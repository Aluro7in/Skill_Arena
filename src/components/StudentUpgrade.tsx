import React, { useState } from 'react';
import { Crown, Star, Users, Zap, Shield, CheckCircle, X, Sparkles, TrendingUp, Headphones, CreditCard, Loader, Clock, Database, Globe, Phone, Settings, BarChart3, BookOpen, MessageSquare, Download, Video, Award, Target, Lock, Unlock } from 'lucide-react';
import { stripeService } from '../services/stripe';
import { stripeProducts } from '../stripe-config';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  yearlyPrice?: number;
  originalYearlyPrice?: number;
  period: string;
  popular: boolean;
  recommended?: boolean;
  features: string[];
  restrictions?: string[];
  badge: string;
  color: string;
  icon: React.ComponentType<any>;
  priceId: string;
  yearlyPriceId?: string;
  description: string;
  storage: string;
  support: string;
  trialDays?: number;
  minUsers?: number;
}

const StudentUpgrade: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [teamSize, setTeamSize] = useState(5);

  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: 'freemium',
      name: 'Freemium',
      price: 0,
      yearlyPrice: 0,
      period: '/forever',
      popular: false,
      badge: 'Always Free',
      color: 'from-gray-500 to-gray-600',
      icon: Unlock,
      priceId: '',
      description: 'Perfect for getting started with basic learning',
      storage: '500MB',
      support: 'Email (48h)',
      features: [
        'Access to basic learning materials',
        'Basic tutorials and guides',
        'Community forum access',
        'Basic analytics dashboard',
        'Up to 3 project saves',
        'Maximum 2 concurrent projects',
        'Basic export options'
      ],
      restrictions: [
        'No advanced features or premium content',
        '500MB storage limit',
        'No team collaboration features',
        'Basic export options only',
        'Limited customer support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Individual',
      price: 14.99,
      originalPrice: 19.99,
      yearlyPrice: 149.99,
      originalYearlyPrice: 179.88,
      period: '/month',
      popular: true,
      badge: 'Most Popular',
      color: 'from-purple-500 to-blue-500',
      icon: Star,
      priceId: stripeProducts[0].priceId,
      yearlyPriceId: stripeProducts[1].priceId,
      description: 'Advanced learning with unlimited projects and premium content',
      storage: '50GB',
      support: 'Email (24h)',
      trialDays: 30,
      features: [
        'All Freemium features included',
        'Unlimited project saves',
        'Advanced tutorials & premium content library',
        'Priority email support (24h response)',
        'Advanced analytics and reporting',
        'Custom project templates',
        '50GB storage',
        'Offline access capability',
        'Premium export options',
        'Monthly live workshops',
        'Personal progress tracking',
        'Priority feature requests'
      ]
    },
    {
      id: 'teams',
      name: 'Teams',
      price: 39.99,
      originalPrice: 49.99,
      period: '/user/month',
      popular: false,
      recommended: true,
      badge: 'Best for Teams',
      color: 'from-emerald-500 to-teal-500',
      icon: Users,
      priceId: stripeProducts[2].priceId,
      description: 'Collaborative workspace with advanced team features',
      storage: '500GB Shared',
      support: 'Phone (4h)',
      trialDays: 30,
      minUsers: 5,
      features: [
        'All Premium Individual features',
        'Dedicated account manager',
        'Team workspace with real-time collaboration',
        'Role-based access control (Admin, Manager, Member)',
        'Team analytics dashboard',
        'Custom onboarding training',
        'API access for integrations',
        'SSO integration',
        '500GB shared storage',
        'Advanced security features',
        'Custom reporting and insights',
        'Priority phone support (4h response)',
        'White-label options available',
        'Advanced user management'
      ]
    }
  ];

  const handleSubscription = async (tier: SubscriptionTier) => {
    if (tier.id === 'freemium') return;
    
    setLoading(tier.id);
    setError(null);

    try {
      let priceId = tier.priceId;
      if (billingPeriod === 'yearly' && tier.yearlyPriceId) {
        priceId = tier.yearlyPriceId;
      }
      await stripeService.purchaseProduct(priceId, 'subscription');
    } catch (err: any) {
      setError(err.message || 'Failed to start checkout process');
      console.error('Subscription error:', err);
    } finally {
      setLoading(null);
    }
  };

  const calculateTeamPrice = (basePrice: number) => {
    if (billingPeriod === 'yearly') {
      return (basePrice * 12 * 0.83 * teamSize); // 17% yearly discount
    }
    return basePrice * teamSize;
  };

  const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCost = monthlyPrice * 12;
    return monthlyCost - yearlyPrice;
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-6">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <span className="text-purple-300 font-semibold">Choose Your Learning Journey</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
          Subscription Plans
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          From free learning basics to enterprise-grade team collaboration. Find the perfect plan to accelerate your growth and unlock your potential.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
          <div className="flex space-x-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
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

      {/* Team Size Selector for Teams Plan */}
      <div className="max-w-md mx-auto bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-white mb-2">Team Size Calculator</h3>
          <p className="text-gray-400 text-sm">Adjust team size to see pricing (minimum 5 users)</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTeamSize(Math.max(5, teamSize - 1))}
            className="bg-gray-700 hover:bg-gray-600 text-white w-10 h-10 rounded-lg transition-colors"
          >
            -
          </button>
          <div className="flex-1 text-center">
            <span className="text-2xl font-bold text-white">{teamSize}</span>
            <span className="text-gray-400 text-sm block">users</span>
          </div>
          <button
            onClick={() => setTeamSize(teamSize + 1)}
            className="bg-gray-700 hover:bg-gray-600 text-white w-10 h-10 rounded-lg transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {subscriptionTiers.map((tier) => {
          const Icon = tier.icon;
          const isLoading = loading === tier.id;
          const currentPrice = billingPeriod === 'yearly' && tier.yearlyPrice !== undefined ? tier.yearlyPrice : tier.price;
          const originalPrice = billingPeriod === 'yearly' && tier.originalYearlyPrice !== undefined ? tier.originalYearlyPrice : tier.originalPrice;
          const displayPrice = tier.id === 'teams' ? calculateTeamPrice(tier.price) : currentPrice;
          const displayOriginalPrice = tier.id === 'teams' && tier.originalPrice ? calculateTeamPrice(tier.originalPrice) : originalPrice;
          
          return (
            <div
              key={tier.id}
              className={`relative bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                tier.popular ? 'ring-2 ring-purple-500/50 hover:shadow-purple-500/30' : 
                tier.recommended ? 'ring-2 ring-emerald-500/50 hover:shadow-emerald-500/30' : 
                'hover:shadow-white/10'
              }`}
            >
              {/* Badge */}
              {(tier.popular || tier.recommended) && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`${
                    tier.popular ? 'bg-gradient-to-r from-purple-600 to-blue-600' :
                    'bg-gradient-to-r from-emerald-600 to-teal-600'
                  } text-white px-6 py-2 rounded-full text-sm font-bold`}>
                    {tier.badge}
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${tier.color} mb-4 shadow-2xl`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                
                <div className="mb-4">
                  {displayOriginalPrice && displayOriginalPrice !== displayPrice && (
                    <div className="text-gray-400 line-through text-lg">
                      ${tier.id === 'teams' ? `${displayOriginalPrice.toFixed(0)}` : displayOriginalPrice}
                      {tier.id === 'teams' && billingPeriod === 'monthly' ? '/month' : tier.period}
                    </div>
                  )}
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-4xl font-bold text-white">
                      ${tier.id === 'teams' ? displayPrice.toFixed(0) : displayPrice}
                    </span>
                    <span className="text-gray-400">
                      {tier.id === 'teams' && billingPeriod === 'monthly' ? '/month' : tier.period}
                    </span>
                  </div>
                  {tier.id === 'teams' && (
                    <div className="text-sm text-gray-400 mt-1">
                      ${billingPeriod === 'yearly' ? (displayPrice / teamSize / 12).toFixed(2) : tier.price}/user/month
                    </div>
                  )}
                  {billingPeriod === 'yearly' && tier.yearlyPrice && tier.price > 0 && (
                    <div className="text-green-400 text-sm font-semibold mt-1">
                      Save ${calculateYearlySavings(tier.price, tier.yearlyPrice)}/year
                    </div>
                  )}
                </div>

                {/* Trial Badge */}
                {tier.trialDays && (
                  <div className="inline-flex items-center space-x-2 bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{tier.trialDays}-day free trial</span>
                  </div>
                )}
              </div>

              {/* Storage & Support Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 text-center">
                  <Database className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-white font-semibold text-sm">{tier.storage}</div>
                  <div className="text-gray-400 text-xs">Storage</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 text-center">
                  <Headphones className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-white font-semibold text-sm">{tier.support}</div>
                  <div className="text-gray-400 text-xs">Support</div>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Restrictions for Freemium */}
              {tier.restrictions && (
                <div className="mb-8">
                  <h4 className="text-gray-400 text-sm font-semibold mb-3">Limitations:</h4>
                  <ul className="space-y-2">
                    {tier.restrictions.map((restriction, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <X className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-400 text-sm">{restriction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={() => handleSubscription(tier)}
                disabled={isLoading || tier.id === 'freemium'}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 ${
                  tier.id === 'freemium'
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : tier.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl hover:shadow-purple-500/50'
                    : tier.recommended
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl hover:shadow-emerald-500/50'
                    : 'bg-black/30 backdrop-blur-sm border border-white/10 text-white hover:bg-black/50'
                }`}
              >
                {tier.id === 'freemium' ? (
                  <>
                    <Unlock className="h-5 w-5" />
                    <span>Current Plan</span>
                  </>
                ) : isLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>
                      {tier.trialDays ? `Start ${tier.trialDays}-Day Trial` : 'Subscribe Now'}
                    </span>
                  </>
                )}
              </button>

              {tier.minUsers && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400">
                    Minimum {tier.minUsers} users required
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Feature Comparison */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Detailed Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 text-gray-400 font-semibold">Features</th>
                <th className="text-center py-4 text-white font-semibold">Freemium</th>
                <th className="text-center py-4 text-purple-400 font-semibold">Premium</th>
                <th className="text-center py-4 text-emerald-400 font-semibold">Teams</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                ['Project Saves', '3 projects', 'Unlimited', 'Unlimited'],
                ['Concurrent Projects', '2', 'Unlimited', 'Unlimited'],
                ['Storage', '500MB', '50GB', '500GB shared'],
                ['Premium Content', false, true, true],
                ['Advanced Analytics', false, true, true],
                ['Custom Templates', false, true, true],
                ['Offline Access', false, true, true],
                ['Live Workshops', false, 'Monthly', 'Weekly'],
                ['Support Response', '48 hours', '24 hours', '4 hours'],
                ['Team Collaboration', false, false, true],
                ['Role Management', false, false, true],
                ['API Access', false, false, true],
                ['SSO Integration', false, false, true],
                ['Dedicated Manager', false, false, true],
                ['Custom Onboarding', false, false, true],
                ['Phone Support', false, false, true]
              ].map((row, index) => (
                <tr key={index} className="border-b border-white/10">
                  <td className="py-4 text-gray-300 font-medium">{row[0]}</td>
                  {row.slice(1).map((feature, i) => (
                    <td key={i} className="text-center py-4">
                      {typeof feature === 'boolean' ? (
                        feature ? (
                          <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-white font-medium">{feature}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Policies & Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Shield className="h-6 w-6 text-blue-400 mr-2" />
            Trial & Payment Policies
          </h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>30-day free trial for Premium and Teams tiers</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Instant access upon payment verification</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Prorated refunds for cancellations</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Secure payment via major credit cards</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Monthly/annual billing options available</span>
            </li>
          </ul>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Settings className="h-6 w-6 text-purple-400 mr-2" />
            Account Management
          </h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Automatic renewal with email notifications</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>7-day grace period for failed payments</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Data retention for 30 days after downgrade</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Easy plan upgrades and downgrades</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Cancel anytime with immediate effect</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Security & Trust */}
      <div className="bg-gradient-to-r from-green-600/10 via-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
        <Shield className="h-12 w-12 mx-auto mb-4 text-green-400" />
        <h3 className="text-xl font-bold text-white mb-4">Enterprise-Grade Security</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Your data is protected with bank-level encryption, SOC 2 compliance, and regular security audits. We never store payment information and use Stripe for secure processing.
        </p>
        <div className="flex justify-center items-center space-x-8 text-gray-400">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>SOC 2 Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>GDPR Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>PCI DSS</span>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: 'What happens during the free trial?',
              answer: 'You get full access to all premium features for 30 days. No credit card required to start, and you can cancel anytime before the trial ends.'
            },
            {
              question: 'Can I change plans anytime?',
              answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes are prorated and take effect immediately.'
            },
            {
              question: 'What payment methods do you accept?',
              answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover) and PayPal through our secure Stripe integration.'
            },
            {
              question: 'How does team billing work?',
              answer: 'Teams are billed per user with a minimum of 5 users. You can add or remove team members monthly, and billing adjusts accordingly.'
            },
            {
              question: 'Is my data safe when I downgrade?',
              answer: 'Yes, we retain your data for 30 days after downgrading, giving you time to upgrade again or export your information.'
            },
            {
              question: 'Do you offer refunds?',
              answer: 'Yes, we offer prorated refunds for annual subscriptions and full refunds within the first 30 days of any new subscription.'
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
      <div className="text-center bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-emerald-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
        <Crown className="h-16 w-16 mx-auto mb-6 text-purple-400" />
        <h3 className="text-3xl font-bold text-white mb-4">Ready to Accelerate Your Growth?</h3>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of learners and teams who have transformed their skills with our comprehensive platform.
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => handleSubscription(subscriptionTiers[1])} // Premium plan
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 flex items-center space-x-2"
          >
            <Star className="h-5 w-5" />
            <span>Start Premium Trial</span>
          </button>
          <button 
            onClick={() => handleSubscription(subscriptionTiers[2])} // Teams plan
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105 flex items-center space-x-2"
          >
            <Users className="h-5 w-5" />
            <span>Start Teams Trial</span>
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          Need help choosing? <button className="text-purple-400 hover:text-purple-300 transition-colors">Contact our sales team</button>
        </p>
      </div>
    </div>
  );
};

export default StudentUpgrade;