import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";

interface OnboardingTourProps {
  run: boolean;
  onComplete: () => void;
}

export function OnboardingTour({ run, onComplete }: OnboardingTourProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-bold">¡Bienvenido a Lawgic Sales Pipeline! 🎉</h3>
          <p>
            Esta plataforma te ayudará a gestionar tu proceso de ventas de manera eficiente.
            Te mostraremos las funcionalidades principales en un recorrido rápido.
          </p>
        </div>
      ),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold">Dashboard</h3>
          <p>
            Aquí verás métricas clave: prospectos activos, reuniones programadas, 
            valor del pipeline y tu tasa de conversión.
          </p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="prospectos"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold">Prospectos</h3>
          <p>
            Vista completa de todos tus contactos en formato tabla. 
            Aquí puedes buscar, filtrar y gestionar cada prospecto.
          </p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="pipeline"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold">Pipeline (Kanban)</h3>
          <p>
            Vista visual de tu proceso de ventas. Arrastra y suelta prospectos 
            entre columnas para actualizar su estado fácilmente.
          </p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="nuevo-prospecto"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold">Crear Prospecto</h3>
          <p>
            Haz clic aquí para agregar un nuevo prospecto. 
            Completa su información básica, estado y notas de seguimiento.
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[data-tour="buscar"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold">Búsqueda Global</h3>
          <p>
            Encuentra rápidamente cualquier prospecto por nombre, empresa o email.
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "body",
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold">¡Todo listo! 🚀</h3>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Funcionalidades clave:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Haz clic en cualquier prospecto para ver o editar detalles</li>
              <li>Arrastra cards en el Kanban para cambiar estados</li>
              <li>Genera links de pago y envía info por WhatsApp</li>
              <li>Revisa el historial de cambios de cada prospecto</li>
              <li>Filtra por estado y temperatura para organizar mejor</li>
            </ul>
          </div>
          <p className="text-sm">
            Puedes volver a ver este recorrido cuando quieras desde el botón de ayuda en el menú.
          </p>
        </div>
      ),
      placement: "center",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onComplete();
      setStepIndex(0);
    } else {
      setStepIndex(index);
    }
  };

  useEffect(() => {
    if (run) {
      setStepIndex(0);
    }
  }, [run]);

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      disableOverlayClose
      locale={{
        back: "Atrás",
        close: "Cerrar",
        last: "Finalizar",
        next: "Siguiente",
        skip: "Saltar",
      }}
      styles={{
        options: {
          primaryColor: "hsl(var(--primary))",
          backgroundColor: "hsl(var(--background))",
          textColor: "hsl(var(--foreground))",
          arrowColor: "hsl(var(--background))",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
        },
        tooltipContent: {
          padding: "10px 0",
        },
        buttonNext: {
          backgroundColor: "hsl(var(--primary))",
          borderRadius: 6,
          padding: "8px 16px",
        },
        buttonBack: {
          color: "hsl(var(--muted-foreground))",
          marginRight: 10,
        },
        buttonSkip: {
          color: "hsl(var(--muted-foreground))",
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
}
