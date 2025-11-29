import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { OnboardingTour } from "./OnboardingTour";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [runTour, setRunTour] = useState(false);

  // Check if user has seen the tour before
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("lawgic-tour-completed");
    if (!hasSeenTour) {
      // Start tour after a short delay on first visit
      setTimeout(() => setRunTour(true), 1000);
    }
  }, []);

  const handleStartTour = () => {
    setRunTour(true);
  };

  const handleTourComplete = () => {
    setRunTour(false);
    localStorage.setItem("lawgic-tour-completed", "true");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar onStartTour={handleStartTour} />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      
      <OnboardingTour run={runTour} onComplete={handleTourComplete} />
    </SidebarProvider>
  );
}
