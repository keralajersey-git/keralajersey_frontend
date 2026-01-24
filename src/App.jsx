import React from 'react';
import Home from './pages/Home';
import FloatingActions from './components/FloatingActions';

function App() {
  return (
    <div className="min-h-screen w-full relative">
      {/* Peachy Mint Dream Gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `white`,
        }}
      />
      {/* Your Content/Components */}
      <div className="relative z-10">
        <Home />
      </div>

      {/* Floating Action Icons */}
      <FloatingActions />
    </div>
  );
}

export default App;
