import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Products from '../components/Products';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <Products />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
