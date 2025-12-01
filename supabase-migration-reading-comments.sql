-- =====================================================
-- Migración: Tabla de Comentarios de Lecturas
-- Descripción: Tabla para almacenar comentarios asociados a lecturas específicas
-- Fecha: 2024
-- =====================================================

-- Crear tabla de comentarios de lecturas
CREATE TABLE IF NOT EXISTS public.reading_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Relación con la lectura
  year INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  point_id VARCHAR(100) NOT NULL,
  
  -- Contenido del comentario
  comment TEXT NOT NULL,
  author VARCHAR(100),
  
  -- Metadatos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Índice único para evitar duplicados por combinación año-semana-punto
  CONSTRAINT unique_reading_comment UNIQUE (year, week_number, point_id)
);

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_reading_comments_year_week 
  ON public.reading_comments(year, week_number);

CREATE INDEX IF NOT EXISTS idx_reading_comments_point_id 
  ON public.reading_comments(point_id);

CREATE INDEX IF NOT EXISTS idx_reading_comments_created_at 
  ON public.reading_comments(created_at DESC);

-- Comentarios en la tabla
COMMENT ON TABLE public.reading_comments IS 'Comentarios asociados a lecturas específicas de puntos de medición';
COMMENT ON COLUMN public.reading_comments.year IS 'Año de la lectura';
COMMENT ON COLUMN public.reading_comments.week_number IS 'Número de semana de la lectura';
COMMENT ON COLUMN public.reading_comments.point_id IS 'ID del punto de medición (ej: pozo_11, residencias_10_15)';
COMMENT ON COLUMN public.reading_comments.comment IS 'Texto del comentario';
COMMENT ON COLUMN public.reading_comments.author IS 'Nombre del autor del comentario';

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_reading_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_reading_comments_updated_at ON public.reading_comments;
CREATE TRIGGER trigger_update_reading_comments_updated_at
  BEFORE UPDATE ON public.reading_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_reading_comments_updated_at();

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE public.reading_comments ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura a todos los usuarios autenticados
CREATE POLICY "Permitir lectura de comentarios a usuarios autenticados"
  ON public.reading_comments
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Permitir inserción a todos los usuarios autenticados
CREATE POLICY "Permitir inserción de comentarios a usuarios autenticados"
  ON public.reading_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: Permitir actualización a todos los usuarios autenticados
CREATE POLICY "Permitir actualización de comentarios a usuarios autenticados"
  ON public.reading_comments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Permitir eliminación a todos los usuarios autenticados
CREATE POLICY "Permitir eliminación de comentarios a usuarios autenticados"
  ON public.reading_comments
  FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- Datos de ejemplo (opcional - comentar si no se desea)
-- =====================================================

-- Insertar algunos comentarios de ejemplo
INSERT INTO public.reading_comments (year, week_number, point_id, comment, author) VALUES
  (2024, 45, 'pozo_11', 'Lectura verificada, consumo normal', 'Juan Pérez'),
  (2024, 45, 'residencias_10_15', 'Incremento debido a evento especial en residencias', 'María García'),
  (2024, 46, 'pozo_12', 'Mantenimiento programado, lectura estimada', 'Carlos López')
ON CONFLICT (year, week_number, point_id) DO NOTHING;

-- =====================================================
-- Fin de la migración
-- =====================================================
