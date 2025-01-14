// Element image original and processed
const originalImage = document.getElementById("original-image");
const processedImage = document.getElementById("processed-image");
// Element result couter
const countActual = document.getElementById("count-actual");
const countStandard = document.getElementById("count-standard");
// Element name model
const nameModel = document.getElementById("name-model");
// Auto connect camera
document.addEventListener("DOMContentLoaded", async () => {
  await window.api.connectCamera();
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

//  Trigger
document
  .getElementById("trigger-button")
  .addEventListener("click", async () => {
    const response = await window.api.trigger();

    const imageUrl = response.processed_image_url; // Lấy URL ảnh từ API
    const results = response.results;
    // Hiển thị kết quả
    countActual.textContent = results;
    // Hiển thị ảnh
    processedImage.src = imageUrl;
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
const startLive =  () => {
  originalImage.src =  window.api.getLiveUrl();
  console.log(originalImage.src);
  updateLiveButtonState(true);
  isLive = true;
};
// Dừng live
const stopLive = async () => {
  await window.api.stopLive();
  originalImage.src = "";
  updateLiveButtonState(false);
  isLive = false;
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
    // Hiển thị kết quả
    countActual.textContent = result;
    // Hiển thị hình ảnh
    processedImage.src = imageUrl;

    if (isGrabbing) {
      // Gọi lại hàm sau 0.1s
      setTimeout(updateResults, 100);
    }
  } catch (error) {
    console.error("Error during grabbing:", error);
    isGrabbing = false;
    updateButtonState();
  }
};

const updateButtonState = () => {
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
    startLive()
  } else {
    // Bắt đầu grab

    isGrabbing = true;
    console.log("Grabbing started.");
    updateResults();
  }
  updateButtonState();
});

// ====== Wires ======
const inputWires = document.getElementById("quantity-value-standard");
inputWires.addEventListener("change", () => {
  countStandard.textContent = inputWires.value;
});
