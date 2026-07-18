console.log('AudioPlayer loaded');

class AudioPlayer {
  constructor(playerElement) {
    this.player = playerElement;
    this.audio = this.player.querySelector('#ringtone');
    this.playBtn = this.player.querySelector('.play-btn');
    this.progressBar = this.player.querySelector('.progress-bar');
    this.currentTimeEl = this.player.querySelector('.current-time');
    this.durationEl = this.player.querySelector('.duration');
    this.volumeBar = this.player.querySelector('.volume-bar');
    this.muteBtn = this.player.querySelector('.mute-btn');

    this.isPlaying = false;
    this.isSeeking = false;

    this.initializePlayer();
  }

  initializePlayer() {
    // Load metadata to get duration
    this.audio.addEventListener('loadedmetadata', () => {
      // this.durationEl.textContent = this.formatTime(this.audio.duration);
      // this.progressBar.max = Math.floor(this.audio.duration);
      console.log('Audio duration:', this.formatTime(this.audio.duration));
    });

    // Update progress as audio plays
    this.audio.addEventListener('timeupdate', () => {
      if (!this.isSeeking) {
        this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        this.progressBar.value = Math.floor(this.audio.currentTime);
      }
    });

    // Handle play/pause
    this.playBtn.addEventListener('click', () => this.togglePlay());

    // Space bar to play/pause
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        this.togglePlay();
      }
    });

    // Progress bar seeking
    this.progressBar.addEventListener('input', () => {
      this.isSeeking = true;
      this.currentTimeEl.textContent = this.formatTime(this.progressBar.value);
    });

    this.progressBar.addEventListener('change', () => {
      this.audio.currentTime = this.progressBar.value;
      this.isSeeking = false;
    });

    // Volume controls
    this.volumeBar.addEventListener('input', (e) => {
      this.audio.volume = e.target.value / 100;
      this.updateVolumeIcon();
    });

    this.muteBtn.addEventListener('click', () => this.toggleMute());

    // Handle audio end
    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.updatePlayButton();
    });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
    this.updatePlayButton();
  }

  updatePlayButton() {
    const playIcon = this.playBtn.querySelector('.play-icon');
    const pauseIcon = this.playBtn.querySelector('.pause-icon');

    if (this.isPlaying) {
      playIcon.hidden = true;
      pauseIcon.hidden = false;
      this.playBtn.setAttribute('aria-label', 'Pause');
    } else {
      playIcon.hidden = false;
      pauseIcon.hidden = true;
      this.playBtn.setAttribute('aria-label', 'Play');
    }
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
    this.updateVolumeIcon();
  }

  updateVolumeIcon() {
    if (this.audio.muted || this.audio.volume === 0) {
      this.muteBtn.textContent = '🔇';
      this.muteBtn.setAttribute('aria-label', 'Unmute');
    } else if (this.audio.volume < 0.5) {
      this.muteBtn.textContent = '🔉';
      this.muteBtn.setAttribute('aria-label', 'Mute');
    } else {
      this.muteBtn.textContent = '🔊';
      this.muteBtn.setAttribute('aria-label', 'Mute');
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// Initialize player
document.addEventListener('DOMContentLoaded', () => {
  const playerElement = document.querySelector('.player');
  if (playerElement) {
    new AudioPlayer(playerElement);
  }
});
