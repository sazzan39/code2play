CODE2PLAY: The Scavenger Heist
Internal Breach is a real-time, competitive cybersecurity simulation designed for educational workshops and tech events. It challenges up to 30 participants ("Agents") to navigate a multi-phase digital heist, culminating in a real-world scavenger hunt for a physical treasure.

Project Overview: 

The system utilizes a central Node.js/Socket.io engine to orchestrate live gameplay across four distinct technical phases:

Phase 01: Social Engineering (The Quiz): Agents must answer a randomized, non-repeating deck of 50 tech questions. Every player receives a unique shuffled sequence.

Phase 02: Brute Force (Hex Decryption): A high-speed memory search where agents must locate a specific hexadecimal hash within a shifting data stream.

Phase 03:The Snake Engine : A tactical navigation game where agents collect data packets while avoiding firewall collisions.

Phase 04: Memory Puzzle : A pattern-matching challenge that increases in complexity, requiring agents to synchronize with the final vault's encryption.

🛠️ Tech Stack

Frontend: React.js with Tailwind CSS for a high-fidelity cyberpunk UI.

Backend: Node.js & Express.

Real-Time Communication: Socket.io for low-latency state synchronization and leaderboard updates.

Deployment: Optimized for Render (Server) and Vercel (Client).

🎮 Admin Controls: 

The system includes a Hidden Admin War Map. By accessing a secure portal, the event organizer can:

- Monitor live progress bars of all 30 players simultaneously.

- Manually trigger the "Breach" to start the game for all connected clients.

- Initiate emergency system resets.

🏆 The Treasure Reveal
Unlike standard games, Internal Breach bridges the gap between digital and physical. Upon reaching the final score threshold, the winner's terminal decrypts a localized hint:

"THE TREASURE IS WITH SAJAN!"

🏗️ Installation
Bash
# Clone the repository
git clone https://github.com/sazzan39/code2play.git

# Setup Server
cd server && npm install
node index.js

# Setup Client
cd client && npm install
npm start