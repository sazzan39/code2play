// server/generator.js

/**
 * Generates dynamic questions based on the game phase.
 * Phase 1: Basic Logic & Syntax
 * Phase 2: Algorithms & Patterns
 * Phase 3: Advanced Decryption
 */
function generateQuestion(phase) {
  const pool = {
    1: [
      { 
        text: "In JavaScript, what is the result of: typeof NaN?", 
        options: ["'number'", "'NaN'", "'undefined'", "'object'"], 
        correct: 0 
      },
      { 
        text: "Which operator is used to check both value and type?", 
        options: ["==", "=", "===", "!="], 
        correct: 2 
      },
      { 
        text: "What does '1' + 1 result in?", 
        options: ["2", "11", "Error", "undefined"], 
        correct: 1 
      }
    ],
    2: [
      { 
        text: "Which data structure follows the First-In-First-Out (FIFO) principle?", 
        options: ["Stack", "Queue", "Binary Tree", "Object"], 
        correct: 1 
      },
      { 
        text: "What is the time complexity of searching in a sorted array using Binary Search?", 
        options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"], 
        correct: 2 
      }
    ],
    3: [
      { 
        text: "HEIST LOGIC: If A=1, B=2, what is (C + D) * 2?", 
        options: ["10", "14", "7", "21"], 
        correct: 1 
      },
      { 
        text: "Binary Breach: Convert 1011 to Decimal.", 
        options: ["11", "13", "9", "15"], 
        correct: 0 
      }
    ]
  };

  // Select the appropriate pool based on phase
  const questions = pool[phase] || pool[1];
  
  // Return a random question from that phase's pool
  return questions[Math.floor(Math.random() * questions.length)];
}

// CRITICAL: This allows index.js to use the function
module.exports = { generateQuestion };

console.log("GENERATOR TEST:", generateQuestion(1));