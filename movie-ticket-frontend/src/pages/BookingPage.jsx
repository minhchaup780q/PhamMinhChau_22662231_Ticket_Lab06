import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const BookingPage = ({ movie, onBack }) => {
  const [seat, setSeat] = useState("");
  const [isDone, setIsDone] = useState(false);

  // const handleBooking = async () => {
  //   try {
  //     const payload = {
  //       user_id: 1, // Fix cứng để demo hoặc lấy từ auth context
  //       movie_id: movie.id,
  //       seat_number: seat,
  //       total_price: movie.price_per_seat,
  //       status: 'PENDING'
  //     };
  //     await axiosClient.post('/bookings', payload);
  //     setIsDone(true);
  //   } catch (err) {
  //     alert("Lỗi kết nối Booking Service!");
  //   }
  // };

  const handleBooking = async () => {
  setLoading(true); // Nên có trạng thái chờ
  try {
    const payload = {
      user_id: 1, 
      movie_id: movie.id,
      seat_number: seat,
      total_price: movie.price_per_seat,
      status: 'PENDING'
    };

    // Gọi trực tiếp đến IP Service (Bỏ qua axiosClient cũ nếu nó cấu hình sai baseURL)
    const response = await axios.post('http://172.16.54.193:8082/bookings', payload);
    
    if (response.status === 200 || response.status === 201) {
      setIsDone(true);
      console.log("Booking thành công!");
    }
  } catch (err) {
    console.error("Chi tiết lỗi:", err.response || err);
    alert(`Lỗi: ${err.response?.data?.message || "Không thể kết nối trực tiếp đến Service!"}`);
  } finally {
    setLoading(false);
  }
};

  if (isDone) return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50 p-6 text-center">
      <CheckCircle size={80} className="text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-green-800">Yêu cầu đã gửi!</h2>
      <p className="text-green-600">Payment Service đang xử lý qua RabbitMQ. Vui lòng kiểm tra thông báo sau.</p>
      <button onClick={onBack} className="mt-6 text-blue-600 underline">Quay lại trang chủ</button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-2xl rounded-3xl mt-10">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 mb-6"><ArrowLeft size={18}/> Quay lại</button>
      <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
      <p className="text-gray-500 mb-6">Thời lượng: {movie.duration_minutes} phút</p>
      
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Chọn vị trí ghế (ví dụ: A10)</span>
          <input 
            type="text" value={seat} onChange={(e) => setSeat(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-blue-500"
            placeholder="Nhập ghế..."
          />
        </label>
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex justify-between"><span>Giá vé:</span> <strong>{Number(movie.price_per_seat).toLocaleString()}đ</strong></div>
        </div>
        <button 
          onClick={handleBooking}
          className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition"
        >
          XÁC NHẬN ĐẶT VÉ
        </button>
      </div>
    </div>
  );
};

export default BookingPage;