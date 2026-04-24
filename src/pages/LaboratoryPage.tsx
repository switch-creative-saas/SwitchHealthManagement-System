import { useState } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  TrendingUp,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const tabs = [
  { id: 'orders', label: 'Lab Orders', count: 18 },
  { id: 'results', label: 'Results', count: 42 },
  { id: 'templates', label: 'Templates', count: 156 },
];

const labOrders = [
  { id: 'LAB-2026-001', patient: 'Adebayo Johnson', uhin: 'SH-NG-LAG-001', tests: ['CBC', 'Lipid Panel', 'HbA1c'], ordered: '2026-02-23', priority: 'routine', status: 'pending' },
  { id: 'LAB-2026-002', patient: 'Chioma Okonkwo', uhin: 'SH-NG-LAG-002', tests: ['Urinalysis', 'Thyroid Function'], ordered: '2026-02-23', priority: 'urgent', status: 'processing' },
  { id: 'LAB-2026-003', patient: 'Emmanuel Adeyemi', uhin: 'SH-NG-ABJ-003', tests: ['Cardiac Enzymes', 'Troponin'], ordered: '2026-02-22', priority: 'stat', status: 'completed' },
  { id: 'LAB-2026-004', patient: 'Fatima Abdullahi', uhin: 'SH-NG-KAN-004', tests: ['Liver Function', 'Renal Function'], ordered: '2026-02-22', priority: 'routine', status: 'pending' },
];

const labResults = [
  { id: 1, test: 'HbA1c', patient: 'Adebayo Johnson', value: '7.2%', reference: '4.0-6.5%', status: 'abnormal', date: '2026-02-20', trend: 'up' },
  { id: 2, test: 'Total Cholesterol', patient: 'Chioma Okonkwo', value: '195 mg/dL', reference: '<200 mg/dL', status: 'normal', date: '2026-02-19', trend: 'stable' },
  { id: 3, test: 'Glucose (Fasting)', patient: 'Emmanuel Adeyemi', value: '142 mg/dL', reference: '70-100 mg/dL', status: 'abnormal', date: '2026-02-18', trend: 'up' },
  { id: 4, test: 'WBC Count', patient: 'Fatima Abdullahi', value: '7.5 K/uL', reference: '4.5-11.0 K/uL', status: 'normal', date: '2026-02-17', trend: 'stable' },
];

export function LaboratoryPage() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laboratory</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage lab orders, results, and test templates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-royal-500 to-royal-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="premium-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-xs text-gray-500">Processing</p>
            </div>
          </div>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-xs text-gray-500">Completed Today</p>
            </div>
          </div>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-xs text-gray-500">Critical Results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-white text-royal-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs",
              activeTab === tab.id ? "bg-royal-100 text-royal-700" : "bg-gray-200 text-gray-600"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Search by patient, order ID, or test..."
            className="pl-12 py-3 rounded-xl"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Lab Orders */}
      {activeTab === 'orders' && (
        <div className="premium-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tests</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {labOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-royal-600">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.patient}</p>
                      <p className="text-xs text-gray-500">{order.uhin}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {order.tests.map((test) => (
                        <span key={test} className="px-2 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs">
                          {test}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium uppercase",
                      order.priority === 'stat' ? "bg-red-100 text-red-700" :
                      order.priority === 'urgent' ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      order.status === 'completed' ? "bg-green-100 text-green-700" :
                      order.status === 'processing' ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {order.status}
                    </span>
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
      )}

      {/* Lab Results */}
      {activeTab === 'results' && (
        <div className="premium-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Test</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Result</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody>
              {labResults.map((result) => (
                <tr key={result.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{result.test}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{result.patient}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "font-semibold",
                      result.status === 'abnormal' ? "text-red-600" : "text-gray-900"
                    )}>
                      {result.value}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{result.reference}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit",
                      result.status === 'abnormal' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    )}>
                      {result.status === 'abnormal' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {result.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className={cn(
                        "w-4 h-4",
                        result.trend === 'up' ? "text-red-500" : "text-green-500"
                      )} />
                      <span className="text-xs text-gray-500 capitalize">{result.trend}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
