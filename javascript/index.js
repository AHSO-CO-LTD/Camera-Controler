// ======================================= Element =======================================
const elements = {
  originalImage: document.getElementById("original-image"),
  processedImage: document.getElementById("processed-image"),
  countActual: document.getElementById("count-actual"),
  nameModel: document.getElementById("name-model"),
  showStatus: document.getElementById("value-show-status"),
  cycleTime: document.getElementById("cycle-count-value"),
  valueBelt: document.getElementById("footer-qty"),
  inputStandard: document.getElementById("quantity-value-standard"),
  valueActual: document.getElementById("quantity-value-actual"),
  resultStatus: document.getElementById("result-status"),
  textResult: document.getElementById("context-result"),
  liveButtonText: document.getElementById("live-button-text"),
  liveButtonIcon: document.getElementById("icon-live-run-stop"),
  liveButton: document.getElementById("live-button"),
  runButtonText: document.getElementById("run-button-text"),
  runButton: document.getElementById("run-button"),
  runButtonIcon: document.getElementById("icon-run-stop"),
  triggerButton: document.getElementById("trigger-button"),
  settingButton: document.getElementById("setting-button"),
  modelButton: document.getElementById("model-button"),
  reportButton: document.getElementById("report-button"),
  loading: document.getElementById("loading"),
};

let response,
  stopTime,
  isLive = false,
  isGrabbing = false;

document.addEventListener("DOMContentLoaded", async () => {
  await window.api.initialPython();
  checkBackendContinuously();
});
// Lắng nghe sự kiện "model-closed" từ tiến trình chính
window.api.receive("model-closed", () => {
  loadValueModel();
});

// ======================================= Mở cửa sổ cài đặt =======================================
const openWindow = (action) => window.api[action]();
elements.settingButton.addEventListener("click", () =>
  openWindow("openSettings")
);
elements.modelButton.addEventListener("click", () => {
  openWindow("openModel");
});
elements.reportButton.addEventListener("click", async () => {
  alert("2");
});

// ======================================= Kiểm tra backend =======================================
async function checkBackendContinuously() {
  const interval = 3000;
  const checkInterval = setInterval(async () => {
    try {
      response = await window.api.checkBackend();
      if (response.message === "Check backend finish") {
        elements.showStatus.textContent =
          "Backend is ready: " + response.message;
        clearInterval(checkInterval);
        elements.loading.style.display = "none";
        response = await window.api.connectCamera();
        elements.showStatus.textContent = response.message;
      } else {
        console.log("Still checking backend...");
      }
    } catch (error) {
      console.error("Error checking backend:", error);
    }
  }, interval);
}

// ======================================= Trigger =======================================
elements.triggerButton.addEventListener("click", async () => {
  response = await window.api.trigger();
  const { processed_image_url, results, cycle_time, message } = response;

  elements.countActual.textContent = results;
  elements.valueActual.textContent = results;
  elements.processedImage.src = processed_image_url;
  elements.showStatus.textContent = message;
  elements.cycleTime.textContent = cycle_time;
});

// ======================================= Live =======================================
const updateLiveButtonState = (state) => {
  if (state) {
    elements.liveButtonText.textContent = "STOP";
    elements.liveButtonIcon.classList.replace("fa-video", "fa-stop");
    elements.liveButton.style.background = "#FFC107";
  } else {
    elements.liveButtonText.textContent = "LIVE";
    elements.liveButtonIcon.classList.replace("fa-stop", "fa-video");
    elements.liveButton.style.background = "#1abc9c";
  }
};

const startLive = () => {
  response = window.api.getLiveUrl();
  elements.originalImage.src = response;
  updateLiveButtonState(true);
  isLive = true;
  elements.showStatus.textContent = "Live stream started successfully.";
};

const stopLive = async () => {
  response = await window.api.stopLive();
  elements.originalImage.src = "";
  updateLiveButtonState(false);
  isLive = false;
  elements.showStatus.textContent = response.message;
};

elements.liveButton.addEventListener("click", () => {
  isLive ? stopLive() : startLive();
});

// ======================================= Run Grab =======================================
const updateButtonState = () => {
  if (isGrabbing) {
    elements.runButtonText.textContent = "STOP";
    elements.runButtonIcon.classList.replace("fa-play", "fa-stop");
    elements.runButton.style.background = "#FFC107";
  } else {
    elements.runButtonText.textContent = "RUN";
    elements.runButtonIcon.classList.replace("fa-stop", "fa-play");
    elements.runButton.style.background = "#1abc9c";
  }
};

const updateResults = async () => {
  try {
    const response = await window.api.startGrab();
    const { processed_image_url, results, cycle_time, message } = response;

    elements.countActual.textContent = results;
    elements.valueActual.textContent = results;
    elements.processedImage.src = processed_image_url;
    elements.showStatus.textContent = message;
    elements.cycleTime.textContent = cycle_time;

    if (elements.countActual.textContent === elements.inputStandard.value) {
      console.log("Equal value. Stopping grab...");
      isGrabbing = false;
      updateButtonState();
      elements.showStatus.textContent = "Grabbing stopped (Equal value).";
      await window.api.imagePass();
      elements.valueBelt.textContent =
        parseInt(elements.valueBelt.textContent, 10) + 1;
      checkStatusResult();
      // Time
      timeCount();
      stopTotalTime();
      checkCountValues();
      return;
    }

    if (isGrabbing) {
      setTimeout(updateResults, 10);
    }
  } catch (error) {
    console.error("Error during grabbing:", error);
    isGrabbing = false;
    updateButtonState();
  }
};

elements.runButton.addEventListener("click", async () => {
  elements.resultStatus.style.background = "#ffc107";
  elements.textResult.textContent = "COUNTING";
  if (isGrabbing) {
    isGrabbing = false;
    setTimeout(() => {
      elements.showStatus.textContent = "Grabbing stopped.";
    }, 1000);
    timeCount();
    stopTotalTime();
  } else {
    isGrabbing = true;
    updateResults();
    timeCount();
    startTotalTime();
  }
  updateButtonState();
});

// ======================================= So sánh chuẩn vs thực tế =======================================
function checkStatusResult() {
  if (elements.countActual.textContent === elements.inputStandard.value) {
    elements.resultStatus.style.background = "#27ae60";
    elements.textResult.textContent = "PASS";
  } else {
    elements.resultStatus.style.background = "#e74c3c";
    elements.textResult.textContent = "ERROR";
  }
}

elements.runButton.addEventListener("click", async () => {
  if (elements.runButtonText.textContent.trim() === "RUN") {
    if (elements.countActual.textContent === elements.inputStandard.value) {
      checkStatusResult();
      await window.api.imagePass();
    } else {
      checkStatusResult();
      await window.api.imageError();
    }
  }
});

// ======================================= Standard =======================================
async function loadValueModel() {
  const selectedModel = localStorage.getItem("selectedModel");
  if (selectedModel) {
    elements.nameModel.textContent = selectedModel;
  } else {
    console.log("No model selected.");
  }
  try {
    const response = await window.api.readModel(selectedModel);
    if (!response) {
      console.error("Unable to receive response from API.");
    } else if (!response.file_path) {
      console.error("The returned data is invalid.");
    } else {
      const modelData = response.data;
      document.getElementById("quantity-value-standard").value =
        modelData.SpinningCount.StandardBelt;
      document.getElementById("size-value-standard").value =
        modelData.SpinningCount.SizeBelt;
    }
  } catch (error) {
    console.error("Error reading JSON file:", error);
  }
}

