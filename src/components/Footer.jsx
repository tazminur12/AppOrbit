import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowUp, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-r from-gray-900 via-purple-900 to-black text-gray-300 border-t border-purple-800">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">App</span>
              <span className="text-white">Orbit</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Building the future of web applications with cutting-edge technology and user-centric design.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub className="w-5 h-5" aria-label="GitHub" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="w-5 h-5" aria-label="Twitter" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="w-5 h-5" aria-label="LinkedIn" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Navigation</h3>
            <nav className="space-y-2" aria-label="Footer navigation">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/products">Products</FooterLink>
              <FooterLink to="/features">Features</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Company</h3>
            <nav className="space-y-2" aria-label="Company links">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Legal</h3>
            <nav className="space-y-2" aria-label="Legal links">
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/cookies">Cookie Policy</FooterLink>
              <FooterLink to="/gdpr">GDPR</FooterLink>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            &copy; {currentYear} AppOrbit. All rights reserved.
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <FooterLink to="/sitemap">Sitemap</FooterLink>
            <FooterLink to="/status">Status</FooterLink>
            <FooterLink to="/accessibility">Accessibility</FooterLink>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label="Back to top"
      >
        <FaArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
};

// Reusable FooterLink component
const FooterLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="block text-gray-400 hover:text-white transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
    >
      {children}
    </Link>
  );
};

export default Footer;