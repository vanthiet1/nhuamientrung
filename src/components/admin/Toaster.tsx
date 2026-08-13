"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
          fontSize: "14px",
          borderRadius: "8px",
        },
        success: {
          style: {
            background: "#10b981", // emerald-500
            color: "white",
          },
        },
        error: {
          style: {
            background: "#ef4444", // red-500
            color: "white",
          },
        },
      }}
    />
  );
}
