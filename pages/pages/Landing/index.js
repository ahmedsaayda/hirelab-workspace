import React from "react";

import { CallToAction } from "./CallToAction";
import { Faqs } from "./Faqs";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Pricing } from "./Pricing";
import { PrimaryFeatures } from "./PrimaryFeatures";
import { SecondaryFeatures } from "./SecondaryFeatures";
import { Testimonials } from "./Testimonials";

const Landing = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  );
};

export default Landing;
