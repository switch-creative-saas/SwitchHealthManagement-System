import { useEffect, useMemo, useState } from 'react';
import { 
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  List,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  UserCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { toast } from 'sonner';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
type AppointmentType = 'Consultation' | 'Follow-up' | 'Emergency';
type Role = 'super-admin' | 'hospital-admin' | 'receptionist' | 'doctor' | 'nurse' | 'lab-scientist';

interface Appointment {
  id: string;
  patient: string;
  patientSwitchId: string;
  doctor: string;
  doctorId: string;
  department: string;
  date: string;
  time: string;
  duration: number;
  type: AppointmentType;
  status: AppointmentStatus;
  notes: string;
  phone: string;
  labLinked: boolean;
}

const timeSlots = Array.from({ length: 20 }, (_, i) => {
  const hour = Math.floor((i + 16) / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${minute}`;
});

const doctors = [
  { id: 'doc_1', name: 'Dr. Sarah Johnson', department: 'General Medicine', workingHours: ['08:00', '18:00'], breaks: ['12:00'], maxPerHour: 2 },
  { id: 'doc_2', name: 'Dr. Michael Chen', department: 'Cardiology', workingHours: ['09:00', '17:00'], breaks: ['13:00'], maxPerHour: 2 },
  { id: 'doc_3', name: 'Dr. Emily Davis', department: 'Pediatrics', workingHours: ['08:30', '16:30'], breaks: ['12:30'], maxPerHour: 3 },
];

const seedAppointments: Appointment[] = [
  { id: 'a1', patient: 'Chioma Okonkwo', patientSwitchId: 'SW-2026-000261', doctor: 'Dr. Sarah Johnson', doctorId: 'doc_1', department: 'General Medicine', date: '2026-04-24', time: '09:00', duration: 30, type: 'Follow-up', status: 'pending', notes: 'Blood pressure review', phone: '+2348023456789', labLinked: false },
  { id: 'a2', patient: 'Emmanuel Adeyemi', patientSwitchId: 'SW-2026-000262', doctor: 'Dr. Michael Chen', doctorId: 'doc_2', department: 'Cardiology', date: '2026-04-24', time: '09:30', duration: 45, type: 'Consultation', status: 'confirmed', notes: 'Chest pain follow-up', phone: '+2348034567890', labLinked: true },
  { id: 'a3', patient: 'Fatima Abdullahi', patientSwitchId: 'SW-2026-000263', doctor: 'Dr. Sarah Johnson', doctorId: 'doc_1', department: 'General Medicine', date: '2026-04-24', time: '10:00', duration: 30, type: 'Emergency', status: 'pending', notes: 'High fever', phone: '+2348045678901', labLinked: true },
  { id: 'a4', patient: 'Ngozi Eze', patientSwitchId: 'SW-2026-000264', doctor: 'Dr. Emily Davis', doctorId: 'doc_3', department: 'Pediatrics', date: '2026-04-24', time: '11:30', duration: 30, type: 'Consultation', status: 'completed', notes: 'Routine check', phone: '+2348067890123', labLinked: false },
];

const statusClass: Record<AppointmentStatus, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
  'no-show': 'bg-gray-100 text-gray-700',
};

export function AppointmentsPage() {
  const { currentRole, canEdit, userName } = useAuth();
  const { isMobile, isTablet } = useResponsive();
  const role = currentRole as Role;
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments);
  const [query, setQuery] = useState('');
  const [activeDate, setActiveDate] = useState('2026-04-24');
  const [view, setView] = useState<'calendar' | 'list'>(isMobile ? 'list' : 'calendar');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<Record<string, boolean>>({});
  const [doctorDecisionReason, setDoctorDecisionReason] = useState('');
  const [newForm, setNewForm] = useState({
    patient: '',
    patientSwitchId: '',
    doctorId: '',
    department: '',
    date: activeDate,
    time: '09:00',
    type: 'Consultation' as AppointmentType,
    notes: '',
  });

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isMobile) setView('list');
  }, [isMobile]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('switch-health:training-action', { detail: { action: 'appointments:viewed' } }));
  }, []);

  const visibleAppointments = useMemo(() => {
    const base = appointments.filter((appointment) => {
      if (role === 'doctor') return appointment.doctor === userName;
      if (role === 'lab-scientist') return appointment.labLinked;
      return true;
    });
    return base.filter((appointment) => {
      if (appointment.date !== activeDate) return false;
      const needle = query.toLowerCase();
      return `${appointment.patient} ${appointment.doctor} ${appointment.type}`.toLowerCase().includes(needle);
    });
  }, [appointments, activeDate, query, role, userName]);

  const stats = useMemo(() => {
    const items = visibleAppointments;
    return [
      { label: 'Total Today', value: items.length, color: 'bg-royal-500' },
      { label: 'Completed', value: items.filter((a) => a.status === 'completed').length, color: 'bg-blue-500' },
      { label: 'Pending', value: items.filter((a) => a.status === 'pending').length, color: 'bg-amber-500' },
      { label: 'No-show', value: items.filter((a) => a.status === 'no-show').length, color: 'bg-gray-500' },
      { label: 'Cancelled', value: items.filter((a) => a.status === 'cancelled').length, color: 'bg-red-500' },
    ];
  }, [visibleAppointments]);

  const notifications = useMemo(
    () => [
      `New appointment pending doctor approval (${visibleAppointments.filter((a) => a.status === 'pending').length})`,
      'Upcoming appointment reminder sent to patients',
      'Status updates synchronized with receptionist queue',
    ],
    [visibleAppointments],
  );

  const canCreateAppointment = role === 'receptionist' || role === 'hospital-admin' || role === 'super-admin';
  const canDoctorAction = role === 'doctor';
  const canReschedule = canEdit('Appointments') || role === 'doctor' || role === 'receptionist';

  const doctorAvailability = (doctorId: string, date: string, time: string) => {
    const doctor = doctors.find((item) => item.id === doctorId);
    if (!doctor) return { ok: false, reason: 'Select a valid doctor.' };
    const [start, end] = doctor.workingHours;
    if (time < start || time > end) return { ok: false, reason: `Doctor unavailable at ${time}. Suggested next slot: ${start}.` };
    if (doctor.breaks.includes(time)) return { ok: false, reason: 'Doctor on break. Suggest next available slot after 30 mins.' };
    const sameHour = appointments.filter((item) => item.doctorId === doctorId && item.date === date && item.time.slice(0, 2) === time.slice(0, 2) && item.status !== 'cancelled');
    if (sameHour.length >= doctor.maxPerHour) return { ok: false, reason: 'Max patients per hour reached. Suggested next hour slot.' };
    const collision = appointments.some((item) => item.doctorId === doctorId && item.date === date && item.time === time && item.status !== 'cancelled');
    if (collision) return { ok: false, reason: 'Double booking blocked by smart scheduling.' };
    return { ok: true, reason: '' };
  };

  const createAppointment = () => {
    if (!canCreateAppointment) {
      toast.error('RBAC: You cannot create appointments.');
      return;
    }
    if (!newForm.patient || !newForm.patientSwitchId || !newForm.doctorId || !newForm.department) {
      toast.error('Fill patient, doctor, department and schedule fields.');
      return;
    }
    const availability = doctorAvailability(newForm.doctorId, newForm.date, newForm.time);
    if (!availability.ok) {
      toast.error(availability.reason);
      return;
    }
    const doctor = doctors.find((item) => item.id === newForm.doctorId);
    const next: Appointment = {
      id: crypto.randomUUID(),
      patient: newForm.patient,
      patientSwitchId: newForm.patientSwitchId,
      doctor: doctor?.name ?? '',
      doctorId: newForm.doctorId,
      department: newForm.department,
      date: newForm.date,
      time: newForm.time,
      duration: 30,
      type: newForm.type,
      status: 'pending',
      notes: newForm.notes,
      phone: '+2348000000000',
      labLinked: false,
    };
    setAppointments((prev) => [...prev, next]);
    setShowNewModal(false);
    toast.success('Appointment created. Doctor has been notified.');
    window.dispatchEvent(new CustomEvent('switch-health:training-action', { detail: { action: 'appointments:created' } }));
    window.dispatchEvent(new CustomEvent('switch-health:training-action', { detail: { action: 'appointments:doctor-assigned' } }));
    window.dispatchEvent(new CustomEvent('switch-health:training-action', { detail: { action: 'appointments:confirmation-sent' } }));
  };

  const mutateStatus = (id: string, status: AppointmentStatus, reason?: string) => {
    setAppointments((prev) => prev.map((appointment) => (appointment.id === id ? { ...appointment, status, notes: reason ? `${appointment.notes} | ${reason}` : appointment.notes } : appointment)));
    if (status === 'confirmed') toast.success('Appointment accepted. Receptionist notified.');
    if (status === 'cancelled') toast.error('Appointment cancelled. Receptionist notified.');
    if (status === 'completed') toast.success('Appointment marked completed.');
  };

  const openPatient = (switchId: string) => {
    window.dispatchEvent(new CustomEvent('app:navigate', { detail: { switchId } }));
  };

  const openDoctor = () => {
    window.dispatchEvent(new CustomEvent('app:navigate', { detail: { page: 'administration' } }));
    toast.info('Opening doctor profile workspace.');
  };

  const changeDateBy = (days: number) => {
    const base = new Date(activeDate);
    base.setDate(base.getDate() + days);
    setActiveDate(base.toISOString().slice(0, 10));
  };

  const renderCalendarCards = () =>
    visibleAppointments.map((appointment) => {
      const index = timeSlots.indexOf(appointment.time);
      if (index < 0) return null;
      return (
        <button
          key={appointment.id}
          onClick={() => setSelected(appointment)}
          className="absolute left-2 right-2 rounded-xl p-3 text-left shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
          style={{ top: `${index * (isTablet ? 56 : 72) + 6}px`, height: `${(appointment.duration / 30) * (isTablet ? 56 : 72) - 12}px` }}
        >
          <div className={cn('rounded-xl p-2.5 border-l-4 h-full', appointment.status === 'confirmed' ? 'bg-green-50 border-green-500' : appointment.status === 'pending' ? 'bg-amber-50 border-amber-500' : appointment.status === 'completed' ? 'bg-blue-50 border-blue-500' : 'bg-red-50 border-red-500')}>
            <p className="text-sm font-semibold text-gray-900">{appointment.patient}</p>
            <p className="text-xs text-gray-600">{appointment.type} • {appointment.doctor}</p>
          </div>
        </button>
      );
    });

  return (
    <div className="space-y-4 page-transition pb-16 md:pb-0">
      <div className="rounded-3xl border border-white/70 bg-white/75 backdrop-blur-xl p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row gap-2 lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-sm text-gray-500">Responsive hospital scheduling with role-based workflows.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input className="pl-9 w-56" placeholder="Search patient, doctor, type" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="relative">
              <Button variant="outline" size="icon" onClick={() => setShowNotifications((v) => !v)}>
                <Bell className="w-4 h-4" />
              </Button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-100 bg-white shadow-lg p-3 z-20">
                  <p className="font-semibold text-sm text-gray-900 mb-2">Appointment Alerts</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    {notifications.map((notice) => <p key={notice} className="rounded-lg bg-gray-50 p-2">{notice}</p>)}
                  </div>
        </div>
              )}
            </div>
            <Button variant="outline" size="icon" onClick={() => window.dispatchEvent(new CustomEvent('app:navigate', { detail: { page: 'settings' } }))}>
              <UserCircle2 className="w-4 h-4" />
            </Button>
            <div className="hidden md:flex gap-1 p-1 bg-gray-100 rounded-lg">
              <button onClick={() => setView('calendar')} className={cn('px-3 py-1.5 rounded-md text-sm', view === 'calendar' ? 'bg-white text-royal-700' : 'text-gray-600')}>Calendar</button>
              <button onClick={() => setView('list')} className={cn('px-3 py-1.5 rounded-md text-sm', view === 'list' ? 'bg-white text-royal-700' : 'text-gray-600')}>List</button>
          </div>
            <Button
              data-tour-id="appointments-new"
              className="bg-gradient-to-r from-royal-500 to-royal-700 text-white gap-2"
              onClick={() => setShowNewModal(true)}
              disabled={!canCreateAppointment}
            >
            <Plus className="w-4 h-4" />
            New Appointment
          </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/70 bg-white/75 backdrop-blur-xl p-3">
            <div className="flex items-center gap-2">
              <div className={cn('w-2.5 h-2.5 rounded-full', stat.color)} />
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/75 backdrop-blur-xl overflow-hidden">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => changeDateBy(-1)}><ChevronLeft className="w-4 h-4" /></button>
            <p className="font-semibold text-gray-900">{new Date(activeDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</p>
            <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => changeDateBy(1)}><ChevronRight className="w-4 h-4" /></button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setActiveDate(new Date().toISOString().slice(0, 10))}>Today</Button>
          </div>

        {loading ? (
          <div className="p-4 flex items-center gap-2 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" />Loading schedules...</div>
        ) : view === 'calendar' && !isMobile ? (
          <div className="grid grid-cols-[72px_1fr] md:grid-cols-[90px_1fr]">
            <div className="bg-gray-50">
              {timeSlots.map((time) => (
                <div key={time} className={cn('flex items-center justify-center text-xs text-gray-500 border-b border-gray-100', isTablet ? 'h-14' : 'h-[72px]')}>{time}</div>
              ))}
            </div>
            <div className="relative">
              {timeSlots.map((time) => (
                <div key={time} className={cn('border-b border-gray-100', isTablet ? 'h-14' : 'h-[72px]')} />
              ))}
              {renderCalendarCards()}
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {visibleAppointments.map((appointment) => (
              <div key={appointment.id} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                <button className="w-full flex items-start justify-between text-left" onClick={() => setExpandedMobile((prev) => ({ ...prev, [appointment.id]: !prev[appointment.id] }))}>
                  <div>
                    <p className="font-semibold text-gray-900">{appointment.patient}</p>
                    <p className="text-xs text-gray-500">{appointment.time} • {appointment.doctor}</p>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs', statusClass[appointment.status])}>{appointment.status}</span>
                </button>
                <div className={cn('grid transition-all duration-300', expandedMobile[appointment.id] ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]')}>
                  <div className="overflow-hidden space-y-2">
                    <p className="text-sm text-gray-600">{appointment.type} • {appointment.department}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => mutateStatus(appointment.id, 'confirmed')}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => mutateStatus(appointment.id, 'pending', 'Reschedule requested')}>Reschedule</Button>
                      <Button size="sm" variant="outline" onClick={() => mutateStatus(appointment.id, 'cancelled')}>Cancel</Button>
                      <Button size="sm" variant="outline" onClick={() => setSelected(appointment)}>Open</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isMobile && (
        <div className="fixed bottom-0 inset-x-0 z-20 border-t border-gray-200 bg-white/90 backdrop-blur px-4 py-2 flex items-center justify-between">
          <button className={cn('text-xs flex flex-col items-center', view === 'calendar' ? 'text-royal-700' : 'text-gray-500')} onClick={() => setView('calendar')}><CalendarDays className="w-4 h-4" />Calendar</button>
          <button className={cn('text-xs flex flex-col items-center', view === 'list' ? 'text-royal-700' : 'text-gray-500')} onClick={() => setView('list')}><List className="w-4 h-4" />List</button>
          <button className="text-xs flex flex-col items-center text-royal-700" onClick={() => setShowNewModal(true)}><Plus className="w-4 h-4" />New</button>
        </div>
      )}

      {showNewModal && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="w-full max-w-2xl rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl p-4 sm:p-6 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">New Appointment</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowNewModal(false)}><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Patient name" value={newForm.patient} onChange={(e) => setNewForm((p) => ({ ...p, patient: e.target.value }))} />
              <Input placeholder="Patient Switch ID" value={newForm.patientSwitchId} onChange={(e) => setNewForm((p) => ({ ...p, patientSwitchId: e.target.value }))} />
              <select className="h-10 rounded-md border border-input px-3 text-sm" value={newForm.doctorId} onChange={(e) => setNewForm((p) => ({ ...p, doctorId: e.target.value, department: doctors.find((d) => d.id === e.target.value)?.department ?? '' }))}>
                <option value="">Select doctor by availability</option>
                {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} ({doctor.department})</option>)}
              </select>
              <Input placeholder="Department" value={newForm.department} onChange={(e) => setNewForm((p) => ({ ...p, department: e.target.value }))} />
              <Input type="date" value={newForm.date} onChange={(e) => setNewForm((p) => ({ ...p, date: e.target.value }))} />
              <select className="h-10 rounded-md border border-input px-3 text-sm" value={newForm.time} onChange={(e) => setNewForm((p) => ({ ...p, time: e.target.value }))}>
                {timeSlots.map((slot) => <option key={slot}>{slot}</option>)}
              </select>
              <select className="h-10 rounded-md border border-input px-3 text-sm" value={newForm.type} onChange={(e) => setNewForm((p) => ({ ...p, type: e.target.value as AppointmentType }))}>
                <option>Consultation</option>
                <option>Follow-up</option>
                <option>Emergency</option>
              </select>
              <Input placeholder="Notes" value={newForm.notes} onChange={(e) => setNewForm((p) => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="text-xs text-gray-500">
              Availability check: {newForm.doctorId ? doctorAvailability(newForm.doctorId, newForm.date, newForm.time).reason || 'Available slot.' : 'Select doctor/time to validate.'}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancel</Button>
              <Button className="bg-royal-700 hover:bg-royal-800 text-white" onClick={createAppointment}>Create Appointment</Button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm flex justify-end" onClick={() => setSelected(null)}>
          <aside className="w-full max-w-md h-full bg-white/90 backdrop-blur-xl border-l border-white/70 p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Appointment Detail</h3>
              <button onClick={() => setSelected(null)}><XCircle className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-sm space-y-1">
              <p><span className="text-gray-500">Patient:</span> <button className="text-royal-700 hover:underline" onClick={() => openPatient(selected.patientSwitchId)}>{selected.patient}</button></p>
              <p><span className="text-gray-500">Doctor:</span> <button className="text-royal-700 hover:underline" onClick={openDoctor}>{selected.doctor}</button></p>
              <p><span className="text-gray-500">Status:</span> <span className={cn('px-2 py-0.5 rounded-full text-xs ml-1', statusClass[selected.status])}>{selected.status}</span></p>
              <p><span className="text-gray-500">Notes:</span> {selected.notes}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => mutateStatus(selected.id, 'confirmed')}>Accept</Button>
              <Button size="sm" variant="outline" disabled={!canReschedule} onClick={() => mutateStatus(selected.id, 'pending', 'Reschedule requested')}>Reschedule</Button>
              <Button size="sm" variant="outline" onClick={() => mutateStatus(selected.id, 'cancelled')}>Cancel</Button>
              <Button size="sm" variant="outline" disabled={!canDoctorAction} onClick={() => mutateStatus(selected.id, 'completed')}>Complete</Button>
                      </div>
            {canDoctorAction && selected.status === 'pending' && (
              <div className="rounded-xl border border-gray-100 p-3 space-y-2">
                <p className="text-xs text-gray-500">Doctor Pending Request Action</p>
                <Input placeholder="Reject reason (required for reject)" value={doctorDecisionReason} onChange={(e) => setDoctorDecisionReason(e.target.value)} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => mutateStatus(selected.id, 'confirmed')}>ACCEPT</Button>
                  <Button size="sm" variant="outline" onClick={() => mutateStatus(selected.id, 'pending', 'Doctor proposed reschedule')}>RESCHEDULE</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (!doctorDecisionReason.trim()) {
                        toast.error('Reject reason is required.');
                        return;
                      }
                      mutateStatus(selected.id, 'cancelled', doctorDecisionReason);
                    }}
                  >
                    REJECT
                  </Button>
                      </div>
                    </div>
            )}
            <div className="rounded-xl bg-blue-50 p-3 text-xs text-blue-700">
              Notifications:
              <ul className="list-disc ml-4 mt-1">
                <li>New appointment notifies doctor.</li>
                <li>Status changes notify receptionist.</li>
                <li>Upcoming appointment reminders notify patient.</li>
              </ul>
                    </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Role: {role}</span>
              <button className="p-1.5 rounded-lg hover:bg-gray-100"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
          </aside>
        </div>
      )}
    </div>
  );
}
