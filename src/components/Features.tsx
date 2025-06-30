import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  MessageCircle, 
  Bot, 
  Zap, 
  Shield, 
  Globe, 
  Code, 
  BarChart3,
  Upload,
  Search,
  Sparkles,
  Layers
} from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Smart Document Upload',
    description: 'Drag & drop PDFs, DOCX, TXT files. Instant processing with AWS Lambda for lightning-fast ingestion.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: MessageCircle,
    title: 'AI-Powered Chat',
    description: 'Chat naturally with your documents using Amazon Bedrock. Get instant answers, summaries, and insights.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Bot,
    title: 'Embeddable Widget',
    description: 'One-line integration SDK. Beautiful floating chat widget that works on any website or app.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Zap,
    title: 'Serverless Architecture',
    description: 'Built on AWS Lambda & API Gateway. Scales automatically from zero to millions of requests.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Search,
    title: 'Intelligent Search',
    description: 'Semantic search across document content. Find relevant information instantly with AI understanding.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: BarChart3,
    title: 'Document Insights',
    description: 'Auto-generated summaries, key entities, sentiment analysis, and reading time estimates.',
    color: 'from-teal-500 to-blue-500'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC2 compliant. End-to-end encryption. Your documents are processed securely and never stored permanently.',
    color: 'from-slate-500 to-gray-500'
  },
  {
    icon: Code,
    title: 'Developer-First',
    description: 'RESTful APIs, webhooks, and comprehensive SDK. Build custom integrations with full documentation.',
    color: 'from-violet-500 to-purple-500'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
            <Sparkles className="h-4 w-4 mr-2" />
            Powerful Features
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            Everything You Need to Build
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Document Intelligence
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            From upload to deployment, DocuBot.AI provides all the tools you need to create 
            intelligent document experiences for your users.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="h-full p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 hover:border-primary-300 transition-all duration-300 hover:shadow-xl">
                <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-600/10"></div>
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium text-white mb-4">
                  <Layers className="h-4 w-4 mr-2" />
                  Serverless Architecture
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                  Built for Scale with AWS
                </h3>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  Every component runs on AWS serverless infrastructure for maximum scalability, 
                  reliability, and cost-effectiveness.
                </p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'AWS Lambda', desc: 'Serverless Compute' },
                  { name: 'API Gateway', desc: 'RESTful APIs' },
                  { name: 'Amazon S3', desc: 'Document Storage' },
                  { name: 'Amazon Bedrock', desc: 'AI/ML Models' }
                ].map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="text-white font-semibold mb-1">{tech.name}</div>
                    <div className="text-slate-400 text-sm">{tech.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;