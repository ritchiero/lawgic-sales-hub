import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type Prospect = {
  id: string;
  nombre: string;
  empresa: string | null;
  email: string | null;
  telefono: string | null;
  fuente: string | null;
  estado: string;
  temperatura: string;
  compromiso: string | null;
  producto_interes: string | null;
  monto_estimado: number | null;
  proxima_accion: string | null;
  fecha_proxima_accion: string | null;
  fecha_ultima_reunion: string | null;
  notas: string | null;
  created_at: string;
};

interface ProspectModalProps {
  open: boolean;
  onClose: () => void;
  prospect?: Prospect | null;
}

export function ProspectModal({ open, onClose, prospect }: ProspectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: prospect || {
      nombre: "",
      empresa: "",
      email: "",
      telefono: "",
      fuente: "",
      estado: "nuevo",
      temperatura: "warm",
      compromiso: "",
      producto_interes: "",
      monto_estimado: null,
      proxima_accion: "",
      fecha_proxima_accion: "",
      notas: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (prospect) {
        const { error } = await supabase
          .from("prospects")
          .update(data)
          .eq("id", prospect.id);

        if (error) throw error;
        toast.success("Prospecto actualizado exitosamente");
      } else {
        const { error } = await supabase.from("prospects").insert([data]);

        if (error) throw error;
        toast.success("Prospecto creado exitosamente");
      }

      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{prospect ? "Editar Prospecto" : "Nuevo Prospecto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="basico" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basico">Info Básica</TabsTrigger>
              <TabsTrigger value="estado">Estado</TabsTrigger>
              <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
            </TabsList>

            <TabsContent value="basico" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input id="nombre" {...register("nombre", { required: true })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa/Despacho</Label>
                  <Input id="empresa" {...register("empresa")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" {...register("telefono")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuente">Fuente (¿Cómo llegó?)</Label>
                  <Input id="fuente" {...register("fuente")} placeholder="Referido, LinkedIn, etc." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="producto_interes">Producto de Interés</Label>
                  <Input id="producto_interes" {...register("producto_interes")} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="estado" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    defaultValue={watch("estado")}
                    onValueChange={(value) => setValue("estado", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nuevo">Nuevo</SelectItem>
                      <SelectItem value="contactado">Contactado</SelectItem>
                      <SelectItem value="reunion_agendada">Reunión Agendada</SelectItem>
                      <SelectItem value="reunion_hecha">Reunión Hecha</SelectItem>
                      <SelectItem value="propuesta_enviada">Propuesta Enviada</SelectItem>
                      <SelectItem value="negociando">Negociando</SelectItem>
                      <SelectItem value="pagado">Pagado</SelectItem>
                      <SelectItem value="perdido">Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperatura">Temperatura</Label>
                  <Select
                    defaultValue={watch("temperatura")}
                    onValueChange={(value) => setValue("temperatura", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hot">🔥 Hot</SelectItem>
                      <SelectItem value="warm">🌤️ Warm</SelectItem>
                      <SelectItem value="cold">❄️ Cold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compromiso">Compromiso</Label>
                  <Select
                    defaultValue={watch("compromiso") || undefined}
                    onValueChange={(value) => setValue("compromiso", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inmediato">Inmediato</SelectItem>
                      <SelectItem value="30_dias">30 días</SelectItem>
                      <SelectItem value="explorando">Explorando</SelectItem>
                      <SelectItem value="no_interesado">No interesado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monto_estimado">Monto Estimado (MXN)</Label>
                  <Input
                    id="monto_estimado"
                    type="number"
                    step="0.01"
                    {...register("monto_estimado")}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seguimiento" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="proxima_accion">Próxima Acción</Label>
                  <Input
                    id="proxima_accion"
                    {...register("proxima_accion")}
                    placeholder="Enviar propuesta, agendar seguimiento..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_proxima_accion">Fecha Próxima Acción</Label>
                  <Input
                    id="fecha_proxima_accion"
                    type="date"
                    {...register("fecha_proxima_accion")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notas">Notas</Label>
                  <Textarea
                    id="notas"
                    {...register("notas")}
                    rows={6}
                    placeholder="Notas de reuniones, intereses específicos, objeciones..."
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : prospect ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
