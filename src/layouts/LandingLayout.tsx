import { Footer } from "../components/common/Footer";
import { Header } from "../components/common/Header";
import {Outlet } from 'react-router-dom';

export const LandingLayout = (): JSX.Element => {
  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  );
};

export default LandingLayout;