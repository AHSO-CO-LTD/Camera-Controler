let timerInterval; // Biến lưu trữ interval cho footer-time
let lostTimeInterval; // Biến lưu trữ interval cho footer-lost-time
let elapsedTime = 0; // Tổng thời gian đã trôi qua cho footer-time (ms)
let lostElapsedTime = 0; // Tổng thời gian đã trôi qua cho footer-lost-time (ms)
let totalElapsedTime = 0;
let storedTotalTime = 0; // Lưu tổng thời gian đã tính trước đó

// Hàm định dạng thời gian HH:MM:SS
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// Hàm bắt đầu đếm Lost Time
function startLostTime() {
  const lostStartTime = Date.now() - lostElapsedTime;
  lostTimeInterval = setInterval(() => {
    lostElapsedTime = Date.now() - lostStartTime;
    document.getElementById("footer-lost-time").textContent =
      formatTime(lostElapsedTime);
  }, 1000); // Cập nhật mỗi giây
}

// Hàm dừng Lost Time
function stopLostTime() {
  clearInterval(lostTimeInterval);
  lostTimeInterval = null;
}

// Hàm reset tất cả thông số
function resetAll() {
  // Cộng giá trị hiện tại của footer-total vào giá trị đã lưu
  const totalElement = document.getElementById("footer-total").textContent;
  storedTotalTime += timeToMilliseconds(totalElement);

  // Đặt lại các giá trị cho thời gian chạy và Lost Time
  elapsedTime = 0;
  lostElapsedTime = 0;

  // Cập nhật giao diện cho các trường thời gian khác
  document.getElementById("footer-time").textContent = "00:00:00";
  document.getElementById("footer-lost-time").textContent = "00:00:00";

  // Dừng các bộ đếm
  clearInterval(timerInterval);
  clearInterval(lostTimeInterval);
  timerInterval = null;
  lostTimeInterval = null;

  showStatus(
    "Reset time.",
    "inactive"
  );
}

// Sự kiện click cho nút "Run"

document.getElementById("run-button").addEventListener("click", () => {

  // Nếu đang chạy thì dừng đếm, nếu không thì bắt đầu đếm
  if (timerInterval) {
    clearInterval(timerInterval); // Dừng đếm thời gian chính
    timerInterval = null;
    // Bắt đầu đếm Lost Time
    if (!lostTimeInterval) {
      startLostTime();
    }
  } else {
    const startTime = Date.now() - elapsedTime; // Lưu thời điểm bắt đầu
    // Bắt đầu đếm thời gian chính
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime; // Cập nhật thời gian trôi qua
      document.getElementById("footer-time").textContent =
        formatTime(elapsedTime);
    }, 1000); // Cập nhật mỗi giây

    // Dừng Lost Time
    stopLostTime();
  }
});
// Sự kiện click cho nút "Reset"
document.getElementById("reset-button").addEventListener("click", () => {
  resetAll();
});
// Tổng thời gian của thời gian dừng và chạy
// Hàm chuyển đổi thời gian theo định dạng HH:MM:SS thành mili giây
function timeToMilliseconds(timeString) {
  const parts = timeString.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

// Hàm chuyển mili giây thành định dạng HH:MM:SS
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// Hàm tính tổng thời gian
function updateTotalTime() {
  // Lấy thời gian từ footer-time và footer-lost-time
  const time = document.getElementById("footer-time").textContent;
  // const lostTime = document.getElementById("footer-lost-time").textContent;

  // Chuyển đổi thời gian thành mili giây
  const timeMilliseconds = timeToMilliseconds(time);
  // const lostTimeMilliseconds = timeToMilliseconds(lostTime);

  // Tính tổng thời gian cộng dồn
  totalElapsedTime = storedTotalTime + timeMilliseconds; //+ lostTimeMilliseconds;

  // Cập nhật tổng thời gian vào footer-total
  document.getElementById("footer-total").textContent =
    formatTime(totalElapsedTime);
}
// Gọi hàm updateTotalTime mỗi khi thời gian hoặc lost-time thay đổi
setInterval(updateTotalTime, 1);
