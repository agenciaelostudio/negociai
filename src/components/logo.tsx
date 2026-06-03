import { MessageCircleMore } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 font-bold", className)}>
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <MessageCircleMore className={cn("size-5", iconClassName)} />
      </span>
      <span className="text-xl tracking-tight">
        Negoci<span className="text-primary">Aí</span>
      </span>
    </div>
  );
}
