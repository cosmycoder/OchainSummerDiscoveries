import {  useState, useEffect } from "react";

const Footer = () => {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        // Update the year when the component mounts
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer>
           <p>{`© ${year} OCS-Discoveries. All Rights Reserved.`}</p>
        </footer>
    );
};

export default Footer;