// === Toggle helper functions ===
/**
 * @function showElement - Displays the specified element.
 * @param {HTMLElement} el - The element to be shown.
 */
export function showElement(el) {
  el.classList.remove("hidden");
  el.classList.add("visible");
}

/**
 * @function hideElement - Hides the specified element.
 * @param {HTMLElement} el - The element to be hidden.
 */
export function hideElement(el) {
  el.classList.remove("visible");
  el.classList.add("hidden");
}
