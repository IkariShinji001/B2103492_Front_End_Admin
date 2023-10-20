function extractDateAndTime(timestamp) {
  // Tạo đối tượng Date từ timestamp
  const dateTime = new Date(timestamp);

  // Lấy thông tin ngày và giờ
  const date = dateTime.toLocaleDateString(); // Lấy ngày dưới dạng chuỗi
  const time = dateTime.toLocaleTimeString(); // Lấy giờ dưới dạng chuỗi

  return `${date} ${time}`
}

export default extractDateAndTime;
