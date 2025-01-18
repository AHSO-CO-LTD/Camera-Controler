// Element image original and processed
const originalImage = document.getElementById("original-image");
const processedImage = document.getElementById("processed-image");
// Element result couter
const countActual = document.getElementById("count-actual");
const countStandard = document.getElementById("count-standard");
// Element name model
const nameModel = document.getElementById("name-model");
// Element show status
const showStatus = document.getElementById("value-show-status");
// Element cycle time
const cycleTime = document.getElementById("cycle-count-value");
// Element belt
const valueBelt = document.getElementById("footer-qty");
// Element input standard 
const inputStandard = document.getElementById("quantity-value-standard");
// Response backend
let response;
// Stop time
let stopTime;
document.addEventListener("DOMContentLoaded", async () => {
  // Kiểm tra python đã Schạy hoàn tất chưa
  checkBackendContinuously();
});
// Lấy tên model
const selectedModel = localStorage.getItem("selectedModel");
if (selectedModel) {
  nameModel.textContent = selectedModel;
} else {
  console.log("No model selected.");
}
// ====== Open window setting ======
document.getElementById("setting-button").addEventListener("click", () => {
  window.api.openSettings(); // Gọi hàm từ preload.js để mở settings
});
// ====== Oen window model ======
document.getElementById("model-button").addEventListener("click", () => {
  window.api.openModel();
});

// =======================================  Check backend =======================================
async function checkBackendContinuously() {
  const checkBackend = document.getElementById("loading");
  const interval = 3000; // Thời gian giữa mỗi lần gọi (ms)
  const checkInterval = setInterval(async () => {
    try {
      response = await window.api.checkBackend();
      if (response.message === "Check backend finish") {
        showStatus.textContent = "Backend is ready: " + response.message;
        clearInterval(checkInterval); // Dừng việc gọi liên tục
        checkBackend.style.display = "none";
        response = await window.api.connectCamera();
        // Status
        showStatus.textContent = response.message;
      } else {
        console.log("Still checking backend...");
      }
    } catch (error) {
      console.error("Error checking backend:", error);
    }
  }, interval);
}

// =======================================  Trigger =======================================
document
  .getElementById("trigger-button")
  .addEventListener("click", async () => {
    response = await window.api.trigger();

    const imageUrl = response.processed_image_url; // Lấy URL ảnh từ API
    const results = response.results;
    const cycleTimeValue = response.cycle_time;
    const message = response.message;

    // Hiển thị kết quả
    countActual.textContent = results;
    // Hiển thị ảnh
    processedImage.src = imageUrl;
    // Status
    showStatus.textContent = message;
    // Cycle time

    cycleTime.textContent = cycleTimeValue;
  });
// ======================================= Live =======================================
// ===== Start/Stop =====
const liveButtonText = document.getElementById("live-button-text");
const liveButton = document.getElementById("live-button");
const liveButtonIcon = document.getElementById("icon-live-run-stop");

let isLive = false;

const updateLiveButtonState = (state) => {
  if (state) {
    liveButtonText.textContent = "STOP";
    liveButtonIcon.classList.remove = "fa-video";
    liveButtonIcon.classList.add = "fa-stop";
    liveButton.style.background = "#FFC107";
  } else {
    liveButtonText.textContent = "LIVE";
    liveButtonIcon.classList.remove = "fa-stop";
    liveButtonIcon.classList.add = "fa-video";
    liveButton.style.background = "#1abc9c";
  }
};
// Bắt đầu live
const startLive = () => {
  response = window.api.getLiveUrl();
  originalImage.src = response;
  updateLiveButtonState(true);
  isLive = true;
  // Status
  showStatus.textContent = "Live stream started successfully.";
};
// Dừng live
const stopLive = async () => {
  response = await window.api.stopLive();
  originalImage.src = "";
  updateLiveButtonState(false);
  isLive = false;
  // Status
  showStatus.textContent = response.message;
};

// ===== Event Listener =====
liveButton.addEventListener("click", () => {
  isLive ? stopLive() : startLive();
});

// ======================================= Run Grab =======================================
// ====== Start/Stop ======
const runButtonText = document.getElementById("run-button-text");
const runButton = document.getElementById("run-button");
const runButtonIcon = document.getElementById("icon-run-stop");
let isGrabbing = false;

const updateResults = async () => {
  try {
    const response = await window.api.startGrab();
    const imageUrl = response.processed_image_url;
    const result = response.results;
    const cycleTimeValue = response.cycle_time;
    const message = response.message;
    // Hiển thị kết quả
    countActual.textContent = result;
    // Hiển thị hình ảnh
    processedImage.src = imageUrl;
    // Status
    showStatus.textContent = message;
    // Cycle time
    cycleTime.textContent = cycleTimeValue;
    // Kiểm tra nếu countActual và countStandar thì dừng

    if (countActual.textContent === countStandard.textContent) {
      console.log("Equal value. Stopping grab...");
      isGrabbing = false;
      updateButtonState();
      showStatus.textContent = "Grabbing stopped (Equal value).";
      await window.api.imagePass();
      valueBelt.textContent = parseInt(valueBelt.textContent, 10) + 1;    
      return;
    }

    if (isGrabbing) {
      // Gọi lại hàm sau 0.1s
      setTimeout(updateResults, 10);
    }
  } catch (error) {
    console.error("Error during grabbing:", error);
    isGrabbing = false;
    updateButtonState();
  }
};

const updateButtonState = async () => {
  if (isGrabbing) {
    runButtonText.textContent = "STOP";
    runButtonIcon.classList.remove("fa-play");
    runButtonIcon.classList.add("fa-stop");
    runButton.style.background = "#FFC107";
  } else {
    runButtonText.textContent = "RUN";
    runButtonIcon.classList.remove("fa-stop");
    runButtonIcon.classList.add("fa-play");
    runButton.style.background = "#1abc9c";
  }
};
runButton.addEventListener("click", async () => {
  if (isGrabbing) {
    // Dừng việc grab
    isGrabbing = false;
    console.log("Grabbing stopped.");
    setTimeout(() => {
      showStatus.textContent = "Grabbing stopped.";
    }, 1000);
  } else {
    // Bắt đầu grab

    isGrabbing = true;
    console.log("Grabbing started.");
    updateResults();
  }
  updateButtonState();
});

// ====== Compare standard vs actual ======
runButton.addEventListener("click", async () => {
  if (runButtonText.textContent.trim() === "RUN") {
    if (countActual.textContent === countStandard.textContent) {
      await window.api.imagePass();
    } else {
      await window.api.imageError();
    }
  }
});

// ====== Wires ======

inputStandard.addEventListener("change", () => {
  countStandard.textContent = inputStandard.value;
  
});
