import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
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
import { ProspectActions } from "./ProspectActions";

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
  sensibilidad: number | null;
  objeciones: any | null;
  resumen_ejecutivo: string | null;
  citas_clave: any | null;
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
    defaultValues: {
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

  // Reset form when prospect changes
  useEffect(() => {
    if (prospect) {
      reset({
        nombre: prospect.nombre || "",
        empresa: prospect.empresa || "",
        email: prospect.email || "",
        telefono: prospect.telefono || "",
        fuente: prospect.fuente || "",
        estado: prospect.estado || "nuevo",
        temperatura: prospect.temperatura || "warm",
        compromiso: prospect.compromiso || "",
        producto_interes: prospect.producto_interes || "",
        monto_estimado: prospect.monto_estimado || null,
        proxima_accion: prospect.proxima_accion || "",
        fecha_proxima_accion: prospect.fecha_proxima_accion || "",
        notas: prospect.notas || "",
      });
    } else {
      reset({
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
      });
    }
  }, [prospect, reset]);

  // Fetch prospect history
  const { data: history } = useQuery({
    queryKey: ["prospect-history", prospect?.id],
    queryFn: async () => {
      if (!prospect?.id) return [];
      const { data, error } = await supabase
        .from("prospect_history")
        .select("*")
        .eq("prospect_id", prospect.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!prospect?.id,
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (prospect) {
        // Track changes for history
        const changes: Array<{ campo: string; anterior: any; nuevo: any }> = [];
        
        Object.keys(data).forEach((key) => {
          if (data[key] !== (prospect as any)[key]) {
            changes.push({
              campo: key,
              anterior: (prospect as any)[key],
              nuevo: data[key],
            });
          }
        });

        const { error } = await supabase
          .from("prospects")
          .update(data)
          .eq("id", prospect.id);

        if (error) throw error;

        // Insert history records
        if (changes.length > 0) {
          await supabase.from("prospect_history").insert(
            changes.map((change) => ({
              prospect_id: prospect.id,
              campo_modificado: change.campo,
              valor_anterior: String(change.anterior ?? ""),
              valor_nuevo: String(change.nuevo ?? ""),
            }))
          );
        }

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
          {prospect && (
            <div className="pt-4">
              <ProspectActions prospect={prospect} onUpdate={onClose} />
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="basico" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basico">Info Básica</TabsTrigger>
              <TabsTrigger value="estado">Estado</TabsTrigger>
              <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
              <TabsTrigger value="analisis">Análisis IA</TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
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

            <TabsContent value="analisis" className="space-y-4">
              <div className="space-y-4 text-muted-foreground">
                {prospect?.sensibilidad || prospect?.resumen_ejecutivo || prospect?.objeciones || prospect?.citas_clave ? (
                  <>
                    {prospect.sensibilidad && (
                      <div className="space-y-2">
                        <Label>Sensibilidad</Label>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${prospect.sensibilidad * 10}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{prospect.sensibilidad}/10</span>
                        </div>
                      </div>
                    )}

                    {prospect.resumen_ejecutivo && (
                      <div className="space-y-2">
                        <Label>Resumen Ejecutivo</Label>
                        <p className="text-sm leading-relaxed">{prospect.resumen_ejecutivo}</p>
                      </div>
                    )}

                    {prospect.objeciones && Array.isArray(prospect.objeciones) && prospect.objeciones.length > 0 && (
                      <div className="space-y-2">
                        <Label>Objeciones Detectadas</Label>
                        <ul className="list-disc list-inside space-y-1">
                          {(prospect.objeciones as any[]).map((obj: any, i: number) => (
                            <li key={i} className="text-sm">{obj}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {prospect.citas_clave && Array.isArray(prospect.citas_clave) && prospect.citas_clave.length > 0 && (
                      <div className="space-y-2">
                        <Label>Citas Clave</Label>
                        <div className="space-y-2">
                          {(prospect.citas_clave as any[]).map((cita: any, i: number) => (
                            <blockquote key={i} className="border-l-2 border-primary pl-4 italic text-sm">
                              "{cita}"
                            </blockquote>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p>No hay análisis IA disponible para este prospecto.</p>
                    <p className="text-xs mt-2">Los análisis se generan automáticamente después de las reuniones.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="historial" className="space-y-4">
              <div className="space-y-2">
                {history && history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((item: any) => (
                      <div key={item.id} className="border border-border rounded-lg p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground">{item.campo_modificado}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleString("es-MX", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="line-through">{item.valor_anterior || "(vacío)"}</span>
                          <span>→</span>
                          <span className="text-foreground">{item.valor_nuevo || "(vacío)"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No hay cambios registrados para este prospecto.</p>
                  </div>
                )}
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
