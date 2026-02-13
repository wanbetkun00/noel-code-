const typewriter = document.getElementById("typewriter");
const scrollToTimeline = document.getElementById("scrollToTimeline");
const timelineSection = document.getElementById("timeline");
const gallerySection = document.getElementById("gallery");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
const introOverlay = document.getElementById("introOverlay");
const giftButton = document.getElementById("giftButton");
const introHearts = document.getElementById("introHearts");
const mainContent = document.getElementById("mainContent");

// INSERT_TEXT_HERE: Typewriter name
const typewriterText = "Đỗ Trần Phương Uyên";
let typewriterIndex = 0;

const typeNextChar = () => {
  if (!typewriter) return;
  if (typewriterIndex <= typewriterText.length) {
    typewriter.textContent = typewriterText.slice(0, typewriterIndex);
    typewriterIndex += 1;
    setTimeout(typeNextChar, 90);
  }
};

const startMainEffects = (() => {
  let started = false;
  return () => {
    if (started) return;
    started = true;
    typeNextChar();
    initHearts();
  };
})();

const scrollTarget = timelineSection || gallerySection;
if (scrollToTimeline && scrollTarget) {
  scrollToTimeline.addEventListener("click", () => {
    scrollTarget.scrollIntoView({ behavior: "smooth" });
  });
}

let isMusicPlaying = false;

const updateMusicButtonLabel = () => {
  if (!musicToggle) return;
  musicToggle.textContent = isMusicPlaying ? "Pause Music" : "Play Music";
};

const startBackgroundMusic = async () => {
  if (!bgMusic || isMusicPlaying) return;
  try {
    await bgMusic.play();
    isMusicPlaying = true;
    updateMusicButtonLabel();
  } catch (error) {
    if (musicToggle) musicToggle.textContent = "Tap to Play";
  }
};

const toggleBackgroundMusic = async () => {
  if (!bgMusic) return;
  if (!isMusicPlaying) {
    await startBackgroundMusic();
    return;
  }
  bgMusic.pause();
  isMusicPlaying = false;
  updateMusicButtonLabel();
};

if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", () => {
    toggleBackgroundMusic();
  });
}

const heartsCanvas = document.getElementById("heartsCanvas");
const heartsCtx = heartsCanvas ? heartsCanvas.getContext("2d") : null;
const hearts = [];

const resizeCanvas = () => {
  if (!heartsCanvas) return;
  heartsCanvas.width = window.innerWidth;
  heartsCanvas.height = window.innerHeight;
};

const randomBetween = (min, max) => Math.random() * (max - min) + min;
const HEART_COLORS = ["#ff4d6d", "#ff7aa2", "#ff3b7a", "#ff5c8a"];
const INTRO_REVEAL_DELAY = 900;

const createHeart = () => ({
  x: randomBetween(0, window.innerWidth),
  y: randomBetween(-window.innerHeight, 0),
  size: randomBetween(8, 18),
  speed: randomBetween(0.6, 1.6),
  sway: randomBetween(-0.6, 0.6),
  alpha: randomBetween(0.5, 0.9),
});

const drawHeart = (heart) => {
  if (!heartsCtx) return;
  heartsCtx.save();
  heartsCtx.translate(heart.x, heart.y);
  heartsCtx.scale(heart.size / 16, heart.size / 16);
  heartsCtx.globalAlpha = heart.alpha;
  heartsCtx.fillStyle = "rgba(128, 0, 32, 0.7)";
  heartsCtx.beginPath();
  heartsCtx.moveTo(0, 6);
  heartsCtx.bezierCurveTo(0, 0, -8, 0, -8, 6);
  heartsCtx.bezierCurveTo(-8, 10, -4, 14, 0, 16);
  heartsCtx.bezierCurveTo(4, 14, 8, 10, 8, 6);
  heartsCtx.bezierCurveTo(8, 0, 0, 0, 0, 6);
  heartsCtx.closePath();
  heartsCtx.fill();
  heartsCtx.restore();
};

const updateHearts = () => {
  if (!heartsCtx || !heartsCanvas) return;
  heartsCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);

  hearts.forEach((heart) => {
    heart.y += heart.speed;
    heart.x += heart.sway;

    if (heart.y > window.innerHeight + 20) {
      heart.y = randomBetween(-200, -50);
      heart.x = randomBetween(0, window.innerWidth);
    }
    drawHeart(heart);
  });

  requestAnimationFrame(updateHearts);
};

const initHearts = () => {
  if (!heartsCanvas || !heartsCtx) return;
  resizeCanvas();
  hearts.length = 0;
  const area = window.innerWidth * window.innerHeight;
  const totalHearts = Math.min(Math.floor(area / 8000), 160);
  for (let i = 0; i < totalHearts; i += 1) {
    hearts.push(createHeart());
  }
  updateHearts();
};

window.addEventListener("resize", () => {
  resizeCanvas();
});

window.addEventListener("load", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});

const createBurstHearts = () => {
  if (!introHearts) return;
  const total = 140;

  for (let i = 0; i < total; i += 1) {
    const heart = document.createElement("span");
    heart.className = "intro-heart";
    heart.style.left = `${randomBetween(0, window.innerWidth)}px`;
    heart.style.top = `${randomBetween(0, window.innerHeight)}px`;
    const duration = randomBetween(1.4, 2.6);
    const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    heart.style.setProperty("--x", `${randomBetween(-220, 220)}px`);
    heart.style.setProperty("--y", `${randomBetween(-320, -80)}px`);
    heart.style.setProperty("--scale", `${randomBetween(0.7, 1.45)}`);
    heart.style.setProperty("--duration", `${duration}s`);
    heart.style.setProperty("--size", `${randomBetween(10, 20)}px`);
    heart.style.setProperty("--heart-color", color);
    heart.style.setProperty("--glow", `${randomBetween(6, 14)}px`);
    heart.style.setProperty("--glow-color", color);
    heart.style.setProperty("--rotate", `${randomBetween(-25, 25)}deg`);
    introHearts.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000 + 240);
  }
};

const revealMain = () => {
  if (introOverlay) introOverlay.classList.add("is-hidden");
  if (mainContent) mainContent.classList.remove("main-hidden");
  document.body.classList.remove("intro-active");
  startMainEffects();
};

if (introOverlay && mainContent) {
  document.body.classList.add("intro-active");
  let introAnimating = false;
  if (giftButton) {
    giftButton.addEventListener("click", () => {
      if (introAnimating) return;
      introAnimating = true;
      createBurstHearts();
      startBackgroundMusic();
      setTimeout(revealMain, INTRO_REVEAL_DELAY);
    });
  }
} else {
  if (mainContent) mainContent.classList.remove("main-hidden");
  startMainEffects();
}
