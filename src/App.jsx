import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductPage from './pages/ProductPage';
import CollectionPage from './pages/CollectionPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full relative overflow-x-hidden max-w-screen">
        {/* Peachy Mint Dream Gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `white`,
          }}
        />
        {/* Content Area */}
        <div className="relative z-10 overflow-x-hidden w-full max-w-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:slug/:id" element={<ProductPage />} />
            <Route path="/collections/:categorySlug" element={<CollectionPage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
