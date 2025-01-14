const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // Hàm mở cửa sổ settings từ index.html
  openSettings: () => ipcRenderer.send("open-settings"),
  // Hàm mở cửa sổ model từ index.html
  openModel: () => ipcRenderer.send("open-model"),
  // Nghe sự kiện từ main process
  on: (channel, callback) => ipcRenderer.on(channel, callback),

  // Gửi dữ liệu từ renderer đến main process
  send: (channel, data) => ipcRenderer.send(channel, data),

  connectCamera: async () => {
    try {
      const response = await fetch("http://localhost:5000/api/connect_camera", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to connect camera");
      return response.json();
    } catch (error) {
      console.error("Error in connectCamera:", error);
      return { message: "Error connecting camera", error: error.message };
    }
  },
  disconnectCamera: async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/disconnect_camera",
        { method: "POST" }
      );
      if (!response.ok) throw new Error("Failed to disconnect camera");
      return response.json();
    } catch (error) {
      console.error("Error in disconnectCamera:", error);
      return { message: "Error disconnecting camera", error: error.message };
    }
  },
  setCameraSettings: async (settings) => {
    try {
      const response = await fetch("http://localhost:5000/api/set_settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("Failed to set camera settings");
      return response.json();
    } catch (error) {
      console.error("Error in setCameraSettings:", error);
      return { message: "Error setting camera settings", error: error.message };
    }
  },
  getCameraSettings: async () => {
    try {
      const reponse = await fetch("http://localhost:5000/api/get_settings");
      const data = await reponse.json();

      if (reponse.ok) {
        console.log("Camera settings: ", data.settings);
        // Hiển thị thông số lên giao diện
        // CCD
        document.getElementById("width").value = data.settings.width;
        document.getElementById("height").value = data.settings.height;
        document.getElementById("offsetX").value = data.settings.offsetX;
        document.getElementById("offsetY").value = data.settings.offsetY;
        document.getElementById("gain").value = data.settings.gain;
        document.getElementById("exposure").value = data.settings.exposure;
      
      } else {
        console.error("Error fetching settings:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  },

  trigger: async () => {
    try {
      const response = await fetch("http://localhost:5000/api/trigger", {
        method: "POST",
      });

      // Kiểm tra nếu không thành công
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error occurred while triggering");
      }

      // Trả về dữ liệu JSON
      return await response.json();
    } catch (error) {
      console.error("Trigger error:", error.message);
      return { success: false, message: error.message };
    }
  },

  getLiveUrl: () => "http://localhost:5000/api/live",
  stopLive: async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stop_live", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to stop live");
      return response.json();
    } catch (error) {
      console.error("Error stop live:", error);
      return { message: "Error stop live", error: error.message };
    }
  },
  grabCheck: async () => {
    const response = await fetch("http://localhost:5000/api/grab_check", {
      method: "POST",
    });
    return response.json();
  },

  // ============================ Run ============================
  startGrab: async () => {
    try {
      const reponse = await fetch("http://localhost:5000/api/start_grab", {
        method: "POST",
      });
      // Kiểm tra nếu không thành công
      if(!reponse.ok){
        const errorData = await reponse.json();
        throw new Error(errorData.message || "Error occurred while start grab");
      }
      // Trả về dữ liệu JSON
      return await reponse.json();
    } catch (error) {
      console.error("Grab error:" , error.message);
      return {success: false, message: error.message};
    }
  },

  stopGrab: async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stop_grab", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to stop grabbing images");
      }
      const data = await response.json(); // Xử lý dữ liệu trả về từ server
      console.log(data.message); // In ra thông báo từ server (có thể là "Stopped continuous image processing")
      console.log("Saved Images:", data.saved_images); // In ra các hình ảnh đã lưu
    } catch (error) {
      console.error("Error:", error.message); // In ra lỗi nếu có
    }
  },
  // ============================ Model ============================
  createModel: async (nameModel) => {
    try {
      const response = await fetch("http://localhost:5000/api/create_model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model_name: nameModel }),
      });
      if (!response.ok) throw new Error("Failt to create model.");
      return response.json();
    } catch (error) {
      console.error("Error in createModel:", error);
      return { message: "Error create model ", error: error.message };
    }
  },
  listModel: async () => {
    const listModels = document.getElementById("list-model");
    const nameModel = document.getElementById("name-model");

    try {
      // Xóa toàn bộ nội dung cũ trong list-model trước khi thêm các phần tử mới
      listModels.innerHTML = "";
      const response = await fetch("http://localhost:5000/api/list_models", {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to list models");
      const data = await response.json();
      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          const modelItem = document.createElement("div");
          modelItem.className = "model-item";
          modelItem.textContent = file;
          listModels.appendChild(modelItem);
          // Thêm sự kiện click cho mỗi item
          modelItem.addEventListener("click", async () => {
            nameModel.value = file;
            // Lưu tên file vào localStorage
            localStorage.setItem("selectedModel", file);
          });
        });
      } else {
        listModels.textContent = "No files found in folder 'models'";
      }
    } catch (error) {
      console.error("Error fetching model list:", error);
      listModels.textContent = "Error loading list model.";
    }
  },
  loadModel: async (nameModel) => {
    if (!nameModel) {
      return;
    }
    const detailsContent = document.getElementById("details-content");
    const width = document.getElementById("width-model");
    const height = document.getElementById("height-model");
    const offsetX = document.getElementById("offsetX-model");
    const offsetY = document.getElementById("offsetY-model");
    const exposure = document.getElementById("exposure-model");

    try {
      const response = await fetch(
        `http://localhost:5000/api/load_model?file=${nameModel}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) throw new Error("Failed to load model details");
      const data = await response.json();
      // Lấy giá trị từ json
      const deviceName = data.DeviceInformation.DeviceName;
      detailsContent.textContent = `Device name: ${deviceName}`;
      // Hiển thị thông tin chi tiết của file JSON
      width.value = data.ImageSettings.Width;
      height.value = data.ImageSettings.Height;
      offsetX.value = data.ImageSettings.OffsetX;
      offsetY.value = data.ImageSettings.OffsetY;
      exposure.value = data.AcquisitionSettings.ExposureTime.Value;

      // detailsContent.textContent = JSON.stringify(data, null, 4); // Hiển thị toàn bộ thông tin JSON đẹp hơn
    } catch (error) {
      console.error("Error loading model details:", error);
    }
  },
  saveModel: async (nameModel) => {
    if (!nameModel) {
      console.error("Model name is required.");
      return;
    }

    // Thu thập giá trị từ các trường input
    const width = document.getElementById("width-model").value;
    const height = document.getElementById("height-model").value;
    const offsetX = document.getElementById("offsetX-model").value;
    const offsetY = document.getElementById("offsetY-model").value;
    const exposure = document.getElementById("exposure-model").value;

    // Đối tượng chứa các cập nhật
    const updates = {
      "ImageSettings.Width": parseInt(width, 10),
      "ImageSettings.Height": parseInt(height, 10),
      "ImageSettings.OffsetX": parseInt(offsetX, 10),
      "ImageSettings.OffsetY": parseInt(offsetY, 10),
      "AcquisitionSettings.ExposureTime.Value": parseInt(exposure, 10),
    };
    try {
      // Gửi yêu cầu đến API
      const response = await fetch("http://localhost:5000/api/update_model", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_name: nameModel, // Tên file model
          updates: updates, // Giá trị cập nhật
        }),
      });

      if (!response.ok) throw new Error("Fail to save model");

      const result = await response.json();
      console.log("Model updated successfully:", result);
    } catch (error) {
      console.error("Error saving model: ", error);
    }
  },
});
