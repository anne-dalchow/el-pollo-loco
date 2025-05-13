/**
 * @class SoundManager - A class responsible for managing sounds in the game.
 * Allows playing, pausing, muting, unmuting, and stopping sounds, as well as controlling their volume and playback rate.
 */
export default class SoundManager {
  /**
   * @constructor - Initializes the sound manager object with an empty sounds collection and sets the muted status to false.
   * @param {Object} sounds - A collection of sounds, indexed by their file paths.
   * @param {boolean} muted - A flag indicating whether sounds are muted (true) or not (false).
   */
  constructor() {
    this.sounds = {};
    this.muted = false;
  }

  /**
   * @method prepare - Prepares a sound for playback by creating an audio object.
   * @param {string} path - The path to the audio file.
   * @param {number} [volume=1] - The volume level of the sound (0 to 1).
   * @param {boolean} [loop=false] - Whether the sound should loop.
   * @param {number} [playbackRate=1] - The playback speed of the sound (1 is normal speed).
   * @returns {HTMLAudioElement} - The prepared audio object.
   */
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

  /**
   * @method play - Plays a prepared sound.
   * @param {string} path - The path to the audio file to play.
   * @returns {Promise} - A promise that resolves when the sound starts playing.
   */
  play(path) {
    return this.sounds[path].play();
  }

  /**
   * @method pause - Pauses a playing sound.
   * @param {string} path - The path to the audio file to pause.
   */
  pause(path) {
    return this.sounds[path].pause();
  }

  /**
   * @method unmuteAll - Unmutes all sounds and restores their original volume and playback rate.
   */
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

  /**
   * @method muteAll - Mutes all sounds by setting their volume to 0.
   */
  muteAll() {
    this.muted = true;
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = 0;
    });
  }

  /**
   * @method stopAndResetAllSounds - Stops and resets all sounds. Pauses all sounds, sets their volume to 0, and resets their playback position and finally clears the sound collection.
   */
  stopAndResetAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      sound.pause();
      sound.volume = 0;
      sound.currentTime = 0;
    });
    this.sounds = {};
  }
}
