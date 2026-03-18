// script.js

// Mảng ánh xạ số tháng sang tên viết tắt tiếng Anh (JAN, FEB...)
const monthAbbrs = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Lấy các element từ HTML
const datePicker = document.getElementById('birth-date-picker');
const flowerOriginal = document.getElementById('flower-original');
const flowerZoomed = document.getElementById('flower-zoomed');
const placeholderText = document.getElementById('placeholder-text');
const imageFrame = document.getElementById('image-frame');
const zoomPreviewContainer = document.getElementById('zoom-preview-container');

// Lắng nghe sự kiện khi người dùng thay đổi ngày
datePicker.addEventListener('change', function() {
    const selectedDateStr = this.value; // Dạng YYYY-MM-DD

    if (selectedDateStr) {
        // Tạo đối tượng Date từ chuỗi
        const dateObj = new Date(selectedDateStr);
        
        // Lấy ngày và tháng (Lưu ý: getMonth() trả về từ 0-11)
        const day = dateObj.getDate();
        const monthIndex = dateObj.getMonth();
        
        // 1. Tạo tên Folder Tháng (Dạng "01", "02", ..., "12")
        const monthFolder = (monthIndex + 1).toString().padStart(2, '0');
        
        // 2. Tạo tên viết tắt của tháng (JAN, FEB...)
        const monthAbbr = monthAbbrs[monthIndex];
        
        // 3. Tạo tên file ảnh (Dạng "19MAR.png")
        const fileName = `${day}${monthAbbr}.png`;
        
        // 4. Ghép đường dẫn hoàn chỉnh. GIẢ ĐỊNH folder là assets/365-B-Flower/
        const imagePath = `assets/365-B-Flower/${monthFolder}/${fileName}`;
        
        // 5. Cập nhật giao diện
        // Ẩn ảnh cũ để tránh hiệu ứng "giật"
        flowerOriginal.classList.add('hidden');
        zoomPreviewContainer.classList.add('hidden'); // Ẩn preview nếu có
        placeholderText.classList.remove('hidden');
        placeholderText.textContent = "Searching for your flower...";

        // Cập nhật đường dẫn ảnh mới cho cả ảnh gốc và ảnh phóng to
        flowerOriginal.src = imagePath;
        flowerZoomed.src = imagePath; // Dùng chung 1 ảnh để phóng to

        // Xử lý sự kiện load ảnh thành công
        flowerOriginal.onload = function() {
            flowerOriginal.classList.remove('hidden');
            placeholderText.classList.add('hidden');
            // Cập nhật URL nền cho container phóng to để hiệu ứng mượt hơn
            zoomPreviewContainer.style.backgroundImage = `url(${imagePath})`;
        };

        // Xử lý sự kiện load ảnh lỗi (quan trọng khi test local)
        flowerOriginal.onerror = function() {
            flowerOriginal.classList.add('hidden');
            placeholderText.classList.remove('hidden');
            placeholderText.textContent = "Error: Flower image not found.";
            zoomPreviewContainer.classList.add('hidden');
        };

    } else {
        // Nếu xóa ngày, quay lại trạng thái placeholder
        flowerOriginal.classList.add('hidden');
        placeholderText.classList.remove('hidden');
        placeholderText.textContent = "Select a date to see your flower";
        zoomPreviewContainer.classList.add('hidden');
    }
});

// --- LOGIC XỬ LÝ HIỆU ỨNG PHÓNG TO (ZOOM) DẠNG AMAZON ---

// Khi di chuột VÀO khung ảnh
imageFrame.addEventListener('mouseenter', function() {
    // Chỉ hiển thị preview khi đã có ảnh hoa được load
    if (!flowerOriginal.classList.contains('hidden')) {
        zoomPreviewContainer.classList.remove('hidden');
    }
});

// Khi di chuột TRONG khung ảnh
imageFrame.addEventListener('mousemove', function(e) {
    if (zoomPreviewContainer.classList.contains('hidden')) return;

    // Lấy vị trí chuột trong khung ảnh
    const rect = imageFrame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Tính phần trăm vị trí chuột
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Di chuyển background-image của ô preview để tạo hiệu ứng phóng to theo trỏ chuột
    // 200% là độ phóng to, bạn có thể tăng giảm
    zoomPreviewContainer.style.backgroundSize = "200%"; 
    zoomPreviewContainer.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
});

// Khi di chuột RA KHỎI khung ảnh
imageFrame.addEventListener('mouseleave', function() {
    zoomPreviewContainer.classList.add('hidden');
});