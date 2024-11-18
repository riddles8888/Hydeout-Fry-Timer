let timers = [];
let baskets = [];
let settings = {};
let selectedTimer = null;
let selectedBasket = null;

// Fetch data from the JSON file
fetch('data.json')
    .then(response => response.json())
    .then(data => {
      settings = data.settings;
      timers = data.timers;
      baskets = data.baskets;

      applyTheme();
      createButtons('timerButtons', timers, handleTimerSelect);
      createButtons('basketButtons', baskets, handleBasketSelect);
    })
    .catch(error => {
      console.error('Error loading data.json:', error);
    });

// Apply the dark theme using settings from the JSON
function applyTheme() {
  const styles = `
    body {
      background-color: ${settings.backgroundColor};
      color: ${settings.textColor};
    }
    .button {
      background-color: ${settings.buttonColor};
      color: ${settings.textColor};
      border: none;
      border-radius: 10px;
      padding: 20px 0px;
      font-size: 1.2em;
      text-align: center;
      cursor: pointer;
      font-weight: bold;
      text-transform: uppercase;
      min-width: 150px;
      box-sizing: border-box;
    }
    .button-basket {
      min-width: 50px;
    }
    .button:hover {
      background-color: ${settings.buttonHoverColor};
    }
    .button.selected {
      background-color: ${settings.highlightColor};
      color: ${settings.textColor};
      border: 2px solid ${settings.textColor};
    }
    .timer-box {
      position: relative;
      border: 2px solid ${settings.textColor};
      padding: 20px;
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #1e1e1e;
      border-radius: 10px;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    .timer-box strong {
      font-size: 1.4em;
      margin-bottom: 10px;
      text-align: center;
    }
    .countdown {
      font-size: 4em;
      font-weight: bold;
      margin: 0;
    }
    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
      border: none;
      color: ${settings.textColor};
      font-size: 6em; /* Larger close button */
      padding: 5px; /* Ensures enough clickable area */
      line-height: 1;
      cursor: pointer;
      font-weight: bold;
    }
    .close-button:hover {
      color: red;
    }
    .timer-box.alarm-active {
      background-color: red;
      color: white;
    }
  `;
  document.getElementById('dynamicStyles').innerHTML = styles;
}


// Create buttons for timers or baskets
function createButtons(containerId, items, clickHandler) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Clear existing buttons
  items.forEach(item => {
    const button = document.createElement("div");
    if (containerId === 'basketButtons') {
      button.className = "button button-basket";
    } else {
      button.className = "button";
    }
    button.textContent = item.name || item; // Timers have names, baskets are strings
    button.addEventListener("click", () => clickHandler(item, button));
    container.appendChild(button);
  });
}

// Handle timer selection
function handleTimerSelect(timer, button) {
  clearSelection("timerButtons");
  button.classList.add("selected");
  selectedTimer = timer;
  startTimerIfReady();
}

// Handle basket selection
function handleBasketSelect(basket, button) {
  clearSelection("basketButtons");
  button.classList.add("selected");
  selectedBasket = basket;
  startTimerIfReady();
}

// Clear selection
function clearSelection(containerId) {
  const container = document.getElementById(containerId);
  const buttons = container.querySelectorAll(".button");
  buttons.forEach(button => button.classList.remove("selected"));
}

// Start timer if both timer and basket are selected
function startTimerIfReady() {
  if (selectedTimer && selectedBasket) {
    createTimerBox(selectedTimer.name, selectedBasket, selectedTimer.duration, selectedTimer.midTimers || []);
    // Reset the selections after creating the timer
    selectedTimer = null;
    selectedBasket = null;
    clearSelection("timerButtons");
    clearSelection("basketButtons");
  }
}

// Move a timer box to the top of the list
function moveToTop(timerBox) {
  const timerContainer = document.getElementById("timerContainer");
  timerContainer.insertBefore(timerBox, timerContainer.firstChild);
}

// Create a countdown timer box
function createTimerBox(timerName, basketName, duration, midTimers) {
  const timerBox = document.createElement("div");
  timerBox.className = "timer-box";
  const countdownId = `countdown-${Date.now()}`;
  timerBox.innerHTML = `
    <button class="close-button">×</button>
    <strong>${timerName} - Basket ${basketName}</strong>
    <div id="${countdownId}" class="countdown">${formatTime(duration)}</div>
  `;
  document.getElementById("timerContainer").appendChild(timerBox);

  const countdownElement = timerBox.querySelector(`#${countdownId}`);
  const closeButton = timerBox.querySelector(".close-button");

  let remainingTime = duration;
  const midTimerSet = new Set(midTimers);
  let alarmPlaying = false; // Track if an alarm is currently playing

  // Create a reusable audio element for this timer
  const alarmAudio = document.createElement("audio");
  alarmAudio.src = settings.sound;
  alarmAudio.loop = true;

  // Silence and reset alarm or remove timer when clicking the red timer box
  timerBox.addEventListener("click", () => {
    if (timerBox.classList.contains("alarm-active")) {
      stopAndRemoveSound();
      timerBox.classList.remove("alarm-active");

      // Remove the timer box if the timer has ended
      if (remainingTime <= 0) {
        timerBox.remove();
      }
    }
  });

  // Handle close button
  closeButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent removing timer when clicking the close button
    stopAndRemoveSound();
    timerBox.remove();
    clearInterval(interval);
  });

  // Countdown logic
  const interval = setInterval(() => {
    remainingTime--;
    countdownElement.textContent = formatTime(remainingTime);

    if (midTimerSet.has(remainingTime) && !alarmPlaying) {
      activateAlarm();
      moveToTop(timerBox); // Move timer to the top
    }

    if (remainingTime <= 0) {
      clearInterval(interval);
      countdownElement.textContent = "Time's up!";
      activateAlarm();
      moveToTop(timerBox); // Move timer to the top
    }
  }, 1000);

  // Activate alarm by turning the timer red and playing sound
  function activateAlarm() {
    if (!alarmPlaying) {
      alarmAudio.play();
      timerBox.classList.add("alarm-active");
      alarmPlaying = true;
    }
  }

  // Stop alarm and reset state
  function stopAndRemoveSound() {
    if (alarmPlaying) {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
      alarmPlaying = false;
    }
  }
}

// Format time as MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
