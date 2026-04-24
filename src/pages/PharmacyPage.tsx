import { useState } from 'react';
import { 
  Pill, 
  Plus, 
  Search, 
  Package,
  AlertTriangle,
  TrendingDown,
  ShoppingCart,
  MoreHorizontal,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const inventory = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Analgesic', stock: 245, reorderLevel: 50, unitPrice: 250, expiry: '2027-06-15', status: 'adequate' },
  { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 32, reorderLevel: 40, unitPrice: 450, expiry: '2026-12-20', status: 'low' },
  { id: 3, name: 'Metformin 500mg', category: 'Antidiabetic', stock: 189, reorderLevel: 60, unitPrice: 380, expiry: '2027-03-10', status: 'adequate' },
  { id: 4, name: 'Amlodipine 5mg', category: 'Antihypertensive', stock: 12, reorderLevel: 30, unitPrice: 520, expiry: '2026-11-05', status: 'critical' },
  { id: 5, name: 'Ibuprofen 400mg', category: 'NSAID', stock: 156, reorderLevel: 40, unitPrice: 280, expiry: '2027-08-22', status: 'adequate' },
];

const recentDispensations = [
  { id: 1, patient: 'Adebayo Johnson', medication: 'Metformin 500mg', quantity: 30, date: '2026-02-23', pharmacist: 'Pharm. Amina' },
  { id: 2, patient: 'Chioma Okonkwo', medication: 'Paracetamol 500mg', quantity: 20, date: '2026-02-23', pharmacist: 'Pharm. John' },
  { id: 3, patient: 'Emmanuel Adeyemi', medication: 'Amlodipine 5mg', quantity: 30, date: '2026-02-22', pharmacist: 'Pharm. Amina' },
];

export function PharmacyPage() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pharmacy</h1>
          <p className="text-sm text-gray-500 mt-1">
            Inventory management and medication dispensing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-royal-500 to-royal-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="premium-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-xs text-gray-500">Total Items</p>
            </div>
          </div>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">8</p>
              <p className="text-xs text-gray-500">Low Stock</p>
            </div>
          </div>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">3</p>
              <p className="text-xs text-gray-500">Expiring Soon</p>
            </div>
          </div>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-xs text-gray-500">Dispensed Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {[
          { id: 'inventory', label: 'Inventory' },
          { id: 'dispensations', label: 'Dispensations' },
          { id: 'orders', label: 'Purchase Orders' },
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

      {/* Inventory */}
      {activeTab === 'inventory' && (
        <>
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Search medications..."
                className="pl-12 py-3 rounded-xl"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          {/* Inventory Table */}
          <div className="premium-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Medication</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Unit Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Expiry</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                          <Pill className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{item.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-semibold",
                          item.status === 'critical' ? "text-red-600" :
                          item.status === 'low' ? "text-amber-600" :
                          "text-gray-900"
                        )}>
                          {item.stock}
                        </span>
                        <span className="text-xs text-gray-400">/ {item.reorderLevel} min</span>
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-gray-200 mt-1 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            item.status === 'critical' ? "bg-red-500" :
                            item.status === 'low' ? "bg-amber-500" :
                            "bg-green-500"
                          )}
                          style={{ width: `${Math.min((item.stock / item.reorderLevel) * 100, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">₦{item.unitPrice.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{item.expiry}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        item.status === 'critical' ? "bg-red-100 text-red-700" :
                        item.status === 'low' ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      )}>
                        {item.status}
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
        </>
      )}

      {/* Dispensations */}
      {activeTab === 'dispensations' && (
        <div className="premium-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Medication</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Pharmacist</th>
              </tr>
            </thead>
            <tbody>
              {recentDispensations.map((disp) => (
                <tr key={disp.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{disp.patient}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-700">{disp.medication}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{disp.quantity} units</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{disp.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{disp.pharmacist}</span>
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
