import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, Loader2, Nfc } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { PatientStatus, PatientTag, RegistryPatient } from '@/lib/patientRegistry';
import { createPatient } from '@/lib/patientRegistry';

type Draft = Omit<RegistryPatient, 'id' | 'switchId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;

const initialDraft = (tenantId: string): Draft => ({
  tenantId,
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'male',
  phone: '',
  email: '',
  address: '',
  state: '',
  country: '',
  maritalStatus: '',
  occupation: '',
  nationalId: '',
  profilePhoto: '',
  bloodGroup: '',
  genotype: '',
  allergies: '',
  chronicConditions: '',
  currentMedications: '',
  familyMedicalHistory: '',
  pastSurgeries: '',
  disabilityStatus: '',
  pregnancyStatus: '',
  emergencyContactName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
  emergencyAddress: '',
  insuranceProvider: '',
  insurancePolicyNumber: '',
  insuranceExpiryDate: '',
  insuranceType: '',
  nfcCardId: '',
  nfcActive: false,
  status: 'active',
  tags: [],
  documents: [],
  timeline: [],
  doctorAssigned: '',
  department: '',
  admissionStatus: 'Outpatient',
  insuranceProviderFilter: '',
});

const steps = ['Basic Info', 'Medical Info', 'Emergency Contact', 'Insurance', 'NFC & Confirm'];

interface PatientOnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  creatorName: string;
  canCreate: boolean;
  onCreated?: () => void;
}

