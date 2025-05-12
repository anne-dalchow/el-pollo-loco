export default class SoundManager {
  constructor() {
    this.sounds = {};
    this.muted = false;
  }

  prepare(path, volume = 1, loop = false, playbackRate = 1) {
    if (!this.sounds[path]) {
      const sound = new Audio(path);
      sound.loop = loop;
      sound.volume = this.muted ? 0 : volume;
      sound.playbackRate = playbackRate;
      sound.dataset.originalVolume = volume;
      sound.dataset.originalPlaybackRate = playbackRate;
      this.sounds[path] = sound;
    }
    return this.sounds[path];
  }

  play(path) {
    try {
      const sound = this.sounds[path];
      if (!sound) {
        console.warn(`Sound wurde nicht vorbereitet: ${path}`);
        return;
      }
      sound.play();
      return sound;
    } catch (e) {
      console.warn(`Sound konnte nicht abgespielt werden: ${path}`, e);
    }
  }

  pause(path) {
    const sound = this.sounds[path];
    if (sound && !sound.paused) {
      sound.pause();
    }
  }

  unmuteAll() {
    this.muted = false;
    Object.values(this.sounds).forEach((sound) => {
      const originalVolume = parseFloat(sound.dataset.originalVolume || 1);
      const originalPlaybackRate = parseFloat(
        sound.dataset.originalPlaybackRate || 1
      );
      sound.volume = originalVolume;
      sound.playbackRate = originalPlaybackRate;
    });
  }

  muteAll() {
    this.muted = true;
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = 0;
    });
  }

  toggleMute() {
    this.muted ? this.unmuteAll() : this.muteAll();
  }

  stopAndResetAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      sound.pause();
      sound.volume = 0;
      sound.currentTime = 0;
    });
    this.sounds = {};
  }
}
