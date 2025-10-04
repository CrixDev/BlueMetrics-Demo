-- ============================================================
-- TABLA: correos
-- Descripción: Almacena los correos de contacto del formulario
-- de la landing page
-- ============================================================

CREATE TABLE IF NOT EXISTS correos (
  id BIGSERIAL PRIMARY KEY,
  remitente TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  empresa TEXT,
  asunto TEXT NOT NULL,
  mensaje TEXT,
  leido BOOLEAN DEFAULT FALSE,
  importante BOOLEAN DEFAULT FALSE,
  categoria TEXT DEFAULT 'consulta',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_correos_leido ON correos(leido);
CREATE INDEX IF NOT EXISTS idx_correos_categoria ON correos(categoria);
CREATE INDEX IF NOT EXISTS idx_correos_created_at ON correos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_correos_email ON correos(email);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_correos_updated_at
  BEFORE UPDATE ON correos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================================

-- Habilitar RLS en la tabla
ALTER TABLE correos ENABLE ROW LEVEL SECURITY;

-- Política: Permitir INSERT a todos (para el formulario público)
CREATE POLICY "Permitir INSERT público en correos"
  ON correos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política: Permitir SELECT solo a usuarios autenticados (administradores)
CREATE POLICY "Permitir SELECT a usuarios autenticados"
  ON correos
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Permitir UPDATE solo a usuarios autenticados (administradores)
CREATE POLICY "Permitir UPDATE a usuarios autenticados"
  ON correos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Permitir DELETE solo a usuarios autenticados (administradores)
CREATE POLICY "Permitir DELETE a usuarios autenticados"
  ON correos
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- COMENTARIOS DE LA TABLA
-- ============================================================

COMMENT ON TABLE correos IS 'Almacena los correos de contacto del formulario de la landing page';
COMMENT ON COLUMN correos.id IS 'Identificador único del correo';
COMMENT ON COLUMN correos.remitente IS 'Nombre completo del remitente';
COMMENT ON COLUMN correos.email IS 'Correo electrónico del remitente';
COMMENT ON COLUMN correos.telefono IS 'Teléfono de contacto (opcional)';
COMMENT ON COLUMN correos.empresa IS 'Empresa del remitente (opcional)';
COMMENT ON COLUMN correos.asunto IS 'Asunto del correo';
COMMENT ON COLUMN correos.mensaje IS 'Mensaje del correo';
COMMENT ON COLUMN correos.leido IS 'Indica si el correo ha sido leído';
COMMENT ON COLUMN correos.importante IS 'Indica si el correo está marcado como importante';
COMMENT ON COLUMN correos.categoria IS 'Categoría del correo (consulta, alerta, mantenimiento, etc.)';
COMMENT ON COLUMN correos.created_at IS 'Fecha y hora de creación del registro';
COMMENT ON COLUMN correos.updated_at IS 'Fecha y hora de la última actualización';

-- ============================================================
-- DATOS DE EJEMPLO (opcional, para pruebas)
-- ============================================================

-- Insertar algunos correos de ejemplo
INSERT INTO correos (remitente, email, telefono, empresa, asunto, mensaje, leido, importante, categoria)
VALUES 
  ('Juan Pérez', 'juan.perez@example.com', '+52 844 123 4567', 'Acme Corp', 'Consulta sobre consumo de agua', 'Hola, me gustaría obtener más información sobre el consumo del pozo 11 en el último mes.', false, true, 'consulta'),
  ('María González', 'maria.gonzalez@example.com', '+52 844 987 6543', 'Tech Solutions', 'Solicitud de demo', 'Me interesa conocer más sobre su plataforma de gestión hídrica.', false, false, 'consulta'),
  ('Carlos Ramírez', 'carlos.ramirez@example.com', NULL, NULL, 'Pregunta técnica', '¿Su sistema es compatible con sensores de terceros?', true, false, 'consulta');

-- ============================================================
-- INSTRUCCIONES DE USO
-- ============================================================
/*
1. Copia todo este código SQL
2. Ve a tu proyecto en Supabase
3. Navega a "SQL Editor" en el menú lateral
4. Pega el código y haz clic en "Run"
5. La tabla 'correos' será creada con todas sus políticas RLS

IMPORTANTE: 
- La tabla permite INSERT público (anon) para que el formulario funcione sin autenticación
- Solo usuarios autenticados pueden ver (SELECT), actualizar (UPDATE) o eliminar (DELETE) correos
- Si quieres que SOLO los admins puedan ver los correos, modifica la política SELECT
*/

