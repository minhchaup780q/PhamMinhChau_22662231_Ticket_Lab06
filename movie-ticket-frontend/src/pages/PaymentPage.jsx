import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { movieId, seatNumbers } = location.state || {};

    const [status, setStatus] = useState("IDLE");
    const [movie, setMovie] = useState(null);

    // 👉 lấy giá phim thật
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await axiosClient.get(`/movies/${movieId}`);
                setMovie(res.data);
            } catch (err) {
                console.error("Lỗi load movie:", err);
            }
        };

        if (movieId) fetchMovie();
    }, [movieId]);

    const handlePayment = async () => {
        if (!movieId || !seatNumbers || seatNumbers.length === 0) {
            alert("Thiếu dữ liệu booking!");
            return;
        }

        if (!movie) {
            alert("Chưa load được giá phim!");
            return;
        }

        setStatus("PROCESSING");

        try {
            const createdBookingIds = [];
           

            // 👉 tạo booking từng ghế
            for (const seat of seatNumbers) {
                console.log("Ghế được đặt là:", seat)
                const res = await axiosClient.post('/bookings', {
                    userId: 1,
                    movieId: Number(movieId),
                    seatNumber: seat,
                    totalPrice: movie.pricePerSeat // 👈 GIÁ THẬT
                });

                createdBookingIds.push(res.data.id);
            }

            // 👉 polling booking đầu tiên (hoặc có thể check hết)
            const bookingId = createdBookingIds[0];

            const interval = setInterval(async () => {
                try {
                    const bookingRes = await axiosClient.get(`/bookings/${bookingId}`);
                    const bookingStatus = bookingRes.data.status;

                    console.log("CHECK STATUS:", bookingStatus);

                    if (bookingStatus === "SUCCESS") {
                        clearInterval(interval);
                        setStatus("SUCCESS");
                    }

                    if (bookingStatus === "FAILED") {
                        clearInterval(interval);
                        setStatus("ERROR");
                    }

                } catch (err) {
                    console.error("Polling error:", err);
                    clearInterval(interval);
                    setStatus("ERROR");
                }
            }, 2000);

        } catch (err) {
            console.error(err);
            setStatus("ERROR");
        }
    };

    if (status === "PROCESSING") return (
        <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={80} />
            <p className="text-blue-600 font-semibold">Đang xử lý thanh toán...</p>
        </div>
    );

    if (status === "SUCCESS") return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-50">
            <CheckCircle size={80} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-700">Thanh toán thành công!</h2>
            <button
                onClick={() => navigate("/")}
                className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg"
            >
                Về trang chủ
            </button>
        </div>
    );

    if (status === "ERROR") return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-50">
            <XCircle size={80} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-700">Thanh toán thất bại!</h2>
            <button
                onClick={handlePayment}
                className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg"
            >
                Thử lại
            </button>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">Thanh toán</h2>

            <p className="text-gray-500">Movie ID: {movieId}</p>
            <p className="text-gray-500">Ghế: {seatNumbers?.join(', ')}</p>
            <p className="text-gray-500">
                Giá mỗi ghế: {movie?.pricePerSeat?.toLocaleString()}đ
            </p>

            <button
                onClick={handlePayment}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-blue-700"
            >
                Thanh toán ngay
            </button>
        </div>
    );
};

export default PaymentPage;