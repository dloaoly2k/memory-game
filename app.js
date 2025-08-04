/**
 * Memory Card Game - Main Game Logic
 * Features: 5 difficulty levels, timer, move counter, scoring system, card matching, sound effects, player names
 */

class MemoryGame {
    constructor() {
        // Game state variables
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameStarted = false;
        this.gameEnded = false;
        this.timer = null;
        this.seconds = 0;
        this.canFlip = true;
        this.playerName = 'Guest';
        this.currentLevel = 1;
        this.maxLevel = 5;

        // Sound system
        this.soundEnabled = true;
        this.volume = 0.7;
        this.sounds = {};

        // Level configurations
        this.levelConfigs = {
            1: { gridSize: 4, pairs: 8, description: 'Easy - 4x4 grid with 8 pairs (16 cards)' },
            2: { gridSize: 6, pairs: 18, description: 'Medium - 6x6 grid with 18 pairs (36 cards)' },
            3: { gridSize: 7, pairs: 24, description: 'Hard - 7x7 grid with 24 pairs (49 cards)' },
            4: { gridSize: 8, pairs: 32, description: 'Expert - 8x8 grid with 32 pairs (64 cards)' },
            5: { gridSize: 9, pairs: 40, description: 'Master - 9x9 grid with 40 pairs (81 cards)' }
        };

        // Extended card icons for higher levels (40 unique icons for level 5)
        this.cardIcons = [
            'fas fa-heart', 'fas fa-star', 'fas fa-diamond', 'fas fa-circle',
            'fas fa-square', 'fas fa-triangle', 'fas fa-bolt', 'fas fa-gem',
            'fas fa-moon', 'fas fa-sun', 'fas fa-cloud', 'fas fa-leaf',
            'fas fa-fire', 'fas fa-water', 'fas fa-mountain', 'fas fa-tree',
            'fas fa-car', 'fas fa-plane', 'fas fa-ship', 'fas fa-bicycle',
            'fas fa-cat', 'fas fa-dog', 'fas fa-fish', 'fas fa-bird',
            'fas fa-apple', 'fas fa-banana', 'fas fa-orange', 'fas fa-grape',
            'fas fa-book', 'fas fa-pencil', 'fas fa-camera', 'fas fa-phone',
            'fas fa-home', 'fas fa-key', 'fas fa-lock', 'fas fa-gift',
            'fas fa-crown', 'fas fa-flag', 'fas fa-umbrella', 'fas fa-snowflake',
            'fas fa-rocket', 'fas fa-robot', 'fas fa-ghost', 'fas fa-dragon'
        ];

        // DOM elements
        this.gameBoard = document.getElementById('game-board');
        this.timerDisplay = document.getElementById('timer');
        this.movesDisplay = document.getElementById('moves');
        this.scoreDisplay = document.getElementById('score');
        this.levelDisplay = document.getElementById('level');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.nextLevelBtn = document.getElementById('next-level-btn');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.nextLevelBtnModal = document.getElementById('next-level-btn-modal');
        
        // Player name elements
        this.playerNameInput = document.getElementById('player-name');
        this.saveNameBtn = document.getElementById('save-name-btn');
        this.currentPlayerDisplay = document.getElementById('current-player-display');
        this.winnerNameDisplay = document.getElementById('winner-name');
        
        // Sound control elements
        this.soundToggleBtn = document.getElementById('sound-toggle');
        this.volumeSlider = document.getElementById('volume-slider');
        this.volumeValue = document.getElementById('volume-value');
        
        // Level selection elements
        this.levelButtons = document.querySelectorAll('.level-btn');
        this.currentLevelDisplay = document.getElementById('current-level-display');
        this.levelDescription = document.getElementById('level-description');
        this.completedLevelDisplay = document.getElementById('completed-level');
        this.levelBonusDisplay = document.getElementById('level-bonus');

        // Initialize the game
        this.initializeGame();
        this.initializeSounds();
        this.bindEvents();
        this.loadPlayerName();
        this.updateLevelDisplay();
    }

