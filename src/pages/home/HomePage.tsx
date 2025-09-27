import HeroSection2 from "./components/HeroSection2";
import ServiceSection from "./components/ServiceSection";
import ProductSection from "./components/ProductSection";
import TestimonialSection from "./components/TestimonialSection";
import HeroSection from "./components/HeroSection";

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <ServiceSection />
      <HeroSection2 />
      <ProductSection />
      <TestimonialSection />
    </>
  );
};

export default HomePage;
