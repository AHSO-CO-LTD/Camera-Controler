// =========== Open window setting call get camera setting ===========
// ========= Menu =========
function selectMenu(menu) {
  const menuItems = ["ccd", "camera"];
  menuItems.forEach((item) => {
    document.getElementById(item).classList.remove("active");
    document.getElementById(`${item}-content`).classList.remove("active");
  });
  document.getElementById(menu).classList.add("active");
  document.getElementById(`${menu}-content`).classList.add("active");
}
// ========= Get value model =========
document.addEventListener("DOMContentLoaded", () => {
  const nameModelSetting = document.getElementById("name-model-setting");
  const selectedModel = localStorage.getItem("selectedModel");

  if (selectedModel) {
    nameModelSetting.textContent = selectedModel;
    // Sử dụng tên model ở đây
  } else {
    console.log("No model selected.");
  }
  const filePath = `../backend/models/${nameModelSetting.textContent}`; // Đường dẫn đến file JSON

  // Truy xuất file JSON
  fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch JSON file");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // Hiển thị dữ liệu JSON lên giao diện
      // CCD
      document.getElementById("width").value = data.ImageSettings.Width;
      document.getElementById("height").value = data.ImageSettings.Height;
      document.getElementById("offsetX").value = data.ImageSettings.OffsetX;
      document.getElementById("offsetY").value = data.ImageSettings.OffsetY;
      document.getElementById("gain").value =
        data.AcquisitionSettings.Gain.Value;
      document.getElementById("exposure").value =
        data.AcquisitionSettings.ExposureTime.Value;
      // Camera
      document.getElementById("name-camera").textContent = data.DeviceInformation.DeviceName;
    })
    .catch((error) => {
      console.error("Error loading JSON file:", error);
    });
});

// ====== Apply Settings ======
const applySettingsButton = document.getElementById("apply_settings");
applySettingsButton.addEventListener("click", async () => {
  const width = document.getElementById("width").value;
  const height = document.getElementById("height").value;
  const offsetX = document.getElementById("offsetX").value;
  const offsetY = document.getElementById("offsetY").value;
  const gain = document.getElementById("gain").value;
  const exposure = document.getElementById("exposure").value;

  const settings = { width, height, offsetX, offsetY, gain, exposure };
  await window.api.setCameraSettings(settings);
});

// ===================== Camera =====================
// Connect camera
document.getElementById("connectCamera").addEventListener("click", async () => {
  await window.api.connectCamera();
  // await window.api.getCameraSettings();
});
// Disconnect camera
document
  .getElementById("disconnectCamera")
  .addEventListener("click", async () => {
    const response = await window.api.disconnectCamera();
    console.log(response.message);
  });
