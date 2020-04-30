import React from 'react';
import Header from "../components/Home/layout/Header";
import Footer from "../components/Home/layout/Footer";


const LayoutDefault = ({ children }) => (
  <>
    <Header navPosition="right" className="reveal-from-bottom" />
    <main className="site-content">
      {children}
    </main>
    <Footer />
  </>
);

export default LayoutDefault;  