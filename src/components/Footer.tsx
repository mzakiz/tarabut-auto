
import React from 'react';
import { Phone, Mail, MapPin, FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-ksa-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">DriveDealDream</h3>
            <p className="text-gray-400 mb-4">
              Experience the best car deals in Saudi Arabia with financing options tailored to your needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-ksa-secondary transition-colors">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-ksa-secondary transition-colors">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-ksa-secondary transition-colors">
                <TwitterIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-ksa-secondary transition-colors">Home</a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-ksa-secondary transition-colors">Features</a>
              </li>
              <li>
                <a href="#specs" className="text-gray-400 hover:text-ksa-secondary transition-colors">Specifications</a>
              </li>
              <li>
                <a href="#calculator" className="text-gray-400 hover:text-ksa-secondary transition-colors">Affordability</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-ksa-secondary mr-2 mt-0.5" />
                <span className="text-gray-400">+966 12 345 6789</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-ksa-secondary mr-2 mt-0.5" />
                <span className="text-gray-400">sales@drivedeal.sa</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-ksa-secondary mr-2 mt-0.5" />
                <span className="text-gray-400">
                  King Fahd Road, Riyadh, Kingdom of Saudi Arabia
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to receive updates on our latest offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-md w-full bg-gray-800 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-ksa-secondary"
              />
              <Button className="bg-ksa-secondary hover:bg-ksa-secondary/90 rounded-l-none">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} DriveDealDream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
