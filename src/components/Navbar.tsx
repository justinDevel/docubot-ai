import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth, useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/60 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                DocuBot.AI
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-700 hover:text-primary-600 transition-colors">
              Features
            </a>
            <a href="#demo" className="text-slate-700 hover:text-primary-600 transition-colors">
              Demo
            </a>
            <a href="#pricing" className="text-slate-700 hover:text-primary-600 transition-colors">
              Pricing
            </a>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-slate-700 hover:text-primary-600 transition-colors">
                <span>Developers</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/docs" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  SDK Documentation
                </Link>
                <Link to="/api" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  API Reference
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard"
                  className="text-slate-700 hover:text-primary-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-slate-700 hover:text-primary-600 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Get Started
                  </motion.button>
                </SignInButton>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-slate-200"
        >
          <div className="px-4 py-4 space-y-4">
            <a href="#features" className="block text-slate-700 hover:text-primary-600 transition-colors">
              Features
            </a>
            <a href="#demo" className="block text-slate-700 hover:text-primary-600 transition-colors">
              Demo
            </a>
            <a href="#pricing" className="block text-slate-700 hover:text-primary-600 transition-colors">
              Pricing
            </a>
            <Link to="/docs" className="block text-slate-700 hover:text-primary-600 transition-colors">
              SDK
            </Link>
            <div className="pt-4 space-y-2">
              {isSignedIn ? (
                <>
                  <Link 
                    to="/dashboard"
                    className="block w-full text-left text-slate-700 hover:text-primary-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <UserButton />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="w-full text-left text-slate-700 hover:text-primary-600 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <button className="w-full px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium">
                      Get Started
                    </button>
                  </SignInButton>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;