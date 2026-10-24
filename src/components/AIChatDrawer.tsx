import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  HelpCircle,
  RotateCcw,
  Cpu,
  CheckCircle,
} from 'lucide-react';
import { StudentProfile, ChatMessage } from '../types/student';
import { askTawjihAI } from '../services/aiService';
import { MarkdownContent } from './MarkdownContent';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  apiKey: string;
  onOpenApiKeyModal: () => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  student,
  apiKey,
  onOpenApiKeyModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      timestamp: 'À l’instant',
      content: `👋 Salam ${student.name} ! Je suis votre conseiller d’orientation intelligent **Tawjih AI**.

J'ai analysé en direct votre relevé de notes actuel en **${student.levelLabel}** :
- **Mathématiques :** \`${student.currentGrades.math}/20\`
- **Physique-Chimie :** \`${student.currentGrades.physics}/20\`
- **SVT :** \`${student.currentGrades.svt}/20\`
- **Objectif Verrouillé :** **${student.targetThresholds.careerName}**

Cliquez sur l'une des suggestions rapides ci-dessous ou posez-moi votre question !`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastModelUsed, setLastModelUsed] = useState<string>(
    apiKey ? 'Gemini 1.5 Cloud' : 'Tawjih Neural Engine (Offline Fallback)'
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompt chips as requested in requirements
  const promptChips = [
    "I'm in 7th/9th grade, should I do Tronc Commun Scientifique, Science Math, or SVT?",
    "Based on my points right now, can I become a Doctor, Engineer, or Pilot?",
    "Why did my Engineering probability drop after my last Math test?",
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // When student switches, update welcoming message
  useEffect(() => {
    setMessages([
      {
        id: `init-${student.id}-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'À l’instant',
        content: `👋 Salam ${student.name} ! Je suis votre conseiller d’orientation intelligent **Tawjih AI**.

J'ai analysé en direct votre relevé de notes actuel en **${student.levelLabel}** :
- **Mathématiques :** \`${student.currentGrades.math}/20\`
- **Physique-Chimie :** \`${student.currentGrades.physics}/20\`
- **SVT :** \`${student.currentGrades.svt}/20\`
- **Objectif Verrouillé :** **${student.targetThresholds.careerName}**

Cliquez sur l'une des suggestions rapides ci-dessous ou posez-moi votre question !`,
      },
    ]);
  }, [student.id]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await askTawjihAI(query, student, student.currentGrades, apiKey);
      setLastModelUsed(response.modelUsed);

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: response.content,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: "Désolé, une erreur temporaire s'est produite. Le moteur de secours reste opérationnel.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-950/95 border-l border-slate-800 shadow-2xl flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>Conseiller Tawjih AI</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Grounded
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {student.name} • Math: {student.currentGrades.math}/20, PC: {student.currentGrades.physics}/20
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setMessages([
                {
                  id: `reset-${Date.now()}`,
                  sender: 'assistant',
                  timestamp: 'À l’instant',
                  content: `Historique réinitialisé pour ${student.name}. Posez une nouvelle question !`,
                },
              ])
            }
            title="Effacer le chat"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Engine Status Banner */}
      <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Moteur actif : </span>
          <strong className="text-slate-200">{lastModelUsed}</strong>
        </div>
        <button
          onClick={onOpenApiKeyModal}
          className="text-emerald-400 hover:underline font-semibold"
        >
          {apiKey ? 'Clé Configurée' : '+ Ajouter Clé Gemini'}
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none whitespace-pre-wrap'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              {msg.sender === 'assistant' ? (
                <MarkdownContent content={msg.content} />
              ) : (
                msg.content
              )}
              <div
                className={`text-[10px] mt-2 text-right ${
                  msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5 text-indigo-300">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-slate-400 font-mono pl-1">
                Analyse algorithmique des notes...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Questions Fréquentes (1 Clic) :</span>
        </span>
        <div className="flex flex-col gap-1.5">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              disabled={isLoading}
              className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all truncate"
            >
              💬 {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Posez votre question (ex: Puis-je faire Sciences Math ?)..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-md shadow-emerald-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
