import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import BaseEyes from './BaseEyes';

interface MotionButtonProps {
  label: string;
  to: string;
}

const HeroSection: React.FC<MotionButtonProps> = ({ label, to }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = () => {
    router.push(to);
  };

  if (!isClient) {
    return null; // Render nothing until the component is mounted on the client
  }

  return (
    <>
      <h1>Welcome to My Landing Page</h1>
      <p>Learn more about our awesome products!</p>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          border: 'none',
          backgroundColor: '#007bff',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
      {label}
      </motion.button>
  </>
  );
};

export default HeroSection;