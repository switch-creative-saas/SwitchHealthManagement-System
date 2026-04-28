import { useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Hospital, Loader2, Lock, Mail, Moon, Shield, Sparkles, Stethoscope, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import type { PageType } from '@/types';
import type { UserRole } from '@/contexts/AuthContext';

type Stage = 'login' | 'signup' | 'onboarding' | 'welcome';
type FacilityType = 'Hospital' | 'Clinic' | 'Pharmacy' | 'Lab';
type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role?: UserRole;
  passwordHash?: string;
  provider: 'email' | 'google';
  profilePicture?: string;
  onboardingComplete: boolean;
  switchId?: string;
  facilityName?: string;
  country?: string;
  verifiedEmail?: boolean;
};

const roles: { label: string; value: UserRole }[] = [
  { label: 'Doctor', value: 'doctor' },
  { label: 'Nurse', value: 'nurse' },
  { label: 'Receptionist', value: 'receptionist' },
  { label: 'Pharmacist', value: 'pharmacist' },
  { label: 'Lab Scientist', value: 'lab-scientist' },
  { label: 'Admin', value: 'hospital-admin' },
];

interface AuthGatewayPageProps {
  onAuthenticated: (payload: { role: UserRole; name: string; email: string; redirectPage: PageType }) => void;
  defaultTheme: 'light' | 'dark';
}

function usersKey() {
  return 'switch-health-auth-users';
}

function sessionKey() {
  return 'switch-health-auth-session';
}

function onboardingKey(email: string) {
  return `switch-health-onboarding-complete-${email.toLowerCase()}`;
}

