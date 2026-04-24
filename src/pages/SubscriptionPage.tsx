import { useState } from 'react';
import { 
  CheckCircle2,
  Download,
  Calendar,
  Users,
  Database,
  AlertCircle,
  Zap,
  Building2,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { Subscription, Invoice } from '@/types/rbac';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small clinics',
    monthlyPrice: 50000,
    annualPrice: 450000,
    features: [
      'Up to 10 staff members',
      'Up to 1,000 patients',
      '10 GB storage',
      'Basic analytics',
      'Email support',
    ],
    notIncluded: [
      'Multi-branch support',
      'Advanced analytics',
      'API access',
      'Dedicated account manager',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing hospitals',
    monthlyPrice: 150000,
    annualPrice: 1350000,
    popular: true,
    features: [
      'Up to 50 staff members',
      'Up to 10,000 patients',
      '100 GB storage',
      'Advanced analytics',
      'Priority support',
      'Multi-branch support',
      'API access',
    ],
    notIncluded: [
      'Dedicated account manager',
      'Custom integrations',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large hospital networks',
    monthlyPrice: 500000,
    annualPrice: 4500000,
    features: [
      'Unlimited staff members',
      'Unlimited patients',
      '1 TB storage',
      'Enterprise analytics',
      '24/7 dedicated support',
      'Multi-branch support',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
    notIncluded: [],
  },
];

const mockSubscription: Subscription = {
  id: 'sub-001',
  hospitalId: 'h1',
  plan: 'professional',
  billingCycle: 'annual',
  basePrice: 1350000,
  perUserPrice: 0,
  totalPrice: 1350000,
  maxUsers: 50,
  maxPatients: 10000,
  maxStorageGB: 100,
  currentUsers: 42,
  currentPatients: 2847,
  currentStorageGB: 45.2,
  status: 'active',
  autoRenew: true,
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  nextBillingDate: '2026-12-01',
};

const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-001',
    hospitalId: 'h1',
    subscriptionId: 'sub-001',
    subtotal: 1350000,
    tax: 67500,
    discount: 0,
    total: 1417500,
    description: 'Annual Professional Plan - 2026',
    lineItems: [
      { description: 'Professional Plan (Annual)', quantity: 1, unitPrice: 1350000, total: 1350000 },
      { description: 'VAT (5%)', quantity: 1, unitPrice: 67500, total: 67500 },
    ],
    status: 'paid',
    paidAt: '2026-01-01T10:30:00Z',
    issueDate: '2026-01-01',
    dueDate: '2026-01-15',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-002',
    hospitalId: 'h1',
    subscriptionId: 'sub-001',
    subtotal: 50000,
    tax: 2500,
    discount: 0,
    total: 52500,
    description: 'Additional Storage - 50GB',
    lineItems: [
      { description: 'Storage Upgrade (50GB)', quantity: 1, unitPrice: 50000, total: 50000 },
      { description: 'VAT (5%)', quantity: 1, unitPrice: 2500, total: 2500 },
    ],
    status: 'paid',
    paidAt: '2026-02-15T14:20:00Z',
    issueDate: '2026-02-15',
    dueDate: '2026-03-01',
  },
];

const paymentMethods = [
  { id: 'pm-001', type: 'card' as const, brand: 'Visa', last4: '4242', expiryMonth: 12, expiryYear: 2027, isDefault: true },
];

