type Handler = () => void;
let _handler: Handler | null = null;

export function registerBookingHandler(fn: Handler) {
  _handler = fn;
}

export function openBookingModal() {
  _handler?.();
}
