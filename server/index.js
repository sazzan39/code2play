const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();


app.use(cors({ origin: "*" })); 
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/dist')));

const server = http.createServer(app);


const io = new Server(server, { 
  cors: { 
    origin: "*", 
    methods: ["GET", "POST"]
  },
  transports: ["websocket", "polling"]
});

// --- 🎮 GAME CONFIGURATION ---
const TREASURE_LOCATION = "THE TREASURE IS ON THE EDGE OF THE DOOR!"; 
let gameStarted = false; 
let players = {}; 
const THRESHOLDS = { PHASE2: 200, PHASE3: 350, PHASE4: 500, WIN: 650 };

const QUESTION_BANK = [
  // NETWORKING 
  { q: "What is the standard port for HTTPS?", a: ["80", "443", "22", "8080"], c: 1 },
  { q: "What does 'DNS' stand for?", a: ["Domain Name System", "Digital Network Service", "Data Node Storage"], c: 0 },
  { q: "Which command checks connectivity to a server?", a: ["tracert", "ping", "netstat", "ipconfig"], c: 1 },
  { q: "IPv6 addresses are how many bits long?", a: ["32", "64", "128", "256"], c: 2 },
  { q: "Which device operates at Layer 3 (Network Layer)?", a: ["Hub", "Switch", "Router", "Repeater"], c: 2 },
  { q: "What does 'FTP' stand for?", a: ["File Transfer Protocol", "Fast Text Processing", "File Type Path"], c: 0 },
  { q: "Which of these is NOT a valid IP address?", a: ["192.168.1.1", "10.0.0.5", "256.0.0.1"], c: 2 },
  { q: "What is 'Latency' in networking?", a: ["Bandwidth speed", "Data loss", "Delay in transmission"], c: 2 },
  { q: "Which protocol is connection-oriented?", a: ["UDP", "TCP", "ICMP", "IP"], c: 1 },
  { q: "What is the physical address of a NIC called?", a: ["IP Address", "MAC Address", "Port Number"], c: 1 },
  // WEB DEVELOPMENT
  { q: "What does 'JSON' stand for?", a: ["JavaScript Object Notation", "Java Source Open Network", "Just Script On Node"], c: 0 },
  { q: "Which HTML tag creates a line break?", a: ["<lb>", "<break>", "<br>", "<n>"], c: 2 },
  { q: "Which HTTP method is used to update data?", a: ["GET", "POST", "PUT", "DELETE"], c: 2 },
  { q: "In CSS, how do you select an element with class 'box'?", a: ["#box", ".box", "*box", "box()"], c: 1 },
  { q: "What is React.js mainly used for?", a: ["Database management", "Building User Interfaces", "Server-side routing"], c: 1 },
  { q: "Which tag creates a numbered list?", a: ["<ul>", "<dl>", "<ol>", "<list>"], c: 2 },
  { q: "What is the correct syntax for a comment in HTML?", a: ["// Comment", "", "/* Comment */"], c: 1 },
  { q: "Which CSS property controls space INSIDE a border?", a: ["Margin", "Padding", "Spacing", "Gap"], c: 1 },
  { q: "What does 'npm' stand for?", a: ["Node Package Manager", "New Project Main", "Net Path Module"], c: 0 },
  { q: "Which JavaScript keyword declares a constant?", a: ["var", "let", "const", "fixed"], c: 2 },
  // --- CYBERSECURITY ---
  { q: "What is 'DDoS'?", a: ["Direct Denial of Service", "Distributed Denial of Service", "Data Download on Server"], c: 1 },
  { q: "What is 'Ransomware'?", a: ["Free software", "Malware that demands payment", "Antivirus tool"], c: 1 },
  { q: "Which of these is a form of Social Engineering?", a: ["SQL Injection", "Pretexting", "Buffer Overflow"], c: 1 },
  { q: "What does a Firewall do?", a: ["Cools down CPU", "Filters network traffic", "Increases internet speed"], c: 1 },
  { q: "What is 'Hashing'?", a: ["Encrypting with a key", "One-way data mapping", "Compressing files"], c: 1 },
  { q: "Which protocol is used for secure remote login?", a: ["Telnet", "SSH", "FTP", "HTTP"], c: 1 },
  { q: "What is a 'Zero-Day' vulnerability?", a: ["A virus 0 days old", "A flaw known before a fix exists", "A safe bug"], c: 1 },
  { q: "What does 'CIA' triad stand for in security?", a: ["Confidentiality, Integrity, Availability", "Central Intelligence Agency", "Code, Input, Access"], c: 0 },
  { q: "What is a 'Botnet'?", a: ["A robot network", "Network of infected computers", "AI chat bot"], c: 1 },
  { q: "Which is safer: HTTP or HTTPS?", a: ["HTTP", "HTTPS", "They are same"], c: 1 },
  // --- HARDWARE & OS ---
  { q: "What is the core of an Operating System called?", a: ["Shell", "Kernel", "Core", "Root"], c: 1 },
  { q: "Which storage is faster?", a: ["HDD", "SSD", "Floppy Disk", "CD-ROM"], c: 1 },
  { q: "What does 'GPU' stand for?", a: ["General Processing Unit", "Graphics Processing Unit", "Gaming Power Unit"], c: 1 },
  { q: "1024 Gigabytes is equal to...", a: ["1 MB", "1 PB", "1 TB", "1 ZB"], c: 2 },
  { q: "Which key combination opens Task Manager in Windows?", a: ["Ctrl+C", "Alt+F4", "Ctrl+Shift+Esc"], c: 2 },
  { q: "What does 'GUI' stand for?", a: ["Graphical User Interface", "General Used Input", "Gaming UI"], c: 0 },
  { q: "Which component powers all other components?", a: ["CPU", "Motherboard", "PSU", "RAM"], c: 2 },
  { q: "What is 'Clock Speed' measured in?", a: ["Bytes", "Hertz (Hz)", "Pixels", "Watts"], c: 1 },
  { q: "Which OS is based on the Darwin kernel?", a: ["Windows", "macOS", "Ubuntu", "Android"], c: 1 },
  { q: "What is 'Virtualization'?", a: ["VR Gaming", "Running VMs on hardware", "Fake Internet"], c: 1 },
  // -- MODERN TECH & CLOUD --
  { q: "What is 'Git' used for?", a: ["Video editing", "Version Control", "Cloud Hosting"], c: 1 },
  { q: "Who owns GitHub?", a: ["Google", "Facebook", "Microsoft", "Apple"], c: 2 },
  { q: "What is 'Docker'?", a: ["A shipping company", "Containerization platform", "New coding language"], c: 1 },
  { q: "Which of these is a NoSQL database?", a: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"], c: 2 },
  { q: "What does 'AI' stand for?", a: ["Automated Input", "Artificial Intelligence", "Active Interface"], c: 1 },
  { q: "What is 'Big Data'?", a: ["Large text files", "Complex/Large datasets", "High res images"], c: 1 },
  { q: "Which company created the Android OS?", a: ["Samsung", "Apple", "Google", "Nokia"], c: 2 },
  { q: "What is '5G'?", a: ["5 Gigabytes", "5th Gen Mobile Network", "5 Graphics cards"], c: 1 },
  { q: "What is 'Open Source'?", a: ["Free Wifi", "Code anyone can inspect/modify", "Paid software"], c: 1 },
  { q: "Which tech powers Bitcoin?", a: ["Cloud", "Blockchain", "IoT", "Big Data"], c: 1 }
];

const getTask = (p) => {
  if (p.phase === 1) {
    const qIndex = p.quizIndex % QUESTION_BANK.length;
    return QUESTION_BANK[qIndex];
  }
  if (p.phase === 2) {
    return { target: "0x" + Math.floor(Math.random()*255).toString(16).toUpperCase().padStart(2, '0') };
  }
  return null;
};

// socket engine
io.on("connection", (socket) => {
  console.log(`NEW SIGNAL: ${socket.id}`);
  socket.emit("leaderboardUpdate", Object.values(players).sort((a,b) => b.score - a.score));

  socket.on("adminLogin", (pass) => {
    if(pass === "Vault@@2026!") {
      socket.emit("adminLoginSuccess");
    } else {
      socket.emit("adminLoginFail");
    }
  });

  socket.on("joinGame", (name) => {
    const pName = name.toUpperCase();
    players[socket.id] = { name: pName, score: 0, phase: 1, id: socket.id, quizIndex: 0 };
    io.emit("leaderboardUpdate", Object.values(players).sort((a,b) => b.score - a.score));
    if (gameStarted) {
       socket.emit("gameState", players[socket.id], getTask(players[socket.id]));
    }
  });

  socket.on("submitAction", ({ isCorrect, type }) => {
    const p = players[socket.id];
    if (!p || !gameStarted) return;

    if (isCorrect) {
      p.score += (type === 'decryption' ? 15 : 25);
      if (type === 'quiz') p.quizIndex += 1;

      if (p.score >= THRESHOLDS.PHASE2 && p.phase === 1) p.phase = 2;
      else if (p.score >= THRESHOLDS.PHASE3 && p.phase === 2) p.phase = 3;
      else if (p.score >= THRESHOLDS.PHASE4 && p.phase === 3) p.phase = 4;
      
      if (p.score >= THRESHOLDS.WIN) {
        io.emit("winner", p.name);
        socket.emit("secretReveal", { location: TREASURE_LOCATION });
      }
    } else {
      const penalty = (type === 'snake' ? 50 : 15);
      p.score = Math.max(0, p.score - penalty);
    }

    socket.emit("gameState", p, getTask(p));
    io.emit("leaderboardUpdate", Object.values(players).sort((a,b) => b.score - a.score));
  });

  socket.on("adminStart", () => {
    gameStarted = true; 
    io.emit("gameStarted");
    Object.keys(players).forEach(id => {
      if(players[id]) io.to(id).emit("gameState", players[id], getTask(players[id]));
    });
  });

  socket.on("forceReset", () => {
    players = {};
    gameStarted = false; 
    io.emit("forceReset");
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("leaderboardUpdate", Object.values(players).sort((a,b) => b.score - a.score));
  });
});

// --- 🛠️ THE CATCH-ALL FIX ---
// This middleware replaces app.get('*') to prevent PathError on Node v22
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/socket.io')) {
    return res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  }
  next();
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => console.log(`CODE2PLAY CORE ONLINE: ${PORT}`));