export function PatientOnboardingWizard({
  open,
  onOpenChange,
  tenantId,
  creatorName,
  canCreate,
  onCreated,
}: PatientOnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [draft, setDraft] = useState<Draft>(initialDraft(tenantId));

  const canProceed = useMemo(() => {
    if (step === 1) {
      return Boolean(draft.firstName && draft.lastName && draft.dateOfBirth && draft.phone && draft.address && draft.state && draft.country);
    }
    if (step === 3) {
      return Boolean(draft.emergencyContactName && draft.emergencyRelationship && draft.emergencyPhone);
    }
    return true;
  }, [step, draft]);

  const updateField = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const emailPattern = /^\S+@\S+\.\S+$/;
    const phonePattern = /^\+?[0-9]{10,15}$/;
    if (draft.email && !emailPattern.test(draft.email)) {
      throw new Error('Enter a valid email address');
    }
    if (!phonePattern.test(draft.phone) || !phonePattern.test(draft.emergencyPhone)) {
      throw new Error('Phone number must be 10-15 digits and can include +');
    }
  };

  const submit = async () => {
    if (!canCreate) {
      toast.error('Permission denied: RBAC policy blocks patient creation.');
      return;
    }
    try {
      validate();
      setSubmitting(true);
      await createPatient(creatorName, {
        ...draft,
        tenantId,
        insuranceProviderFilter: draft.insuranceProvider,
      });
      toast.success('Patient registered successfully', {
        description: 'Switch ID has been generated and audit entry recorded.',
      });
      setDraft(initialDraft(tenantId));
      setStep(1);
      onOpenChange(false);
      onCreated?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create patient';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-[1320px] h-[95vh] md:h-[90vh] bg-white/95 backdrop-blur-2xl border border-white/70 overflow-hidden p-0 rounded-2xl shadow-2xl">
        <DialogHeader className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-royal-50/80 to-indigo-50/60">
          <DialogTitle className="text-[#1E1B8F]">Patient Onboarding Wizard</DialogTitle>
          <p className="text-xs text-gray-500">Enterprise registry flow with server-side Switch ID generation.</p>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-[35%_65%] lg:grid-cols-[28%_72%] h-full min-h-0">
          <aside className="hidden md:block border-r border-gray-100 bg-white/70 md:overflow-y-auto">
            <div className="sticky top-0 p-4 lg:p-5 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <p className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-3">Onboarding Steps</p>
              <div className="space-y-2">
                {steps.map((name, index) => (
                  <button
                    key={name}
                    onClick={() => setStep(index + 1)}
                    className={cn(
                      'w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all text-left',
                      step === index + 1 ? 'bg-[#1E1B8F] text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100',
                    )}
                  >
                    <span>{name}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="overflow-y-auto bg-white">
            <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 pb-28">
              <div className="md:hidden mb-4 -mx-1 overflow-x-auto">
                <div className="flex gap-2 px-1 pb-1">
                  {steps.map((name, index) => (
                    <button
                      key={name}
                      onClick={() => setStep(index + 1)}
                      className={cn(
                        'whitespace-nowrap rounded-lg px-3 py-2 text-xs transition-all',
                        step === index + 1 ? 'bg-[#1E1B8F] text-white' : 'bg-gray-100 text-gray-600',
                      )}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Identity Details</h3>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <Input placeholder="First name *" value={draft.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
                      <Input placeholder="Middle name" value={draft.middleName} onChange={(e) => updateField('middleName', e.target.value)} />
                      <Input placeholder="Last name *" value={draft.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
                      <Input type="date" value={draft.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
                      <select className="h-10 rounded-md border border-input px-3 text-sm bg-white" value={draft.gender} onChange={(e) => updateField('gender', e.target.value as Draft['gender'])}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <Input placeholder="Phone number *" value={draft.phone} onChange={(e) => updateField('phone', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Contact & Address</h3>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <Input type="email" placeholder="Email" value={draft.email} onChange={(e) => updateField('email', e.target.value)} />
                      <Input placeholder="State *" value={draft.state} onChange={(e) => updateField('state', e.target.value)} />
                      <Input placeholder="Country *" value={draft.country} onChange={(e) => updateField('country', e.target.value)} />
                      <Input placeholder="Marital status" value={draft.maritalStatus} onChange={(e) => updateField('maritalStatus', e.target.value)} />
                      <Input placeholder="Occupation" value={draft.occupation} onChange={(e) => updateField('occupation', e.target.value)} />
                      <Input placeholder="National ID (optional)" value={draft.nationalId} onChange={(e) => updateField('nationalId', e.target.value)} />
                      <Input placeholder="Address *" value={draft.address} onChange={(e) => updateField('address', e.target.value)} className="md:col-span-2 xl:col-span-3" />
                      <Input placeholder="Profile photo URL" value={draft.profilePhoto} onChange={(e) => updateField('profilePhoto', e.target.value)} className="md:col-span-2 xl:col-span-3" />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Clinical Profile</h3>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <Input placeholder="Blood group" value={draft.bloodGroup} onChange={(e) => updateField('bloodGroup', e.target.value)} />
                      <Input placeholder="Genotype" value={draft.genotype} onChange={(e) => updateField('genotype', e.target.value)} />
                      <Input placeholder="Disability status" value={draft.disabilityStatus} onChange={(e) => updateField('disabilityStatus', e.target.value)} />
                      <Input placeholder="Allergies" value={draft.allergies} onChange={(e) => updateField('allergies', e.target.value)} />
                      <Input placeholder="Chronic conditions" value={draft.chronicConditions} onChange={(e) => updateField('chronicConditions', e.target.value)} />
                      <Input placeholder="Current medications" value={draft.currentMedications} onChange={(e) => updateField('currentMedications', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">History</h3>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <Input placeholder="Family medical history" value={draft.familyMedicalHistory} onChange={(e) => updateField('familyMedicalHistory', e.target.value)} className="md:col-span-2 xl:col-span-3" />
                      <Input placeholder="Past surgeries" value={draft.pastSurgeries} onChange={(e) => updateField('pastSurgeries', e.target.value)} className="md:col-span-2 xl:col-span-3" />
                      <Input placeholder="Pregnancy status (if applicable)" value={draft.pregnancyStatus} onChange={(e) => updateField('pregnancyStatus', e.target.value)} className="md:col-span-2 xl:col-span-3" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Emergency Contact</h3>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <Input placeholder="Emergency contact name *" value={draft.emergencyContactName} onChange={(e) => updateField('emergencyContactName', e.target.value)} />
                      <Input placeholder="Relationship *" value={draft.emergencyRelationship} onChange={(e) => updateField('emergencyRelationship', e.target.value)} />
                      <Input placeholder="Emergency phone *" value={draft.emergencyPhone} onChange={(e) => updateField('emergencyPhone', e.target.value)} />
                      <Input placeholder="Emergency address" value={draft.emergencyAddress} onChange={(e) => updateField('emergencyAddress', e.target.value)} className="md:col-span-2 xl:col-span-3" />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Insurance Information</h3>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <Input placeholder="Insurance provider" value={draft.insuranceProvider} onChange={(e) => updateField('insuranceProvider', e.target.value)} />
                      <Input placeholder="Policy number" value={draft.insurancePolicyNumber} onChange={(e) => updateField('insurancePolicyNumber', e.target.value)} />
                      <Input type="date" placeholder="Expiry date" value={draft.insuranceExpiryDate} onChange={(e) => updateField('insuranceExpiryDate', e.target.value)} />
                      <Input placeholder="Insurance type" value={draft.insuranceType} onChange={(e) => updateField('insuranceType', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-gray-200 p-4 bg-gradient-to-br from-white to-gray-50">
                    <p className="font-semibold text-gray-900 flex items-center gap-2"><Nfc className="w-4 h-4 text-royal-600" />NFC Assignment</p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <Input placeholder="NFC card ID (optional)" value={draft.nfcCardId} onChange={(e) => updateField('nfcCardId', e.target.value)} />
                      <select
                        className="h-10 rounded-md border border-input px-3 text-sm bg-white"
                        value={String(draft.nfcActive)}
                        onChange={(e) => updateField('nfcActive', e.target.value === 'true')}
                      >
                        <option value="false">NFC inactive</option>
                        <option value="true">Activate NFC link</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Care Settings</h3>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <select
                        className="h-10 rounded-md border border-input px-3 text-sm bg-white"
                        value={draft.status}
                        onChange={(e) => updateField('status', e.target.value as PatientStatus)}
                      >
                        <option value="active">Active</option>
                        <option value="inpatient">Inpatient</option>
                        <option value="outpatient">Outpatient</option>
                        <option value="discharged">Discharged</option>
                        <option value="referred">Referred</option>
                      </select>
                      <Input placeholder="Doctor assigned" value={draft.doctorAssigned} onChange={(e) => updateField('doctorAssigned', e.target.value)} />
                      <Input placeholder="Department" value={draft.department} onChange={(e) => updateField('department', e.target.value)} />
                      <Input placeholder="Admission status" value={draft.admissionStatus} onChange={(e) => updateField('admissionStatus', e.target.value)} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['vip', 'high-risk', 'chronic-care', 'pediatric', 'geriatric'] as PatientTag[]).map((tag) => (
                      <button
                        key={tag}
                        className={cn(
                          'px-3 py-1 rounded-full text-xs border transition-colors',
                          draft.tags.includes(tag) ? 'bg-royal-600 text-white border-royal-600' : 'bg-white text-gray-600 border-gray-200',
                        )}
                        onClick={() =>
                          updateField(
                            'tags',
                            draft.tags.includes(tag) ? draft.tags.filter((item) => item !== tag) : [...draft.tags, tag],
                          )
                        }
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Switch ID will be generated as <span className="font-semibold">SW-YYYY-XXXXXX</span> at save time.
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 border-t border-gray-100 bg-white/95 backdrop-blur px-4 py-3 sm:px-6 lg:px-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button className="w-full sm:w-auto" variant="outline" onClick={() => (step > 1 ? setStep((prev) => prev - 1) : onOpenChange(false))}>
                {step > 1 ? 'Previous Step' : 'Cancel'}
              </Button>
              {step < 5 ? (
                <Button className="w-full sm:w-auto bg-royal-700 hover:bg-royal-800 text-white" onClick={() => setStep((prev) => prev + 1)} disabled={!canProceed}>
                  Next Step
                </Button>
              ) : (
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white" onClick={submit} disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Complete Onboarding
                </Button>
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
