import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, FileText, MessageCircle, Zap, Play } from 'lucide-react';
import { useAuth, SignInButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { isSignedIn } = useAuth();

  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full text-sm font-medium text-primary-700 mb-8"
          >
            <Zap className="h-4 w-4 mr-2" />
            Powered by AWS Lambda & Amazon Bedrock
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6"
          >
            Chat with Your{' '}
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Documents
            </span>
            <br />
            Like Never Before
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Transform PDFs, contracts, manuals, and policies into intelligent AI assistants. 
            Get instant answers, summaries, and insights. Embed anywhere with our SDK.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            {isSignedIn ? (
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Start Building</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </SignInButton>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-primary-300 transition-all duration-200 flex items-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Feature Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 max-w-md mx-auto"
          >
            <div className="text-center">
              <div className="p-3 bg-gradient-to-r from-primary-100 to-primary-200 rounded-xl inline-block mb-2">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <p className="text-sm text-slate-600">Upload Documents</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-gradient-to-r from-accent-100 to-accent-200 rounded-xl inline-block mb-2">
                <MessageCircle className="h-6 w-6 text-accent-600" />
              </div>
              <p className="text-sm text-slate-600">Chat Instantly</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-gradient-to-r from-success-100 to-success-200 rounded-xl inline-block mb-2">
                <Bot className="h-6 w-6 text-success-600" />
              </div>
              <p className="text-sm text-slate-600">Embed Anywhere</p>
            </div>
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 relative"
        >
          <div className="bg-gradient-to-r from-primary-600/10 to-accent-600/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1 text-center">
                    <span className="text-slate-300 text-sm">DocuBot.AI Dashboard</span>
                  </div>
                </div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full inline-block">
                    <Bot className="h-12 w-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-900 font-semibold">Real AWS Integration Active</p>
                    <p className="text-slate-600">Upload documents and start chatting!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;