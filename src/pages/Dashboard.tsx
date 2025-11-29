import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign, TrendingUp, Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: prospects, isLoading } = useQuery({
    queryKey: ["prospects-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospects")
        .select("*")
        .neq("estado", "perdido");
      
      if (error) throw error;
      return data;
    },
  });

  const totalActivos = prospects?.length || 0;
  const valorPipeline = prospects?.reduce((sum, p) => sum + (Number(p.monto_estimado) || 0), 0) || 0;
  const hotProspects = prospects?.filter(p => p.temperatura === "hot").length || 0;

  // Calcular reuniones esta semana
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
  
  const reunionesEstaSemana = prospects?.filter(p => {
    if (!p.fecha_proxima_accion) return false;
    const fecha = new Date(p.fecha_proxima_accion);
    return fecha >= startOfWeek && fecha <= endOfWeek;
  }).length || 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Vista general de tu pipeline de ventas</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Vista general de tu pipeline de ventas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prospectos Activos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivos}</div>
            <p className="text-xs text-muted-foreground">
              En proceso
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reuniones Esta Semana
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reunionesEstaSemana}</div>
            <p className="text-xs text-muted-foreground">
              Próximas acciones
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor del Pipeline
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${valorPipeline.toLocaleString("es-MX")}
            </div>
            <p className="text-xs text-muted-foreground">
              MXN estimado
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prospectos Hot
            </CardTitle>
            <Flame className="h-4 w-4 text-temp-hot" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hotProspects}</div>
            <p className="text-xs text-muted-foreground">
              Alta prioridad
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Próximas Acciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prospects
                ?.filter(p => p.fecha_proxima_accion)
                .sort((a, b) => new Date(a.fecha_proxima_accion!).getTime() - new Date(b.fecha_proxima_accion!).getTime())
                .slice(0, 5)
                .map((prospect) => (
                  <div key={prospect.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{prospect.nombre}</p>
                      <p className="text-sm text-muted-foreground">{prospect.proxima_accion}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(prospect.fecha_proxima_accion!).toLocaleDateString("es-MX", { 
                        day: "numeric", 
                        month: "short" 
                      })}
                    </div>
                  </div>
                ))}
              {(!prospects || prospects.filter(p => p.fecha_proxima_accion).length === 0) && (
                <p className="text-center text-muted-foreground py-8">
                  No hay acciones próximas programadas
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["nuevo", "contactado", "reunion_agendada", "reunion_hecha", "propuesta_enviada", "negociando", "pagado"].map((estado) => {
                const count = prospects?.filter(p => p.estado === estado).length || 0;
                const percentage = totalActivos > 0 ? (count / totalActivos) * 100 : 0;
                
                return (
                  <div key={estado} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{estado.replace("_", " ")}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
