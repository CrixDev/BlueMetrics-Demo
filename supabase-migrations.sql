-- ============================================
-- MIGRACIONES PARA COMENTARIOS E HISTORIAL DE POZOS
-- ============================================
-- Ejecuta este archivo en tu consola SQL de Supabase

-- ============================================
-- 1. TABLA DE COMENTARIOS DE POZOS
-- ============================================

-- Crear tabla de comentarios
CREATE TABLE IF NOT EXISTS well_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  well_id INTEGER NOT NULL,
  comment_text TEXT NOT NULL,
  author_name VARCHAR(255) DEFAULT 'Usuario',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_well_comments_well_id ON well_comments(well_id);
CREATE INDEX IF NOT EXISTS idx_well_comments_created_at ON well_comments(created_at DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en comentarios
CREATE TRIGGER update_well_comments_updated_at
  BEFORE UPDATE ON well_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE well_comments ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público para comentarios
CREATE POLICY "Allow public read access on well_comments"
  ON well_comments FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access on well_comments"
  ON well_comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access on well_comments"
  ON well_comments FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access on well_comments"
  ON well_comments FOR DELETE
  USING (true);

-- ============================================
-- 2. TABLA DE EVENTOS/HISTORIAL DE POZOS
-- ============================================

-- Crear tabla de eventos
CREATE TABLE IF NOT EXISTS well_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  well_id INTEGER NOT NULL,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('mantenimiento', 'parado', 'reparacion', 'inspeccion', 'otro')),
  event_status VARCHAR(50) DEFAULT 'activo' CHECK (event_status IN ('activo', 'completado', 'cancelado')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  author_name VARCHAR(255) DEFAULT 'Usuario',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_well_events_well_id ON well_events(well_id);
CREATE INDEX IF NOT EXISTS idx_well_events_event_type ON well_events(event_type);
CREATE INDEX IF NOT EXISTS idx_well_events_start_date ON well_events(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_well_events_event_status ON well_events(event_status);

-- Trigger para actualizar updated_at en eventos
CREATE TRIGGER update_well_events_updated_at
  BEFORE UPDATE ON well_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE well_events ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público para eventos
CREATE POLICY "Allow public read access on well_events"
  ON well_events FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access on well_events"
  ON well_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access on well_events"
  ON well_events FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access on well_events"
  ON well_events FOR DELETE
  USING (true);

-- ============================================
-- 3. DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Comentarios de ejemplo para el Pozo 12
INSERT INTO well_comments (well_id, comment_text, author_name) VALUES
  (12, 'Revisión mensual completada. Todo en orden.', 'Juan Pérez'),
  (12, 'Se detectó una pequeña fuga en la tubería, programar mantenimiento.', 'María González');

-- Eventos de ejemplo para el Pozo 12
INSERT INTO well_events (well_id, event_type, event_status, title, description, start_date, end_date, author_name) VALUES
  (12, 'mantenimiento', 'completado', 'Mantenimiento preventivo de bomba', 'Cambio de aceite y revisión general de la bomba sumergible', '2023-02-10', '2023-02-25', 'Técnico Mantenimiento'),
  (12, 'reparacion', 'completado', 'Reparación de tubería', 'Reparación de fuga menor en tubería principal', '2024-07-05', '2024-07-08', 'Equipo Reparaciones');
