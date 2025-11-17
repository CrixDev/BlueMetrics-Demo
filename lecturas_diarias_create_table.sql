-- ====================================================================
-- Script SQL para crear la tabla lecturas_diarias
-- ====================================================================
-- Generado para almacenar lecturas diarias de consumo de agua
-- Compatible con PostgreSQL/Supabase
-- ====================================================================

-- Eliminar tabla si existe (¡CUIDADO! Esto borrará todos los datos)
-- DROP TABLE IF EXISTS public.lecturas_diarias CASCADE;

-- Crear la tabla
CREATE TABLE IF NOT EXISTS public.lecturas_diarias (
    id BIGSERIAL PRIMARY KEY,
    mes_anio VARCHAR(50),
    dia_hora VARCHAR(50),
    consumo DECIMAL(12,2),
    general_pozos DECIMAL(12,2),
    pozo_3 DECIMAL(12,2),
    pozo_8 DECIMAL(12,2),
    pozo_15 DECIMAL(12,2),
    pozo_4 DECIMAL(12,2),
    a_y_d DECIMAL(12,2),
    campus_8 DECIMAL(12,2),
    a7_cc DECIMAL(12,2),
    megacentral DECIMAL(12,2),
    planta_fisica DECIMAL(12,2),
    residencias DECIMAL(12,2),
    pozo7 DECIMAL(12,2),
    pozo11 DECIMAL(12,2),
    pozo_12 DECIMAL(12,2),
    pozo_14 DECIMAL(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- Índices para optimizar consultas
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_lecturas_diarias_mes_anio 
    ON public.lecturas_diarias(mes_anio);

CREATE INDEX IF NOT EXISTS idx_lecturas_diarias_dia_hora 
    ON public.lecturas_diarias(dia_hora);

CREATE INDEX IF NOT EXISTS idx_lecturas_diarias_created_at 
    ON public.lecturas_diarias(created_at DESC);

-- ====================================================================
-- Comentarios sobre la tabla y columnas
-- ====================================================================
COMMENT ON TABLE public.lecturas_diarias IS 
    'Tabla de lecturas diarias de consumo de agua de pozos y diferentes zonas del campus';

COMMENT ON COLUMN public.lecturas_diarias.id IS 
    'Identificador único autoincrementable';

COMMENT ON COLUMN public.lecturas_diarias.mes_anio IS 
    'Mes y año de la lectura (ej: "mayo 2022", "junio 2023")';

COMMENT ON COLUMN public.lecturas_diarias.dia_hora IS 
    'Día y hora de la lectura (ej: "Lun01 09:00", "Mar02 9:00")';

COMMENT ON COLUMN public.lecturas_diarias.consumo IS 
    'Consumo registrado en el período';

COMMENT ON COLUMN public.lecturas_diarias.general_pozos IS 
    'Lectura general de pozos (medidor principal)';

COMMENT ON COLUMN public.lecturas_diarias.pozo_3 IS 
    'Lectura acumulada del pozo 3';

COMMENT ON COLUMN public.lecturas_diarias.pozo_8 IS 
    'Lectura acumulada del pozo 8';

COMMENT ON COLUMN public.lecturas_diarias.pozo_15 IS 
    'Lectura acumulada del pozo 15';

COMMENT ON COLUMN public.lecturas_diarias.pozo_4 IS 
    'Lectura acumulada del pozo 4';

COMMENT ON COLUMN public.lecturas_diarias.a_y_d IS 
    'Lectura de zona A y D';

COMMENT ON COLUMN public.lecturas_diarias.campus_8 IS 
    'Lectura de Campus 8 (con comillas dobles en nombre original)';

COMMENT ON COLUMN public.lecturas_diarias.a7_cc IS 
    'Lectura de A7-CC';

COMMENT ON COLUMN public.lecturas_diarias.megacentral IS 
    'Lectura de Megacentral';

COMMENT ON COLUMN public.lecturas_diarias.planta_fisica IS 
    'Lectura de Planta Física';

COMMENT ON COLUMN public.lecturas_diarias.residencias IS 
    'Lectura de Residencias';

COMMENT ON COLUMN public.lecturas_diarias.pozo7 IS 
    'Lectura acumulada del pozo 7';

COMMENT ON COLUMN public.lecturas_diarias.pozo11 IS 
    'Lectura acumulada del pozo 11';

COMMENT ON COLUMN public.lecturas_diarias.pozo_12 IS 
    'Lectura acumulada del pozo 12';

COMMENT ON COLUMN public.lecturas_diarias.pozo_14 IS 
    'Lectura acumulada del pozo 14';

COMMENT ON COLUMN public.lecturas_diarias.created_at IS 
    'Fecha y hora de creación del registro';

COMMENT ON COLUMN public.lecturas_diarias.updated_at IS 
    'Fecha y hora de última actualización del registro';

-- ====================================================================
-- Trigger para actualizar updated_at automáticamente
-- ====================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_lecturas_diarias_updated_at ON public.lecturas_diarias;

CREATE TRIGGER update_lecturas_diarias_updated_at
    BEFORE UPDATE ON public.lecturas_diarias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- Permisos (ajustar según necesidades de seguridad)
-- ====================================================================
-- GRANT SELECT, INSERT, UPDATE ON public.lecturas_diarias TO authenticated;
-- GRANT USAGE, SELECT ON SEQUENCE lecturas_diarias_id_seq TO authenticated;

-- ====================================================================
-- Fin del script
-- ====================================================================
COMMIT;
