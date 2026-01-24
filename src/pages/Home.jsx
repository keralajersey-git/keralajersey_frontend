import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Products from '../components/Products';
import Testimonials from '../components/Testimonials';
import TeamCarousel from '../components/TeamCarousel';
import Marquee from '../components/Marquee';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Hero />
      <Marquee />
      <About />
      <Products />
      <Testimonials />
      <TeamCarousel />
      <Footer />
    </div>
  );
};

export default Home;
