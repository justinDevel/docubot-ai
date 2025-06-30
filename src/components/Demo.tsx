import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  MessageCircle, 
  Bot, 
  Send,
  Play,
  Code,
  ExternalLink
} from 'lucide-react';

const Demo = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi! I\'ve analyzed your employment contract. What would you like to know?' },
    { id: 2, type: 'user', text: 'What are the key benefits mentioned?' },
    { id: 3, type: 'bot', text: 'Based on the contract, here are the key benefits:\n\n• Health insurance (100% premium covered)\n• 401(k) with 6% company match\n• 20 days PTO + 10 sick days\n• $2,000 annual learning budget\n• Remote work flexibility' }
  ]);

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'embed', label: 'Embed', icon: Code }
  ];

  return (
    <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full text-sm font-medium text-primary-700 mb-4"
          >
            <Play className="h-4 w-4 mr-2" />
            Live Demo
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            See DocuBot.AI in{' '}
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Action
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            From upload to deployment, experience the complete workflow in under 3 minutes.
          </motion.p>
        </div>

        {/* Demo Interface */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Tab Navigation */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
            <div className="flex items-center space-x-1 bg-slate-700/50 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900 shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Upload Your Document</h3>
                    <p className="text-slate-600">Drag & drop or click to upload PDFs, DOCX, or TXT files</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-primary-300 rounded-xl p-12 text-center bg-primary-50/50 hover:bg-primary-50 transition-colors cursor-pointer group">
                    <div className="p-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full inline-block mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-lg font-medium text-slate-900 mb-2">Drop your files here</p>
                    <p className="text-slate-600">Supports PDF, DOCX, TXT up to 10MB</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {['Employment Contract', 'User Manual', 'Privacy Policy'].map((doc, index) => (
                      <div key={doc} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <FileText className="h-6 w-6 text-slate-600 mb-2" />
                        <p className="text-sm font-medium text-slate-900">{doc}</p>
                        <p className="text-xs text-slate-500">Sample document</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Chat with Your Document</h3>
                    <p className="text-slate-600">Ask questions and get instant AI-powered answers</p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-6 h-80 overflow-y-auto space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                          message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className={`p-2 rounded-full ${
                            message.type === 'user' 
                              ? 'bg-primary-600' 
                              : 'bg-gradient-to-r from-accent-600 to-purple-600'
                          }`}>
                            {message.type === 'user' ? (
                              <div className="w-5 h-5 bg-white rounded-full"></div>
                            ) : (
                              <Bot className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div className={`p-3 rounded-xl ${
                            message.type === 'user'
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-slate-900 border border-slate-200'
                          }`}>
                            <p className="text-sm whitespace-pre-line">{message.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Ask about vacation days, salary, termination..."
                      className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button className="p-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:shadow-lg transition-all">
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'embed' && (
                <motion.div
                  key="embed"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Embed Anywhere</h3>
                    <p className="text-slate-600">One line of code to add document chat to any website</p>
                  </div>
                  
                  <div className="bg-slate-900 rounded-xl p-6 text-green-400 font-mono text-sm overflow-x-auto">
                    <div className="space-y-2">
                      <div className="text-slate-500">// Add to your website</div>
                      <div>&lt;script src="https://cdn.docubot.ai/sdk.js"&gt;&lt;/script&gt;</div>
                      <div>&lt;script&gt;</div>
                      <div className="ml-4">
                        DocuBot.init({'{'}
                        <div className="ml-4">
                          <div>apiKey: "your_api_key",</div>
                          <div>documentId: "doc_abc123",</div>
                          <div>theme: "dark",</div>
                          <div>position: "bottom-right"</div>
                        </div>
                        {'}'});
                      </div>
                      <div>&lt;/script&gt;</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-slate-800 rounded-xl p-6 relative overflow-hidden">
                      <div className="text-white text-sm mb-4">Preview: Your Website</div>
                      <div className="bg-white rounded-lg p-4 h-32">
                        <div className="h-2 bg-slate-200 rounded mb-2"></div>
                        <div className="h-2 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="p-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                          <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-success-50 to-emerald-50 rounded-lg border border-success-200">
                        <div>
                          <div className="font-medium text-success-800">Widget Active</div>
                          <div className="text-sm text-success-600">Ready to chat</div>
                        </div>
                        <div className="h-3 w-3 bg-success-500 rounded-full animate-pulse"></div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Load Time</span>
                          <span className="font-medium text-slate-900">0.8s</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Bundle Size</span>
                          <span className="font-medium text-slate-900">12.3kb</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Mobile Ready</span>
                          <span className="font-medium text-success-600">✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <span>Try It Now</span>
            <ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Demo;