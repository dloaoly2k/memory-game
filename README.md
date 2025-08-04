# Memory Card Game

A modern, interactive memory card matching game built with HTML, CSS, and JavaScript. Test your memory by finding matching pairs of cards in a 4x4 grid!

## 🎮 Features

### Core Gameplay
- **4x4 Grid Layout**: 16 cards arranged in a responsive grid
- **Card Matching**: Flip two cards at a time to find matching pairs
- **Visual Feedback**: Smooth card flip animations and match indicators
- **Game Completion**: Win by matching all 8 pairs of cards

### Game Statistics
- **Timer**: Real-time game duration tracking (MM:SS format)
- **Move Counter**: Track the number of card flip attempts
- **Scoring System**: Dynamic scoring based on:
  - Base points for each match (100 points)
  - Bonus for efficient play (fewer moves = higher bonus)
  - Time penalty (longer games = reduced score)

### User Interface
- **Modern Design**: Clean, responsive layout with gradient backgrounds
- **Game Controls**: Start, Reset, and Play Again buttons
- **Statistics Display**: Real-time updates of timer, moves, and score
- **Game Over Modal**: Celebration screen with final statistics
- **Instructions**: Clear gameplay guidelines for new players

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: CSS transitions and keyframe animations
- **Font Awesome Icons**: 8 different card symbols for variety
- **Game State Management**: Proper handling of game states and user interactions

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Click "Start Game" to begin playing

### File Structure
```
memory-game/
├── index.html      # Main HTML structure
├── style.css       # Styling and animations
├── app.js          # Game logic and functionality
└── README.md       # Project documentation
```

## 🎯 How to Play

1. **Start the Game**: Click the "Start Game" button to begin
2. **Flip Cards**: Click on any card to reveal its symbol
3. **Find Matches**: Click a second card to see if it matches the first
4. **Complete Pairs**: Matched cards stay face up; unmatched cards flip back
5. **Win**: Match all 8 pairs to complete the game

### Scoring System
- **Base Score**: 100 points per match
- **Efficiency Bonus**: Up to 50 bonus points for fewer moves
- **Time Penalty**: Up to 30 points deducted for longer completion times
- **Minimum Score**: 10 points guaranteed per match

## 🛠️ Technical Implementation

### Game Architecture
- **Object-Oriented Design**: Main `MemoryGame` class manages all game logic
- **Event-Driven**: Responsive to user interactions and game state changes
- **Modular Code**: Separated concerns between HTML structure, CSS styling, and JavaScript logic

### Key Components

#### HTML Structure
- Semantic HTML5 elements for accessibility
- Font Awesome integration for card icons
- Modal dialog for game completion

#### CSS Features
- CSS Grid for responsive card layout
- CSS Transform3D for card flip animations
- Flexbox for flexible component layouts
- Media queries for mobile responsiveness
- CSS custom properties for consistent theming

#### JavaScript Logic
- **Card Management**: Dynamic card creation and shuffling
- **Game State**: Comprehensive state tracking and validation
- **Timer System**: Real-time game duration tracking
- **Scoring Algorithm**: Dynamic score calculation
- **Event Handling**: Robust user interaction management

### Performance Optimizations
- Efficient DOM manipulation with event delegation
- Optimized card shuffling using Fisher-Yates algorithm
- Minimal reflows and repaints during animations
- Responsive design with CSS Grid and Flexbox

## 🎨 Customization

### Changing Card Icons
Modify the `cardIcons` array in `app.js`:
```javascript
this.cardIcons = [
    'fas fa-heart', 'fas fa-star', 'fas fa-diamond', 'fas fa-circle',
    'fas fa-square', 'fas fa-triangle', 'fas fa-bolt', 'fas fa-gem'
];
```

### Adjusting Game Difficulty
- **Grid Size**: Modify CSS Grid template columns in `style.css`
- **Card Count**: Update the `cardIcons` array length
- **Scoring**: Adjust scoring algorithm in the `updateScore()` method

### Styling Customization
- **Colors**: Modify CSS custom properties and gradient values
- **Animations**: Adjust timing and easing in CSS keyframes
- **Layout**: Customize grid gaps, padding, and responsive breakpoints

## 🔧 Browser Compatibility

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## 📱 Mobile Support

The game is fully responsive and optimized for mobile devices:
- Touch-friendly card interactions
- Responsive grid layout
- Optimized button sizes for touch input
- Mobile-first CSS media queries

## 🎯 Future Enhancements

Potential features for future versions:
- **Difficulty Levels**: Different grid sizes and card counts
- **Sound Effects**: Audio feedback for card flips and matches
- **Leaderboard**: Local storage for high scores
- **Themes**: Multiple visual themes and card sets
- **Multiplayer**: Turn-based multiplayer functionality
- **Accessibility**: Enhanced screen reader support

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

---

**Enjoy playing the Memory Card Game!** 🎮✨ # memory-game
