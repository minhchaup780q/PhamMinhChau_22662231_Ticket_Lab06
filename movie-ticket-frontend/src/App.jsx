import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MovieList from './pages/MovieList';
import BookingPage from './pages/BookingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={
              !selectedMovie ? (
                <MovieList onSelectMovie={(movie) => setSelectedMovie(movie)} />
              ) : (
                <BookingPage 
                  movie={selectedMovie} 
                  onBack={() => setSelectedMovie(null)} 
                />
              )
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Catch-all route to redirect unrecognized URLs to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;