import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { PlusCircle, Film, Trash2, Clock, DollarSign } from 'lucide-react';


const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false)
  const [newMovie, setNewMovie] = useState({
    title: '',
    duration_minutes: '',
    pricePerSeat: '',
    description: ''
  });

  // 1. Lấy danh sách phim để hiển thị
  const fetchMovies = async () => {
    try {
      const res = await axiosClient.get('/api/movies');
      setMovies(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách phim", err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // 2. Xử lý thêm phim mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/movies', newMovie);
      alert("Thêm phim thành công!");
      setNewMovie({ title: '', duration_minutes: '', pricePerSeat: '', description: '' });
      setShowForm(false);
      fetchMovies(); // Load lại danh sách
    } catch (err) {
      alert("Lỗi khi thêm phim!");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Film className="text-blue-600" /> Quản lý Phim
        </h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} /> {showForm ? "Đóng Form" : "Thêm Phim Mới"}
        </button>
      </div>

      {/* FORM THÊM PHIM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên phim</label>
              <input 
                required type="text" 
                className="mt-1 block w-full border rounded-md p-2"
                value={newMovie.title}
                onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Thời lượng (phút)</label>
              <input 
                required type="number" 
                className="mt-1 block w-full border rounded-md p-2"
                value={newMovie.duration_minutes}
                onChange={(e) => setNewMovie({...newMovie, duration_minutes: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Giá vé (VNĐ)</label>
              <input 
                required type="number" 
                className="mt-1 block w-full border rounded-md p-2"
                value={newMovie.pricePerSeat}
                onChange={(e) => setNewMovie({...newMovie, pricePerSeat: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea 
                className="mt-1 block w-full border rounded-md p-2"
                value={newMovie.description}
                onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
              ></textarea>
            </div>
          </div>
          <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">
            LƯU PHIM
          </button>
        </form>
      )}

      {/* DANH SÁCH PHIM DẠNG BẢNG */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Tên phim</th>
              <th className="p-4 font-semibold text-gray-600">Thời lượng</th>
              <th className="p-4 font-semibold text-gray-600">Giá vé</th>
              <th className="p-4 font-semibold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id} className="border-b last:border-none hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{m.title}</td>
                <td className="p-4 flex items-center gap-1 text-gray-500"><Clock size={16}/> {m.duration_minutes}m</td>
                <td className="p-4 text-blue-600 font-bold">{Number(m.pricePerSeat).toLocaleString()}đ</td>
                <td className="p-4">
                  <button className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {movies.length === 0 && <p className="p-10 text-center text-gray-400">Chưa có phim nào trong danh sách.</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;