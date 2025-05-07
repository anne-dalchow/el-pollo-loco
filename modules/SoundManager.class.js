export default class SoundManager {
  constructor() {
    this.enabled = true;
  }

  toggle(state) {
    this.enabled = state;
  }

  play(filePath, volume = 1, playbackRate = 1) {
    if (!this.enabled) return;
    const audio = new Audio(filePath);
    audio.volume = volume;
    audio.playbackRate = playbackRate;
    audio.play();
    return audio;
  }
}
