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

  prepareAll() {
    this.prepareWorldSounds();
    this.prepareCharacterSounds();
    this.prepareEnemySounds();
    this.prepareBottleSounds();
    this.prepareEndbossSounds();
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
    sound.path = path;
    sound.dataset.originalVolume = volume;
    sound.dataset.originalPlaybackRate = playbackRate;
    this.sounds[path] = sound;

    return this.sounds[path];
  }

  prepareWorldSounds() {
    const worldSounds = {
      background: "assets/audio/background.wav",
      coin: "assets/audio/coin.wav",
      collecting: "assets/audio/collect.wav",
      lose: "assets/audio/lose_endscreen.wav",
      win: "assets/audio/win_endscreen.wav",
    };

    const config = {
      background: { volume: 0.2, loop: true, rate: 1 },
      coin: { volume: 0.2, loop: false, rate: 1 },
      collecting: { volume: 0.1, loop: false, rate: 1 },
      lose: { volume: 0.5, loop: false, rate: 1 },
      win: { volume: 0.5, loop: false, rate: 1 },
    };

    for (const [key, path] of Object.entries(worldSounds)) {
      const { volume, loop, rate } = config[key] || {};
      this.sounds[key] = this.prepare(path, volume, loop, rate);
    }
  }

  prepareCharacterSounds() {
    const characterSounds = {
      walking: "assets/audio/walking.mp3",
      jumping: "assets/audio/jump.wav",
      hurting: "assets/audio/hurt.ogg",
      snoring: "assets/audio/snoring.wav",
      dead: "assets/audio/character_die.mp3",
    };

    const config = {
      walking: { volume: 1, loop: true, rate: 2 },
      jumping: { volume: 1, loop: false, rate: 1 },
      hurting: { volume: 1, loop: false, rate: 1 },
      snoring: { volume: 0.8, loop: true, rate: 1.5 },
      dead: { volume: 0.5, loop: false, rate: 1 },
    };

    for (const [key, path] of Object.entries(characterSounds)) {
      const { volume, loop, rate } = config[key] || {};
      this.sounds[key] = this.prepare(path, volume, loop, rate);
    }
  }

  prepareEndbossSounds() {
    const endbossSounds = {
      endboss_hurting: "assets/audio/chicken sound.mp3",
      endfight: "assets/audio/endboss.wav",
    };

    const config = {
      endfight: { volume: 0.2, loop: true, rate: 1 },
      endboss_hurting: { volume: 1, loop: false, rate: 1.5 },
    };

    for (const [key, path] of Object.entries(endbossSounds)) {
      const { volume, loop, rate } = config[key] || {};
      this.sounds[key] = this.prepare(path, volume, loop, rate);
    }
  }

  prepareEnemySounds() {
    const enemySounds = {
      chicken_dead: {
        path: "assets/audio/damage.mp3",
        volume: 0.4,
        loop: false,
        rate: 1,
      },
    };

    for (const [key, { path, volume, loop, rate }] of Object.entries(
      enemySounds
    )) {
      this.sounds[key] = this.prepare(path, volume, loop, rate);
    }
  }

  prepareBottleSounds() {
    const bottleSounds = {
      throw_bottle: {
        path: "assets/audio/throw.wav",
        volume: 0.1,
        loop: false,
        rate: 1,
      },
    };

    for (const [key, { path, volume, loop, rate }] of Object.entries(
      bottleSounds
    )) {
      this.sounds[key] = this.prepare(path, volume, loop, rate);
    }
  }

  playByKey(key) {
    const sound = this.sounds[key];
    if (sound) sound.play();
  }

  pauseByKey(key) {
    const sound = this.sounds[key];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
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
}
