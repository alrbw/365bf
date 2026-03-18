// script.js
const monthAbbrs = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Khai báo Elements
const datePicker = document.getElementById('birth-date-picker');
const flowerOriginal = document.getElementById('flower-original');
const placeholderText = document.getElementById('placeholder-text');
const imageFrame = document.getElementById('image-frame');
const zoomPreviewContainer = document.getElementById('zoom-preview-container');

const flowerInfo = document.getElementById('flower-info');
const flowerNameEl = document.getElementById('flower-name');
const flowerMeaningEl = document.getElementById('flower-meaning');

datePicker.addEventListener('change', function() {
    const selectedDateStr = this.value;

    if (selectedDateStr) {
        const dateObj = new Date(selectedDateStr);
        const day = dateObj.getDate();
        const monthIndex = dateObj.getMonth();
        
        // 1. Tạo Key để lấy dữ liệu từ data.js (Dạng DDMM)
        const dayKey = day.toString().padStart(2, '0');
        const monthKey = (monthIndex + 1).toString().padStart(2, '0');
        const dataKey = `${dayKey}${monthKey}`;

        // 2. Tạo đường dẫn ảnh (Dạng assets/365-B-Flower/03/19MAR.png)
        const monthAbbr = monthAbbrs[monthIndex];
        const fileName = `${day}${monthAbbr}.png`;
        const imagePath = `assets/365-B-Flower/${monthKey}/${fileName}`;

        // 3. Cập nhật Ảnh
        flowerOriginal.classList.add('hidden');
        placeholderText.textContent = "Loading...";
        flowerOriginal.src = imagePath;

        flowerOriginal.onload = () => {
            flowerOriginal.classList.remove('hidden');
            placeholderText.classList.add('hidden');
            // Cập nhật background cho ô Zoom
            zoomPreviewContainer.style.backgroundImage = `url(${imagePath})`;
        };

        flowerOriginal.onerror = () => {
            placeholderText.textContent = "Image not found.";
            flowerInfo.classList.add('hidden');
        };

        // 4. Cập nhật Text từ data.js
        if (typeof flowerData !== 'undefined' && flowerData[dataKey]) {
            flowerNameEl.textContent = flowerData[dataKey].name;
            flowerMeaningEl.textContent = flowerData[dataKey].meaning;
            flowerInfo.classList.remove('hidden');
        } else {
            flowerInfo.classList.add('hidden');
        }
    }
});

// HIỆU ỨNG ZOOM DẠNG AMAZON
imageFrame.addEventListener('mousemove', function(e) {
    if (flowerOriginal.classList.contains('hidden')) return;

    zoomPreviewContainer.classList.remove('hidden');
    const rect = imageFrame.getBoundingClientRect();
    
    // Tính toán vị trí chuột theo %
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Phóng to 250% và di chuyển background theo chuột
    zoomPreviewContainer.style.backgroundSize = "250%";
    zoomPreviewContainer.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
});

imageFrame.addEventListener('mouseleave', () => {
    zoomPreviewContainer.classList.add('hidden');
});