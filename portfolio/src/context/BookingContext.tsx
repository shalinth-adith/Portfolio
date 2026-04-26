"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import BookingModal from "@/components/BookingModal";

const BookingCtx = createContext<() => void>(() => {});

export function useBooking() {
  return useContext(BookingCtx);
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BookingCtx.Provider value={() => setIsOpen(true)}>
      {children}
      {isOpen && <BookingModal onClose={() => setIsOpen(false)} />}
    </BookingCtx.Provider>
  );
}
