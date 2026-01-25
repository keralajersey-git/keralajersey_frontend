import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Products from '../components/Products';
import Testimonials from '../components/Testimonials';
import TeamCarousel from '../components/TeamCarousel';
import Marquee from '../components/Marquee';
import Footer from '../components/Footer';

import Navbar from '../components/Navbar';

const Home = () => {
  const [filter, setFilter] = React.useState(null);

  const handleQualitySelect = (quality) => {
    setFilter(quality);
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <Navbar />
      <Hero onSelectQuality={handleQualitySelect} />
      <Marquee />
      <About />
      <Products externalFilter={filter} setExternalFilter={setFilter} />
      <Testimonials />
      <TeamCarousel />
      <Footer />
    </div>
  );
};

export default Home;
