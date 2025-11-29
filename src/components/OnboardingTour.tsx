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
        <div className="space-y-3">
          <h3 className="text-lg font-bold">¡Bienvenido a Lawgic Sales Pipeline! 🎉</h3>
          <p>
            Esta plataforma te ayudará a gestionar tu proceso de ventas de manera eficiente.
            Te mostraremos las funcionalidades principales en un recorrido rápido.
          </p>
          <p className="text-sm text-muted-foreground">
            Puedes cerrar este recorrido en cualquier momento haciendo clic en "Saltar" o presionando ESC.
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
      disableBeacon: true,
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
      disableBeacon: true,
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
      disableBeacon: true,
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
      disableBeacon: true,
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
      disableBeacon: true,
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
          <p className="text-sm font-medium">
            Puedes volver a ver este recorrido cuando quieras desde el botón "Recorrido guiado" en el menú lateral.
          </p>
        </div>
      ),
      placement: "center",
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data;
    
    // Close tour on any completion status or ESC key
    if (
      status === STATUS.FINISHED || 
      status === STATUS.SKIPPED ||
      action === "close" ||
      action === "skip"
    ) {
      onComplete();
      setStepIndex(0);
      return;
    }
    
    // Update step index for navigation
    if (type === "step:after") {
      setStepIndex(index + (action === "prev" ? -1 : 1));
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
      disableOverlayClose={false}
      disableCloseOnEsc={false}
      spotlightClicks={false}
      hideCloseButton={false}
      locale={{
        back: "Atrás",
        close: "Cerrar",
        last: "Finalizar",
        next: "Siguiente",
        skip: "Saltar tour",
      }}
      styles={{
        options: {
          primaryColor: "hsl(217 91% 60%)",
          backgroundColor: "hsl(240 10% 3.9%)",
          textColor: "hsl(0 0% 98%)",
          arrowColor: "hsl(240 10% 3.9%)",
          zIndex: 10000,
          overlayColor: "rgba(0, 0, 0, 0.6)",
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
        },
        tooltipContent: {
          padding: "10px 0",
        },
        buttonNext: {
          backgroundColor: "hsl(217 91% 60%)",
          borderRadius: 6,
          padding: "8px 16px",
          fontSize: "14px",
        },
        buttonBack: {
          color: "hsl(0 0% 63.9%)",
          marginRight: 10,
          fontSize: "14px",
        },
        buttonSkip: {
          color: "hsl(0 0% 63.9%)",
          fontSize: "14px",
        },
        buttonClose: {
          color: "hsl(0 0% 63.9%)",
          fontSize: "20px",
          padding: "8px",
        },
        overlay: {
          cursor: "pointer",
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
}
