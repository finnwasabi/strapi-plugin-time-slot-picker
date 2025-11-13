# Hướng dẫn sử dụng Time Slot Picker

## Cài đặt

Plugin đã được tự động enable trong `backend/config/plugins.js`.

## Cách sử dụng

### 1. Thêm field vào Content Type

1. Khởi động Strapi: `cd backend && yarn develop`
2. Vào **Content-Type Builder**
3. Chọn content type muốn thêm field (hoặc tạo mới)
4. Click **Add another field**
5. Chọn tab **Custom**
6. Chọn **Time Slot Picker**
7. Đặt tên field (ví dụ: `timeSlots`)
8. Click **Finish** và **Save**

### 2. Cấu hình Time Slots (Optional)

Trong phần **Advanced Settings** của field, bạn có thể cấu hình các ngày và khung giờ:

```json
{
  "days": [
    {
      "date": "2026-06-18",
      "label": "DAY 1 | WED, JUN 18, 2026",
      "morningSlots": [
        "8:00-9:00",
        "9:00-10:00",
        "10:00-11:00",
        "11:00-12:00",
        "12:00-13:00"
      ],
      "afternoonSlots": [
        "13:00-14:00",
        "14:00-15:00",
        "15:00-16:00",
        "16:00-17:00",
        "17:00-18:00"
      ]
    },
    {
      "date": "2026-06-19",
      "label": "DAY 2 | THU, JUN 19, 2026",
      "morningSlots": ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00"],
      "afternoonSlots": ["13:00-14:00", "14:00-15:00", "15:00-16:00"]
    }
  ]
}
```

Nếu không cấu hình, plugin sẽ sử dụng config mặc định.

### 3. Sử dụng trong Content Manager

Khi tạo/edit entry, bạn sẽ thấy giao diện chọn time slots:

- Checkbox cho từng ngày để chọn tất cả slots
- Chia thành Morning và Afternoon
- Click vào slot để chọn/bỏ chọn

### 4. Data Structure

Data được lưu dạng JSON:

```json
{
  "days": [
    {
      "date": "2026-06-18",
      "slots": ["8:00-9:00", "9:00-10:00", "11:00-12:00"]
    },
    {
      "date": "2026-06-19",
      "slots": ["13:00-14:00", "14:00-15:00"]
    }
  ]
}
```

### 5. Query từ API

```javascript
// GET request
const response = await fetch("/api/your-content-type/1");
const data = await response.json();

// Access time slots
const timeSlots = data.data.attributes.timeSlots;
console.log(timeSlots.days); // Array of days with selected slots
```

## Troubleshooting

Nếu plugin không hiển thị:

1. Restart Strapi server
2. Clear browser cache
3. Kiểm tra console log có lỗi không
4. Đảm bảo plugin đã được enable trong `backend/config/plugins.js`
