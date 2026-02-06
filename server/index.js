const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ["https://code2play-1.onrender.com", "http://localhost:3000"],
  credentials: true
}));
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// --- CONFIG AND SECURITY ---
const ADMIN_AUTH = { email: "admin@heist.com", pass: "Vault2026!" };
let gameStarted = false;
let players = {}; 

const THRESHOLDS = { PHASE2: 100, PHASE3: 250, PHASE4: 500, WIN: 650 };

//  INTEGRATED TASK GENERATOR 
const getTask = (phase) => {
  if (phase === 1) {
    const questions = [

      // Networking
  { q: "What does 'WWW' stand for?", a: ["Web World Wide", "World Wide Web", "World Web Wide"], c: 1 },
  { q: "Which protocol is used to send emails?", a: ["SMTP", "HTTP", "FTP", "SSH"], c: 0 },
  { q: "What is the standard port for HTTP?", a: ["443", "80", "21", "25"], c: 1 },
  { q: "What is a 'MAC' address?", a: ["Apple's IP", "Media Access Control", "Main Admin Code"], c: 1 },
  { q: "Which device connects multiple networks together?", a: ["Switch", "Router", "Hub", "Modem"], c: 1 },
  { q: "What is the speed of a 1Gbps connection in Mbps?", a: ["100", "10", "1000", "500"], c: 2 },
  { q: "Which of these is a private IP address?", a: ["8.8.8.8", "192.168.1.1", "172.217.0.1"], c: 1 },
  { q: "What does 'LAN' stand for?", a: ["Local Area Network", "Link Access Node", "Large Area Net"], c: 0 },
  { q: "Which protocol provides automatic IP addresses?", a: ["DNS", "DHCP", "ICMP", "TCP"], c: 1 },
  { q: "What is the loopback IP address?", a: ["0.0.0.0", "255.255.255.255", "127.0.0.1"], c: 2 },

  //  Web Development
  { q: "Which tag is used to create a hyperlink?", a: ["<link>", "<a>", "<href>", "<url>"], c: 1 },
  { q: "What is the correct HTML for a large heading?", a: ["<head>", "<h6>", "<h1>", "<header>"], c: 2 },
  { q: "Which CSS property changes text color?", a: ["text-style", "font-color", "color", "fg-color"], c: 2 },
  { q: "In JavaScript, 'var x = 5' is an example of...?", a: ["Loop", "Variable", "Function", "Object"], c: 1 },
  { q: "What does 'DOM' stand for?", a: ["Data Object Model", "Document Object Model", "Digital Order Main"], c: 1 },
  { q: "Which HTML attribute is used for inline styles?", a: ["class", "id", "style", "css"], c: 2 },
  { q: "How do you select an ID in CSS?", a: [".", "#", "*", "@"], c: 1 },
  { q: "Which tag is used for a bulleted list?", a: ["<ol>", "<li>", "<ul>", "<dl>"], c: 2 },
  { q: "What is the 'Alt' attribute used for in images?", a: ["Scaling", "Description", "Filtering"], c: 1 },
  { q: "Which JS function displays a popup box?", a: ["msg()", "popup()", "alert()", "box()"], c: 2 },

  // Cybersecurity
  { q: "What is a 'Phishing' attack?", a: ["Fishing for code", "Fraudulent emails", "Brute forcing"], c: 1 },
  { q: "What does 'VPN' stand for?", a: ["Virtual Private Network", "Visual Port Node", "Verified Path Net"], c: 0 },
  { q: "Which of these is a strong password?", a: ["password123", "admin", "P@ssw0rd!2026"], c: 2 },
  { q: "What is 2FA?", a: ["Two Fast Apps", "Two Factor Authentication", "Second File Access"], c: 1 },
  { q: "A 'White Hat' hacker is...?", a: ["Criminal", "Ethical", "Government Spy"], c: 1 },
  { q: "What is a 'Trojan' in computing?", a: ["Antivirus", "Malware", "Hardware part"], c: 1 },
  { q: "Which symbol indicates a secure website?", a: ["Star", "Padlock", "Triangle", "Eye"], c: 1 },
  { q: "What is 'SQL Injection'?", a: ["Database attack", "Fast coding", "Data entry"], c: 0 },
  { q: "Which layer of the OSI model is the Physical layer?", a: ["7", "4", "1", "3"], c: 2 },
  { q: "What is 'Encryption'?", a: ["Deleting data", "Scrambling data", "Moving data"], c: 1 },

  // Hardware and OS
  { q: "What is the 'brain' of the computer?", a: ["RAM", "GPU", "CPU", "HDD"], c: 2 },
  { q: "Which of these is volatile memory?", a: ["SSD", "RAM", "ROM", "Flash Drive"], c: 1 },
  { q: "What does 'BIOS' stand for?", a: ["Basic Input Output System", "Binary Input OS", "Board Integrated System"], c: 0 },
  { q: "Which OS is open-source?", a: ["Windows", "macOS", "Linux", "iOS"], c: 2 },
  { q: "How many bits are in a byte?", a: ["4", "8", "16", "32"], c: 1 },
  { q: "What does 'USB' stand for?", a: ["Universal Serial Bus", "United State Board", "Ultra Speed Binary"], c: 0 },
  { q: "What is the main circuit board called?", a: ["Fatherboard", "Motherboard", "Keyboard"], c: 1 },
  { q: "Which component renders graphics?", a: ["CPU", "RAM", "GPU", "PSU"], c: 2 },
  { q: "What does 'SSD' stand for?", a: ["Super Speed Drive", "Solid State Drive", "System Storage Disk"], c: 1 },
  { q: "A 'bit' can be...?", a: ["0 or 1", "A or B", "True or False"], c: 0 },

  // Cloud and Modern Tech
  { q: "What is 'The Cloud'?", a: ["Weather app", "Remote servers", "Local storage"], c: 1 },
  { q: "Which of these is a Cloud provider?", a: ["AWS", "Photoshop", "Excel", "Spotify"], c: 0 },
  { q: "What does 'IoT' stand for?", a: ["Internet of Tasks", "Internal of Tech", "Internet of Things"], c: 2 },
  { q: "What is 'SaaS'?", a: ["System as a Service", "Software as a Service", "Server as a Storage"], c: 1 },
  { q: "Which language is used for Data Science?", a: ["PHP", "Swift", "Python", "Ruby"], c: 2 },
  { q: "What is a '404' error?", a: ["Forbidden", "Not Found", "Server Down"], c: 1 },
  { q: "What is 'Blockchain' used for?", a: ["Encryption", "Cryptocurrency", "Image editing"], c: 1 },
  { q: "Which of these is an AI?", a: ["Excel", "ChatGPT", "Windows", "Chrome"], c: 1 },
  { q: "What does 'API' stand for?", a: ["App Program Interface", "Application Programming Interface", "Admin Power Input"], c: 1 },
  { q: "Who is known as the father of computers?", a: ["Bill Gates", "Charles Babbage", "Alan Turing"], c: 1 }
];
    return questions[Math.floor(Math.random() * questions.length)];
  }
  if (phase === 2) {
    return { target: "0x" + Math.floor(Math.random()*255).toString(16).toUpperCase().padStart(2, '0') };
  }
  return null;
};

