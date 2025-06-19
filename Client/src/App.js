// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './UploadPage';
import Result from './Result';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <NavBar /> {/* Menú visible siempre */}
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/Result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;