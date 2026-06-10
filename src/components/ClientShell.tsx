"use client";

import { useState, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis, stopLenis, startLenis } from "@/utils/scroll";
import Loader from "./Loader";
import Cursor from "./Cursor";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Marquee from "./Marquee";
import About from "./About";
import Experience from "./Experience";
import Blog from "./Blog";
import CTA from "./CTA";
import Footer from "./Footer";
import BookingModal from "./BookingModal";
import ScrollProgress from "./ScrollProgress";
import JourneyRail from "./JourneyRail";

gsap.registerPlugin(ScrollTrigger);

export default function ClientShell() {
  const [bookingOpen, setBookingOpen] = useState(false);

  // Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  const open = () => {
    stopLenis(); // freeze background scroll while the modal is up
    setBookingOpen(true);
  };
  const close = () => {
    startLenis();
    setBookingOpen(false);
  };

  return (
    <>
      <Loader />
      <Cursor />
      <ScrollProgress />
      <JourneyRail />
      <Navbar openBooking={open} />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience openBooking={open} />
        <Blog />
        <CTA openBooking={open} />
      </main>
      <Footer />
      {bookingOpen && <BookingModal onClose={close} />}
    </>
  );
}
