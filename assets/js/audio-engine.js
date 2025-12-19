/**
 * Audio Engine
 * Handles dynamic music playback, fading, and UI synchronization.
 */

class MusicController {
    constructor() {
        this.audio = new Audio();
        this.audio.loop = true;
        this.isPlaying = false;
        this.faderInterval = null;
        this.defaultSong = "assets/media/shehnai.mp3"; // Fallback

        // UI Elements (to be bound later)
        this.playBtn = null;
        this.vinylIcon = null;
    }

    /**
     * Initialize the player with a song URL
     * @param {string} songUrl - The URL of the MP3
     */
    init(songUrl) {
        const src = songUrl || this.defaultSong;
        this.audio.src = src;
        this.audio.volume = 0; // Start at 0 for fade-in

        // Attempt auto-play logic
        this.play();
    }

    bindUI(playBtnId, vinylIconId) {
        this.playBtn = document.getElementById(playBtnId);
        this.vinylIcon = document.getElementById(vinylIconId);

        if (this.playBtn) {
            this.playBtn.addEventListener('click', () => this.toggle());
        }
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.fadeIn();
            this.updateUI();
        }).catch(err => {
            console.warn("Auto-play blocked by browser. Validation required.", err);
            this.isPlaying = false;
            this.updateUI();
        });
    }

    pause() {
        this.fadeOut(() => {
            this.audio.pause();
            this.isPlaying = false;
            this.updateUI();
        });
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    /**
     * Smoothly increases volume from 0 to 1
     */
    fadeIn() {
        clearInterval(this.faderInterval);
        this.faderInterval = setInterval(() => {
            if (this.audio.volume < 0.9) {
                this.audio.volume += 0.05;
            } else {
                this.audio.volume = 1;
                clearInterval(this.faderInterval);
            }
        }, 200);
    }

    /**
     * Smoothly decreases volume from current to 0
     * @param {Function} callback - Function to run after fade completes
     */
    fadeOut(callback) {
        clearInterval(this.faderInterval);
        this.faderInterval = setInterval(() => {
            if (this.audio.volume > 0.1) {
                this.audio.volume -= 0.1;
            } else {
                this.audio.volume = 0;
                clearInterval(this.faderInterval);
                if (callback) callback();
            }
        }, 200);
    }

    updateUI() {
        if (this.vinylIcon) {
            if (this.isPlaying) {
                this.vinylIcon.classList.add('spinning');
            } else {
                this.vinylIcon.classList.remove('spinning');
            }
        }

        if (this.playBtn) {
            this.playBtn.innerHTML = this.isPlaying
                ? '<i class="fas fa-pause"></i>'
                : '<i class="fas fa-play"></i>';
        }
    }
}

// Global Instance
window.audioEngine = new MusicController();
