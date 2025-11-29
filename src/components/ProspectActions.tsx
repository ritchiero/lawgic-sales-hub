import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, MessageSquare, Check, X, MoreHorizontal } from "lucide-react";
import { PaymentLinkModal } from "./PaymentLinkModal";
import { WhatsAppModal } from "./WhatsAppModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Prospect = {
  id: string;
  nombre: string;
  empresa: string | null;
  producto_interes: string | null;
  monto_estimado: number | null;
  estado: string;
  notas: string | null;
};

interface ProspectActionsProps {
  prospect: Prospect;
  onUpdate: () => void;
}

export function ProspectActions({ prospect, onUpdate }: ProspectActionsProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const handleMarkAsPaid = async () => {
    try {
      const { error } = await supabase
        .from("prospects")
        .update({ estado: "pagado" })
        .eq("id", prospect.id);

      if (error) throw error;

      await supabase.from("prospect_history").insert({
        prospect_id: prospect.id,
        campo_modificado: "estado",
        valor_anterior: prospect.estado,
        valor_nuevo: "pagado",
      });

      toast.success("Prospecto marcado como pagado");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Error al marcar como pagado");
    }
  };

  const handleMarkAsLost = async (reason: string) => {
    try {
      const { error } = await supabase
        .from("prospects")
        .update({ 
          estado: "perdido",
          notas: `${prospect.notas || ""}\n\nRazón de pérdida: ${reason}`.trim()
        })
        .eq("id", prospect.id);

      if (error) throw error;

      await supabase.from("prospect_history").insert({
        prospect_id: prospect.id,
        campo_modificado: "estado",
        valor_anterior: prospect.estado,
        valor_nuevo: "perdido",
      });

      toast.success("Prospecto marcado como perdido");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Error al marcar como perdido");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowPaymentModal(true)}
          className="gap-2"
        >
          <CreditCard className="h-4 w-4" />
          Generar link de pago
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowWhatsAppModal(true)}
          className="gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Enviar a Roberto
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleMarkAsPaid} className="gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Marcar como pagado
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleMarkAsLost("No especificada")}
              className="gap-2"
            >
              <X className="h-4 w-4 text-red-500" />
              Marcar como perdido
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <PaymentLinkModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        prospect={prospect}
      />

      <WhatsAppModal
        open={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        prospect={prospect}
      />
    </>
  );
}
