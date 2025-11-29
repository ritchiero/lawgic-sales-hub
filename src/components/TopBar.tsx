import { Bell, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeNames: Record<string, string> = {
  "/": "Dashboard",
  "/prospectos": "Prospectos",
  "/pipeline": "Pipeline",
  "/configuracion": "Configuración",
};

export function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRoute = routeNames[location.pathname] || "Dashboard";

  const handleNewProspect = () => {
    // This will be handled by a global state or modal trigger
    const event = new CustomEvent("open-prospect-modal");
    window.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <SidebarTrigger />
      
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          {location.pathname !== "/" && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentRoute}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative w-64" data-tour="buscar">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar prospectos..."
            className="w-full pl-8"
          />
        </div>

        <Button onClick={handleNewProspect} className="gap-2" data-tour="nuevo-prospecto">
          <Plus className="h-4 w-4" />
          Nuevo prospecto
        </Button>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
