import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, className = '' }) => {
  return (
    <div className={`markdown-body text-slate-200 text-xs sm:text-sm leading-relaxed space-y-2.5 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-extrabold text-white mt-3 mb-1.5 border-b border-slate-800 pb-1 flex items-center gap-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-bold text-white mt-2.5 mb-1 flex items-center gap-1.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-bold text-emerald-400 mt-2 mb-1">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-1.5 leading-relaxed text-slate-200">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-300">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="my-2 space-y-1 pl-4 list-disc marker:text-emerald-400 text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 space-y-1 pl-4 list-decimal marker:text-indigo-400 text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-2 pl-3.5 py-1.5 border-l-2 border-emerald-500 bg-slate-950/60 rounded-r-xl text-slate-300 italic text-xs sm:text-sm">
              {children}
            </blockquote>
          ),
          code: ({ inline, className: codeClass, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="font-mono text-[11px] sm:text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-300 mx-0.5"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="my-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] sm:text-xs text-slate-200 overflow-x-auto">
                <code>{children}</code>
              </pre>
            );
          },
          hr: () => <hr className="my-3 border-slate-800" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="w-full text-xs text-left border-collapse border border-slate-800">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 font-bold text-slate-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-slate-800 px-2.5 py-1 text-slate-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
