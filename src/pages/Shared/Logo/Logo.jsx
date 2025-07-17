import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../../public/scholarship-management.png';

const Logo = ({ className = '' }) => {
    return (
        <Link to="/" className={`inline-block ${className}`}>
            <img 
                src={logo} 
                alt="Scholarship Management" 
                className="h-10 md:h-12 w-auto object-contain transition-transform hover:scale-105"
            />
        </Link>
    );
};

export default Logo;