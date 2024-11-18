# Touch-Friendly Timer Application

A responsive, touch-friendly timer application with a dark theme, designed for use on touch-screen devices. This project supports multiple timers and allows users to associate timers with baskets. The application features intuitive controls and dynamic visuals, making it ideal for scenarios like food preparation, task management, or other timer-based workflows.

---

## Features

- **Dark Theme**: A visually appealing, modern dark mode for reduced eye strain.
- **Touch-Friendly Interface**: Large buttons and intuitive layouts designed for touch-screen devices.
- **Dynamic Timers**:
  - Supports multiple timers, each associated with a basket.
  - Timers include mid-timer alerts and a final alarm.
- **Customizable**:
  - Colors, sound effects, and themes are easily configurable via `data.json`.
- **Interactive Alarm Handling**:
  - Timers turn red when an alarm is active, and clicking the timer box silences the alarm.
  - Clean removal of timers upon completion or manually using the close button.
- **Smooth Transitions**: Timers visually transition to draw attention when alarms are triggered.

---

## How to Use

1. **Add Timers and Baskets**:
   - Define timers, durations, mid-timer intervals, and baskets in the `data.json` file.

2. **Start a Timer**:
   - Select a timer and a basket to automatically start the countdown.

3. **Alarm Management**:
   - When a mid-timer or end-timer is triggered, the timer box turns red.
   - Click the red box to silence the alarm, or use the "X" button to remove the timer.

---

## File Structure

```
/project-directory
  |- main.html       # Main HTML file with layout
  |- scripts.js       # Core JavaScript for functionality
  |- data.json        # Configuration file for timers, baskets, and styles
  |- beep.wav         # Alarm sound file
```

---

## Customization

### Modify Colors, Sounds, and Styles
- **Edit `data.json`**:
  ```json
  {
    "settings": {
      "backgroundColor": "#121212",
      "buttonColor": "#1E1E1E",
      "buttonHoverColor": "#2A2A2A",
      "highlightColor": "#FF5733",
      "textColor": "#FFFFFF",
      "sound": "beep.wav"
    },
    "timers": [
      { "name": "Fries", "duration": 270, "midTimers": [90, 180] },
      { "name": "Oreos", "duration": 180 },
      { "name": "Chicken Tenders", "duration": 360, "midTimers": [120, 240] }
    ],
    "baskets": ["Basket 1", "Basket 2", "Basket 3", "Basket 4"]
  }
  ```
  - Customize the color scheme, button styles, and alarm sound.
  - Add or modify timers and their mid-timer alerts.
  - Add or rename baskets for task assignments.

---

## Demo

A live demo can be easily set up by running the `main.html` file in any modern web browser. The app is entirely client-side and does not require a server.

---

## Requirements

- A modern web browser that supports HTML5, CSS3, and JavaScript.
- Optional: An alarm sound file (`beep.wav`).

---

## Future Enhancements

- Persistent storage to save timers between sessions.
- Timer history or analytics for usage tracking.
- Configurable notifications for end and mid-timers.

---

Feel free to fork, modify, and use this project to suit your needs! Contributions and feedback are always welcome.

---

Let me know if you'd like me to make further refinements!
