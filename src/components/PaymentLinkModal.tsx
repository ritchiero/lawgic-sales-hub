import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

type Prospect = {
  id: string;
  nombre: string;
  producto_interes: string | null;
  monto_estimado: number | null;
};

interface PaymentLinkModalProps {
  open: boolean;
  onClose: () => void;
  prospect: Prospect;
}

export function PaymentLinkModal({ open, onClose, prospect }: PaymentLinkModalProps) {
  const [monto, setMonto] = useState(prospect.monto_estimado?.toString() || "");
  const [paymentLink, setPaymentLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    // TODO: Integrar con Stripe real
    const link = `https://pay.lawgic.mx/checkout/${prospect.id}?amount=${monto}`;
    setPaymentLink(link);
    toast.success("Link de pago generado");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    toast.success("Link copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generar Link de Pago</DialogTitle>
          <DialogDescription>
            {prospect.nombre} - {prospect.producto_interes || "Sin producto"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monto">Monto (MXN)</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {!paymentLink ? (
            <Button onClick={handleGenerate} className="w-full" disabled={!monto}>
              Generar Link
            </Button>
          ) : (
            <div className="space-y-2">
              <Label>Link de Pago</Label>
              <div className="flex gap-2">
                <Input value={paymentLink} readOnly className="flex-1" />
                <Button size="icon" variant="outline" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Este link expirará en 7 días. Integración con Stripe próximamente.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