export function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [autoRenew, setAutoRenew] = useState(mockSubscription.autoRenew);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const usagePercentages = {
    users: (mockSubscription.currentUsers / mockSubscription.maxUsers) * 100,
    patients: (mockSubscription.currentPatients / mockSubscription.maxPatients) * 100,
    storage: (mockSubscription.currentStorageGB / mockSubscription.maxStorageGB) * 100,
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription & Billing</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your plan, usage, and payment methods
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-royal-500 to-royal-700 text-white gap-2"
          onClick={() => setShowUpgradeModal(true)}
        >
          <Zap className="w-4 h-4" />
          Upgrade Plan
        </Button>
      </div>

      {/* Current Plan Card */}
      <div className="premium-card overflow-hidden">
        <div className="bg-gradient-to-r from-royal-500 to-royal-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">
                  Current Plan
                </span>
                <span className="px-3 py-1 rounded-full bg-green-400/30 text-green-300 text-sm font-medium">
                  Active
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-1">Professional</h2>
              <p className="text-white/70">Billed annually • Renews on Dec 1, 2026</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">₦1,417,500</p>
              <p className="text-white/70">per year</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Usage Stats */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Staff Members</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {mockSubscription.currentUsers} / {mockSubscription.maxUsers}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    usagePercentages.users > 80 ? "bg-red-500" : "bg-royal-500"
                  )}
                  style={{ width: `${usagePercentages.users}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Patients</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {mockSubscription.currentPatients.toLocaleString()} / {mockSubscription.maxPatients.toLocaleString()}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${usagePercentages.patients}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Storage</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {mockSubscription.currentStorageGB} GB / {mockSubscription.maxStorageGB} GB
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-amber-500 transition-all"
                  style={{ width: `${usagePercentages.storage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Auto Renew */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Auto-Renewal</p>
                <p className="text-sm text-gray-500">Your subscription will automatically renew</p>
              </div>
            </div>
            <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="premium-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Payment Methods</h3>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Method
          </Button>
        </div>

        <div className="space-y-3">
          {paymentMethods.map((pm) => (
            <div key={pm.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 rounded bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{pm.brand} ending in {pm.last4}</p>
                  <p className="text-sm text-gray-500">Expires {pm.expiryMonth}/{pm.expiryYear}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {pm.isDefault && (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    Default
                  </span>
                )}
                <button className="p-2 rounded-lg hover:bg-gray-200 text-gray-400">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice History */}
      <div className="premium-card overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Invoice History</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Invoice #</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-royal-600">{invoice.invoiceNumber}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">{invoice.description}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{invoice.issueDate}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">₦{invoice.total.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit",
                    invoice.status === 'paid' ? "bg-green-100 text-green-700" :
                    invoice.status === 'pending' ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {invoice.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> :
                     invoice.status === 'pending' ? <Calendar className="w-3 h-3" /> :
                     <AlertCircle className="w-3 h-3" />}
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-auto py-8">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl p-8 animate-page-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
                <p className="text-sm text-gray-500 mt-1">Select the plan that best fits your needs</p>
              </div>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <span className="text-gray-400 text-xl">&times;</span>
              </button>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-8">
              <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={cn(
                    "px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
                    billingCycle === 'monthly' ? "bg-white text-royal-600 shadow-sm" : "text-gray-500"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={cn(
                    "px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                    billingCycle === 'annual' ? "bg-white text-royal-600 shadow-sm" : "text-gray-500"
                  )}
                >
                  Annual
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                    Save 25%
                  </span>
                </button>
              </div>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={cn(
                    "rounded-2xl p-6 transition-all",
                    plan.popular 
                      ? "bg-gradient-to-b from-royal-500 to-royal-700 text-white ring-4 ring-royal-200" 
                      : "bg-white border-2 border-gray-100 hover:border-royal-200"
                  )}
                >
                  {plan.popular && (
                    <div className="mb-4">
                      <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className={cn("text-xl font-bold mb-1", plan.popular ? "text-white" : "text-gray-900")}>
                    {plan.name}
                  </h3>
                  <p className={cn("text-sm mb-4", plan.popular ? "text-white/70" : "text-gray-500")}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className={cn("text-4xl font-bold", plan.popular ? "text-white" : "text-gray-900")}>
                      ₦{billingCycle === 'annual' ? plan.annualPrice.toLocaleString() : plan.monthlyPrice.toLocaleString()}
                    </span>
                    <span className={cn("text-sm", plan.popular ? "text-white/70" : "text-gray-500")}>
                      /{billingCycle === 'annual' ? 'year' : 'month'}
                    </span>
                  </div>

                  <Button 
                    className={cn(
                      "w-full mb-6",
                      plan.popular 
                        ? "bg-white text-royal-600 hover:bg-gray-100" 
                        : "bg-gradient-to-r from-royal-500 to-royal-700 text-white"
                    )}
                  >
                    {plan.id === mockSubscription.plan ? 'Current Plan' : 'Upgrade'}
                  </Button>

                  <div className="space-y-3">
                    <p className={cn("text-sm font-medium", plan.popular ? "text-white" : "text-gray-700")}>
                      Features included:
                    </p>
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className={cn("w-4 h-4", plan.popular ? "text-white" : "text-green-500")} />
                        <span className={cn("text-sm", plan.popular ? "text-white/90" : "text-gray-600")}>
                          {feature}
                        </span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 opacity-50">
                        <span className={cn("w-4 h-4 rounded-full border-2", plan.popular ? "border-white/50" : "border-gray-300")} />
                        <span className={cn("text-sm", plan.popular ? "text-white/60" : "text-gray-400")}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
