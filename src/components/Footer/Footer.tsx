import { FC } from "react";
import styles from '../../app/page.module.css';

const Footer: FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <p>© {currentYear} <span className={styles.highlight}>OCS-Discoveries</span>. All Rights Reserved.</p>
        </footer>
    );
};

export default Footer;
