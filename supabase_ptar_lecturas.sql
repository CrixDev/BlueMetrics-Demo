-- ============================================================
-- TABLA: lecturas_ptar
-- Descripción: Lecturas diarias de la Planta de Tratamiento 
--              de Aguas Residuales (PTAR)
-- Estructura: Una sola tabla para todos los años
-- ============================================================

-- Eliminar tabla si existe (usar con precaución en producción)
DROP TABLE IF EXISTS public.lecturas_ptar CASCADE;

-- Crear tabla de lecturas PTAR
CREATE TABLE public.lecturas_ptar (
    id BIGSERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora VARCHAR(20),
    medidor_entrada DECIMAL(12, 2),
    medidor_salida DECIMAL(12, 2),
    ar DECIMAL(12, 2), -- Agua Residual
    at DECIMAL(12, 2), -- Agua Tratada
    recirculacion DECIMAL(12, 2),
    total_dia DECIMAL(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    
    -- Constraint único para evitar duplicados por fecha
    CONSTRAINT unique_fecha_ptar UNIQUE (fecha)
);

-- Índices para mejorar el rendimiento de consultas
CREATE INDEX idx_lecturas_ptar_fecha ON public.lecturas_ptar(fecha DESC);
CREATE INDEX idx_lecturas_ptar_year ON public.lecturas_ptar(EXTRACT(YEAR FROM fecha));
CREATE INDEX idx_lecturas_ptar_month ON public.lecturas_ptar(EXTRACT(YEAR FROM fecha), EXTRACT(MONTH FROM fecha));

-- Comentarios en la tabla y columnas
COMMENT ON TABLE public.lecturas_ptar IS 'Lecturas diarias de la Planta de Tratamiento de Aguas Residuales (PTAR) - Todos los años';
COMMENT ON COLUMN public.lecturas_ptar.id IS 'Identificador único autoincremental';
COMMENT ON COLUMN public.lecturas_ptar.fecha IS 'Fecha de la lectura (formato: YYYY-MM-DD)';
COMMENT ON COLUMN public.lecturas_ptar.hora IS 'Hora de la lectura (formato: HH:MM AM/PM)';
COMMENT ON COLUMN public.lecturas_ptar.medidor_entrada IS 'Lectura del medidor de entrada de agua (m³)';
COMMENT ON COLUMN public.lecturas_ptar.medidor_salida IS 'Lectura del medidor de salida de agua (m³)';
COMMENT ON COLUMN public.lecturas_ptar.ar IS 'Agua Residual del día (m³)';
COMMENT ON COLUMN public.lecturas_ptar.at IS 'Agua Tratada del día (m³)';
COMMENT ON COLUMN public.lecturas_ptar.recirculacion IS 'Agua de recirculación (m³)';
COMMENT ON COLUMN public.lecturas_ptar.total_dia IS 'Total de agua procesada en el día (m³)';
COMMENT ON COLUMN public.lecturas_ptar.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN public.lecturas_ptar.updated_at IS 'Fecha de última actualización del registro';

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_lecturas_ptar_updated_at ON public.lecturas_ptar;
CREATE TRIGGER update_lecturas_ptar_updated_at
    BEFORE UPDATE ON public.lecturas_ptar
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.lecturas_ptar ENABLE ROW LEVEL SECURITY;

-- Política de seguridad: Permitir lectura a todos los usuarios autenticados
CREATE POLICY "Permitir lectura de lecturas PTAR a usuarios autenticados"
    ON public.lecturas_ptar
    FOR SELECT
    TO authenticated
    USING (true);

-- Política de seguridad: Permitir inserción a usuarios autenticados
CREATE POLICY "Permitir inserción de lecturas PTAR a usuarios autenticados"
    ON public.lecturas_ptar
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Política de seguridad: Permitir actualización a usuarios autenticados
CREATE POLICY "Permitir actualización de lecturas PTAR a usuarios autenticados"
    ON public.lecturas_ptar
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Política de seguridad: Permitir eliminación a usuarios autenticados
CREATE POLICY "Permitir eliminación de lecturas PTAR a usuarios autenticados"
    ON public.lecturas_ptar
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================
-- VISTAS ÚTILES PARA ANÁLISIS
-- ============================================================

-- Vista: Resumen por año
CREATE OR REPLACE VIEW public.vista_ptar_resumen_anual AS
SELECT 
    EXTRACT(YEAR FROM fecha) AS año,
    COUNT(*) AS total_registros,
    SUM(ar) AS total_agua_residual_m3,
    SUM(at) AS total_agua_tratada_m3,
    AVG(ar) AS promedio_diario_ar_m3,
    AVG(at) AS promedio_diario_at_m3,
    ROUND(AVG(CASE WHEN ar > 0 THEN (at / ar) * 100 ELSE NULL END), 2) AS eficiencia_promedio_porcentaje,
    MIN(fecha) AS fecha_inicio,
    MAX(fecha) AS fecha_fin
FROM public.lecturas_ptar
WHERE ar IS NOT NULL AND at IS NOT NULL
GROUP BY EXTRACT(YEAR FROM fecha)
ORDER BY año DESC;

-- Vista: Resumen por mes
CREATE OR REPLACE VIEW public.vista_ptar_resumen_mensual AS
SELECT 
    EXTRACT(YEAR FROM fecha) AS año,
    EXTRACT(MONTH FROM fecha) AS mes,
    TO_CHAR(fecha, 'YYYY-MM') AS periodo,
    COUNT(*) AS total_registros,
    SUM(ar) AS total_agua_residual_m3,
    SUM(at) AS total_agua_tratada_m3,
    AVG(ar) AS promedio_diario_ar_m3,
    AVG(at) AS promedio_diario_at_m3,
    ROUND(AVG(CASE WHEN ar > 0 THEN (at / ar) * 100 ELSE NULL END), 2) AS eficiencia_promedio_porcentaje
FROM public.lecturas_ptar
WHERE ar IS NOT NULL AND at IS NOT NULL
GROUP BY EXTRACT(YEAR FROM fecha), EXTRACT(MONTH FROM fecha), TO_CHAR(fecha, 'YYYY-MM')
ORDER BY año DESC, mes DESC;

-- Vista: Resumen por trimestre
CREATE OR REPLACE VIEW public.vista_ptar_resumen_trimestral AS
SELECT 
    EXTRACT(YEAR FROM fecha) AS año,
    CASE 
        WHEN EXTRACT(MONTH FROM fecha) BETWEEN 1 AND 3 THEN 1
        WHEN EXTRACT(MONTH FROM fecha) BETWEEN 4 AND 6 THEN 2
        WHEN EXTRACT(MONTH FROM fecha) BETWEEN 7 AND 9 THEN 3
        ELSE 4
    END AS trimestre,
    CASE 
        WHEN EXTRACT(MONTH FROM fecha) BETWEEN 1 AND 3 THEN 'T1'
        WHEN EXTRACT(MONTH FROM fecha) BETWEEN 4 AND 6 THEN 'T2'
        WHEN EXTRACT(MONTH FROM fecha) BETWEEN 7 AND 9 THEN 'T3'
        ELSE 'T4'
    END AS trimestre_label,
    COUNT(*) AS total_registros,
    SUM(ar) AS total_agua_residual_m3,
    SUM(at) AS total_agua_tratada_m3,
    AVG(ar) AS promedio_diario_ar_m3,
    AVG(at) AS promedio_diario_at_m3,
    ROUND(AVG(CASE WHEN ar > 0 THEN (at / ar) * 100 ELSE NULL END), 2) AS eficiencia_promedio_porcentaje
FROM public.lecturas_ptar
WHERE ar IS NOT NULL AND at IS NOT NULL
GROUP BY 
    EXTRACT(YEAR FROM fecha), 
    CASE 
        WHEN EXTRACT(MONTH FROM fecha) BETWEEN 1 AND 3 THEN 1
        WHEN EXTRACT(MONTH FROM fecha) BETWEEN 4 AND 6 THEN 2
        WHEN EXTRACT(MONTH FROM fecha) BETWEEN 7 AND 9 THEN 3
        ELSE 4
    END,
    CASE 
        WHEN EXTRACT(MONTH FROM fecha) BETWEEN 1 AND 3 THEN 'T1'
        WHEN EXTRACT(MONTH FROM fecha) BETWEEN 4 AND 6 THEN 'T2'
        WHEN EXTRACT(MONTH FROM fecha) BETWEEN 7 AND 9 THEN 'T3'
        ELSE 'T4'
    END
ORDER BY año DESC, trimestre DESC;

-- Comentarios en las vistas
COMMENT ON VIEW public.vista_ptar_resumen_anual IS 'Resumen anual de lecturas PTAR con totales y promedios';
COMMENT ON VIEW public.vista_ptar_resumen_mensual IS 'Resumen mensual de lecturas PTAR con totales y promedios';
COMMENT ON VIEW public.vista_ptar_resumen_trimestral IS 'Resumen trimestral de lecturas PTAR con totales y promedios';

-- ============================================================
-- TABLA COMPLETADA
-- ============================================================
