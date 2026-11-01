import { SparklesIcon } from 'lucide-react';

type MessageLoadingProps = {
  text: string;
};

export const MessageLoading = ({ text }: MessageLoadingProps) => (
  <div className="flex justify-start">
    <div className="flex items-center gap-2.5 rounded-xl border border-white/6 bg-white/3 px-3 py-2 text-[13px] text-neutral-300 shadow-xs backdrop-blur-xs">
      <SparklesIcon size={16} className="animate-pulse text-blue-400/80" />
      <span className="animate-pulse font-medium tracking-wide">{text}</span>
      <div className="ml-0.5 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1 rounded-full bg-blue-400/60"
            style={{
              animation: `picoclaw-loading-bounce 1.4s ease-in-out ${i * 0.16}s infinite`
            }}
          />
        ))}
      </div>
    </div>
  </div>
);
