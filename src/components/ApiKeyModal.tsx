import React, { useState } from 'react';
import { X, Key, ShieldCheck, Sparkles, Check, AlertCircle, Cpu, Terminal } from 'lucide-react';
import { MarkdownContent } from './MarkdownContent';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentApiKey,
  onSaveApiKey,
}) => {
  const [keyInput, setKeyInput] = useState<string>(currentApiKey);
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [sampleResponse, setSampleResponse] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    onClose();
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveApiKey('');
    setTestingStatus('idle');
    setStatusMessage('Clé supprimée. Le moteur de secours déterministe est actif.');
    setSampleResponse('');
  };

  const handleTestKey = async () => {
    const cleanKey = keyInput.trim();
    if (!cleanKey) {
      setTestingStatus('failed');
      setStatusMessage('Veuillez entrer une clé API pour effectuer le test.');
      return;
    }

    setTestingStatus('testing');
    setStatusMessage('Validation avec client = genai.Client() et model="gemma-4-26b-a4b-it"...');
    setSampleResponse('');

    // 1. Try Python google-genai backend first
    try {
      const response = await fetch('/api/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: cleanKey }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestingStatus('success');
        setStatusMessage(`✅ Connexion google-genai SDK validée ! Modèle : ${data.model}`);
        if (data.sample) {
          setSampleResponse(data.sample);
        }
        return;
      }
    } catch (e) {
      console.warn('Backend proxy test failed, trying direct browser test:', e);
    }

    // 2. Direct browser fallback test
    try {
      const directRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${cleanKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Roses are red...' }] }],
          }),
        }
      );

      if (directRes.ok) {
        const data = await directRes.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        setTestingStatus('success');
        setStatusMessage('✅ Clé Google AI Studio valide ! Connectée à l’API Cloud.');
        if (text) {
          setSampleResponse(text);
        }
        return;
      } else {
        const errData = await directRes.json().catch(() => ({}));
        setTestingStatus('failed');
        setStatusMessage(`Erreur API (${directRes.status}): ${errData?.error?.message || 'Clé non reconnue'}`);
      }
    } catch (err: any) {
      setTestingStatus('failed');
      setStatusMessage(`Échec réseau : ${err.message || 'Impossible de joindre le serveur'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Configuration IA (Google GenAI SDK)</h3>
            <p className="text-xs text-slate-400">
              Module officiel <code className="text-emerald-400">google-genai</code> • Modèle <code className="text-indigo-400">gemma-4-26b-a4b-it</code>
            </p>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 mb-4 font-mono text-[11px] text-slate-300">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-slate-400 text-[10px]">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Python SDK Implementation (google-genai)</span>
            </span>
            <span className="text-emerald-400">Actif sur le Backend</span>
          </div>
          <div className="text-slate-400">from google import genai</div>
          <div className="text-slate-400">client = genai.Client()</div>
          <div className="text-slate-200">
            response = client.models.generate_content(
          </div>
          <div className="text-emerald-400 pl-4">
            model="gemma-4-26b-a4b-it",
          </div>
          <div className="text-slate-300 pl-4">
            contents="Roses are red..."
          </div>
          <div className="text-slate-200">)</div>
          <div className="text-indigo-300">print(response.text)</div>
        </div>

        {/* Key Input */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-semibold text-slate-300 block">
            Google AI Studio API Key :
          </label>
          <input
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AQ... ou AIzaSy..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
          />
          <p className="text-[11px] text-slate-500">
            Cette clé est transmise au client <code className="text-slate-400">genai.Client(api_key=...)</code>.
          </p>
        </div>

        {/* Testing status feedback */}
        {testingStatus !== 'idle' && (
          <div
            className={`p-3 rounded-xl text-xs mb-4 flex flex-col gap-2 ${
              testingStatus === 'success'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                : testingStatus === 'testing'
                ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800'
                : 'bg-red-950/60 text-red-300 border border-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {testingStatus === 'success' && <Check className="w-4 h-4 shrink-0" />}
              {testingStatus === 'failed' && <AlertCircle className="w-4 h-4 shrink-0" />}
              <span className="font-semibold">{statusMessage}</span>
            </div>

            {sampleResponse && (
              <div className="mt-1 p-2.5 rounded-lg bg-slate-950/80 border border-emerald-900/40 text-[11px] text-slate-200">
                <MarkdownContent content={sampleResponse} />
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestKey}
              disabled={testingStatus === 'testing'}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>{testingStatus === 'testing' ? 'Exécution SDK...' : 'Tester le SDK GenAI'}</span>
            </button>
            {keyInput && (
              <button
                onClick={handleClear}
                className="px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/30 text-xs font-semibold transition-colors"
              >
                Supprimer
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold"
            >
              Fermer
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
