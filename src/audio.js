export class SoundManager {
    constructor() {
        this.currentSound = null;
        this.audio = new Audio();
        this.audio.loop = true;
        this.isPlaying = false;
        this.volume = 0.5;
        this.soundType = 'rain'; // 'rain' or 'cafe'

        this.sounds = {
            rain: './public/sounds/rain.mp3',
            cafe: './public/sounds/cafe.mp3'
        };
    }

    setVolume(value) {
        this.volume = value;
        this.audio.volume = this.volume;
    }

    setSoundType(type) {
        if (this.sounds[type]) {
            this.soundType = type;
            const wasPlaying = this.isPlaying;
            if (wasPlaying) {
                this.stop();
            }
            this.audio.src = this.sounds[type];
            if (wasPlaying) {
                this.play();
            }
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
        return this.isPlaying;
    }

    play() {
        if (!this.audio.src || this.audio.src === '') {
            this.audio.src = this.sounds[this.soundType];
        }
        this.audio.volume = this.volume;
        this.audio.play().catch(e => console.error("Audio play failed:", e));
        this.isPlaying = true;
    }

    stop() {
        this.audio.pause();
        this.isPlaying = false;
    }
}
