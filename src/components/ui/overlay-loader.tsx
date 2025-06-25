import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverlayLoaderProps {
  show: boolean;
  text?: string;
  className?: string;
}

export default function OverlayLoader({ show, text = "Loading...", className }: OverlayLoaderProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity",
        className
      )}
    >
      <Loader2 className="h-10 w-10 animate-spin text-white mb-4" />
      <span className="text-white text-sm font-medium">{text}</span>
    </div>
  );
}
