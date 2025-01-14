const cigarettes = document.querySelectorAll(".cigarette"); // Lấy tất cả thuốc lá
const cylinders = document.querySelectorAll(".container-cylinder"); // Lấy tất cả hình trụ
const cigarettess = [
  document.getElementById("cigarette1"),
  document.getElementById("cigarette2"),
];
const myDiv = document.getElementById("container-cylinder");

// Tạo 50 span tự động cho mỗi cigarette
cigarettess.forEach((cigarette, index) => {
  for (let i = 1; i <= 50; i++) {
    const span = document.createElement("span");
    span.style.setProperty("--index", i); // Đặt giá trị cho biến --i
    span.style.transform = `translate(-50%, -50%) rotateX(${
      i * 7.2
    }deg) translateZ(3vw)`; // Tính toán góc xoay cho span
    cigarette.appendChild(span);
  }
});
document.addEventListener("DOMContentLoaded", function () {


  const container = document.getElementById("container-cylinder");
  let zOffset = -60;
  let count = 0;
  const intervalId = setInterval(() => {
    if(count < 19){
    zOffset += 7;
    const newBefore = document.createElement("div");
    newBefore.style.position = "absolute";
    newBefore.style.left = "-10px";
    newBefore.style.top = "-10px";
    newBefore.style.width = "100%";
    newBefore.style.height = "100%";
    newBefore.style.borderRadius = "65px";
    newBefore.style.background = "none";
    newBefore.style.border = "10px solid rgba(15, 14, 14, 0.6)";
    newBefore.style.transform = `translateZ(${zOffset}px) scale(1.1)`;
    newBefore.style.transformStyle = "preserve-3d";
    newBefore.style.boxShadow = "0 0 20px rgna(0, 0, 0, 0.5)";
    newBefore.style.transform =  "border 5s ease";
    container.appendChild(newBefore);
    count++;
    }else {
      clearInterval(intervalId);
    }
  }, 2000);

});
let isDragging = false;
let previousX = 0;
let previousY = 0;
let rotateY = 0;
let rotateZ = 0;

document.addEventListener("mousedown", (e) => {
  isDragging = true;
  previousX = e.clientX;
  previousY = e.clientY;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - previousX;
  const deltaY = e.clientY - previousY;

  rotateY += deltaX * 1; // Xoay quanh trục Y
  rotateZ += deltaY * 1; // Xoay quanh trục Z

  cylinders.forEach((cylinder) => {
    cylinder.style.transform = `rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`; // Áp dụng cả hai phép xoay cho từng hình trụ
  });

  previousX = e.clientX;
  previousY = e.clientY;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});
