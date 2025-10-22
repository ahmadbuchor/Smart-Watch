// ======================= AUTH ===========================
const userId = localStorage.getItem("user_id");
const userName = localStorage.getItem("user_name");
if (!userId && window.location.pathname.includes("dashboard")) {
  window.location.href = "index.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ======================= DASHBOARD LOAD ===========================
if (window.location.pathname.includes("dashboard")) {
  document.getElementById("welcomeName").innerText = `👋 ${userName}`;

  // Grafik & statistik awal
  const ctx = document.getElementById("chart").getContext("2d");
  let chartLabels = [];
  let chartValues = [];
  const repChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: [{
        label: 'Jumlah Reps',
        data: chartValues,
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#ccc" } },
        y: { ticks: { color: "#ccc" } }
      }
    }
  });

  // ================= Variabel Latihan =================
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const resetBtn = document.getElementById("resetBtn");
  const totalRepsEl = document.getElementById("totalReps");
  const totalCaloriesEl = document.getElementById("totalCalories");
  const durationEl = document.getElementById("duration");
  const highscoreEl = document.getElementById("highscore");
  const repList = document.getElementById("repList");
  const motivationText = document.getElementById("motivationText");

  let reps = 0;
  let seconds = 0;
  let highscore = 0;
  let interval = null;
  let timer = null;

  // ================= Timer =================
  function startTimer() {
    timer = setInterval(() => {
      seconds++;
      durationEl.innerText = `${seconds} s`;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  // ================= Suara Penyemangat =================
  const motivations = [
    "Keep going! You're strong!",
    "Amazing work, keep it up!",
    "Stay focused and push harder!",
    "Great pace, you're doing awesome!",
    "Feel the power, let's go!",
    "You're unstoppable!",
    "Strong and steady, keep going!"
  ];

  let selectedVoice = null;
  speechSynthesis.onvoiceschanged = () => {
    const voices = speechSynthesis.getVoices();
    selectedVoice = voices.find(v =>
      v.lang.startsWith("en") &&
      (v.name.toLowerCase().includes("female") ||
       v.name.toLowerCase().includes("google") ||
       v.name.toLowerCase().includes("samantha") ||
       v.name.toLowerCase().includes("zira"))
    ) || voices.find(v => v.lang.startsWith("en"));
  };

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.voice = selectedVoice;
    utterance.pitch = 1.1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  }

  // ================= Start =================
  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = true;

    startTimer();
    interval = setInterval(() => {
      reps++;
      totalRepsEl.innerText = reps;
      totalCaloriesEl.innerText = `${(reps * 0.45).toFixed(1)} kcal`;

      const now = new Date().toLocaleTimeString();
      chartLabels.push(now);
      chartValues.push(reps);
      repChart.update();

      if (reps % 5 === 0) {
        const text = motivations[Math.floor(Math.random() * motivations.length)];
        motivationText.innerText = text;
        speak(text);
      }
    }, 1000);
  });

  // ================= Stop =================
  stopBtn.addEventListener("click", () => {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = false;
    clearInterval(interval);
    stopTimer();
  });

  // ================= Reset =================
  resetBtn.addEventListener("click", () => {
    // simpan ke riwayat reps
    const li = document.createElement("li");
    li.textContent = `${reps} reps — ${new Date().toLocaleString()}`;
    repList.prepend(li);

    if (reps > highscore) {
      highscore = reps;
      highscoreEl.innerText = highscore;
    }

    reps = 0;
    seconds = 0;
    totalRepsEl.innerText = 0;
    totalCaloriesEl.innerText = "0 kcal";
    durationEl.innerText = "0 s";
    chartLabels.length = 0;
    chartValues.length = 0;
    repChart.update();
    motivationText.innerText = "";
    resetBtn.disabled = true;
  });
}

// ======================= PROFILE MODAL ===========================
const profileBtn = document.getElementById("profileBtn");
const profileModal = document.getElementById("profileModal");
const closeProfileBtn = document.getElementById("closeProfileBtn");
const profileName = document.getElementById("profileName");
const profileId = document.getElementById("profileId");
const profileWeight = document.getElementById("profileWeight");
const profileHeight = document.getElementById("profileHeight");

if (profileBtn) {
  profileBtn.addEventListener("click", () => {
  fetch(`http://localhost/smart_rep_api/get_profile.php?user_id=${userId}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        profileName.textContent = `👤 Name: ${data.user.name}`;
        profileId.textContent = `🆔 ID: ${data.user.id}`;
        profileWeight.textContent = `⚖️ Weight: ${data.user.weight || '-'}`;
        profileHeight.textContent = `📏 Height: ${data.user.height || '-'}`;
      } else {
        profileName.textContent = `👤 Name: ${userName}`;
        profileId.textContent = `🆔 ID: ${userId}`;
        profileWeight.textContent = `⚖️ Weight: -`;
        profileHeight.textContent = `📏 Height: -`;
      }
      profileModal.style.display = "flex";
    })
    .catch(err => {
      console.error(err);
      profileModal.style.display = "flex";
    });
  });
}

if (closeProfileBtn) {
  closeProfileBtn.addEventListener("click", () => {
    profileModal.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === profileModal) {
    profileModal.style.display = "none";
  }
});

// ======================= PROFILE FORM ===========================
const profileForm = document.getElementById("profileForm");
if (profileForm) {
  fetch(`http://localhost/smart_rep_api/get_profile.php?user_id=${userId}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        document.getElementById("name").value = data.user.name || "";
        document.getElementById("weight").value = data.user.weight || "";
        document.getElementById("height").value = data.user.height || "";
      }
    });

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const weight = document.getElementById("weight").value;
    const height = document.getElementById("height").value;

    fetch("http://localhost/smart_rep_api/update_profile.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, name, weight, height })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          alert("Profile updated successfully!");
          window.location.href = "dashboard.html";
        } else {
          alert("Failed to update profile: " + data.message);
        }
      });
  });
}

// ======================= LOGOUT ===========================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });
}
