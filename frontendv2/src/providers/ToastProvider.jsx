import React from "react";
import { Toaster } from "react-hot-toast";

function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,

        success: {
          duration: 3000,
        },

        error: {
          duration: 5000,
        },
      }}
    />
  );
}

export default ToastProvider;
