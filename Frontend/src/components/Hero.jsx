import { Link } from "react-router-dom";
import { motion as Motion } from "motion/react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const item = {
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Hero = () => {
  return (
    <Motion.section
      className="w-[90%] md:w-[75vw] mx-auto py-20"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <Motion.h1
        variants={item}
        className="text-[8vw] md:text-[5vw] font-bold text-center"
      >
        <div>Connect with anyone,</div>
        <div className="text-[#009435]">anywhere</div>
      </Motion.h1>

      <Motion.p
        variants={item}
        className="mt-6 text-sm md:text-2xl text-gray-500 text-center"
      >
        Experience seamless messaging with ChatWave. Send messages, share
        moments, and stay connected with the people who matter most.
      </Motion.p>

      <Motion.div
        variants={item}
        className="mt-8 flex md:flex-row flex-col items-center justify-center gap-4"
      >
        <Link to="/signup">
          <Motion.button
            className="btn btn-success btn-xl"
            whileHover={{ y: 5 }}
            whileTap={{ scale: 1.1 }}
          >
            Start Chatting
          </Motion.button>
        </Link>

        <Link to="/login">
          <Motion.button
            className="btn btn-outline btn-xl"
            whileHover={{ y: 5 }}
            whileTap={{ scale: 1.1 }}
          >
            Already have Account
          </Motion.button>
        </Link>
      </Motion.div>
    </Motion.section>
  );
};

export default Hero;
