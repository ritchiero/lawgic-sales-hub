import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  color: string;
  children: React.ReactNode;
}

export function KanbanColumn({ id, title, count, color, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col min-w-[280px] max-w-[280px] h-fit bg-card border border-border rounded-lg transition-colors",
        isOver && "ring-2 ring-primary"
      )}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", color)} />
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {count}
          </span>
        </div>
      </div>
      <div className="p-2 space-y-2 min-h-[200px]">
        {children}
      </div>
    </div>
  );
}
