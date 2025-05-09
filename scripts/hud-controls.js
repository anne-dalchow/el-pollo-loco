document.addEventListener("DOMContentLoaded", () => {
  // Sound-Toggle
  const soundIcons = document.querySelectorAll(".sound i");
  const soundCheckbox = document.getElementById("sound");

  soundIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      soundIcons.forEach((i) => i.classList.toggle("hidden"));
      soundCheckbox.checked = !soundCheckbox.checked;
      // Optional: Dein AudioManager hier ansteuern
      console.log("Sound:", soundCheckbox.checked ? "an" : "aus");
    });
  });

  // Fullscreen-Toggle
  const fullscreenIcons = document.querySelectorAll(".fullscreen-toggle i");
  const fullscreenCheckbox = document.getElementById("fullscreen-checkbox");

  fullscreenIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      fullscreenIcons.forEach((i) => i.classList.toggle("hidden"));
      fullscreenCheckbox.checked = !fullscreenCheckbox.checked;

      if (fullscreenCheckbox.checked) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  });

  // Restart-Button
  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      location.reload(); // oder deine eigene Reset-Logik
    });
  }

  // Start-Button (wenn du "fa-circle-play" verwendest)
  const playBtn = document.querySelector(".fa-circle-play");
  const startscreen = document.getElementById("startscreen");
  const canvas = document.getElementById("canvas");

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      startscreen.classList.add("hidden");
      canvas.classList.remove("hidden");
      // Optional: Game starten
      console.log("Spiel gestartet");
    });
  }

  // Manuelles Icon-Setup (wenn du verstecken willst)
  // z. B. initiale Anzeige "volume-high", nicht "volume-xmark"
  document.querySelector(".fa-volume-high")?.classList.remove("hidden");
  document.querySelector(".fa-volume-xmark")?.classList.add("hidden");
  document.querySelector(".fa-expand")?.classList.remove("hidden");
  document.querySelector(".fa-compress")?.classList.add("hidden");
});
