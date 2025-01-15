const { error } = require("console");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "javascript", "preload.js"), // preload file cho index.html
    },
  });

  mainWindow.maximize();

  // ===== Intro =====
  mainWindow
    .loadFile(path.join(__dirname, "view", "intro.html"))
    .catch((err) => {
      console.error("Failed to load intro.html:", err);
    });

  mainWindow.webContents.on("did-finish-load", () => {
    const currentURL = mainWindow.webContents.getURL();
    if (currentURL.includes("intro.html")) {
      setTimeout(() => {
        mainWindow.loadFile(path.join(__dirname, "index.html")).catch((err) => {
          console.error("Failed to load index.html:", err);
        });
      }, 3000);
    }
  });

  // Dọn dẹp khi cửa sổ đóng
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
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