io.on("connection", (socket) => {
  socket.on("joinGame", (name) => {
    const pName = name.toUpperCase();
    players[socket.id] = { name: pName, score: 0, phase: 1, id: socket.id };
    io.emit("leaderboardUpdate", Object.values(players).sort((a,b) => b.score - a.score));
    if (gameStarted) socket.emit("gameState", players[socket.id], getTask(1));
  });

  socket.on("submitAction", ({ isCorrect, type }) => {
    const p = players[socket.id];
    if (!p || !gameStarted) return;

    if (isCorrect) {
      p.score += (type === 'decryption' ? 15 : 25);
      // Auto-advancement Logic
      if (p.score >= THRESHOLDS.PHASE2 && p.phase === 1) p.phase = 2;
      else if (p.score >= THRESHOLDS.PHASE3 && p.phase === 2) p.phase = 3;
      else if (p.score >= THRESHOLDS.PHASE4 && p.phase === 3) p.phase = 4;
      
      if (p.score >= THRESHOLDS.WIN) io.emit("winner", p.name);
    } else {
      // PENALTY SYSTEM
      const penalty = (type === 'snake' ? 50 : 15);
      p.score = Math.max(0, p.score - penalty);
    }

    socket.emit("gameState", p, getTask(p.phase));
    io.emit("leaderboardUpdate", Object.values(players).sort((a,b) => b.score - a.score));
  });

  socket.on("adminStart", () => {
    gameStarted = true;
    io.emit("gameStarted");
    Object.keys(players).forEach(id => {
      io.to(id).emit("gameState", players[id], getTask(1));
    });
  });

  socket.on("forceReset", () => {
    players = {};
    gameStarted = false;
    io.emit("forceReset");
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("leaderboardUpdate", Object.values(players));
  });
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, '0.0.0.0', () => console.log(`CODE2PLAY: HEIST CORE ONLINE: ${PORT}`));