    /**
     * Initialize sound effects using Web Audio API
     */
    initializeSounds() {
        console.log('Initializing sound system...');
        
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Generate sound effects
            this.sounds = {
                cardFlip: this.createCardFlipSound(),
                cardMatch: this.createMatchSound(),
                cardMismatch: this.createMismatchSound(),
                gameStart: this.createGameStartSound(),
                gameWin: this.createWinSound(),
                buttonClick: this.createButtonClickSound(),
                levelUp: this.createLevelUpSound()
            };
            
            console.log('Sound system initialized successfully');
        } catch (error) {
            console.warn('Sound system initialization failed:', error);
            this.soundEnabled = false;
            this.updateSoundToggleDisplay();
        }
    }

    /**
     * Create a level up sound effect
     * @returns {Function} Sound play function
     */
    createLevelUpSound() {
        return () => {
            if (!this.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Play ascending notes
            const frequencies = [523, 659, 784, 1047, 1319]; // C5, E5, G5, C6, E6
            const duration = 0.8;
            
            frequencies.forEach((freq, index) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                
                gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                gain.gain.linearRampToValueAtTime(this.volume * 0.4, this.audioContext.currentTime + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
                
                osc.start(this.audioContext.currentTime + (index * 0.1));
                osc.stop(this.audioContext.currentTime + duration + (index * 0.1));
            });
        };
    }

    /**
     * Create a card flip sound effect
     * @returns {Function} Sound play function
     */
    createCardFlipSound() {
        return () => {
            if (!this.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }

    /**
     * Create a match sound effect
     * @returns {Function} Sound play function
     */
    createMatchSound() {
        return () => {
            if (!this.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        };
    }

    /**
     * Create a mismatch sound effect
     * @returns {Function} Sound play function
     */
    createMismatchSound() {
        return () => {
            if (!this.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        };
    }

    /**
     * Create a game start sound effect
     * @returns {Function} Sound play function
     */
    createGameStartSound() {
        return () => {
            if (!this.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4
            oscillator.frequency.setValueAtTime(554, this.audioContext.currentTime + 0.1); // C#5
            oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.2); // E5
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.5, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        };
    }

    /**
     * Create a win sound effect
     * @returns {Function} Sound play function
     */
    createWinSound() {
        return () => {
            if (!this.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Play a victory chord
            const frequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6
            const duration = 0.5;
            
            frequencies.forEach((freq, index) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                
                gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                gain.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
                
                osc.start(this.audioContext.currentTime + (index * 0.1));
                osc.stop(this.audioContext.currentTime + duration + (index * 0.1));
            });
        };
    }

    /**
     * Create a button click sound effect
     * @returns {Function} Sound play function
     */
    createButtonClickSound() {
        return () => {
            if (!this.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + 0.001);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        };
    }

    /**
     * Play a sound effect
     * @param {string} soundName - Name of the sound to play
     */
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    /**
     * Load player name from localStorage
     */
    loadPlayerName() {
        const savedName = localStorage.getItem('memoryGamePlayerName');
        if (savedName) {
            this.playerName = savedName;
            this.playerNameInput.value = savedName;
            this.updatePlayerDisplay();
        }
    }

    /**
     * Save player name to localStorage
     */
    savePlayerName() {
        const name = this.playerNameInput.value.trim();
        if (name) {
            this.playerName = name;
            localStorage.setItem('memoryGamePlayerName', name);
            this.updatePlayerDisplay();
            this.playSound('buttonClick');
            console.log(`Player name saved: ${name}`);
        }
    }

    /**
     * Update player name display
     */
    updatePlayerDisplay() {
        this.currentPlayerDisplay.textContent = `Player: ${this.playerName}`;
        this.winnerNameDisplay.textContent = this.playerName;
    }

    /**
     * Toggle sound on/off
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.updateSoundToggleDisplay();
        this.playSound('buttonClick');
        console.log(`Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Update sound toggle button display
     */
    updateSoundToggleDisplay() {
        const icon = this.soundToggleBtn.querySelector('i');
        const text = this.soundToggleBtn.querySelector('span');
        
        if (this.soundEnabled) {
            icon.className = 'fas fa-volume-up';
            text.textContent = 'Sound: ON';
            this.soundToggleBtn.classList.remove('muted');
        } else {
            icon.className = 'fas fa-volume-mute';
            text.textContent = 'Sound: OFF';
            this.soundToggleBtn.classList.add('muted');
        }
    }

    /**
     * Update volume level
     * @param {number} volume - Volume level (0-1)
     */
    updateVolume(volume) {
        this.volume = volume / 100;
        this.volumeValue.textContent = `${Math.round(volume)}%`;
        console.log(`Volume updated: ${Math.round(volume)}%`);
    }

    /**
     * Set the current level
     * @param {number} level - Level number (1-5)
     */
    setLevel(level) {
        if (level >= 1 && level <= this.maxLevel) {
            this.currentLevel = level;
            this.updateLevelDisplay();
            this.updateGameBoardClass();
            this.resetGame();
            console.log(`Level set to: ${level}`);
        }
    }

    /**
     * Update level display and UI
     */
    updateLevelDisplay() {
        // Update level buttons
        this.levelButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.level) === this.currentLevel) {
                btn.classList.add('active');
            }
        });

        // Update level displays
        this.levelDisplay.textContent = this.currentLevel;
        this.currentLevelDisplay.textContent = `Current Level: ${this.currentLevel}`;
        this.levelDescription.textContent = this.levelConfigs[this.currentLevel].description;
    }

    /**
     * Update game board CSS class for responsive layout
     */
    updateGameBoardClass() {
        // Remove all level classes
        this.gameBoard.classList.remove('level-1', 'level-2', 'level-3', 'level-4', 'level-5');
        // Add current level class
        this.gameBoard.classList.add(`level-${this.currentLevel}`);
    }

    /**
     * Initialize the game board and create cards
     */
    initializeGame() {
        console.log(`Initializing memory game for level ${this.currentLevel}...`);
        
        // Clear the game board
        this.gameBoard.innerHTML = '';
        
        // Get current level configuration
        const config = this.levelConfigs[this.currentLevel];
        const pairsNeeded = config.pairs;
        
        // Get icons for current level
        const levelIcons = this.cardIcons.slice(0, pairsNeeded);
        
        // Create card pairs (duplicate each icon)
        const cardValues = [...levelIcons, ...levelIcons];
        
        // Shuffle the cards using Fisher-Yates algorithm
        this.shuffleArray(cardValues);
        
        // Create card elements
        cardValues.forEach((icon, index) => {
            const card = this.createCard(icon, index);
            this.cards.push(card);
            this.gameBoard.appendChild(card);
        });

        console.log(`Created ${this.cards.length} cards with ${pairsNeeded} unique pairs for level ${this.currentLevel}`);
    }

    /**
     * Create a single card element with front and back faces
     * @param {string} icon - Font Awesome icon class
     * @param {number} index - Card index
     * @returns {HTMLElement} Card element
     */
    createCard(icon, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.icon = icon;

        // Create card front (shows icon)
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        const iconElement = document.createElement('i');
        iconElement.className = `card-icon ${icon}`;
        cardFront.appendChild(iconElement);

        // Create card back (shows question mark)
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';

        // Append both faces to the card
        card.appendChild(cardFront);
        card.appendChild(cardBack);

        return card;
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Bind event listeners to game elements
     */
    bindEvents() {
        // Card click events
        this.gameBoard.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card && this.canFlip && this.gameStarted && !this.gameEnded) {
                this.flipCard(card);
            }
        });

        // Button events
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.nextLevelBtn.addEventListener('click', () => this.nextLevel());
        this.nextLevelBtnModal.addEventListener('click', () => this.nextLevel());
        
        // Level selection events
        this.levelButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const level = parseInt(btn.dataset.level);
                this.setLevel(level);
                this.playSound('buttonClick');
            });
        });
        
        // Player name events
        this.saveNameBtn.addEventListener('click', () => this.savePlayerName());
        this.playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.savePlayerName();
            }
        });
        
        // Sound control events
        this.soundToggleBtn.addEventListener('click', () => this.toggleSound());
        this.volumeSlider.addEventListener('input', (e) => this.updateVolume(e.target.value));

        // Close modal when clicking outside
        this.gameOverModal.addEventListener('click', (e) => {
            if (e.target === this.gameOverModal) {
                this.hideGameOverModal();
            }
        });
    }

    /**
     * Start the game and begin timer
     */
    startGame() {
        console.log(`Starting memory game for level ${this.currentLevel}...`);
        
        this.gameStarted = true;
        this.startBtn.disabled = true;
        this.startBtn.textContent = 'Game Running';
        
        // Start the timer
        this.startTimer();
        
        // Play start sound
        this.playSound('gameStart');
        
        console.log('Game started successfully');
    }

    /**
     * Start the game timer
     */
    startTimer() {
        this.timer = setInterval(() => {
            this.seconds++;
            this.updateTimerDisplay();
        }, 1000);
    }

    /**
     * Update timer display in MM:SS format
     */
    updateTimerDisplay() {
        const minutes = Math.floor(this.seconds / 60);
        const remainingSeconds = this.seconds % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        this.timerDisplay.textContent = timeString;
    }

    /**
     * Flip a card and handle game logic
     * @param {HTMLElement} card - Card element to flip
     */
    flipCard(card) {
        // Prevent flipping if card is already flipped or matched
        if (card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        console.log(`Flipping card ${card.dataset.index} with icon ${card.dataset.icon}`);

        // Play flip sound
        this.playSound('cardFlip');

        // Flip the card
        card.classList.add('flipped');
        this.flippedCards.push(card);

        // Check if we have two cards flipped
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateMovesDisplay();
            this.checkForMatch();
        }
    }

    /**
     * Check if the two flipped cards match
     */
    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.dataset.icon === card2.dataset.icon;

        console.log(`Checking match: ${card1.dataset.icon} vs ${card2.dataset.icon} = ${match}`);

        if (match) {
            // Cards match - keep them flipped and update score
            this.handleMatch(card1, card2);
        } else {
            // Cards don't match - flip them back after delay
            this.handleMismatch(card1, card2);
        }
    }

    /**
     * Handle matched cards
     * @param {HTMLElement} card1 - First matched card
     * @param {HTMLElement} card2 - Second matched card
     */
    handleMatch(card1, card2) {
        // Prevent further interaction with matched cards
        this.canFlip = false;
        
        // Play match sound
        this.playSound('cardMatch');
        
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            
            this.matchedPairs++;
            this.updateScore();
            this.flippedCards = [];
            this.canFlip = true;
            
            console.log(`Match found! Total pairs: ${this.matchedPairs}`);
            
            // Check if game is complete
            const config = this.levelConfigs[this.currentLevel];
            if (this.matchedPairs === config.pairs) {
                this.endGame();
            }
        }, 500);
    }

    /**
     * Handle mismatched cards
     * @param {HTMLElement} card1 - First mismatched card
     * @param {HTMLElement} card2 - Second mismatched card
     */
    handleMismatch(card1, card2) {
        // Prevent flipping during animation
        this.canFlip = false;
        
        // Play mismatch sound
        this.playSound('cardMismatch');
        
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            this.flippedCards = [];
            this.canFlip = true;
            
            console.log('Cards flipped back - no match');
        }, 1000);
    }

    /**
     * Update the moves counter display
     */
    updateMovesDisplay() {
        this.movesDisplay.textContent = this.moves;
    }

    /**
     * Update the score based on moves, time, and level
     */
    updateScore() {
        const config = this.levelConfigs[this.currentLevel];
        
        // Base score for each match (higher for higher levels)
        const baseScore = 100 + (this.currentLevel * 25);
        
        // Bonus for quick matches (fewer moves = higher score)
        const moveBonus = Math.max(0, 50 - (this.moves * 2));
        
        // Time penalty (longer time = lower score)
        const timePenalty = Math.min(30, Math.floor(this.seconds / 10));
        
        // Level multiplier (higher levels give more points)
        const levelMultiplier = 1 + (this.currentLevel - 1) * 0.2;
        
        const matchScore = Math.round((baseScore + moveBonus - timePenalty) * levelMultiplier);
        this.score += Math.max(10, matchScore); // Minimum 10 points per match
        
        this.scoreDisplay.textContent = this.score;
        
        console.log(`Score updated: +${matchScore} (total: ${this.score})`);
    }

    /**
     * End the game and show results
     */
    endGame() {
        console.log(`Level ${this.currentLevel} completed!`);
        
        this.gameEnded = true;
        this.stopTimer();
        
        // Play win sound
        this.playSound('gameWin');
        
        // Calculate level bonus
        const levelBonus = this.currentLevel * 500;
        this.score += levelBonus;
        
        // Update final statistics
        document.getElementById('final-time').textContent = this.timerDisplay.textContent;
        document.getElementById('final-moves').textContent = this.moves;
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('completed-level').textContent = this.currentLevel;
        document.getElementById('level-bonus').textContent = `+${levelBonus}`;
        
        // Show/hide next level button
        const nextLevelBtn = document.getElementById('next-level-btn-modal');
        if (this.currentLevel < this.maxLevel) {
            nextLevelBtn.style.display = 'inline-flex';
        } else {
            nextLevelBtn.style.display = 'none';
        }
        
        // Show game over modal
        this.showGameOverModal();
    }

    /**
     * Stop the game timer
     */
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    /**
     * Show the game over modal
     */
    showGameOverModal() {
        this.gameOverModal.style.display = 'block';
    }

    /**
     * Hide the game over modal
     */
    hideGameOverModal() {
        this.gameOverModal.style.display = 'none';
    }

    /**
     * Reset the game to initial state
     */
    resetGame() {
        console.log('Resetting game...');
        
        // Play button click sound
        this.playSound('buttonClick');
        
        // Stop timer if running
        this.stopTimer();
        
        // Reset game state
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameStarted = false;
        this.gameEnded = false;
        this.seconds = 0;
        this.canFlip = true;
        
        // Reset displays
        this.timerDisplay.textContent = '00:00';
        this.movesDisplay.textContent = '0';
        this.scoreDisplay.textContent = '0';
        
        // Reset buttons
        this.startBtn.disabled = false;
        this.startBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';
        this.nextLevelBtn.style.display = 'none';
        
        // Hide modal if open
        this.hideGameOverModal();
        
        // Reinitialize the game board
        this.initializeGame();
        
        console.log('Game reset completed');
    }

    /**
     * Start a new game after completion
     */
    playAgain() {
        this.hideGameOverModal();
        this.resetGame();
        this.startGame();
    }

    /**
     * Advance to the next level
     */
    nextLevel() {
        if (this.currentLevel < this.maxLevel) {
            this.playSound('levelUp');
            this.hideGameOverModal();
            this.setLevel(this.currentLevel + 1);
            this.startGame();
            console.log(`Advanced to level ${this.currentLevel}`);
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Memory Game DOM loaded - initializing...');
    new MemoryGame();
});
