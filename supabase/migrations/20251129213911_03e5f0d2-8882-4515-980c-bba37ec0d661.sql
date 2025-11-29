-- Create prospects table
CREATE TABLE public.prospects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  empresa TEXT,
  email TEXT,
  telefono TEXT,
  fuente TEXT,
  estado TEXT NOT NULL DEFAULT 'nuevo',
  temperatura TEXT NOT NULL DEFAULT 'warm',
  compromiso TEXT,
  producto_interes TEXT,
  monto_estimado NUMERIC,
  proxima_accion TEXT,
  fecha_proxima_accion DATE,
  fecha_ultima_reunion TIMESTAMP WITH TIME ZONE,
  notas TEXT,
  -- Campos de análisis IA (se llenan automáticamente después)
  sensibilidad INTEGER,
  objeciones JSONB,
  resumen_ejecutivo TEXT,
  citas_clave JSONB,
  transcript TEXT,
  -- Campos de integración
  calendar_event_id TEXT,
  zoom_meeting_id TEXT,
  stripe_checkout_id TEXT,
  stripe_payment_status TEXT,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prospect_history table for audit log
CREATE TABLE public.prospect_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_id UUID NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
  campo_modificado TEXT NOT NULL,
  valor_anterior TEXT,
  valor_nuevo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (we'll start with public access for testing)
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospect_history ENABLE ROW LEVEL SECURITY;

-- Create policies for prospects (public access for now, can be restricted later)
CREATE POLICY "Anyone can view prospects" 
ON public.prospects 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create prospects" 
ON public.prospects 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update prospects" 
ON public.prospects 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete prospects" 
ON public.prospects 
FOR DELETE 
USING (true);

-- Create policies for prospect_history
CREATE POLICY "Anyone can view prospect history" 
ON public.prospect_history 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert prospect history" 
ON public.prospect_history 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on prospects
CREATE TRIGGER update_prospects_updated_at
BEFORE UPDATE ON public.prospects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_prospects_estado ON public.prospects(estado);
CREATE INDEX idx_prospects_temperatura ON public.prospects(temperatura);
CREATE INDEX idx_prospects_fecha_proxima_accion ON public.prospects(fecha_proxima_accion);
CREATE INDEX idx_prospects_created_at ON public.prospects(created_at);
CREATE INDEX idx_prospect_history_prospect_id ON public.prospect_history(prospect_id);
CREATE INDEX idx_prospect_history_created_at ON public.prospect_history(created_at);