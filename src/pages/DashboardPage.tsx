import { useState, useEffect } from 'react';
import { 
  Users, 
  CalendarCheck, 
  FlaskConical, 
  Pill, 
  TrendingUp, 
  CreditCard,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Nfc,
  QrCode,
  Search,
  ChevronRight,
  UserPlus,
  CalendarPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { PatientOnboardingWizard } from '@/components/patients/PatientOnboardingWizard';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}

function StatCard({ title, value, change, changeType, icon: Icon, color, subtitle }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) || 0 : value;

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;
    let frame = 0;
    
    const timer = setInterval(() => {
      frame++;
      current = Math.min(numericValue, increment * frame);
      setDisplayValue(Math.floor(current));
      if (frame >= steps) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numericValue]);

  const display = typeof value === 'string' && value.includes('₦') 
    ? `₦${displayValue.toLocaleString()}` 
    : displayValue.toLocaleString();

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-5 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            changeType === 'increase' ? "bg-green-100 text-green-700" :
            changeType === 'decrease' ? "bg-red-100 text-red-700" :
            "bg-gray-100 text-gray-700"
          )}>
            {changeType === 'increase' ? <TrendingUp className="w-3 h-3" /> :
             changeType === 'decrease' ? <TrendingUp className="w-3 h-3 rotate-180" /> : null}
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{display}</h3>
      <p className="text-sm text-gray-500">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

// Quick Action Modals
function NewPatientModal({
  open,
  onClose,
  creatorName,
  canCreatePatient,
}: {
  open: boolean;
  onClose: () => void;
  creatorName: string;
  canCreatePatient: boolean;
}) {
  return (
    <PatientOnboardingWizard
      open={open}
      onOpenChange={onClose}
      tenantId="lagos-central-hospital"
      creatorName={creatorName}
      canCreate={canCreatePatient}
    />
  );
}

function BookAppointmentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [patient, setPatient] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState('consultation');

  const handleBook = () => {
    toast.success('Appointment booked successfully!', {
      description: `${patient} booked with ${doctor} on ${date} at ${time}`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-[#1E1B8F] flex items-center gap-2">
            <CalendarPlus className="w-5 h-5" />
            Book Appointment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Select Patient *</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search patient by name or UHIN..." 
                className="pl-10"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Select Doctor *</label>
            <select 
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
            >
              <option value="">Select doctor</option>
              <option value="Dr. Sarah Johnson">Dr. Sarah Johnson - General Medicine</option>
              <option value="Dr. Michael Chen">Dr. Michael Chen - Cardiology</option>
              <option value="Dr. Emily Davis">Dr. Emily Davis - Pediatrics</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Date *</label>
              <Input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Time *</label>
              <select 
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="08:00">08:00 AM</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Appointment Type</label>
            <select 
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="emergency">Emergency</option>
              <option value="routine-check">Routine Check</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              className="bg-[#1E1B8F] hover:bg-[#1E1B8F]/90 text-white"
              onClick={handleBook}
            >
              <CalendarCheck className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OrderLabModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [patient, setPatient] = useState('');
  const [testType, setTestType] = useState('');
  const [priority, setPriority] = useState('routine');

  const handleOrder = () => {
    toast.success('Lab order created!', {
      description: `${testType} ordered for ${patient}. Lab will be notified.`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-[#1E1B8F] flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Order Lab Test
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Select Patient *</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search patient..." 
                className="pl-10"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Test Type *</label>
            <select 
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
            >
              <option value="">Select test</option>
              <option value="CBC">Complete Blood Count (CBC)</option>
              <option value="Lipid Panel">Lipid Panel</option>
              <option value="HbA1c">HbA1c</option>
              <option value="Urinalysis">Urinalysis</option>
              <option value="Thyroid Function">Thyroid Function</option>
              <option value="Liver Function">Liver Function</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Priority</label>
            <div className="flex gap-2">
              {['routine', 'urgent', 'stat'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                    priority === p 
                      ? p === 'stat' ? "bg-red-100 text-red-700 border-2 border-red-300" :
                        p === 'urgent' ? "bg-amber-100 text-amber-700 border-2 border-amber-300" :
                        "bg-blue-100 text-blue-700 border-2 border-blue-300"
                      : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              className="bg-[#1E1B8F] hover:bg-[#1E1B8F]/90 text-white"
              onClick={handleOrder}
            >
              <FlaskConical className="w-4 h-4 mr-2" />
              Order Test
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DispenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [patient, setPatient] = useState('');
  const [medication, setMedicication] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleDispense = () => {
    toast.success('Medication dispensed!', {
      description: `${quantity}x ${medication} dispensed to ${patient}. Inventory updated.`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-[#1E1B8F] flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Dispense Medication
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Select Patient *</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search patient..." 
                className="pl-10"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Medication *</label>
            <select 
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
              value={medication}
              onChange={(e) => setMedicication(e.target.value)}
            >
              <option value="">Select medication</option>
              <option value="Paracetamol 500mg">Paracetamol 500mg (245 in stock)</option>
              <option value="Amoxicillin 250mg">Amoxicillin 250mg (32 in stock - LOW)</option>
              <option value="Metformin 500mg">Metformin 500mg (189 in stock)</option>
              <option value="Amlodipine 5mg">Amlodipine 5mg (12 in stock - CRITICAL)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Quantity</label>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <span className="w-16 text-center font-semibold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              className="bg-[#1E1B8F] hover:bg-[#1E1B8F]/90 text-white"
              onClick={handleDispense}
            >
              <Pill className="w-4 h-4 mr-2" />
              Dispense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Skeleton Loader for stats
function StatCardSkeleton() {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="w-16 h-6 rounded-full bg-gray-200" />
      </div>
      <div className="w-24 h-8 bg-gray-200 rounded mb-2" />
      <div className="w-32 h-4 bg-gray-200 rounded" />
    </div>
  );
}

export function DashboardPage() {
  const { canCreate, userName } = useAuth();
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [showOrderLab, setShowOrderLab] = useState(false);
  const [showDispense, setShowDispense] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const quickActions = [
    { 
      label: 'New Patient', 
      icon: UserPlus, 
      color: 'from-blue-500 to-blue-700',
      onClick: () => setShowNewPatient(true),
      permission: canCreate('Patients')
    },
    { 
      label: 'Book Appointment', 
      icon: CalendarPlus, 
      color: 'from-green-500 to-green-700',
      onClick: () => setShowBookAppointment(true),
      permission: canCreate('Appointments')
    },
    { 
      label: 'Order Lab Test', 
      icon: FlaskConical, 
      color: 'from-purple-500 to-purple-700',
      onClick: () => setShowOrderLab(true),
      permission: canCreate('Laboratory')
    },
    { 
      label: 'Dispense Meds', 
      icon: Pill, 
      color: 'from-amber-500 to-amber-700',
      onClick: () => setShowDispense(true),
      permission: canCreate('Pharmacy')
    },
  ].filter(action => action.permission);

  const stats = [
    { title: 'Total Patients', value: '2,847', change: 12, changeType: 'increase' as const, icon: Users, color: 'bg-gradient-to-br from-blue-500 to-blue-700', subtitle: '+156 this month' },
    { title: "Today's Appointments", value: '24', change: 8, changeType: 'increase' as const, icon: CalendarCheck, color: 'bg-gradient-to-br from-green-500 to-green-700', subtitle: '8 completed, 16 pending' },
    { title: 'Pending Lab Results', value: '18', change: -5, changeType: 'decrease' as const, icon: FlaskConical, color: 'bg-gradient-to-br from-purple-500 to-purple-700', subtitle: '3 urgent, 15 routine' },
    { title: 'Revenue Today', value: '₦1,245,000', change: 23, changeType: 'increase' as const, icon: CreditCard, color: 'bg-gradient-to-br from-amber-500 to-amber-700', subtitle: '+₦234,000 vs yesterday' },
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'Chioma Okonkwo', time: '09:00 AM', type: 'Follow-up', department: 'General', status: 'confirmed', doctor: 'Dr. Sarah Johnson' },
    { id: 2, patient: 'Emmanuel Adeyemi', time: '09:30 AM', type: 'Consultation', department: 'Cardiology', status: 'checked-in', doctor: 'Dr. Michael Chen' },
    { id: 3, patient: 'Fatima Abdullahi', time: '10:00 AM', type: 'Lab Review', department: 'General', status: 'pending', doctor: 'Dr. Sarah Johnson' },
    { id: 4, patient: 'Oluwaseun Balogun', time: '10:30 AM', type: 'Vaccination', department: 'Pediatrics', status: 'confirmed', doctor: 'Dr. Emily Davis' },
  ];

  const recentActivity = [
    { id: 1, type: 'patient', message: 'New patient registered: Adebayo Johnson', time: '2 min ago', icon: UserPlus, color: 'bg-blue-500' },
    { id: 2, type: 'appointment', message: 'Appointment completed: Sarah Williams', time: '15 min ago', icon: CheckCircle2, color: 'bg-green-500' },
    { id: 3, type: 'lab', message: 'Lab results ready: Michael Brown', time: '32 min ago', icon: FlaskConical, color: 'bg-purple-500' },
    { id: 4, type: 'alert', message: 'Critical: High BP alert for patient #4521', time: '1 hour ago', icon: AlertCircle, color: 'bg-red-500' },
    { id: 5, type: 'billing', message: 'Invoice #INV-2026-001 paid', time: '2 hours ago', icon: CreditCard, color: 'bg-amber-500' },
  ];

  const handleAppointmentClick = (appointment: typeof upcomingAppointments[0]) => {
    toast.info(`Opening appointment: ${appointment.patient}`, {
      description: `${appointment.type} at ${appointment.time} with ${appointment.doctor}`,
    });
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1E1B8F] via-[#2D2B9F] to-[#1E1B8F] p-6 sm:p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#D4AF37] rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-medium backdrop-blur-sm">
                Switch Health v2.0
              </span>
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium backdrop-blur-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Powered
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-sm sm:text-base text-white/70 max-w-lg">
              Africa's Offline-First Digital Health Identity Infrastructure. 
              You have <span className="text-[#D4AF37] font-semibold">12 patients</span> scheduled today.
            </p>
          </div>
          
          {/* NFC Quick Access */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <button className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 hover:border-[#D4AF37] transition-all duration-300 flex flex-col items-center justify-center group">
              <div className="absolute inset-0 rounded-2xl border-2 border-[#D4AF37]/50 animate-[nfc-ripple_1.5s_ease-out_infinite] opacity-0 group-hover:opacity-100" />
              <Nfc className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:text-[#D4AF37] transition-colors" />
              <span className="text-[10px] sm:text-xs text-white/70 mt-1">Tap Card</span>
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors">
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 text-green-300 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {loading 
          ? Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))
        }
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all duration-200 group"
                >
                  <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 bg-gradient-to-br", action.color)}>
                    <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
              <button 
                onClick={() => toast.info('Navigating to Appointments...')}
                className="text-xs sm:text-sm text-[#1E1B8F] hover:text-[#1E1B8F]/80 font-medium flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {upcomingAppointments.map((apt) => (
                <div 
                  key={apt.id} 
                  onClick={() => handleAppointmentClick(apt)}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#1E1B8F]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-[#1E1B8F]">{apt.time.split(' ')[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{apt.patient}</h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm text-gray-500">
                      <span>{apt.type}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{apt.department}</span>
                      <span>•</span>
                      <span className="text-gray-400">{apt.doctor}</span>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium flex-shrink-0",
                    apt.status === 'confirmed' ? "bg-green-100 text-green-700" :
                    apt.status === 'checked-in' ? "bg-blue-100 text-blue-700" :
                    "bg-amber-100 text-amber-700"
                  )}>
                    {apt.status}
                  </span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          {/* AI Insights Preview */}
          <div className="bg-white/70 backdrop-blur-xl border-l-4 border-l-[#D4AF37] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Gulia AI Insights</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-xs sm:text-sm font-medium text-red-700">High Risk Alert</span>
                </div>
                <p className="text-xs text-red-600">3 patients require immediate attention</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-amber-500" />
                  <span className="text-xs sm:text-sm font-medium text-amber-700">Trend Detected</span>
                </div>
                <p className="text-xs text-amber-600">Unusual lab pattern in 5 patients</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-xs sm:text-sm font-medium text-blue-700">Prediction</span>
                </div>
                <p className="text-xs text-blue-600">15% increase in admissions expected</p>
              </div>
            </div>
            <button 
              onClick={() => toast.info('Opening full AI Insights dashboard...')}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#1E1B8F] to-[#1E1B8F]/90 text-white text-sm font-medium hover:shadow-lg hover:shadow-[#1E1B8F]/25 transition-all duration-200"
            >
              View All Insights
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={cn("w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0", activity.color)}>
                    <activity.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900 truncate">{activity.message}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Sync Status */}
          <div className="bg-white/70 backdrop-blur-xl border border-green-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft bg-gradient-to-br from-green-50/50 to-emerald-50/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-500 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Sync Status</h3>
                <p className="text-xs sm:text-sm text-green-600">All data synced</p>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Last sync</span>
                <span className="text-gray-700">2 minutes ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pending items</span>
                <span className="text-gray-700">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cached records</span>
                <span className="text-gray-700">2,847</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewPatientModal open={showNewPatient} onClose={() => setShowNewPatient(false)} creatorName={userName} canCreatePatient={canCreate('Patients')} />
      <BookAppointmentModal open={showBookAppointment} onClose={() => setShowBookAppointment(false)} />
      <OrderLabModal open={showOrderLab} onClose={() => setShowOrderLab(false)} />
      <DispenseModal open={showDispense} onClose={() => setShowDispense(false)} />
    </div>
  );
}