async function hashPassword(raw: string): Promise<string> {
  if (window.crypto?.subtle) {
    const encoded = new TextEncoder().encode(raw);
    const digest = await window.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return btoa(raw);
}

function roleRedirect(role: UserRole): PageType {
  if (role === 'doctor') return 'emr';
  if (role === 'receptionist') return 'appointments';
  if (role === 'hospital-admin' || role === 'super-admin') return 'analytics';
  if (role === 'pharmacist') return 'pharmacy';
  if (role === 'lab-scientist' || role === 'lab-technician') return 'laboratory';
  return 'dashboard';
}

function generateSwitchId(): string {
  const year = new Date().getFullYear();
  const serial = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
  return `SW-${year}-${serial}`;
}

export function AuthGatewayPage({ onAuthenticated, defaultTheme }: AuthGatewayPageProps) {
  const [stage, setStage] = useState<Stage>('login');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(defaultTheme);
  const [emailVerified, setEmailVerified] = useState(false);
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);
  const [setup2FA, setSetup2FA] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'doctor' as UserRole,
    facilityName: '',
    country: 'Nigeria',
  });
  const [onboardingForm, setOnboardingForm] = useState({
    role: 'doctor' as UserRole,
    facilityType: 'Hospital' as FacilityType,
    facilityMode: 'create' as 'create' | 'join',
    facilityName: '',
    invitationCode: '',
    department: '',
    specialty: '',
    yearsExperience: '',
  });

  const passwordStrength = useMemo(() => {
    const pwd = signupForm.password;
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  }, [signupForm.password]);

  const floatingIcons = [Stethoscope, Shield, Hospital, Sparkles, Mail, Lock];

  const getUsers = (): AuthUser[] => {
    const raw = localStorage.getItem(usersKey());
    if (!raw) return [];
    try {
      return JSON.parse(raw) as AuthUser[];
    } catch {
      return [];
    }
  };

  const setUsers = (users: AuthUser[]) => {
    localStorage.setItem(usersKey(), JSON.stringify(users));
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const authenticateSuccess = (user: AuthUser) => {
    if (!user.onboardingComplete || !localStorage.getItem(onboardingKey(user.email))) {
      setPendingUser(user);
      setOnboardingForm((prev) => ({
        ...prev,
        role: user.role ?? 'doctor',
        facilityName: user.facilityName ?? prev.facilityName,
        specialty: user.role === 'doctor' ? prev.specialty : '',
      }));
      setStage('onboarding');
      return;
    }
    const role = user.role ?? 'doctor';
    const token = `sh.jwt.${btoa(`${user.email}:${Date.now()}`)}`;
    if (rememberMe) localStorage.setItem(sessionKey(), token);
    window.dispatchEvent(new CustomEvent('switch-health:notify', { detail: { module: 'auth', type: 'login-success', message: 'User authenticated successfully' } }));
    onAuthenticated({ role, name: user.fullName, email: user.email, redirectPage: roleRedirect(role) });
  };

  const handleLogin = async () => {
    setAuthError('');
    if (!validateEmail(loginForm.email)) return setAuthError('Please enter a valid email address');
    if (!loginForm.password) return setAuthError('Password is required');
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      const users = getUsers();
      const existing = users.find((user) => user.email.toLowerCase() === loginForm.email.toLowerCase());
      if (!existing || !existing.passwordHash) {
        setAuthError('Invalid email or password');
        return;
      }
      const providedHash = await hashPassword(loginForm.password);
      if (providedHash !== existing.passwordHash) {
        setAuthError('Invalid email or password');
        return;
      }
      if (!existing.verifiedEmail) {
        setAuthError('Email not verified. Please verify before continuing.');
        return;
      }
      authenticateSuccess(existing);
    } catch {
      setAuthError('Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setAuthError('');
    if (!signupForm.fullName.trim()) return setAuthError('Full name is required');
    if (!validateEmail(signupForm.email)) return setAuthError('Enter a valid email');
    if (signupForm.password.length < 8) return setAuthError('Password must be at least 8 characters');
    if (signupForm.password !== signupForm.confirmPassword) return setAuthError('Passwords do not match');
    if (!signupForm.facilityName.trim()) return setAuthError('Facility name is required');
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const users = getUsers();
      if (users.some((user) => user.email.toLowerCase() === signupForm.email.toLowerCase())) {
        setAuthError('Email already exists');
        return;
      }
      const created: AuthUser = {
        id: `usr-${Date.now()}`,
        fullName: signupForm.fullName,
        email: signupForm.email,
        phone: signupForm.phone,
        role: signupForm.role,
        passwordHash: await hashPassword(signupForm.password),
        provider: 'email',
        onboardingComplete: false,
        facilityName: signupForm.facilityName,
        country: signupForm.country,
        verifiedEmail: false,
      };
      setUsers([created, ...users]);
      setPendingUser(created);
      setOnboardingForm((prev) => ({ ...prev, role: created.role ?? 'doctor', facilityName: created.facilityName ?? '' }));
      toast.success('Verification email sent. Confirm email to continue onboarding.');
      setEmailVerified(false);
      setStage('onboarding');
    } catch {
      setAuthError('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const failed = Math.random() < 0.05;
      if (failed) {
        setAuthError('Google authentication failed. Please retry.');
        return;
      }
      const googleProfile = {
        fullName: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@switchhealth.ng',
        profilePicture: 'SJ',
      };
      const users = getUsers();
      const existing = users.find((user) => user.email.toLowerCase() === googleProfile.email.toLowerCase());
      const user = existing ?? {
        id: `usr-${Date.now()}`,
        fullName: googleProfile.fullName,
        email: googleProfile.email,
        phone: '',
        provider: 'google' as const,
        onboardingComplete: false,
        profilePicture: googleProfile.profilePicture,
        verifiedEmail: true,
      };
      if (!existing) setUsers([user, ...users]);
      setPendingUser(user);
      setOnboardingForm((prev) => ({ ...prev, role: user.role ?? 'doctor', facilityName: user.facilityName ?? prev.facilityName }));
      setStage('onboarding');
      toast.success('Google sign-in successful. Complete onboarding to continue.');
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    if (!pendingUser) return;
    if (!emailVerified && pendingUser.provider === 'email') {
      setAuthError('Email verification is required before completion.');
      return;
    }
    if (!onboardingForm.department.trim()) return setAuthError('Department is required');
    if (!onboardingForm.facilityName.trim()) return setAuthError('Facility selection is required');
    if (onboardingForm.role === 'doctor' && !onboardingForm.specialty.trim()) return setAuthError('Specialty is required for doctors');
    if (onboardingForm.facilityMode === 'join' && !onboardingForm.invitationCode.trim() && pendingUser.provider !== 'google') {
      setAuthError('Invitation code is required when joining a facility');
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      const switchId = generateSwitchId();
      const users = getUsers();
      const updated = users.map((user) =>
        user.id === pendingUser.id
          ? {
              ...user,
              role: onboardingForm.role,
              onboardingComplete: true,
              switchId,
              facilityName: onboardingForm.facilityName,
              verifiedEmail: user.provider === 'google' ? true : emailVerified,
            }
          : user,
      );
      setUsers(updated);
      localStorage.setItem(onboardingKey(pendingUser.email), '1');
      const finalUser = updated.find((user) => user.id === pendingUser.id)!;
      setPendingUser(finalUser);
      setStage('welcome');
      window.dispatchEvent(new CustomEvent('switch-health:notify', { detail: { module: 'auth', type: 'onboarding-complete', message: `${finalUser.fullName} completed onboarding` } }));
      toast.success('Onboarding completed');
    } finally {
      setLoading(false);
    }
  };

  const enterWorkspace = () => {
    if (!pendingUser?.role) return;
    const token = `sh.jwt.${btoa(`${pendingUser.email}:${Date.now()}`)}`;
    if (rememberMe) localStorage.setItem(sessionKey(), token);
    onAuthenticated({
      role: pendingUser.role,
      name: pendingUser.fullName,
      email: pendingUser.email,
      redirectPage: roleRedirect(pendingUser.role),
    });
  };

  return (
    <div className={`min-h-screen w-full auth-stage-transition ${currentTheme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden lg:flex overflow-hidden auth-visual-bg">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#1E1B8F] to-[#4C1D95] animate-auth-gradient" />
          <div className="absolute inset-0 auth-particles" />
          {floatingIcons.map((Icon, idx) => (
            <div key={idx} className="absolute text-white/25 animate-auth-float" style={{ top: `${10 + idx * 14}%`, left: `${8 + (idx % 3) * 28}%`, animationDelay: `${idx * 0.8}s` }}>
              <Icon className="w-8 h-8" />
            </div>
          ))}
          <div className="relative z-10 p-12 flex flex-col justify-between text-white">
            <div className="text-xs uppercase tracking-[0.2em] text-white/70">Switch Health</div>
            <div>
              <h1 className="text-4xl font-bold leading-tight">Smart Healthcare Infrastructure for Africa</h1>
              <p className="mt-4 text-white/80">Secure identity, clinical workflows, and intelligent operations for modern hospitals.</p>
            </div>
            <div className="text-sm text-white/70">Built with Gulia AI assistance</div>
          </div>
        </div>

        <div className="flex items-center justify-center p-5 sm:p-8 bg-[var(--bg-main)]">
          <div className="w-full max-w-xl glass-panel p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {stage === 'login' && 'Welcome Back'}
                  {stage === 'signup' && 'Create Account'}
                  {stage === 'onboarding' && 'Complete Onboarding'}
                  {stage === 'welcome' && 'Welcome Personalization'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {stage === 'welcome'
                    ? `Welcome ${pendingUser?.fullName ?? 'User'} 👋 Let's set up your workspace...`
                    : 'Secure access to the Switch Health platform'}
                </p>
              </div>
              <button className="p-2 rounded-xl bg-white/60 border border-white/70" onClick={() => setCurrentTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
                {currentTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              </button>
            </div>

            {stage === 'login' && (
              <div className="space-y-4 auth-form-enter">
                <Field label="Email" value={loginForm.email} onChange={(v) => setLoginForm((f) => ({ ...f, email: v }))} type="email" placeholder="you@hospital.org" />
                <Field label="Password" value={loginForm.password} onChange={(v) => setLoginForm((f) => ({ ...f, password: v }))} type="password" placeholder="••••••••" />
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <Checkbox checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked === true)} />
                    Remember me
                  </label>
                  <button className="text-royal-600 hover:underline" onClick={() => toast.message('Password recovery flow placeholder')}>Forgot Password?</button>
                </div>
                {authError && <ErrorText text={authError} />}
                <Button className="w-full bg-gradient-to-r from-royal-500 to-royal-700 text-white" onClick={handleLogin} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Login
                </Button>
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                  <GoogleIcon />
                  Continue with Google
                </Button>
                <p className="text-sm text-center text-gray-500">No account? <button className="text-royal-600 font-medium" onClick={() => { setAuthError(''); setStage('signup'); }}>Sign Up</button></p>
              </div>
            )}

            {stage === 'signup' && (
              <div className="space-y-4 auth-form-enter">
                <Field label="Full Name" value={signupForm.fullName} onChange={(v) => setSignupForm((s) => ({ ...s, fullName: v }))} placeholder="Dr. Jane Doe" />
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Email" value={signupForm.email} onChange={(v) => setSignupForm((s) => ({ ...s, email: v }))} type="email" />
                  <Field label="Phone Number" value={signupForm.phone} onChange={(v) => setSignupForm((s) => ({ ...s, phone: v }))} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Password" value={signupForm.password} onChange={(v) => setSignupForm((s) => ({ ...s, password: v }))} type="password" />
                  <Field label="Confirm Password" value={signupForm.confirmPassword} onChange={(v) => setSignupForm((s) => ({ ...s, confirmPassword: v }))} type="password" />
                </div>
                <PasswordStrength strength={passwordStrength} />
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Role</Label>
                    <select className="w-full mt-1 rounded-md border border-input px-3 py-2 text-sm bg-white/80" value={signupForm.role} onChange={(e) => setSignupForm((s) => ({ ...s, role: e.target.value as UserRole }))}>
                      {roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
                    </select>
                  </div>
                  <Field label="Facility Name" value={signupForm.facilityName} onChange={(v) => setSignupForm((s) => ({ ...s, facilityName: v }))} />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input value={signupForm.country} onChange={(e) => setSignupForm((s) => ({ ...s, country: e.target.value }))} />
                </div>
                {authError && <ErrorText text={authError} />}
                <Button className="w-full bg-gradient-to-r from-royal-500 to-royal-700 text-white" onClick={handleSignup} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Account
                </Button>
                <p className="text-sm text-center text-gray-500">Have an account? <button className="text-royal-600 font-medium" onClick={() => { setAuthError(''); setStage('login'); }}>Login</button></p>
              </div>
            )}

            {stage === 'onboarding' && (
              <div className="space-y-4 auth-form-enter">
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                  Onboarding is mandatory before workspace access (including Google sign-in).
                </div>
                {pendingUser?.provider === 'email' && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Email Verification</span>
                      <Switch checked={emailVerified} onCheckedChange={setEmailVerified} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Simulate email verification completion.</p>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Role</Label>
                    <select className="w-full mt-1 rounded-md border border-input px-3 py-2 text-sm bg-white/80" value={onboardingForm.role} onChange={(e) => setOnboardingForm((f) => ({ ...f, role: e.target.value as UserRole }))}>
                      {roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Facility Type</Label>
                    <select className="w-full mt-1 rounded-md border border-input px-3 py-2 text-sm bg-white/80" value={onboardingForm.facilityType} onChange={(e) => setOnboardingForm((f) => ({ ...f, facilityType: e.target.value as FacilityType }))}>
                      <option>Hospital</option>
                      <option>Clinic</option>
                      <option>Pharmacy</option>
                      <option>Lab</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  <button className={`flex-1 px-3 py-2 text-sm rounded-md ${onboardingForm.facilityMode === 'create' ? 'bg-white text-royal-700' : 'text-gray-600'}`} onClick={() => setOnboardingForm((f) => ({ ...f, facilityMode: 'create' }))}>Create facility</button>
                  <button className={`flex-1 px-3 py-2 text-sm rounded-md ${onboardingForm.facilityMode === 'join' ? 'bg-white text-royal-700' : 'text-gray-600'}`} onClick={() => setOnboardingForm((f) => ({ ...f, facilityMode: 'join' }))}>Join facility</button>
                </div>
                <Field label={onboardingForm.facilityMode === 'create' ? 'Facility Name' : 'Existing Facility'} value={onboardingForm.facilityName} onChange={(v) => setOnboardingForm((f) => ({ ...f, facilityName: v }))} />
                {onboardingForm.facilityMode === 'join' && (
                  <Field label="Invitation Code (or email match)" value={onboardingForm.invitationCode} onChange={(v) => setOnboardingForm((f) => ({ ...f, invitationCode: v }))} />
                )}
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Department" value={onboardingForm.department} onChange={(v) => setOnboardingForm((f) => ({ ...f, department: v }))} />
                  <Field label="Specialty (if doctor)" value={onboardingForm.specialty} onChange={(v) => setOnboardingForm((f) => ({ ...f, specialty: v }))} />
                </div>
                <Field label="Years of Experience (optional)" value={onboardingForm.yearsExperience} onChange={(v) => setOnboardingForm((f) => ({ ...f, yearsExperience: v }))} />
                {onboardingForm.role === 'hospital-admin' && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
                    Admin onboarding: this will create a hospital workspace and initialize system modules.
                  </div>
                )}
                {authError && <ErrorText text={authError} />}
                <Button className="w-full bg-gradient-to-r from-royal-500 to-royal-700 text-white" onClick={completeOnboarding} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Complete Setup
                </Button>
              </div>
            )}

            {stage === 'welcome' && (
              <div className="space-y-4 auth-form-enter">
                <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-green-800">
                  <div className="flex items-center gap-2 mb-1"><CheckCircle2 className="w-5 h-5" />Setup complete</div>
                  <p className="text-sm">Welcome {pendingUser?.fullName} 👋</p>
                  <p className="text-sm">Switch ID: <strong>{pendingUser?.switchId}</strong></p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Optional 2FA Setup</p>
                      <p className="text-xs text-gray-500">You can enable this later from Security settings.</p>
                    </div>
                    <Switch checked={setup2FA} onCheckedChange={setSetup2FA} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="rounded-lg border border-gray-100 p-2">Future-ready: SSO hooks</div>
                  <div className="rounded-lg border border-gray-100 p-2">Future-ready: Gov Health ID login</div>
                  <div className="rounded-lg border border-gray-100 p-2">Future-ready: NFC card login</div>
                  <div className="rounded-lg border border-gray-100 p-2">Future-ready: hospital federated identity</div>
                </div>
                <Button className="w-full bg-gradient-to-r from-royal-500 to-royal-700 text-white" onClick={enterWorkspace}>
                  Enter Workspace
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white/80 focus:ring-2 focus:ring-royal-500/25 transition-all"
      />
    </div>
  );
}

function ErrorText({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700 flex items-start gap-2">
      <AlertCircle className="w-4 h-4 mt-0.5" />
      {text}
    </div>
  );
}

function PasswordStrength({ strength }: { strength: number }) {
  const labels = ['Weak', 'Weak', 'Moderate', 'Strong', 'Excellent'];
  const colors = ['bg-red-500', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-green-500'];
  return (
    <div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full transition-all ${colors[strength]}`} style={{ width: `${(strength / 4) * 100}%` }} />
      </div>
      <p className="text-xs text-gray-500 mt-1">Password strength: {labels[strength]}</p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <span className="mr-2 inline-flex">
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.6 14.7 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12S6.9 21.3 12 21.3c6.9 0 9.1-4.8 9.1-7.3 0-.5 0-.9-.1-1.3H12z"/>
      </svg>
    </span>
  );
}
