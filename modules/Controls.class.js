const leftBtn = document.querySelector(".fa-circle-left");
const rightBtn = document.querySelector(".fa-circle-right");
const upBtn = document.querySelector(".fa-circle-up");
const throwBtn = document.querySelector(".fa-wine-bottle");

/**
 * @class Controls - Manages user input controls for the game, including keyboard and touch controls.
 */
export default class Controls {
  /**
   * @constructor - Initializes control states and sets up keyboard and touch controls.
   */
  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.d = false;

    this.setupKeyboardControls();
    this.setupTouchControls();
  }

  /**
   * @method resetControls - Resets all control states to their default values (false).
   */
  resetControls() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.d = false;
  }

  /**
   * @method setupKeyboardControls - Sets up the event listeners for keyboard controls.
   */
  setupKeyboardControls() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.left = true;
      if (e.key === "ArrowRight") this.right = true;
      if (e.key === " ") this.up = true;
      if (e.key === "d") this.d = true;
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft") this.left = false;
      if (e.key === "ArrowRight") this.right = false;
      if (e.key === " ") this.up = false;
      if (e.key === "d") this.d = false;
    });
  }

  /**
   * @method setupTouchControls - Sets up the event listeners for touch controls on screen buttons.
   */
  setupTouchControls() {
    if (leftBtn) {
      leftBtn.addEventListener("touchstart", () => (this.left = true), {
        passive: true,
      });
      leftBtn.addEventListener("touchend", () => (this.left = false));
    }

    if (rightBtn) {
      rightBtn.addEventListener("touchstart", () => (this.right = true), {
        passive: true,
      });
      rightBtn.addEventListener("touchend", () => (this.right = false));
    }

    if (upBtn) {
      upBtn.addEventListener("touchstart", () => (this.up = true), {
        passive: true,
      });
      upBtn.addEventListener("touchend", () => (this.up = false));
    }

    if (throwBtn) {
      throwBtn.addEventListener("touchstart", () => (this.d = true), {
        passive: true,
      });
      throwBtn.addEventListener("touchend", () => (this.d = false));
    }
  }
}
