export default class SoundManager {
  constructor() {
    this.sounds = {};
    this.muted = false;
  }

  prepare(path, volume = 1, loop = false, playbackRate = 1) {
    let sound = new Audio(path);
    sound.loop = loop;
    sound.volume = this.muted ? 0 : volume;
    sound.playbackRate = playbackRate;
    sound.dataset.originalVolume = volume;
    sound.dataset.originalPlaybackRate = playbackRate;
    this.sounds[path] = sound;

    return this.sounds[path];
  }

  play(path) {
    return this.sounds[path].play();
  }

  pause(path) {
    return this.sounds[path].pause();
  }

  unmuteAll() {
    this.muted = false;
    Object.values(this.sounds).forEach((sound) => {
      let originalVolume = parseFloat(sound.dataset.originalVolume || 1);
      let originalPlaybackRate = parseFloat(
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

  stopAndResetAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      sound.pause();
      sound.volume = 0;
      sound.currentTime = 0;
    });
    this.sounds = {};
  }
}
