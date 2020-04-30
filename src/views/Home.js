import React from 'react';
// import sections

import Cta from "../components/Home/sections/Cta";
import Testimonial from "../components/Home/sections/Testimonial";
import FeaturesSplit from "../components/Home/sections/FeaturesSplit";
import FeaturesTiles from "../components/Home/sections/FeaturesTiles";
import Hero from "../components/Home/sections/Hero";


const Home = () => {

  return (
    <>
      <Hero className="illustration-section-01" />
      <FeaturesTiles />
      <FeaturesSplit invertMobile topDivider imageFill className="illustration-section-02" />
      <Testimonial topDivider />
      <Cta split />
    </>
  );
}

export default Home;