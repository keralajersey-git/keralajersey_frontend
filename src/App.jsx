import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full relative">
        {/* Peachy Mint Dream Gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `white`,
          }}
        />
        {/* Content Area */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
