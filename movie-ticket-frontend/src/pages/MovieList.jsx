import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Film, ShoppingCart, ImageOff } from 'lucide-react'; // Thêm ImageOff để làm fallback
import { useNavigate } from 'react-router-dom';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/movies');
        setMovies(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Lỗi lấy danh sách phim:", err);
        setError("Không thể tải danh sách phim. Vui lòng kiểm tra lại Gateway.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
        <Film className="text-red-500" /> Phim Đang Chiếu
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Đang tải danh sách phim...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center max-w-2xl mx-auto">
          <p className="text-red-600 font-bold text-lg mb-2">Oops!</p>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg shadow-red-500/30"
          >
            Thử lại
          </button>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <Film className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-medium text-xl">Hiện chưa có phim nào đang chiếu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-700">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100">
              
              {/* PHẦN IMAGE MỚI THÊM */}
              <div className="relative h-72 overflow-hidden bg-gray-200">
                {movie.imageUrl ? (
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                       // Nếu link ảnh lỗi, thay thế bằng ảnh placeholder hoặc icon
                       e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ImageOff size={48} strokeWidth={1} />
                    <span className="text-xs mt-2">Không có ảnh</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] px-3 py-1 bg-black/60 backdrop-blur-md text-white font-bold rounded-lg uppercase tracking-wider">
                    {movie.status || 'Đang chiếu'}
                  </span>
                </div>
              </div>

              {/* NỘI DUNG PHÍA DƯỚI */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs text-blue-600 font-semibold">2D/3D Digital</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {movie.title}
                </h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2 min-h-[40px]">
                  {movie.description}
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Giá vé từ</p>
                    <p className="text-xl font-black text-red-600">{Number(movie.pricePerSeat || 0).toLocaleString()}đ</p>
                  </div>
                  <button
                    onClick={() => navigate(`/booking/${movie.id}`)}
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 hover:rotate-6 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;