# Camera-Controler
# Sử dụng cho file python
import cv2
import threading
import os
import time
import json
import random
import shutil
import base64

from roboflow import Roboflow
from flask import Flask, jsonify, Response, send_from_directory,request
from pypylon import pylon
from flask_cors import CORS
from flask import send_from_directory 
from flasgger import Swagger
from ultralytics import YOLO
# Cài đặt thư viện
pip install opencv-python flask flask-cors numpy
pip install flask pypylon opencv-python-headless
pip install opencv-python opencv-python-headless flask
# Roboflow

# Electron
npm init -y
npm install electron

# Khi tải về từ github cần cài lại file electron.exe. Kiểm tra tại C:\\AHSO\\RESTFUL-API\\Camera-Controler\\node_modules\\electron\\dist\\electron.exe
# Các bước thực hiện 
# Bước 1: Xóa thư mục node_modules và file package-lock.json
rm -rf node_modules package-lock.json
# Bước 2: Sau đó, cài đặt lại toàn bộ phụ thuộc.
npm install
# Bước 3: Chạy test thử
npm install


# ============== Đóng gói ==============
# Bước 1: Đóng gói backend
Cài đặt PyInstaller: pip install pyinstaller
Đóng gói backend: pyinstaller --onefile backend.py
# Bước 2: Để file backend.exe cùng cấp với folder runs
# Bước 3: Đóng gói electron
Chạy file backend.exe khi bắt đầu chạy ứng dụng
Thêm cwd để đóng gói các file phụ thuộc của backend.exe
Sửa file package.json của electron: 
 "extraResources": [
      {
        "from": "app/backend/backend.exe",
        "to": "app/backend/backend.exe"
      }
    ],
Đóng gói backend: npm run build
