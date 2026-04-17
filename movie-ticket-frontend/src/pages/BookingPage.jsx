import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState("IDLE"); // IDLE, BOOKING, SUCCESS, ERROR

  // Giả lập sơ đồ ghế 8x10
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Lấy thông tin phim (để hiện tiêu đề, giá...)
        const movieRes = await axiosClient.get(`/movies/${movieId}`);
        setMovie(movieRes.data);

        // 2. Lấy danh sách ghế đã đặt
        const seatsRes = await axiosClient.get(`/bookings/movie/${movieId}/seats`);
        setOccupiedSeats(seatsRes.data); // Giả sử trả về mảng string: ["A1", "B2"...]
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieId]);

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(s => s !== seatId) 
        : [...prev, seatId]
    );
  };

  const handleBooking = () => {
  if (selectedSeats.length === 0) {
    alert("Vui lòng chọn ít nhất một ghế!");
    return;
  }

  // 👉 chuyển sang payment + truyền data
  navigate("/payment", {
    state: {
      movieId: Number(movieId),
      seatNumbers: selectedSeats
    }
  });
};

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={60} />
      <p className="text-gray-500 font-medium">Đang chuẩn bị phòng chiếu...</p>
    </div>
  );

  if (!movie) return <div className="p-20 text-center">Không tìm thấy thông tin phim.</div>;

  const totalPrice = selectedSeats.length * (movie.pricePerSeat || 0);

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* CỘT TRÁI: SƠ ĐỒ GHẾ */}
        <div className="lg:col-span-2">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{movie.title}</h2>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-500 font-medium">
              <span className="bg-gray-200 px-2 py-0.5 rounded text-[10px] text-gray-600 uppercase">Phòng 01</span>
              <span>2D English Sub</span>
            </div>
          </div>

          {/* MÀN HÌNH */}
          <div className="relative mb-16 px-10">
            <div className="h-2 bg-gradient-to-b from-blue-400 to-transparent rounded-full shadow-[0_15px_30px_rgba(96,165,250,0.4)]"></div>
            <p className="text-center text-[10px] font-bold text-blue-400 mt-4 tracking-[0.5em] uppercase">Màn hình</p>
          </div>

          {/* GRID GHẾ */}
          <div className="flex flex-col gap-3 items-center select-none">
            {rows.map(row => (
              <div key={row} className="flex gap-3">
                <span className="w-6 text-xs text-gray-400 flex items-center justify-center font-bold">{row}</span>
                {cols.map(col => {
                  const seatId = `${row}${col}`;
                  const isOccupied = occupiedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <button
                      key={seatId}
                      disabled={isOccupied}
                      onClick={() => toggleSeat(seatId)}
                      className={`
                        w-8 h-8 md:w-9 md:h-9 rounded-t-xl transition-all duration-200 transform active:scale-90
                        flex items-center justify-center text-[10px] font-bold
                        ${isOccupied 
                          ? 'bg-gray-300 text-gray-400 cursor-not-allowed' 
                          : isSelected 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 -translate-y-1' 
                            : 'bg-white border-2 border-gray-100 text-gray-300 hover:border-blue-400 hover:text-blue-400'}
                      `}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* CHÚ THÍCH */}
          <div className="flex justify-center gap-8 mt-12 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm border-2 border-gray-100 bg-white"></div>
              <span className="text-gray-500 text-xs">Trống</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-blue-600"></div>
              <span className="text-gray-500 text-xs">Đang chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-gray-300"></div>
              <span className="text-gray-500 text-xs">Đã đặt</span>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN ĐẶT VÉ */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 h-fit lg:sticky lg:top-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 pb-4 border-b border-gray-50">Tóm tắt đơn hàng</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Phim</span>
              <span className="font-bold text-gray-800 text-right">{movie.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Ghế đã chọn</span>
              <span className="font-bold text-blue-600">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : '---'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-100">
              <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Tổng cộng</span>
              <span className="text-3xl font-black text-red-600 tracking-tighter">
                {totalPrice.toLocaleString()}đ
              </span>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={selectedSeats.length === 0 || bookingStatus === "BOOKING"}
            className={`
              w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3
              ${selectedSeats.length > 0 && bookingStatus !== "BOOKING"
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20 active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
            `}
          >
            {bookingStatus === "BOOKING" ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Đang xử lý...
              </>
            ) : "XÁC NHẬN ĐẶT VÉ"}
          </button>
          
          <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest">
            Hủy vé trước giờ chiếu 30 phút
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;