import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar,
  CreditCard,
  Activity,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const metrics = [
  { id: 1, label: 'Total Patients', value: 2847, change: 12, icon: Users, color: 'from-blue-500 to-blue-700' },
  { id: 2, label: 'Appointments', value: 156, change: 8, icon: Calendar, color: 'from-green-500 to-green-700' },
  { id: 3, label: 'Lab Tests', value: 423, change: 15, icon: Activity, color: 'from-purple-500 to-purple-700' },
  { id: 4, label: 'Revenue', value: '₦12.4M', change: 23, icon: CreditCard, color: 'from-amber-500 to-amber-700' },
];

const departmentStats = [
  { name: 'General Medicine', patients: 456, appointments: 89, revenue: 3200000 },
  { name: 'Cardiology', patients: 234, appointments: 67, revenue: 5400000 },
  { name: 'Pediatrics', patients: 389, appointments: 112, revenue: 2800000 },
  { name: 'Laboratory', patients: 0, appointments: 0, revenue: 1800000 },
  { name: 'Pharmacy', patients: 0, appointments: 0, revenue: 4200000 },
];

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  dateRange === range ? "bg-white text-royal-600 shadow-sm" : "text-gray-500"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-5">
        {metrics.map((metric) => (
          <div key={metric.id} className="premium-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center", metric.color)}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                +{metric.change}%
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</h3>
            <p className="text-sm text-gray-500">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Patient Trends */}
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Patient Trends</h3>
            <Button variant="ghost" size="sm">View Details</Button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 78, 52, 89, 95, 110, 125].map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-royal-500 to-royal-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${value * 1.5}px` }}
                />
                <span className="text-xs text-gray-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Revenue Breakdown</h3>
            <Button variant="ghost" size="sm">View Details</Button>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Consultations', value: 45, amount: 5600000, color: 'bg-royal-500' },
              { label: 'Laboratory', value: 25, amount: 3100000, color: 'bg-purple-500' },
              { label: 'Pharmacy', value: 20, amount: 2480000, color: 'bg-green-500' },
              { label: 'Procedures', value: 10, amount: 1240000, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">₦{item.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="premium-card overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Department Performance</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Department</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Patients</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Appointments</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Revenue</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Performance</th>
            </tr>
          </thead>
          <tbody>
            {departmentStats.map((dept) => (
              <tr key={dept.name} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{dept.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">{dept.patients > 0 ? dept.patients.toLocaleString() : '-'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">{dept.appointments > 0 ? dept.appointments.toLocaleString() : '-'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">₦{dept.revenue.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-royal-500 to-royal-400"
                        style={{ width: `${Math.min((dept.revenue / 5400000) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{Math.round((dept.revenue / 5400000) * 100)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
