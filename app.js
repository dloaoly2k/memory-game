/**
 * Memory Card Game - Main Game Logic
 * Features: 3 difficulty levels, timer, move counter, scoring system, card matching, sound effects, player names, custom AOL images, background music
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
        this.maxLevel = 3;

        // Sound system
        this.soundEnabled = true;
        this.volume = 0.7;
        this.sounds = {};

        // Music system
        this.musicEnabled = false;
        this.musicVolume = 0.5;

        // Level configurations - 3 levels with custom grid sizes
        this.levelConfigs = {
            1: { gridSize: 3, pairs: 3, description: 'Easy - 3 pairs (6 cards) - 3x2 grid' },
            2: { gridSize: 4, pairs: 6, description: 'Medium - 6 pairs (12 cards) - 3x4 grid' },
            3: { gridSize: 4, pairs: 8, description: 'Hard - 8 pairs (16 cards) - 4x4 grid' }
        };

        // Custom AOL images for card fronts
        this.customImages = [
            'images/AOL132.png', 'images/AOL1285.png', 'images/AOL 960.png', 'images/AOL 801.png',
            'images/AOL 5535.png', 'images/AOL 5418.png', 'images/AOL 5189.png', 'images/AOL 5164.png',
            'images/AOL 5118.png', 'images/AOL 5079.png', 'images/AOL 4916.png', 'images/AOL 4753.png',
            'images/AOL 4676.png', 'images/AOL 4149.png', 'images/AOL 3888.png', 'images/AOL 3849.png',
            'images/AOL 3658.png', 'images/AOL 3577.png', 'images/AOL 357.png', 'images/AOL 3451.png',
            'images/AOL 3355.png', 'images/AOL 3329.png', 'images/AOL 3310.png', 'images/AOL 3178.png',
            'images/AOL 3123.png', 'images/AOL 2964.png', 'images/AOL 2511.png', 'images/AOL 2504.png',
            'images/AOL 2225.png', 'images/AOL 2114.png', 'images/AOL 20.png', 'images/AOL 1908.png',
            'images/AOL 1894.png', 'images/AOL 1520.png', 'images/AOL 1519.png', 'images/AOL 1421.png',
            'images/AOL 1327.png', 'images/AOL 1252.png', 'images/AOL 1054.png', 'images/AOL 1044.png',
            'images/AOL 1037.png', 'images/AOL2529.png'
        ];

        // DOM elements
        this.gameBoard = document.getElementById('game-board');
        this.timerDisplay = document.getElementById('timer');
        this.movesDisplay = document.getElementById('moves');
        this.scoreDisplay = document.getElementById('score');
        this.levelDisplay = document.getElementById('level');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
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
        
        // Music control elements
        this.musicToggleBtn = document.getElementById('music-toggle');
        this.musicVolumeSlider = document.getElementById('music-volume-slider');
        this.musicVolumeValue = document.getElementById('music-volume-value');
        this.backgroundMusic = document.getElementById('background-music');
        
        // Level selection elements
        this.levelButtons = document.querySelectorAll('.level-btn');
        console.log('Found level buttons:', this.levelButtons.length);
        this.levelButtons.forEach((btn, index) => {
            console.log(`Level button ${index}:`, btn.dataset.level, btn.textContent);
        });
        this.currentLevelDisplay = document.getElementById('current-level-display');
        this.levelDescription = document.getElementById('level-description');
        this.completedLevelDisplay = document.getElementById('completed-level');
        this.levelBonusDisplay = document.getElementById('level-bonus');

        // Initialize the game - IMPORTANT: updateGameBoardClass must be called BEFORE initializeGame
        this.updateGameBoardClass();
        this.initializeGame();
        this.initializeSounds();
        this.bindEvents();
        this.loadPlayerName();
        this.loadMusicPreferences();
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
        try {
            if (this.sounds[soundName]) {
                this.sounds[soundName]();
            } else {
                console.log(`Sound not found: ${soundName}`);
            }
        } catch (error) {
            console.warn(`Error playing sound ${soundName}:`, error);
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
     * @param {number} level - Level number (1-3)
     */
    setLevel(level) {
        console.log(`setLevel called with: ${level}, maxLevel: ${this.maxLevel}`);
        if (level >= 1 && level <= this.maxLevel) {
            this.currentLevel = level;
            this.updateLevelDisplay();
            this.updateGameBoardClass();
            this.resetGame();
            console.log(`Level set to: ${level}`);
        } else {
            console.log(`Invalid level: ${level}, must be between 1 and ${this.maxLevel}`);
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
        // Remove all level classes (only 3 levels now)
        this.gameBoard.classList.remove('level-1', 'level-2', 'level-3');
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
        const levelIcons = this.customImages.slice(0, pairsNeeded);
        
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
     * @param {string} imagePath - Path to the AOL image for card front
     * @param {number} index - Card index
     * @returns {HTMLElement} Card element
     */
    createCard(imagePath, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.image = imagePath;

        // Create card front (shows AOL image)
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        const imgElement = document.createElement('img');
        imgElement.src = imagePath;
        imgElement.className = 'card-image';
        imgElement.alt = `Card front ${index}`;
        // Add error handling for missing images
        imgElement.onerror = () => {
            imgElement.style.display = 'none';
            const fallbackIcon = document.createElement('i');
            fallbackIcon.className = 'fas fa-question';
            fallbackIcon.style.fontSize = '2rem';
            fallbackIcon.style.color = '#ff0000';
            cardFront.appendChild(fallbackIcon);
        };
        cardFront.appendChild(imgElement);

        // Create card back (shows AOL logo)
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        const backImgElement = document.createElement('img');
        backImgElement.src = 'images/card-back.png';
        backImgElement.className = 'card-back-image';
        backImgElement.alt = 'Card back';
        cardBack.appendChild(backImgElement);

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
        this.nextLevelBtnModal.addEventListener('click', () => this.nextLevel());
        
        // Level selection events
        this.levelButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Level button clicked:', btn.dataset.level);
                const level = parseInt(btn.dataset.level);
                console.log('Parsed level:', level);
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

        // Music control events
        this.musicToggleBtn.addEventListener('click', () => this.toggleMusic());
        this.musicVolumeSlider.addEventListener('input', (e) => this.updateMusicVolume(e.target.value));

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
        
        // Play background music if enabled
        if (this.musicEnabled) {
            this.playBackgroundMusic();
        }
        
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

        console.log(`Flipping card ${card.dataset.index} with image ${card.dataset.image}`);

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
        const match = card1.dataset.image === card2.dataset.image;

        console.log(`Checking match: ${card1.dataset.image} vs ${card2.dataset.image} = ${match}`);

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
        
        // Keep cards flipped and add matched class for green glow
        // Don't remove 'flipped' class - keep cards showing the AOL images
        
        setTimeout(() => {
            // Add matched class while keeping flipped class
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
        
        // Add mismatch class for red flash effect
        card1.classList.add('mismatch');
        card2.classList.add('mismatch');
        
        setTimeout(() => {
            // Remove mismatch class and flip cards back
            card1.classList.remove('flipped', 'mismatch');
            card2.classList.remove('flipped', 'mismatch');
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
        
        // Hide modal if open
        this.hideGameOverModal();
        
        // Reinitialize the game board
        this.initializeGame();
        
        console.log(`Game reset completed for level ${this.currentLevel}`);
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
        } else {
            console.log('All levels completed!');
        }
    }

    /**
     * Load music preferences from localStorage
     */
    loadMusicPreferences() {
        console.log('Loading music preferences...');
        const savedMusicEnabled = localStorage.getItem('memoryGameMusicEnabled');
        if (savedMusicEnabled === 'true') {
            this.musicEnabled = true;
            this.musicToggleBtn.classList.remove('muted');
            this.musicToggleBtn.querySelector('i').className = 'fas fa-volume-up';
            this.musicToggleBtn.querySelector('span').textContent = 'Music: ON';
            console.log('Music enabled from localStorage');
        } else {
            this.musicEnabled = false;
            this.musicToggleBtn.classList.add('muted');
            this.musicToggleBtn.querySelector('i').className = 'fas fa-volume-mute';
            this.musicToggleBtn.querySelector('span').textContent = 'Music: OFF';
            console.log('Music disabled from localStorage');
        }

        const savedMusicVolume = localStorage.getItem('memoryGameMusicVolume');
        if (savedMusicVolume) {
            this.musicVolume = parseFloat(savedMusicVolume);
            this.musicVolumeSlider.value = this.musicVolume * 100;
            this.musicVolumeValue.textContent = `${Math.round(this.musicVolume * 100)}%`;
            console.log('Music volume loaded:', this.musicVolume);
        }
    }

    /**
     * Save music preferences to localStorage
     */
    saveMusicPreferences() {
        localStorage.setItem('memoryGameMusicEnabled', this.musicEnabled);
        localStorage.setItem('memoryGameMusicVolume', this.musicVolume);
    }

    /**
     * Toggle music on/off
     */
    toggleMusic() {
        console.log('toggleMusic called, current state:', this.musicEnabled);
        this.musicEnabled = !this.musicEnabled;
        this.musicToggleBtn.classList.toggle('muted');
        this.musicToggleBtn.querySelector('i').className = this.musicEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        this.musicToggleBtn.querySelector('span').textContent = this.musicEnabled ? 'Music: ON' : 'Music: OFF';
        this.saveMusicPreferences();
        if (this.musicEnabled) {
            console.log('Playing background music...');
            this.playBackgroundMusic();
        } else {
            console.log('Stopping background music...');
            this.stopBackgroundMusic();
        }
    }

    /**
     * Update music volume level
     * @param {number} volume - Volume level (0-1)
     */
    updateMusicVolume(volume) {
        this.musicVolume = volume / 100;
        this.musicVolumeValue.textContent = `${Math.round(volume)}%`;
        console.log(`Music volume updated: ${Math.round(volume)}%`);
        this.saveMusicPreferences();
        if (this.musicEnabled) {
            this.playBackgroundMusic();
        }
    }

    /**
     * Play background music
     */
    playBackgroundMusic() {
        console.log('playBackgroundMusic called');
        if (!this.backgroundMusic) {
            console.warn('Background music element not found');
            return;
        }
        console.log('Background music element found, paused:', this.backgroundMusic.paused);
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.volume = this.musicVolume;
            console.log('Setting volume to:', this.musicVolume);
            this.backgroundMusic.play().catch(e => console.warn('Error playing background music:', e));
        }
    }

    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0; // Reset playback position
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Memory Game DOM loaded - initializing...');
    new MemoryGame();
});
