/** @format */

"use client";
import Button from "@/components/Button";
import starsBg from "@/assets/stars.png";
import gridLines from "@/assets/grid-lines.png";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { RefObject, useEffect, useRef, useState } from "react";

// Define the useRelativeMousePosition hook to track mouse position relative to an element
const useRelativeMousePosition = (to: RefObject<HTMLElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const updateMousePosition = (event: MouseEvent) => {
    if (!to.current) return;
    const { top, left } = to.current.getBoundingClientRect();
    mouseX.set(event.clientX - left);
    mouseY.set(event.clientY - top);
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [updateMousePosition]);

  return [mouseX, mouseY];
};

// Popup component for showing messages

const Popup = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    <motion.div
      className="border border-white/15 p-6 md:p-10 rounded-xl bg-gradient-to-bl from-[rgba(140,69,255,0.3)] to-black max-w-xs md:max-w-md text-center relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <p className="text-lg md:text-2xl tracking-tight text-white">{message}</p>
      <button
        onClick={onClose}
        className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300"
      >
        OK
      </button>
      <div className="absolute inset-0 bg-[rgba(140,69,244,0.3)] mix-blend-soft-light opacity-80 rounded-xl pointer-events-none"></div>
    </motion.div>
  </motion.div>
);

export const CallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const borderedDivRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const backgroundPositionY = useTransform(
    scrollYProgress,
    [0, 1],
    [-100, 100]
  );

  // Call useRelativeMousePosition to get mouseX and mouseY
  const [mouseX, mouseY] = useRelativeMousePosition(borderedDivRef);

  // Use mouseX and mouseY in the maskImage style
  const maskImage = useMotionTemplate`radial-gradient(50% 50% at ${mouseX}px ${mouseY}px, black, transparent)`;

  // State for managing popup visibility and message
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  // Handle form submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElements = event.target as any;
    const formData = {
      name: formElements[0].value,
      email: formElements[1].value,
      phone: formElements[2].value,
      message: formElements[3].value,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setPopupMessage("Message sent successfully");
      } else {
        setPopupMessage("Failed to send message");
      }
    } catch (error) {
      console.log("error", error);
      setPopupMessage("Error sending message");
    }
  };

  // Handle popup close and clear inputs
  const handleClosePopup = () => {
    setPopupMessage(null);
    (document.querySelector("form") as HTMLFormElement).reset(); // Clears the form inputs
  };

  return (
    <section id="contact" className="py-12 md:py-16" ref={sectionRef}>
      <div className="container">
        <motion.div
          ref={borderedDivRef}
          className="border border-white/15 py-16 px-6 md:px-10 rounded-xl overflow-hidden relative group"
          animate={{ backgroundPositionX: starsBg.width }}
          transition={{
            repeat: Infinity,
            duration: 60,
            ease: "linear",
          }}
          style={{
            backgroundPositionY,
            backgroundImage: `url(${starsBg.src})`,
          }}
        >
          <div
            className="absolute inset-0 bg-[rgb(74,32,138)] bg-blend-overlay [mask-image:radial-gradient(50%_50%_at_50%_35%,black,transparent)] group-hover:opacity-0 transition duration-700"
            style={{
              backgroundImage: `url(${gridLines.src})`,
            }}
          ></div>
          <motion.div
            className="absolute inset-0 bg-[rgb(74,32,138)] bg-blend-overlay opacity-0 group-hover:opacity-100 transition duration-700"
            style={{
              maskImage,
              backgroundImage: `url(${gridLines.src})`,
            }}
          ></motion.div>
          <div className="relative">
            <h2 className="text-4xl md:text-5xl mx-auto tracking-tighter text-center font-medium text-white">
              Contact Us
            </h2>
            <p className="text-center text-base md:text-lg mx-auto text-white/70 mt-3 tracking-tight">
              We&apos;re here to help you. Send us a message, and we&apos;ll get
              back to you soon.
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-4 max-w-sm mx-auto text-white"
            >
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 border border-white/10 rounded-md bg-transparent text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-white/10 rounded-md bg-transparent text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full px-4 py-2 border border-white/10 rounded-md bg-transparent text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300"
              />
              <textarea
                placeholder="Message"
                className="w-full px-4 py-2 border border-white/10 rounded-md bg-transparent text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300"
                rows={4}
              ></textarea>
              <div className="flex justify-center mt-4">
                <Button type="submit" className="px-8 py-2">
                  Send
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
      {popupMessage && (
        <Popup message={popupMessage} onClose={handleClosePopup} />
      )}
    </section>
  );
};
