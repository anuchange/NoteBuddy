// lib/store.js
import { create } from "zustand";

const useStore = create((set) => ({
  apiKey: null,
  setApikey: (value) => set((state) => ({ apiKey: value })),
  //   { apiKey: state.apiKey }
  // )),
  //   decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default useStore;
