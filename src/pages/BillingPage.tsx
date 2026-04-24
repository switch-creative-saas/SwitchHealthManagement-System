import { useState } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  MoreHorizontal,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const invoices = [
  { id: 'INV-2026-001', patient: 'Adebayo Johnson', amount: 45000, paid: 45000, balance: 0, date: '2026-02-23', status: 'paid', method: 'Insurance' },
  { id: 'INV-2026-002', patient: 'Chioma Okonkwo', amount: 28000, paid: 15000, balance: 13000, date: '2026-02-22', status: 'partial', method: 'Cash' },
  { id: 'INV-2026-003', patient: 'Emmanuel Adeyemi', amount: 125000, paid: 0, balance: 125000, date: '2026-02-21', status: 'pending', method: 'Insurance' },
  { id: 'INV-2026-004', patient: 'Fatima Abdullahi', amount: 32000, paid: 32000, balance: 0, date: '2026-02-20', status: 'paid', method: 'Card' },
];

const stats = [
  { label: 'Total Revenue', value: '₦2.4M', change: '+12%', color: 'bg-green-500' },
  { label: 'Pending', value: '₦456K', change: '+5%', color: 'bg-amber-500' },
  { label: 'Overdue', value: '₦128K', change: '-3%', color: 'bg-red-500' },
  { label: 'Insurance Claims', value: '₦1.2M', change: '+8%', color: 'bg-blue-500' },
];

export function BillingPage() {
  const [activeTab, setActiveTab] = useState('invoices');

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Insurance</h1>
          <p className="text-sm text-gray-500 mt-1">
            Invoices, payments, and insurance claims
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-royal-500 to-royal-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="premium-card p-5">
            <div className="flex items-center justify-between mb-2">
              <div className={cn("w-3 h-3 rounded-full", stat.color)} />
              <span className="text-xs font-medium text-green-600">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {[
          { id: 'invoices', label: 'Invoices' },
          { id: 'payments', label: 'Payments' },
          { id: 'claims', label: 'Insurance Claims' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-white text-royal-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Search invoices..."
            className="pl-12 py-3 rounded-xl"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      {/* Invoices Table */}
      <div className="premium-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Invoice #</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Paid</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Balance</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-royal-600">{inv.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{inv.patient}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">₦{inv.amount.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-green-600">₦{inv.paid.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-sm font-medium",
                    inv.balance > 0 ? "text-red-600" : "text-gray-500"
                  )}>
                    ₦{inv.balance.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit",
                    inv.status === 'paid' ? "bg-green-100 text-green-700" :
                    inv.status === 'partial' ? "bg-amber-100 text-amber-700" :
                    "bg-gray-100 text-gray-600"
                  )}>
                    {inv.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> :
                     inv.status === 'partial' ? <Clock className="w-3 h-3" /> :
                     <XCircle className="w-3 h-3" />}
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {inv.method === 'Insurance' && <Shield className="w-4 h-4 text-blue-500" />}
                    <span className="text-sm text-gray-600">{inv.method}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
