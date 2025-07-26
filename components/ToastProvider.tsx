"use client";

import "react-toastify/dist/ReactToastify.css";
import { Bounce, Flip, Slide, ToastContainer, Zoom } from "react-toastify";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ToastContainer
        toastClassName={"rounded-lg min-w-96 text-center"}
        position="top-center"
        autoClose={3200}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </>
  );
}