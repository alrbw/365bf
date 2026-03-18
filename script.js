// Cấu hình mảng tháng để khớp với tên file ảnh (1JAN, 2FEB...)
const monthAbbrs = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Khai báo các thành phần giao diện
const datePicker = document.getElementById('birth-date-picker');
const flowerOriginal = document.getElementById('flower-original');
const placeholderText = document.getElementById('placeholder-text');
const imageFrame = document.getElementById('image-frame');
const zoomPreview = document.getElementById('zoom-preview');
const flowerInfo = document.getElementById('flower-info');
const flowerNameEl = document.getElementById('flower-name');
const flowerMeaningEl = document.getElementById('flower-meaning');

// Xử lý khi chọn ngày
datePicker.addEventListener('change', function() {
    const selectedDateStr = this.value; // Định dạng YYYY-MM-DD từ input

    if (selectedDateStr) {
        const dateObj = new Date(selectedDateStr);
        const day = dateObj.getDate();
        const monthIndex = dateObj.getMonth();
        
        // 1. Tạo Key để lấy dữ liệu từ data.js (Định dạng DDMM)
        const dayStr = day.toString().padStart(2, '0');
        const monthStr = (monthIndex + 1).toString().padStart(2, '0');
        const dataKey = `${dayStr}${monthStr}`;

        // 2. Tạo đường dẫn ảnh (Định dạng: assets/365-B-Flower/03/19MAR.png)
        const monthAbbr = monthAbbrs[monthIndex];
        const fileName = `${day}${monthAbbr}.png`;
        const imagePath = `assets/365-B-Flower/${monthStr}/${fileName}`;

        // 3. Cập nhật trạng thái chờ load
        flowerOriginal.classList.add('hidden');
        zoomPreview.classList.add('hidden');
        flowerInfo.classList.add('hidden');
        placeholderText.classList.remove('hidden');
        placeholderText.textContent = "Loading your flower...";

        // 4. Gán nguồn ảnh
        flowerOriginal.src = imagePath;
        zoomPreview.style.backgroundImage = `url(${imagePath})`;

        // Khi ảnh load thành công
        flowerOriginal.onload = function() {
            flowerOriginal.classList.remove('hidden');
            placeholderText.classList.add('hidden');

            // Hiển thị thông tin Tên & Ý nghĩa từ file data.js
            if (typeof flowerData !== 'undefined' && flowerData[dataKey]) {
                flowerNameEl.textContent = flowerData[dataKey].name;
                flowerMeaningEl.textContent = flowerData[dataKey].meaning;
                flowerInfo.classList.remove('hidden');
            }
        };

        // Khi ảnh lỗi
        flowerOriginal.onerror = function() {
            placeholderText.textContent = "Image not found for this date.";
            flowerOriginal.classList.add('hidden');
            flowerInfo.classList.add('hidden');
        };
    }
});

// --- HIỆU ỨNG ZOOM DẠNG AMAZON ---

imageFrame.addEventListener('mousemove', function(e) {
    // Chỉ chạy khi đã có ảnh hoa hiển thị
    if (flowerOriginal.classList.contains('hidden')) return;

    zoomPreview.classList.remove('hidden');

    const rect = imageFrame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Tính toán tỷ lệ vị trí chuột (%)
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Phóng to 250% và di chuyển background theo chuột
    zoomPreview.style.backgroundSize = "250%"; 
    zoomPreview.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
});

imageFrame.addEventListener('mouseleave', function() {
    zoomPreview.classList.add('hidden');
});
