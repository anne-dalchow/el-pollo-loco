export default class SoundManager {
  constructor() {
    this.sounds = {};
    this.muted = false;
  }

  play(path, volume = 1, loop = false, playbackRate = 1) {
    try {
      let sound;

      if (this.sounds[path]) {
        sound = this.sounds[path];
      } else {
        sound = new Audio(path);
        sound.dataset.originalVolume = volume;
        sound.dataset.originalPlaybackRate = playbackRate;
        this.sounds[path] = sound;
      }

      sound.loop = loop;
      sound.volume = this.muted ? 0 : volume;
      sound.playbackRate = playbackRate;
      sound.play();
      return sound;
    } catch (e) {
      console.warn(`Sound konnte nicht abgespielt werden: ${path}`, e);
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
}
