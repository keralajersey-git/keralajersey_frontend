import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

const Admin = lazy(() => import('./pages/Admin'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));

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
          <Suspense fallback={<main className="min-h-screen p-8 text-gray-700">Loading page…</main>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/:slug/:id" element={<ProductPage />} />
              <Route path="/collections/:categorySlug" element={<CollectionPage />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

export default App;
