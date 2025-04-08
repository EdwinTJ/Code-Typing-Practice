import "./styles.css";
import { pythonExercises } from "./pythonChallenges";

// State variables
let currentDifficulty: string = "beginner";
let currentExerciseIndex: number = 0;
let currentCode: string = "";
let startTime: number | null = null;
let timerInterval: number | null = null;
let timeLeft: number = 60;
let totalTyped: number = 0;
let correctTyped: number = 0;

// DOM elements
const promptDisplay = document.getElementById(
  "promptDisplay"
) as HTMLDivElement;
const codeDisplay = document.getElementById("codeDisplay") as HTMLDivElement;
const typingInput = document.getElementById(
  "typingInput"
) as HTMLTextAreaElement;
const wpmDisplay = document.getElementById("wpm") as HTMLDivElement;
const accuracyDisplay = document.getElementById("accuracy") as HTMLDivElement;
const timerDisplay = document.getElementById("timer") as HTMLDivElement;
const restartBtn = document.getElementById("restartBtn") as HTMLButtonElement;
const nextPromptBtn = document.getElementById(
  "nextPromptBtn"
) as HTMLButtonElement;
const difficultyBtns = document.querySelectorAll(
  ".difficulty-btn"
) as NodeListOf<HTMLButtonElement>;

// Initialize the app
function init(): void {
  console.log("Initializing the app");
  loadExercise();
  addEventListeners();
}

// Load an exercise based on current difficulty and index
function loadExercise(): void {
  console.log("Loading exercise:", currentDifficulty, currentExerciseIndex);
  const exercises = pythonExercises[currentDifficulty];
  currentExerciseIndex = currentExerciseIndex % exercises.length;
  const exercise = exercises[currentExerciseIndex];

  // Set current code
  currentCode = exercise.code;

  // Display prompt
  promptDisplay.textContent = exercise.prompt;

  // Display code with syntax highlighting
  displayCodeSimple(exercise.code);

  resetState();
}

// Apply simple display of code
function displayCodeSimple(code: string): void {
  console.log("Displaying code:", code);
  // Clear the code display
  codeDisplay.innerHTML = "";

  // Split code into lines for proper display
  const lines = code.split("\n");

  lines.forEach((line) => {
    // Create a new line div
    const lineDiv = document.createElement("div");
    lineDiv.className = "code-line";

    // Simply wrap each character in a span
    let lineHTML = "";
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      // Escape HTML special characters
      const safeChar =
        char === "&"
          ? "&amp;"
          : char === "<"
          ? "&lt;"
          : char === ">"
          ? "&gt;"
          : char === '"'
          ? "&quot;"
          : char;

      lineHTML += `<span class="char">${safeChar}</span>`;
    }

    // If line is empty, add a non-breaking space
    if (!line) {
      lineHTML = "&nbsp;";
    }

    lineDiv.innerHTML = lineHTML;
    codeDisplay.appendChild(lineDiv);
  });
}

// Reset the state for a new exercise
function resetState(): void {
  startTime = null;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timeLeft = 60;
  totalTyped = 0;
  correctTyped = 0;

  // Reset displays
  typingInput.value = "";
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "100%";
  timerDisplay.textContent = timeLeft.toString();

  // Reset visuals
  promptDisplay.style.color = "#ffffff";

  // Enable input
  typingInput.disabled = false;
  typingInput.focus();
}

// Update the code display based on input
function updateCodeDisplay(input: string): void {
  const charElements = codeDisplay.querySelectorAll(".char");
  const inputChars = input.split("");

  let inputIndex = 0;

  // Reset all characters
  charElements.forEach((charElement) => {
    charElement.className = "char";
  });

  // Check each character against the input
  for (
    let i = 0;
    i < charElements.length && inputIndex < inputChars.length;
    i++
  ) {
    const charElement = charElements[i] as HTMLSpanElement;
    const expected = charElement.textContent;
    const actual = inputChars[inputIndex];

    // Compare characters
    if (expected === actual) {
      charElement.classList.add("correct");
      correctTyped++;
    } else {
      charElement.classList.add("incorrect");
    }

    totalTyped++;
    inputIndex++;
  }

  // Check if exercise is complete
  if (input === currentCode) {
    endExercise(true);
  }
}

// Calculate CPM (Characters Per Minute)
function calculateCPM(): number {
  if (!startTime) return 0;

  const elapsedTime = (Date.now() - startTime) / 1000 / 60; // in minutes
  return Math.round(correctTyped / elapsedTime);
}

// Calculate accuracy percentage
function calculateAccuracy(): number {
  if (totalTyped === 0) return 100;
  return Math.round((correctTyped / totalTyped) * 100);
}

// Update statistics
function updateStats(): void {
  const cpm = calculateCPM();
  const accuracy = calculateAccuracy();

  wpmDisplay.textContent = cpm.toString();
  accuracyDisplay.textContent = `${accuracy}%`;
}

// Start the timer
function startTimer(): void {
  if (timerInterval) return;

  startTime = Date.now();
  timerInterval = window.setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft.toString();

    if (timeLeft <= 0) {
      endExercise(false);
    }

    // Update stats every second
    updateStats();
  }, 1000);
}

// End the exercise
function endExercise(completed: boolean): void {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  typingInput.disabled = true;

  // Final stats update
  updateStats();

  // Highlight completion status
  if (completed) {
    promptDisplay.style.color = "#79b958";
  } else {
    promptDisplay.style.color = "#e84545";
  }
}

// Move to the next exercise
function nextExercise(): void {
  currentExerciseIndex++;
  loadExercise();
}

// Change difficulty level
function changeDifficulty(difficulty: string): void {
  currentDifficulty = difficulty;
  currentExerciseIndex = 0;

  // Update active button
  difficultyBtns.forEach((btn) => {
    if (btn.dataset.difficulty === difficulty) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  loadExercise();
}

// Add event listeners
function addEventListeners(): void {
  console.log("Adding event listeners");
  // Typing input event listener
  typingInput.addEventListener("input", (e) => {
    // Start the timer on first input
    if (!startTime) {
      startTimer();
    }

    const input = (e.target as HTMLTextAreaElement).value;

    // Reset counters for each check
    totalTyped = 0;
    correctTyped = 0;

    updateCodeDisplay(input);
  });

  // Make tab key work in the textarea
  typingInput.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = typingInput.selectionStart || 0;
      const end = typingInput.selectionEnd || 0;

      // Insert two spaces for tab
      typingInput.value =
        typingInput.value.substring(0, start) +
        "  " +
        typingInput.value.substring(end);

      // Move cursor to after the inserted tab
      typingInput.selectionStart = typingInput.selectionEnd = start + 2;

      // Update display
      totalTyped = 0;
      correctTyped = 0;
      updateCodeDisplay(typingInput.value);
    }
  });

  // Restart button
  restartBtn.addEventListener("click", () => {
    resetState();
    // Reset the code display
    displayCodeSimple(currentCode);
  });

  // Next prompt button
  nextPromptBtn.addEventListener("click", nextExercise);

  // Difficulty buttons
  difficultyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const difficulty = btn.dataset.difficulty;
      if (difficulty) {
        changeDifficulty(difficulty);
      }
    });
  });
}

// Initialize the app when the page loads
window.addEventListener("DOMContentLoaded", init);
