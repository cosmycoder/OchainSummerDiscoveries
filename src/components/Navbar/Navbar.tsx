// src/components/Nav/Navbar.tsx
import Link from 'next/link';
import { useState, useEffect, FC } from 'react';
import { FaBars, FaTimes, FaHome, FaGithub, FaFileAlt, FaEnvelope } from 'react-icons/fa';
import styles from './Navbar.module.css';
import { BlueCreateWalletButton } from '../SmartWallet/BlueCreateWalletButton';
import toast from "react-hot-toast";
const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className="container mx-auto px-4 flex justify-between items-center py-4">
          <Brand />
          <MenuToggle isOpen={isOpen} toggleMenu={toggleMenu} />
          <NavMenu isOpen={isOpen} />
        </div>
      </nav>
    </header>
  );
};

const Brand: FC = () => (
  <Link href="/" legacyBehavior>
    <a className="text-white text-2xl font-bold">
      <span className={styles.highlight}>OCS-Discoveries</span>
    </a>
  </Link>
);

interface MenuToggleProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MenuToggle: FC<MenuToggleProps> = ({ isOpen, toggleMenu }) => (
  <div className="md:hidden" onClick={toggleMenu}>
    <i className="text-white text-3xl cursor-pointer">
      {isOpen ? <FaTimes /> : <FaBars />}
    </i>
  </div>
);

interface NavMenuProps {
  isOpen: boolean;
}

const NavMenu: FC<NavMenuProps> = ({ isOpen }) => (
  <ul
    className={`${styles.navMenu} ${isOpen ? styles.active : ''} md:flex md:items-center md:static absolute w-full left-0 md:w-auto md:py-0 py-4 transition-all duration-500 ease-in`}
  >
    {menuItems.map(({ href, label, Icon }) => (
      <li className="md:ml-8 text-xl md:my-0 my-7" key={label}>
        <Link href={href} legacyBehavior>
          <a className={`text-white hover:text-gray-300 duration-500 ${styles.navLink}`}>
            <Icon className="mr-2" />{label}
          </a>
        </Link>
      </li>
    ))}
    <li><BlueCreateWalletButton
      handleSuccess={() => toast.success("Wallet created")}
      handleError={(error: any) => console.log("Exited wallet creation." + error)}
    /></li>
  </ul>
);

const menuItems = [
  { href: '/', label: 'Home', Icon: FaHome },
  { href: 'https://github.com/HiroyukiNaito/OchainSummerDiscoveries', label: 'GitHub', Icon: FaGithub },
  { href: 'https://solidoak.gitbook.io/onchain-summer-discoveries', label: 'Docs', Icon: FaFileAlt },
  { href: 'https://solidoak.tech/', label: 'Contacts', Icon: FaEnvelope },
];

export default Navbar;
