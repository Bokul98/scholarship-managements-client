import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import FooterLogo from '../Logo/FooterLogo';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Branding Column */}
                    <div className="space-y-4">
                        <div>
                            <FooterLogo />
                        </div>
                        <p className="text-gray-400">Find. Apply. Succeed.</p>
                        <div className="flex gap-4 pt-2">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                                <FaFacebookF size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                                <FaTwitter size={20} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                                <FaLinkedinIn size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                                <FaInstagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/scholarships" className="hover:text-teal-400 transition-colors">All Scholarships</Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="hover:text-teal-400 transition-colors">Dashboard</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-teal-400 transition-colors">Contact Us</Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-teal-400 transition-colors">FAQ / Help Center</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal/Support Column */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Legal & Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/terms" className="hover:text-teal-400 transition-colors">Terms & Conditions</Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/refund" className="hover:text-teal-400 transition-colors">Refund Policy</Link>
                            </li>
                            <li>
                                <Link to="/report" className="hover:text-teal-400 transition-colors">Report a Problem</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info Column */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Contact Info</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <span>Email:</span>
                                <a href="mailto:support@scholarship.com" className="hover:text-teal-400 transition-colors">
                                    support@scholarship.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>Phone:</span>
                                <a href="tel:+8801234567890" className="hover:text-teal-400 transition-colors">
                                    +880 1234 567890
                                </a>
                            </li>
                            <li>
                                <address className="not-italic">
                                    Dhaka, Bangladesh
                                </address>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <p className="text-center text-sm">
                        © {currentYear} Scholarship Management — All rights reserved by Bokul Developer.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;