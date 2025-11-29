import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/StatusBadge";
import { TemperatureBadge } from "@/components/TemperatureBadge";
import { ProspectModal } from "@/components/ProspectModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

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

export default function Prospectos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [temperaturaFilter, setTemperaturaFilter] = useState<string>("todos");
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: prospects, isLoading, refetch } = useQuery({
    queryKey: ["prospects", searchQuery, estadoFilter, temperaturaFilter],
    queryFn: async () => {
      let query = supabase.from("prospects").select("*");

      if (searchQuery) {
        query = query.or(`nombre.ilike.%${searchQuery}%,empresa.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      if (estadoFilter !== "todos") {
        query = query.eq("estado", estadoFilter);
      }

      if (temperaturaFilter !== "todos") {
        query = query.eq("temperatura", temperaturaFilter);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Prospect[];
    },
  });

  // Listen for new prospect modal event
  useEffect(() => {
    const handleOpenModal = () => {
      setSelectedProspect(null);
      setIsModalOpen(true);
    };

    window.addEventListener("open-prospect-modal", handleOpenModal);
    return () => window.removeEventListener("open-prospect-modal", handleOpenModal);
  }, []);

  const handleRowClick = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProspect(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prospectos</h1>
          <p className="text-muted-foreground">Gestiona tu lista de contactos</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, empresa o email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
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

        <Select value={temperaturaFilter} onValueChange={setTemperaturaFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Temperatura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="hot">🔥 Hot</SelectItem>
            <SelectItem value="warm">🌤️ Warm</SelectItem>
            <SelectItem value="cold">❄️ Cold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>Nombre</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Temperatura</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead className="text-right">Monto Est.</TableHead>
              <TableHead>Próxima Acción</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prospects && prospects.length > 0 ? (
              prospects.map((prospect) => (
                <TableRow
                  key={prospect.id}
                  className="cursor-pointer hover:bg-muted/50 border-border"
                  onClick={() => handleRowClick(prospect)}
                >
                  <TableCell className="font-medium">{prospect.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{prospect.empresa || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{prospect.email || "-"}</TableCell>
                  <TableCell>
                    <StatusBadge estado={prospect.estado as any} />
                  </TableCell>
                  <TableCell>
                    <TemperatureBadge temperatura={prospect.temperatura as any} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{prospect.producto_interes || "-"}</TableCell>
                  <TableCell className="text-right font-medium">
                    {prospect.monto_estimado 
                      ? `$${Number(prospect.monto_estimado).toLocaleString("es-MX")}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {prospect.proxima_accion || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {prospect.fecha_proxima_accion 
                      ? new Date(prospect.fecha_proxima_accion).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-muted-foreground">No se encontraron prospectos</p>
                    <Button onClick={() => setIsModalOpen(true)}>
                      Crear primer prospecto
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ProspectModal
        open={isModalOpen}
        onClose={handleModalClose}
        prospect={selectedProspect}
      />
    </div>
  );
}
