import {  useState, useEffect } from "react";
import styles from '../app/page.module.css'

const Footer = () => {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        // Update the year when the component mounts
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer>
           <p>© {year} <span className={styles.highlight}>OCS-Discoveries</span>. All Rights Reserved.</p>
        </footer>
    );
};

export default Footer;