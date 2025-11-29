export default function Pipeline() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pipeline</h1>
        <p className="text-muted-foreground">Vista Kanban del proceso de ventas</p>
      </div>

      <div className="flex items-center justify-center h-96 border border-dashed border-border rounded-lg">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Vista Kanban</p>
          <p className="text-muted-foreground">Próximamente: arrastra y suelta prospectos entre estados</p>
        </div>
      </div>
    </div>
  );
}
