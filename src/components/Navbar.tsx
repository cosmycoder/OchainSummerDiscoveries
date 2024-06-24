// src/components/Navbar.tsx
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaHome, FaGithub, FaFileAlt, FaEnvelope } from 'react-icons/fa';
import styles from '../styles/Navbar.module.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        <Link href="/" legacyBehavior>
          <a className="text-white text-2xl font-bold">OCS-Discovery</a>
        </Link>
        <div className="md:hidden" onClick={toggleMenu}>
          <i className="text-white text-3xl cursor-pointer">
            {isOpen ? <FaTimes /> : <FaBars />}
          </i>
        </div>
        <ul className={`${styles.navMenu} ${isOpen ? styles.active : ''} md:flex md:items-center md:static absolute w-full left-0 md:w-auto md:py-0 py-4 transition-all duration-500 ease-in`}>
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link href="/" legacyBehavior>
              <a className={`text-white hover:text-gray-300 duration-500 ${styles.navLink}`}>
                <FaHome className="mr-2" />Home
              </a>
            </Link>
          </li>
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link href="https://github.com" legacyBehavior>
              <a className={`text-white hover:text-gray-300 duration-500 ${styles.navLink}`}>
                <FaGithub className="mr-2" />GitHub
              </a>
            </Link>
          </li>
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link href="/docs" legacyBehavior>
              <a className={`text-white hover:text-gray-300 duration-500 ${styles.navLink}`}>
                <FaFileAlt className="mr-2" />Docs
              </a>
            </Link>
          </li>
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link href="/contact" legacyBehavior>
              <a className={`text-white hover:text-gray-300 duration-500 ${styles.navLink}`}>
                <FaEnvelope className="mr-2" />Contacts
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
