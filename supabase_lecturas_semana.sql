-- Tabla para registrar las lecturas semanales de todos los puntos de consumo
CREATE TABLE IF NOT EXISTS public.lecturas_semana (
    -- Identificador de la semana
    id SERIAL PRIMARY KEY,
    numero_semana INTEGER NOT NULL UNIQUE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Pozos de Agua Potable (Servicios)
    medidor_general_pozos DECIMAL(10, 2),
    pozo_11 DECIMAL(10, 2),
    pozo_14 DECIMAL(10, 2),
    pozo_12 DECIMAL(10, 2),
    pozo_7 DECIMAL(10, 2),
    pozo_3 DECIMAL(10, 2),
    
    -- Pozos de Riego
    pozo_4_riego DECIMAL(10, 2),
    pozo_8_riego DECIMAL(10, 2),
    pozo_15_riego DECIMAL(10, 2),
    total_pozos_riego DECIMAL(10, 2),
    
    -- Circuito 8 Campus
    circuito_8_campus DECIMAL(10, 2),
    auditorio_luis_elizondo DECIMAL(10, 2),
    cdb2 DECIMAL(10, 2),
    cdb2_banos_nuevos_2025 DECIMAL(10, 2),
    arena_borrego DECIMAL(10, 2),
    edificio_negocios_daf DECIMAL(10, 2),
    aulas_6 DECIMAL(10, 2),
    domo_cultural DECIMAL(10, 2),
    wellness_parque_central_tunel DECIMAL(10, 2),
    wellness_registro DECIMAL(10, 2),
    parque_central_registro DECIMAL(10, 2),
    wellness_edificio DECIMAL(10, 2),
    wellness_super_salads DECIMAL(10, 2),
    wellness_torre_enfriamiento DECIMAL(10, 2),
    wellness_alberca DECIMAL(10, 2),
    centrales_comedor_1_principal DECIMAL(10, 2),
    centrales_dona_tota DECIMAL(10, 2),
    centrales_subway DECIMAL(10, 2),
    centrales_carls_jr DECIMAL(10, 2),
    centrales_little_cesars DECIMAL(10, 2),
    centrales_grill_team DECIMAL(10, 2),
    centrales_chilaquiles DECIMAL(10, 2),
    centrales_tec_food DECIMAL(10, 2),
    centrales_oxxo DECIMAL(10, 2),
    comedor_central_tunel DECIMAL(10, 2),
    administrativo DECIMAL(10, 2),
    biotecnologia DECIMAL(10, 2),
    escuela_arte_caldera_1 DECIMAL(10, 2),
    ciap_oriente DECIMAL(10, 2),
    ciap_centro DECIMAL(10, 2),
    ciap_poniente DECIMAL(10, 2),
    ciap_green_shake DECIMAL(10, 2),
    ciap_andatti DECIMAL(10, 2),
    ciap_dc_jochos DECIMAL(10, 2),
    aulas_5 DECIMAL(10, 2),
    ciap_starbucks DECIMAL(10, 2),
    ciap_super_salads DECIMAL(10, 2),
    ciap_sotano DECIMAL(10, 2),
    reflexion DECIMAL(10, 2),
    comedor_2_residencias_10_15 DECIMAL(10, 2),
    residencias_10_15 DECIMAL(10, 2),
    residencias_10_15_llenado DECIMAL(10, 2),
    comedor_2_caldera_2 DECIMAL(10, 2),
    la_choza DECIMAL(10, 2),
    cedes_cisterna DECIMAL(10, 2),
    cedes_site DECIMAL(10, 2),
    nucleo DECIMAL(10, 2),
    expedition DECIMAL(10, 2),
    expedition_bread DECIMAL(10, 2),
    expedition_matthew DECIMAL(10, 2),
    cedes_e2 DECIMAL(10, 2),
    aulas_1 DECIMAL(10, 2),
    rectoria_norte DECIMAL(10, 2),
    pabellon_la_carreta DECIMAL(10, 2),
    rectoria_sur DECIMAL(10, 2),
    aulas_2 DECIMAL(10, 2),
    cetec DECIMAL(10, 2),
    biblioteca DECIMAL(10, 2),
    biblioteca_nikkori DECIMAL(10, 2),
    biblioteca_nectar_works DECIMAL(10, 2),
    biblioteca_tim_horton DECIMAL(10, 2),
    biblioteca_starbucks DECIMAL(10, 2),
    aulas_3 DECIMAL(10, 2),
    basanti DECIMAL(10, 2),
    aulas_3_sr_latino DECIMAL(10, 2),
    aulas_3_starbucks DECIMAL(10, 2),
    centrales_sur DECIMAL(10, 2),
    aulas_4_norte DECIMAL(10, 2),
    
    -- Circuito 6 Residencias
    circuito_6_residencias DECIMAL(10, 2),
    residencias_1_antiguo DECIMAL(10, 2),
    residencias_2_ote DECIMAL(10, 2),
    residencias_2_pte DECIMAL(10, 2),
    residencias_3 DECIMAL(10, 2),
    residencias_4 DECIMAL(10, 2),
    residencias_5 DECIMAL(10, 2),
    residencias_7 DECIMAL(10, 2),
    residencias_8 DECIMAL(10, 2),
    correos DECIMAL(10, 2),
    alberca DECIMAL(10, 2),
    residencias_abc DECIMAL(10, 2),
    
    -- Circuito 4 A7 CE
    circuito_4_a7_ce DECIMAL(10, 2),
    aulas_7 DECIMAL(10, 2),
    cah3_torre_enfriamiento DECIMAL(10, 2),
    caldera_3 DECIMAL(10, 2),
    la_dia DECIMAL(10, 2),
    aulas_4_sur DECIMAL(10, 2),
    aulas_4_maestros DECIMAL(10, 2),
    centro_congresos DECIMAL(10, 2),
    jubileo DECIMAL(10, 2),
    aulas_4_oxxo DECIMAL(10, 2),
    
    -- Circuito Planta Física
    circuito_planta_fisica DECIMAL(10, 2),
    arquitectura_e1 DECIMAL(10, 2),
    arquitectura_anexo DECIMAL(10, 2),
    megacentral_te_2 DECIMAL(10, 2),
    escamilla_banos_trabajadores DECIMAL(10, 2),
    estadio_banorte DECIMAL(10, 2),
    estadio_banorte_te DECIMAL(10, 2),
    campus_norte_edificios_ciudad DECIMAL(10, 2),
    estadio_azul DECIMAL(10, 2),
    
    -- Circuito Megacentral
    circuito_megacentral DECIMAL(10, 2),
    megacentral_te_4 DECIMAL(10, 2),
    
    -- Riego PTAR
    ptar_riego DECIMAL(10, 2),
    pozo_4_riego_alt DECIMAL(10, 2),
    pozo_8_riego_alt DECIMAL(10, 2),
    pozo_15_riego_alt DECIMAL(10, 2),
    campus_norte_ciudad_riego DECIMAL(10, 2),
    comedor_d_ciudad DECIMAL(10, 2),
    
    -- Purgas y Evaporación
    estadio_banorte_purgas DECIMAL(10, 2),
    wellness_cisterna_pluvial_purgas DECIMAL(10, 2),
    wellness_suavizador_purga DECIMAL(10, 2),
    wellness_te_rebosadero DECIMAL(10, 2),
    wellness_te_purga DECIMAL(10, 2),
    cedes_tinaco_riego_pluvial DECIMAL(10, 2),
    megacentral_te_purgas DECIMAL(10, 2),
    megacentral_suavizador_purga DECIMAL(10, 2),
    cah3_te_purgas DECIMAL(10, 2),
    residencias_10_15_te_purga DECIMAL(10, 2),
    estadio_borrego_pluvial DECIMAL(10, 2),
    ciap_cisterna_pluvial DECIMAL(10, 2),
    
    -- Agua de Ciudad
    campo_soft_bol DECIMAL(10, 2),
    cedes_ciudad DECIMAL(10, 2),
    estacionamiento_e3 DECIMAL(10, 2),
    guarderia DECIMAL(10, 2),
    naranjos DECIMAL(10, 2),
    casa_solar DECIMAL(10, 2),
    escamilla_banos_alumnos DECIMAL(10, 2),
    residencias_11_ciudad DECIMAL(10, 2),
    residencias_12_ciudad DECIMAL(10, 2),
    residencias_13_1_ciudad DECIMAL(10, 2),
    residencias_13_2_ciudad DECIMAL(10, 2),
    residencias_13_3_ciudad DECIMAL(10, 2),
    residencias_15_sotano DECIMAL(10, 2),
    residencias_10_15_purga_no DECIMAL(10, 2),
    cdb1_jardineros DECIMAL(10, 2),
    edificio_d DECIMAL(10, 2),
    estadio_yarda DECIMAL(10, 2)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_lecturas_semana_numero ON public.lecturas_semana(numero_semana);
CREATE INDEX idx_lecturas_semana_fechas ON public.lecturas_semana(fecha_inicio, fecha_fin);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_lecturas_semana_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_update_lecturas_semana_updated_at
    BEFORE UPDATE ON public.lecturas_semana
    FOR EACH ROW
    EXECUTE FUNCTION update_lecturas_semana_updated_at();

-- Comentarios en la tabla
COMMENT ON TABLE public.lecturas_semana IS 'Tabla para registrar las lecturas semanales de todos los puntos de consumo de agua del campus';
COMMENT ON COLUMN public.lecturas_semana.numero_semana IS 'Número de la semana (1, 2, 3, ...)';
COMMENT ON COLUMN public.lecturas_semana.fecha_inicio IS 'Fecha de inicio de la semana';
COMMENT ON COLUMN public.lecturas_semana.fecha_fin IS 'Fecha de fin de la semana';

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.lecturas_semana ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos los usuarios autenticados
CREATE POLICY "Permitir lectura a usuarios autenticados" 
    ON public.lecturas_semana
    FOR SELECT
    TO authenticated
    USING (true);

-- Política para permitir inserción solo a usuarios autenticados
CREATE POLICY "Permitir inserción a usuarios autenticados" 
    ON public.lecturas_semana
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Política para permitir actualización solo a usuarios autenticados
CREATE POLICY "Permitir actualización a usuarios autenticados" 
    ON public.lecturas_semana
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Política para permitir eliminación solo a usuarios autenticados
CREATE POLICY "Permitir eliminación a usuarios autenticados" 
    ON public.lecturas_semana
    FOR DELETE
    TO authenticated
    USING (true);

-- Insertar las primeras dos semanas de ejemplo basadas en los datos del JSON
INSERT INTO public.lecturas_semana (
    numero_semana, 
    fecha_inicio, 
    fecha_fin,
    -- Pozos de Servicios
    medidor_general_pozos,
    pozo_11,
    pozo_14,
    pozo_12,
    pozo_7,
    pozo_3
) VALUES 
(
    1,
    '2025-10-06',
    '2025-10-12',
    133500,
    47800,
    40200,
    33850,
    29650,
    NULL
),
(
    2,
    '2025-10-13',
    '2025-10-19',
    142250,
    50700,
    42500,
    35750,
    31300,
    NULL
);




