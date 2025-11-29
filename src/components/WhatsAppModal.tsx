import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Check, ExternalLink } from "lucide-react";

type Prospect = {
  nombre: string;
  producto_interes: string | null;
  monto_estimado: number | null;
};

interface WhatsAppModalProps {
  open: boolean;
  onClose: () => void;
  prospect: Prospect;
}

export function WhatsAppModal({ open, onClose, prospect }: WhatsAppModalProps) {
  const mensaje = `Hola Roberto,

Te comparto la info del prospecto:

• Nombre: ${prospect.nombre}
• Producto: ${prospect.producto_interes || "Sin especificar"}
• Monto estimado: ${prospect.monto_estimado ? `$${Number(prospect.monto_estimado).toLocaleString("es-MX")} MXN` : "Sin especificar"}

¿Podrías darle seguimiento?

Saludos`;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mensaje);
    setCopied(true);
    toast.success("Mensaje copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    // TODO: Agregar número de Roberto
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enviar a Roberto</DialogTitle>
          <DialogDescription>
            Mensaje prellenado con la información del prospecto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea value={mensaje} readOnly rows={12} className="font-mono text-sm" />

          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copiar mensaje
            </Button>
            <Button onClick={handleOpenWhatsApp} className="flex-1 gap-2">
              <ExternalLink className="h-4 w-4" />
              Abrir WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
