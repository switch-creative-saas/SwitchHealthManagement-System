import { useState } from 'react';
import { 
  Plus, 
  Clock,
  User,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];



const appointments = [
  { id: 1, patient: 'Chioma Okonkwo', time: '09:00', duration: 30, type: 'Follow-up', doctor: 'Dr. Sarah Johnson', status: 'confirmed', phone: '+234 802 345 6789' },
  { id: 2, patient: 'Emmanuel Adeyemi', time: '09:30', duration: 45, type: 'Consultation', doctor: 'Dr. Michael Chen', status: 'checked-in', phone: '+234 803 456 7890' },
  { id: 3, patient: 'Fatima Abdullahi', time: '10:00', duration: 30, type: 'Lab Review', doctor: 'Dr. Sarah Johnson', status: 'pending', phone: '+234 804 567 8901' },
  { id: 4, patient: 'Oluwaseun Balogun', time: '11:00', duration: 30, type: 'Vaccination', doctor: 'Dr. Emily Davis', status: 'confirmed', phone: '+234 805 678 9012' },
  { id: 5, patient: 'Ngozi Eze', time: '14:30', duration: 60, type: 'Surgery Prep', doctor: 'Dr. Michael Chen', status: 'confirmed', phone: '+234 806 789 0123' },
];

const stats = [
  { label: 'Total Today', value: 24, color: 'bg-royal-500' },
  { label: 'Completed', value: 8, color: 'bg-green-500' },
  { label: 'Pending', value: 12, color: 'bg-amber-500' },
  { label: 'No-show', value: 2, color: 'bg-red-500' },
  { label: 'Cancelled', value: 2, color: 'bg-gray-500' },
];

export function AppointmentsPage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate] = useState(new Date());

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Schedule and manage patient appointments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setView('calendar')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                view === 'calendar' ? "bg-white text-royal-600 shadow-sm" : "text-gray-500"
              )}
            >
              Calendar
            </button>
            <button
              onClick={() => setView('list')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                view === 'list' ? "bg-white text-royal-600 shadow-sm" : "text-gray-500"
              )}
            >
              List
            </button>
          </div>
          <Button className="bg-gradient-to-r from-royal-500 to-royal-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-100">
            <div className={cn("w-3 h-3 rounded-full", stat.color)} />
            <div>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="premium-card overflow-hidden">
          {/* Calendar Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <Button variant="outline" size="sm">Today</Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-[100px_1fr] divide-x divide-gray-100">
            {/* Time Column */}
            <div className="bg-gray-50">
              {timeSlots.map((time) => (
                <div key={time} className="h-20 flex items-center justify-center text-sm text-gray-500 border-b border-gray-100">
                  {time}
                </div>
              ))}
            </div>

            {/* Appointments Grid */}
            <div className="relative">
              {timeSlots.map((time) => (
                <div key={time} className="h-20 border-b border-gray-100 hover:bg-gray-50/50 transition-colors" />
              ))}

              {/* Appointment Cards */}
              {appointments.map((apt) => {
                const timeIndex = timeSlots.indexOf(apt.time);
                if (timeIndex === -1) return null;
                
                return (
                  <div
                    key={apt.id}
                    className={cn(
                      "absolute left-2 right-2 rounded-xl p-3 cursor-pointer transition-all hover:shadow-lg",
                      apt.status === 'checked-in' ? "bg-blue-100 border-l-4 border-blue-500" :
                      apt.status === 'confirmed' ? "bg-green-100 border-l-4 border-green-500" :
                      "bg-amber-100 border-l-4 border-amber-500"
                    )}
                    style={{
                      top: `${timeIndex * 80 + 8}px`,
                      height: `${(apt.duration / 30) * 80 - 16}px`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 text-sm">{apt.patient}</p>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full uppercase font-medium",
                        apt.status === 'checked-in' ? "bg-blue-200 text-blue-700" :
                        apt.status === 'confirmed' ? "bg-green-200 text-green-700" :
                        "bg-amber-200 text-amber-700"
                      )}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{apt.type}</p>
                    <p className="text-xs text-gray-500">{apt.doctor}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="premium-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-royal-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-royal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{apt.patient}</p>
                        <p className="text-xs text-gray-500">{apt.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{apt.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{apt.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{apt.doctor}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      apt.status === 'checked-in' ? "bg-blue-100 text-blue-700" :
                      apt.status === 'confirmed' ? "bg-green-100 text-green-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-green-100 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-100 text-red-600">
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
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
