const playlist = [
  {
    title: "Midnight Echo",
    artist: "Nova Bloom",
    duration: "3:42",
    cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Ocean Lights",
    artist: "Luna Harbor",
    duration: "4:18",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "Velvet Drive",
    artist: "Kairo Vale",
    duration: "3:56",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    title: "Sunset Run",
    artist: "Ari Lane",
    duration: "4:04",
    cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    title: "Sunset Run",
    artist: "Ari Lane",
    duration: "4:04",
    cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
];

const audio = new Audio();
audio.preload = "auto";

audio.volume = 0.7;

let currentIndex = 0;
let autoplay = true;

const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const albumArt = document.getElementById("albumArt");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const progressBar = document.getElementById("progressBar");
const volumeControl = document.getElementById("volumeControl");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const autoplayBtn = document.getElementById("autoplayBtn");
const playlistEl = document.getElementById("playlist");

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function renderPlaylist() {
  playlistEl.innerHTML = playlist
    .map((track, index) => {
      const activeClass = index === currentIndex ? "active" : "";
      return `
        <li class="playlist-item ${activeClass}" data-index="${index}">
          <img class="playlist-thumb" src="${track.cover}" alt="${track.title}" />
          <div class="playlist-copy">
            <strong>${track.title}</strong>
            <span>${track.artist}</span>
          </div>
          <div class="track-duration">${track.duration}</div>
        </li>
      `;
    })
    .join("");
}

function updateProgressBar() {
  const current = audio.currentTime || 0;
  const duration = audio.duration || 0;

  const percent = duration ? (current / duration) * 100 : 0;
  progressBar.value = percent;
  progressBar.style.setProperty("--fill", `${percent}%`);

  currentTimeEl.textContent = formatTime(current);
  totalTimeEl.textContent = formatTime(duration);
}

function showTrack(index, shouldPlay = false) {
  currentIndex = (index + playlist.length) % playlist.length;
  const track = playlist[currentIndex];

  songTitle.textContent = track.title;
  artistName.textContent = track.artist;
  albumArt.src = track.cover;
  audio.src = track.src;
  audio.load();
  renderPlaylist();

  if (shouldPlay) {
    audio.play().catch(() => {
      playPauseBtn.textContent = "▶";
    });
  } else {
    audio.pause();
    audio.currentTime = 0;
    updateProgressBar();
  }
}

function togglePlayPause() {
  if (audio.paused) {
    audio.play().catch(() => {
      playPauseBtn.textContent = "▶";
    });
  } else {
    audio.pause();
  }
}

function setupVolumeSlider() {
  volumeControl.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    audio.volume = value;
  });
}

function setupProgressBar() {
  progressBar.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    const duration = audio.duration || 0;

    if (duration) {
      audio.currentTime = (value / 100) * duration;
    }
  });
}

function setupPlaylistClicks() {
  playlistEl.addEventListener("click", (event) => {
    const item = event.target.closest(".playlist-item");
    if (!item) return;

    const index = Number(item.dataset.index);
    showTrack(index, true);
  });
}

playPauseBtn.addEventListener("click", togglePlayPause);
prevBtn.addEventListener("click", () => showTrack(currentIndex - 1, true));
nextBtn.addEventListener("click", () => showTrack(currentIndex + 1, true));

autoplayBtn.addEventListener("click", () => {
  autoplay = !autoplay;
  autoplayBtn.textContent = `Autoplay: ${autoplay ? "On" : "Off"}`;
  autoplayBtn.classList.toggle("active", autoplay);
});

audio.addEventListener("loadedmetadata", () => {
  updateProgressBar();
});

audio.addEventListener("timeupdate", updateProgressBar);

audio.addEventListener("play", () => {
  playPauseBtn.textContent = "❚❚";
});

audio.addEventListener("pause", () => {
  playPauseBtn.textContent = "▶";
});

audio.addEventListener("ended", () => {
  if (autoplay) {
    showTrack(currentIndex + 1, true);
  } else {
    playPauseBtn.textContent = "▶";
  }
});

setupVolumeSlider();
setupProgressBar();
setupPlaylistClicks();
renderPlaylist();
showTrack(0, false);
