import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Estado =
  | "nuevo"
  | "contactado"
  | "reunion_agendada"
  | "reunion_hecha"
  | "propuesta_enviada"
  | "negociando"
  | "pagado"
  | "perdido";

const estadoConfig: Record<Estado, { label: string; className: string }> = {
  nuevo: {
    label: "Nuevo",
    className: "bg-status-nuevo/20 text-status-nuevo border-status-nuevo/30",
  },
  contactado: {
    label: "Contactado",
    className: "bg-status-contactado/20 text-status-contactado border-status-contactado/30",
  },
  reunion_agendada: {
    label: "Reunión Agendada",
    className: "bg-status-reunionAgendada/20 text-status-reunionAgendada border-status-reunionAgendada/30",
  },
  reunion_hecha: {
    label: "Reunión Hecha",
    className: "bg-status-reunionHecha/20 text-status-reunionHecha border-status-reunionHecha/30",
  },
  propuesta_enviada: {
    label: "Propuesta Enviada",
    className: "bg-status-propuestaEnviada/20 text-status-propuestaEnviada border-status-propuestaEnviada/30",
  },
  negociando: {
    label: "Negociando",
    className: "bg-status-negociando/20 text-status-negociando border-status-negociando/30",
  },
  pagado: {
    label: "Pagado",
    className: "bg-status-pagado/20 text-status-pagado border-status-pagado/30",
  },
  perdido: {
    label: "Perdido",
    className: "bg-status-perdido/20 text-status-perdido border-status-perdido/30",
  },
};

interface StatusBadgeProps {
  estado: Estado;
  className?: string;
}

export function StatusBadge({ estado, className }: StatusBadgeProps) {
  const config = estadoConfig[estado];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
