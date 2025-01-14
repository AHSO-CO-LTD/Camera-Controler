const { error } = require("console");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "javascript", "preload.js"), // preload file cho index.html
    },
  });

  mainWindow.loadFile("index.html");
}

// ================= Create Window Setting =================
ipcMain.on("open-settings", () => {
  // Tạo cửa sổ settings
  const settingsWindow = new BrowserWindow({
    width: 730,
    height: 740,
    parent: mainWindow, // Đặt parent là mainWindow
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, "javascript", "preload.js"), // preload file cho setting.html
    },
  });

  settingsWindow
    .loadFile("./view/setting.html")
    .catch((err) => console.error("Failed to load setting.html:", err));
});
// ================= Create Window Model =================
ipcMain.on("open-model", () => {
  const modelWindow = new BrowserWindow({
    width: 730,
    height: 740,
    parent: mainWindow,
    model: true,
    webPreferences: {
      preload: path.join(__dirname, "javascript", "preload.js"),
    },
  });
  modelWindow
    .loadFile("./view/model.html")
    .catch((err) => console.error("Failded to load model.html:", err));
});
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
