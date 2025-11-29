import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { TemperatureBadge } from "./TemperatureBadge";

type Prospect = {
  id: string;
  nombre: string;
  empresa: string | null;
  temperatura: string;
  monto_estimado: number | null;
  created_at: string;
  updated_at: string;
};

interface KanbanCardProps {
  prospect: Prospect;
  onClick: () => void;
  isDragging?: boolean;
}

export function KanbanCard({ prospect, onClick, isDragging = false }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: prospect.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const daysSinceUpdate = Math.floor(
    (new Date().getTime() - new Date(prospect.updated_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "bg-background border border-border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow",
        isDragging && "opacity-50"
      )}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm line-clamp-1">{prospect.nombre}</h4>
          <TemperatureBadge temperatura={prospect.temperatura as any} />
        </div>

        {prospect.empresa && (
          <p className="text-xs text-muted-foreground line-clamp-1">{prospect.empresa}</p>
        )}

        {prospect.monto_estimado && (
          <p className="text-sm font-semibold text-primary">
            ${Number(prospect.monto_estimado).toLocaleString("es-MX")}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <span>
            {daysSinceUpdate === 0
              ? "Hoy"
              : daysSinceUpdate === 1
              ? "1 día"
              : `${daysSinceUpdate} días`}
          </span>
        </div>
      </div>
    </div>
  );
}
