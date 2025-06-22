import React, { useState } from 'react';
import { Crown, Zap, Star, Trophy, Target, Users, BookOpen, Award, CheckCircle, X, Sparkles, TrendingUp, Shield, Headphones, CreditCard, Loader } from 'lucide-react';
import { stripeService } from '../services/stripe';

interface UpgradePlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  popular: boolean;
  features: string[];
  badge: string;
  color: string;
  icon: React.ComponentType<any>;
  stripeProductId: string;
  stripePriceId: string;
}

const StudentUpgrade: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans: UpgradePlan[] = [
    {
      id: 'student',
      name: 'Student Plus',
      price: billingPeriod === 'monthly' ? 9.99 : 99.99,
      originalPrice: billingPeriod === 'monthly' ? 14.99 : 149.99,
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      popular: false,
      badge: 'Student Discount',
      color: 'from-green-500 to-emerald-500',
      icon: BookOpen,
      stripeProductId: 'prod_student',
      stripePriceId: billingPeriod === 'monthly' ? 'price_student_monthly' : 'price_student_yearly',
      features: [
        'Unlimited skill access',
        'Premium tutorials',
        'Priority support',
        'Certificate of completion',
        'Study groups access',
        'Mobile app access'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Tester',
      price: billingPeriod === 'monthly' ? 19.99 : 199.99,
      originalPrice: billingPeriod === 'monthly' ? 29.99 : 299.99,
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      popular: true,
      badge: 'Most Popular',
      color: 'from-purple-500 to-blue-500',
      icon: Target,
      stripeProductId: 'prod_pro',
      stripePriceId: billingPeriod === 'monthly' ? 'price_pro_monthly' : 'price_pro_yearly',
      features: [
        'Everything in Student Plus',
        'Exclusive game testing opportunities',
        'Higher compensation rates',
        'Direct studio partnerships',
        'Advanced analytics dashboard',
        'Professional tester certification',
        'Priority job matching',
        'Mentor program access'
      ]
    },
    {
      id: 'elite',
      name: 'Elite Professional',
      price: billingPeriod === 'monthly' ? 39.99 : 399.99,
      originalPrice: billingPeriod === 'monthly' ? 59.99 : 599.99,
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      popular: false,
      badge: 'Premium',
      color: 'from-yellow-500 to-orange-500',
      icon: Crown,
      stripeProductId: 'prod_elite',
      stripePriceId: billingPeriod === 'monthly' ? 'price_elite_monthly' : 'price_elite_yearly',
      features: [
        'Everything in Pro Tester',
        'VIP studio access',
        'Custom learning paths',
        'Personal career coach',
        'Industry networking events',
        'Beta testing for AAA titles',
        'Revenue sharing opportunities',
        'White-glove support',
        'Annual conference tickets'
      ]
    }
  ];

  const handleSubscription = async (plan: UpgradePlan) => {
    setLoading(plan.id);
    setError(null);

    try {
      await stripeService.initialize();
      
      const session = await stripeService.createCheckoutSession({
        mode: 'subscription',
        lineItems: [
          {
            price: plan.stripePriceId,
            quantity: 1,
          },
        ],
        successUrl: `${window.location.origin}/profile?session_id={CHECKOUT_SESSION_ID}&plan=${plan.id}`,
        cancelUrl: `${window.location.origin}/student-upgrade`,
        customerEmail: 'alex@example.com', // This would come from the user context
        metadata: {
          planId: plan.id,
          planName: plan.name,
          userId: '1', // This would come from the user context
        },
      });

      await stripeService.redirectToCheckout(session.id);
    } catch (err: any) {
      setError(err.message || 'Failed to start checkout process');
      console.error('Subscription error:', err);
    } finally {
      setLoading(null);
    }
  };

  const achievements = [
    { icon: Trophy, title: 'Top 1% of Testers', description: 'Join the elite testing community' },
    { icon: Star, title: 'Verified Professional', description: 'Get your professional badge' },
    { icon: Users, title: 'Studio Partnerships', description: 'Direct access to game studios' },
    { icon: TrendingUp, title: 'Career Growth', description: 'Fast-track your testing career' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'QA Lead at Ubisoft',
      avatar: '👩‍💻',
      quote: 'SkillArena Pro helped me land my dream job in just 6 months. The studio connections are invaluable!'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Senior Game Tester',
      avatar: '👨‍🎮',
      quote: 'The exclusive opportunities and higher pay rates made the upgrade worth every penny.'
    },
    {
      name: 'Emily Davis',
      role: 'VR Testing Specialist',
      avatar: '👩‍🚀',
      quote: 'Elite tier gave me access to cutting-edge VR projects I never would have found elsewhere.'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-6">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <span className="text-purple-300 font-semibold">Unlock Your Potential</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
          Level Up Your Learning
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Transform your passion for gaming into a professional career with exclusive opportunities, premium features, and direct access to top game studios.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
              billingPeriod === 'monthly'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-3 rounded-xl transition-all duration-300 relative ${
              billingPeriod === 'yearly'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Save 33%
            </span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto bg-red-600/20 border border-red-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <X className="h-5 w-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isLoading = loading === plan.id;
          
          return (
            <div
              key={plan.id}
              className={`relative bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                plan.popular ? 'ring-2 ring-purple-500/50 hover:shadow-purple-500/30' : 'hover:shadow-white/10'
              } ${selectedPlan === plan.id ? 'ring-2 ring-purple-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} mb-4 shadow-2xl`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {plan.originalPrice && (
                    <span className="text-gray-400 line-through text-lg">${plan.originalPrice}</span>
                  )}
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div className="text-green-400 text-sm font-semibold">
                    Save ${plan.originalPrice - plan.price}{billingPeriod === 'monthly' ? '/month' : '/year'}
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscription(plan)}
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl hover:shadow-purple-500/50'
                    : 'bg-black/30 backdrop-blur-sm border border-white/10 text-white hover:bg-black/50'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Subscribe Now</span>
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                  Secure payment powered by Stripe
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Security */}
      <div className="bg-gradient-to-r from-green-600/10 via-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
        <Shield className="h-12 w-12 mx-auto mb-4 text-green-400" />
        <h3 className="text-xl font-bold text-white mb-4">Secure & Safe Payments</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Your payment information is processed securely through Stripe. We never store your credit card details on our servers.
        </p>
        <div className="flex justify-center items-center space-x-8 text-gray-400">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Stripe Secured</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>30-Day Guarantee</span>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-white text-center mb-8">Unlock Premium Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{achievement.title}</h4>
                <p className="text-gray-400 text-sm">{achievement.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-8">Success Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="text-4xl mb-4">{testimonial.avatar}</div>
              <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
              <div>
                <div className="font-bold text-white">{testimonial.name}</div>
                <div className="text-purple-400 text-sm">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Compare All Features</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 text-gray-400">Features</th>
                <th className="text-center py-4 text-white">Free</th>
                <th className="text-center py-4 text-green-400">Student Plus</th>
                <th className="text-center py-4 text-purple-400">Pro Tester</th>
                <th className="text-center py-4 text-yellow-400">Elite</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                ['Basic Skills Access', true, true, true, true],
                ['Premium Tutorials', false, true, true, true],
                ['Game Testing Opportunities', 'Limited', true, true, true],
                ['Certificate Programs', false, true, true, true],
                ['Studio Partnerships', false, false, true, true],
                ['Personal Coach', false, false, false, true],
                ['Priority Support', false, true, true, true],
                ['Industry Events', false, false, false, true]
              ].map((row, index) => (
                <tr key={index} className="border-b border-white/10">
                  <td className="py-4 text-gray-300">{row[0]}</td>
                  {row.slice(1).map((feature, i) => (
                    <td key={i} className="text-center py-4">
                      {typeof feature === 'boolean' ? (
                        feature ? (
                          <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-400">{feature}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: 'Can I switch plans anytime?',
              answer: 'Yes, you can upgrade or downgrade your plan at any time through your account settings. Changes take effect immediately.'
            },
            {
              question: 'Is there a student discount?',
              answer: 'Yes! All our plans include automatic student pricing with valid student verification.'
            },
            {
              question: 'What if I\'m not satisfied?',
              answer: 'We offer a 30-day money-back guarantee on all premium plans. Contact support for a full refund.'
            },
            {
              question: 'Do I keep my progress if I cancel?',
              answer: 'Yes, your learning progress and completed courses remain in your account forever, even after cancellation.'
            },
            {
              question: 'How secure are the payments?',
              answer: 'All payments are processed securely through Stripe with industry-standard encryption. We never store your payment information.'
            },
            {
              question: 'Can I pause my subscription?',
              answer: 'Yes, you can pause your subscription for up to 3 months through the customer portal without losing your benefits.'
            }
          ].map((faq, index) => (
            <div key={index} className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="font-bold text-white mb-2">{faq.question}</h4>
              <p className="text-gray-300 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
        <Crown className="h-16 w-16 mx-auto mb-6 text-purple-400" />
        <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Future?</h3>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of students who have already launched successful careers in game testing and development.
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => handleSubscription(plans[1])} // Pro plan
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 flex items-center space-x-2"
          >
            <CreditCard className="h-5 w-5" />
            <span>Start Pro Plan</span>
          </button>
          <button className="bg-black/30 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black/50 transition-all flex items-center space-x-2">
            <Headphones className="h-5 w-5" />
            <span>Contact Sales</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentUpgrade;