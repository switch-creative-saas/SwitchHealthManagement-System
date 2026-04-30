import { useState, useRef, useEffect } from 'react';
import { User, Settings, Shield, CreditCard, LogOut, ChevronRight, Crown, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileDropdownProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function ProfileDropdown({ onNavigate, onLogout, onDeleteAccount }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { userName, userEmail, userAvatar, currentRole, isSuperAdmin } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.dataset.overlayOpen = isOpen ? 'true' : 'false';
    return () => {
      document.body.dataset.overlayOpen = 'false';
    };
  }, [isOpen]);

  const menuItems = [
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      description: 'View and edit your profile',
      action: () => onNavigate('settings'),
    },
    {
      id: 'account',
      label: 'Account Settings',
      icon: Settings,
      description: 'Manage account preferences',
      action: () => onNavigate('settings'),
    },
    {
      id: 'security',
      label: 'Security Settings',
      icon: Shield,
      description: 'Password, 2FA, sessions',
      action: () => onNavigate('audit-logs'),
    },
    {
      id: 'subscription',
      label: 'Subscription & Billing',
      icon: CreditCard,
      description: 'Manage plan and payments',
      action: () => onNavigate('subscription'),
    },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl transition-all duration-200",
          isOpen 
            ? "bg-[#1E1B8F]/10" 
            : "hover:bg-gray-100"
        )}
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">{userEmail}</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E1B8F] to-[#D4AF37] flex items-center justify-center text-white font-semibold text-sm">
          {userAvatar}
        </div>
        {isSuperAdmin && (
          <Crown className="w-4 h-4 text-[#D4AF37]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E1B8F] to-[#D4AF37] flex items-center justify-center text-white font-bold text-lg">
                {userAvatar}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[#1E1B8F]/10 text-[#1E1B8F] text-[10px] font-medium">
                  {currentRole.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 hover:bg-gray-50 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#1E1B8F]/10 transition-colors">
                    <Icon className="w-4 h-4 text-gray-500 group-hover:text-[#1E1B8F] transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-[10px] text-gray-500">{item.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1E1B8F] transition-colors" />
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="mx-2 h-px bg-gray-100" />

          {/* Account Actions */}
          <div className="p-2">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 hover:bg-red-50 group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <LogOut className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-sm font-medium text-red-600">Logout</span>
            </button>
            <button
              onClick={() => {
                const confirmed = window.confirm('Delete this account permanently? This cannot be undone.');
                if (!confirmed) return;
                onDeleteAccount();
                setIsOpen(false);
              }}
              className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 hover:bg-red-50 group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <Trash2 className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-sm font-medium text-red-600">Delete Account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
