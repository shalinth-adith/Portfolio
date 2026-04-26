"use client";

import { useState } from "react";
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

export default function ClientShell() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const open  = () => setBookingOpen(true);
  const close = () => setBookingOpen(false);

  return (
    <>
      <Loader />
      <Cursor />
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
