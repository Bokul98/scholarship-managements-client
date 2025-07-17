import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../../public/footer.png';


const FooterLogo = () => {
    return (
        <Link to="/" className={`inline-block`}>
            <img 
                src={logo} 
                alt="Scholarship Management" 
                className="h-10 md:h-12 w-auto object-contain transition-transform hover:scale-105"
            />
        </Link>
    );
};

export default FooterLogo;