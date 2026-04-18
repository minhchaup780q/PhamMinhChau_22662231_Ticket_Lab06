import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { PlusCircle, Film, Trash2, Clock, Edit3, X, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Khởi tạo state khớp chính xác với JSON mẫu của bạn
  const initialMovieState = {
    title: '',
    description: '',
    imageUrl: '',
    durationMinutes: '',
    releaseDate: new Date().toISOString().split('T')[0], // Mặc định ngày hôm nay (YYYY-MM-DD)
    pricePerSeat: '',
    status: 'AVAILABLE' // Mặc định là đang chiếu, JSON bạn gửi là ARCHIVED
  };

  const [newMovie, setNewMovie] = useState(initialMovieState);

  const fetchMovies = async () => {
    try {
      const res = await axiosClient.get('/movies');
      setMovies(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách phim", err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleEditClick = (movie) => {
    setEditingId(movie.id);
    setNewMovie({
      title: movie.title,
      description: movie.description || '',
      imageUrl: movie.imageUrl || '',
      durationMinutes: movie.durationMinutes,
      releaseDate: movie.releaseDate || initialMovieState.releaseDate,
      pricePerSeat: movie.pricePerSeat,
      status: movie.status || 'AVAILABLE'
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewMovie(initialMovieState);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert dữ liệu để khớp kiểu Double/Long của Backend
    const payload = {
      ...newMovie,
      durationMinutes: parseInt(newMovie.durationMinutes),
      pricePerSeat: parseFloat(newMovie.pricePerSeat)
    };

    try {
      if (editingId) {
        await axiosClient.put(`/movies/${editingId}`, payload);
        alert("Cập nhật phim thành công!");
      } else {
        await axiosClient.post('/movies', payload);
        alert("Thêm phim thành công!");
      }
      handleCancel();
      fetchMovies();
    } catch (err) {
      console.error("Lỗi API:", err.response?.data || err.message);
      alert(editingId ? "Lỗi khi cập nhật!" : "Lỗi khi thêm phim!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phim này?")) {
      try {
        await axiosClient.delete(`/movies/${id}`);
        fetchMovies();
      } catch (err) {
        alert("Lỗi khi xóa phim!");
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header - Giữ nguyên */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Film className="text-blue-600" /> Quản lý Phim
        </h1>
        <button 
          onClick={() => (showForm ? handleCancel() : setShowForm(true))}
          className={`${showForm ? "bg-gray-500" : "bg-blue-600"} text-white px-4 py-2 rounded-lg flex items-center gap-2 transition hover:opacity-90`}
        >
          {showForm ? <X size={20} /> : <PlusCircle size={20} />} 
          {showForm ? "Đóng Form" : "Thêm Phim Mới"}
        </button>
      </div>

      {/* FORM THÊM/SỬA PHIM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8 border-2 border-blue-50 animate-in fade-in zoom-in duration-300">
          <h2 className="text-xl font-bold mb-4 text-blue-700">
            {editingId ? `Đang chỉnh sửa: ${newMovie.title}` : "Thêm phim mới"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên phim</label>
              <input required type="text" className="mt-1 block w-full border rounded-md p-2"
                value={newMovie.title} onChange={(e) => setNewMovie({...newMovie, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày phát hành</label>
              <input required type="date" className="mt-1 block w-full border rounded-md p-2"
                value={newMovie.releaseDate} onChange={(e) => setNewMovie({...newMovie, releaseDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Thời lượng (phút)</label>
              <input required type="number" className="mt-1 block w-full border rounded-md p-2"
                value={newMovie.durationMinutes} onChange={(e) => setNewMovie({...newMovie, durationMinutes: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Giá vé (VNĐ)</label>
              <input required type="number" step="0.01" className="mt-1 block w-full border rounded-md p-2"
                value={newMovie.pricePerSeat} onChange={(e) => setNewMovie({...newMovie, pricePerSeat: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Link ảnh Poster</label>
              <input type="text" className="mt-1 block w-full border rounded-md p-2"
                value={newMovie.imageUrl} onChange={(e) => setNewMovie({...newMovie, imageUrl: e.target.value})} />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
              <select className="mt-1 block w-full border rounded-md p-2"
                value={newMovie.status} onChange={(e) => setNewMovie({...newMovie, status: e.target.value})}>
                <option value="AVAILABLE">AVAILABLE (Đang chiếu)</option>
                <option value="ARCHIVED">ARCHIVED (Lưu trữ)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea className="mt-1 block w-full border rounded-md p-2" rows="3"
                value={newMovie.description} onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}></textarea>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700">
              {editingId ? "CẬP NHẬT" : "LƯU PHIM"}
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-200 px-6 py-2 rounded-lg font-bold">HỦY</button>
          </div>
        </form>
      )}

      {/* DANH SÁCH PHIM */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Phim</th>
              <th className="p-4 font-semibold text-gray-600">Ngày phát hành</th>
              <th className="p-4 font-semibold text-gray-600">Giá vé</th>
              <th className="p-4 font-semibold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium">
                  <div className="flex items-center gap-3">
                    <img src={m.imageUrl} alt="poster" className="w-12 h-16 object-cover rounded shadow-sm bg-gray-100" />
                    <div>
                      <div className="font-bold text-gray-900">{m.title}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12}/>{m.durationMinutes} phút</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-2"><Calendar size={14}/> {m.releaseDate}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${m.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {m.status}
                  </span>
                </td>
                <td className="p-4 text-blue-600 font-bold">{Number(m.pricePerSeat).toLocaleString()}đ</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => handleEditClick(m)} className="text-amber-500 hover:scale-110 transition"><Edit3 size={18}/></button>
                    <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:scale-110 transition"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;