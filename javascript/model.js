// ====================== List Model ======================
// Tải danh  sách trang models thi giao diện model được tải
window.addEventListener("DOMContentLoaded", async () => {
  try {
    await window.api.listModel();
  } catch (error) {
    console.log("Error load list models: ", error);
  }
});

// ====================== Create Model ======================
document
  .getElementById("btn-create-model")
  .addEventListener("click", async () => {
    const nameModel = document.getElementById("name-model").value;
    // Send nameModelto api createModel
    await window.api.createModel(nameModel);
    // Load list model
    await window.api.listModel();
  });
// ====================== Load Model ======================
document
  .getElementById("btn-load-model")
  .addEventListener("click", async () => {
    const nameModel = document.getElementById("name-model").value;
    // Send nameModelto api createModel

    await window.api.loadModel(nameModel);
  });
// ====================== Save Model ======================
document
  .getElementById("btn-save-model")
  .addEventListener("click", async () => {
    const nameModel = document.getElementById("name-model").value;
    await window.api.saveModel(nameModel);
  });
