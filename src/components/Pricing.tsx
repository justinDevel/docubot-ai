import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Building } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: '$29',
    period: '/month',
    description: 'Perfect for small teams and side projects',
    features: [
      '1,000 document pages/month',
      '5,000 chat messages/month',
      'Basic analytics',
      'Email support',
      'Standard SDK',
      '99.9% uptime SLA'
    ],
    buttonText: 'Start Free Trial',
    popular: false,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Professional',
    icon: Star,
    price: '$99',
    period: '/month',
    description: 'Ideal for growing businesses and teams',
    features: [
      '10,000 document pages/month',
      '50,000 chat messages/month',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
      'Webhook integrations',
      'API access',
      '99.95% uptime SLA'
    ],
    buttonText: 'Start Free Trial',
    popular: true,
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Enterprise',
    icon: Building,
    price: 'Custom',
    period: '',
    description: 'For large organizations with specific needs',
    features: [
      'Unlimited document pages',
      'Unlimited chat messages',
      'Custom AI models',
      'Dedicated support',
      'White-label solution',
      'Advanced security',
      'Custom integrations',
      '99.99% uptime SLA'
    ],
    buttonText: 'Contact Sales',
    popular: false,
    color: 'from-emerald-500 to-teal-500'
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
            <Star className="h-4 w-4 mr-2" />
            Simple Pricing
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            Choose Your{' '}
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            Start free, scale as you grow. All plans include our core features 
            and world-class support.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`h-full p-8 bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 ${
                plan.popular ? 'border-primary-300 shadow-xl' : 'border-slate-200 hover:border-primary-200'
              } transition-all duration-300`}>
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`p-3 bg-gradient-to-r ${plan.color} rounded-xl inline-block mb-4`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600 ml-1">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-success-500" />
                      </div>
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {plan.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              All Plans Include
            </h3>
            <p className="text-slate-600">
              Core features available in every plan
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'AWS Lambda Architecture',
              'Amazon Bedrock AI',
              'Real-time Chat',
              'Document Insights',
              'Mobile SDK',
              'REST API',
              'Webhook Support',
              '24/7 Monitoring'
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center space-x-2"
              >
                <Check className="h-5 w-5 text-success-500 flex-shrink-0" />
                <span className="text-slate-700 text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Questions about pricing?
          </h3>
          <p className="text-slate-600 mb-6">
            Our sales team is here to help you find the perfect plan for your needs.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white text-slate-700 rounded-lg border-2 border-slate-200 hover:border-primary-300 transition-all duration-200 font-medium"
          >
            Contact Sales
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;