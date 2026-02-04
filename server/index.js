const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { generateQuestion } = require('./questions'); 

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const GLOBAL_ROOM_CODE = "HEIST2026";
const ROOM_ID = "heist_room";
let gameStarted = false;
let players = {};
let treasureText = "In coordinator's Pocket"; 

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on("joinGame", ({ playerName, roomCode }) => {
    const name = playerName?.trim().toUpperCase();
    if (roomCode?.trim().toUpperCase() !== GLOBAL_ROOM_CODE) {
      return socket.emit("error", "INVALID ACCESS CODE");
    }

    socket.join(ROOM_ID);
    if (!players[name]) {
      players[name] = { name, score: 0, phase: 1, socketId: socket.id };
    } else {
      players[name].socketId = socket.id;
    }

    io.to(ROOM_ID).emit("leaderboardUpdate", Object.values(players).sort((a,b) => b.score - a.score));

    if (!gameStarted) {
      socket.emit("waitingForAdmin");
    } else {
      socket.emit("gameState", players[name], generateQuestion(players[name].phase));
    }
  });

  socket.on("adminStartGame", () => {
    gameStarted = true;
    console.log("🚀 THE HEIST HAS BEGUN!");
    Object.keys(players).forEach(name => {
      io.to(players[name].socketId).emit("gameState", players[name], generateQuestion(1));
    });
  });

  socket.on("submit", ({ teamId, choice, correctAnswer }) => {
    const player = players[teamId];
    if (!player) return;

    if (choice === correctAnswer) {
      player.score += 50; // High score jump to move phases quickly
      if (player.score >= 50 && player.phase === 1) player.phase = 2;
      if (player.score >= 100 && player.phase === 2) player.phase = 3; 
    } else {
      player.score = Math.max(0, player.score - 10);
    }

    io.to(ROOM_ID).emit("leaderboardUpdate", Object.values(players).sort((a,b) => b.score - a.score));
    socket.emit("gameState", player, generateQuestion(player.phase));
  });

  socket.on("completePhase", ({ name, phase }) => {
    if (players[name]) {
      players[name].phase = phase + 1;
      socket.emit("gameState", players[name], generateQuestion(players[name].phase));
    }
  });

  socket.on("treasureClaimed", ({ name }) => {
    console.log(`🏆 WINNER: ${name}`);
    socket.emit("revealTreasure", treasureText);
    io.to(ROOM_ID).emit("winnerFound", { name });
  });

  socket.on("adminReset", () => {
    gameStarted = false;
    players = {};
    io.to(ROOM_ID).emit("forceReset");
  });

  socket.on("disconnect", () => console.log("Disconnected"));
});

server.listen(4001, '0.0.0.0', () => {
  console.log("🚀 HEIST SERVER ONLINE ON PORT 4001");
});