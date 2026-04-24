import { useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, BrainCircuit, CheckCircle2, History, ImageUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type AITab = 'symptom-engine' | 'imaging-analysis' | 'history-aware';

export function AIClinicalIntelligencePage() {
  const { canView } = useAuth();
  const [activeTab, setActiveTab] = useState<AITab>('symptom-engine');
  const [symptoms, setSymptoms] = useState('');
  const [uploadedScan, setUploadedScan] = useState<File | null>(null);
  const [risk, setRisk] = useState<'Low' | 'Moderate' | 'High'>('Moderate');

  const rankedConditions = useMemo(
    () => [
      { name: 'Type 2 Diabetes progression', probability: 0.78 },
      { name: 'Metabolic syndrome', probability: 0.61 },
      { name: 'Secondary hypertension', probability: 0.44 },
    ],
    [],
  );

  if (!canView('EMR')) {
    return <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">Access denied by RBAC policy.</div>;
  }

  return (
    <div className="space-y-4 page-transition">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Clinical Intelligence</h1>
          <p className="text-sm text-gray-500">Decision support with explainable risk scoring, imaging insight, and historical pattern detection.</p>
        </div>
        <div className="rounded-xl px-3 py-2 bg-amber-50 text-amber-700 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Clinical Decision Support - Not Final Diagnosis
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {[
          { id: 'symptom-engine', label: 'Symptom Diagnosis Engine' },
          { id: 'imaging-analysis', label: 'AI Imaging Diagnosis' },
          { id: 'history-aware', label: 'History-Aware Analysis' },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as AITab)} className={cn('px-4 py-2 rounded-lg text-sm', activeTab === tab.id ? 'bg-white text-royal-700 shadow-sm' : 'text-gray-600')}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'symptom-engine' && (
        <div className="rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl p-4 sm:p-6 shadow-soft space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <textarea className="min-h-28 rounded-md border border-input p-3 text-sm" placeholder="Enter symptoms (natural language or structured)" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
            <div className="rounded-xl border border-gray-200 p-3 bg-gray-50 text-sm">
              <p className="font-medium text-gray-900 mb-1">Dynamic Follow-up Questions</p>
              <ul className="space-y-1 text-gray-600">
                <li>Any nocturnal polyuria?</li>
                <li>Recent unexplained weight changes?</li>
                <li>Family history of endocrine disorders?</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button className="bg-royal-700 hover:bg-royal-800 text-white" onClick={() => toast.success('AI differential diagnosis report generated.')}>
              <BrainCircuit className="w-4 h-4 mr-2" />
              Run Differential Analysis
            </Button>
            <Button variant="outline" onClick={() => setRisk((prev) => (prev === 'Low' ? 'Moderate' : prev === 'Moderate' ? 'High' : 'Low'))}>Cycle Risk</Button>
            <Button variant="outline"><History className="w-4 h-4 mr-2" />View Previous Diagnoses</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={cn('rounded-xl p-3 border text-sm', risk === 'Low' ? 'bg-green-50 border-green-100 text-green-700' : risk === 'Moderate' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-red-50 border-red-100 text-red-700')}>
              Risk Score: {risk}
            </div>
            <div className="rounded-xl p-3 border bg-blue-50 border-blue-100 text-blue-700 text-sm">Recommended labs: HbA1c, FBS, Lipid Panel</div>
            <div className="rounded-xl p-3 border bg-purple-50 border-purple-100 text-purple-700 text-sm">Urgent escalation: Monitor if persistent dizziness with BP spikes</div>
          </div>
          <div className="rounded-xl border border-gray-200 p-3">
            <p className="font-medium text-sm text-gray-900 mb-2">Ranked Possible Conditions</p>
            <div className="space-y-2">
              {rankedConditions.map((condition) => (
                <div key={condition.name} className="flex items-center justify-between text-sm">
                  <span>{condition.name}</span>
                  <span className="font-medium">{Math.round(condition.probability * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'imaging-analysis' && (
        <div className="rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl p-4 sm:p-6 shadow-soft space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="rounded-xl border-2 border-dashed border-gray-200 p-4 text-sm text-gray-600 cursor-pointer">
              <input
                className="hidden"
                type="file"
                accept=".png,.jpg,.jpeg,.dcm,.pdf"
                onChange={(e) => setUploadedScan(e.target.files?.[0] ?? null)}
              />
              <ImageUp className="w-5 h-5 mb-2 text-royal-700" />
              Upload X-ray / CT / MRI / Ultrasound / ECG
            </label>
            <div className="rounded-xl border border-gray-200 p-3 bg-gray-50 text-sm">
              <p className="font-medium text-gray-900">Imaging Analysis Pipeline</p>
              <p className="text-gray-600 mt-1">Preprocessing to heatmap to confidence scoring to suggested conditions</p>
              <p className="text-gray-600 mt-1">Versioned analysis + doctor approve/reject feedback loop</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button className="bg-royal-700 hover:bg-royal-800 text-white" disabled={!uploadedScan} onClick={() => toast.success('AI imaging report generated with anomaly heatmap.')}>
              Analyze Uploaded Imaging
            </Button>
            <Button variant="outline">Compare with Previous Scans</Button>
            <Button variant="outline">Approve / Reject Findings</Button>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            Highlighted suspicious regions and confidence are advisory; doctor validation required.
          </div>
        </div>
      )}

      {activeTab === 'history-aware' && (
        <div className="rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl p-4 sm:p-6 shadow-soft">
          <h3 className="font-semibold text-gray-900 mb-3">History-Aware AI Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
              <p className="font-medium">Pattern Detected</p>
              <p className="mt-1">Recurrent elevated glucose trends across last 4 visits.</p>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              <p className="font-medium">Chronic Progression Risk</p>
              <p className="mt-1">Moderate risk of glycemic deterioration in 6 months.</p>
            </div>
            <div className="rounded-xl border border-purple-100 bg-purple-50 p-3 text-sm text-purple-700">
              <p className="font-medium">Recurrent Anomaly Flag</p>
              <p className="mt-1">Lipid panel fluctuations linked with inconsistent medication refill intervals.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline"><BarChart3 className="w-4 h-4 mr-2" />Compare Symptom History</Button>
            <Button variant="outline"><CheckCircle2 className="w-4 h-4 mr-2" />Mark reviewed by clinician</Button>
          </div>
        </div>
      )}
    </div>
  );
}
