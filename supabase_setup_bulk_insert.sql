-- ============================================================
-- CONFIGURACIÓN PARA PERMITIR INSERCIÓN MASIVA DE EXCEL
-- ============================================================
-- Ejecuta este script UNA VEZ en el SQL Editor de Supabase
-- para permitir que los clientes suban archivos Excel
-- ============================================================

-- 1. Crear función para inserción masiva de datos
CREATE OR REPLACE FUNCTION insert_bulk_data(
  p_table_name TEXT,
  p_data JSONB
) RETURNS void AS $$
DECLARE
  rec JSONB;
BEGIN
  -- Iterar sobre cada registro en el array JSON
  FOR rec IN SELECT * FROM jsonb_array_elements(p_data)
  LOOP
    -- Insertar cada registro dinámicamente
    EXECUTE format(
      'INSERT INTO %I SELECT * FROM jsonb_populate_record(NULL::%I, $1)',
      p_table_name, p_table_name
    ) USING rec;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Dar permisos de ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION insert_bulk_data(TEXT, JSONB) TO authenticated;

-- 3. Dar permisos de ejecución a usuarios anónimos (si es necesario)
-- GRANT EXECUTE ON FUNCTION insert_bulk_data(TEXT, JSONB) TO anon;

-- ============================================================
-- POLÍTICAS RLS PARA LAS TABLAS DE LECTURAS
-- ============================================================

-- Agua 2023
CREATE POLICY IF NOT EXISTS "allow_authenticated_insert_agua_2023" 
ON public."Lecturas_Semana_Agua_2023"
FOR INSERT 
TO authenticated 
USING (true);

-- Agua 2024
CREATE POLICY IF NOT EXISTS "allow_authenticated_insert_agua_2024" 
ON public."Lecturas_Semana_Agua_2024"
FOR INSERT 
TO authenticated 
USING (true);

-- Agua 2025
CREATE POLICY IF NOT EXISTS "allow_authenticated_insert_agua_2025" 
ON public."Lecturas_Semana_Agua_2025"
FOR INSERT 
TO authenticated 
USING (true);

-- Gas 2023
CREATE POLICY IF NOT EXISTS "allow_authenticated_insert_gas_2023" 
ON public."lecturas_semanales_gas_2023"
FOR INSERT 
TO authenticated 
USING (true);

-- Gas 2024
CREATE POLICY IF NOT EXISTS "allow_authenticated_insert_gas_2024" 
ON public."lecturas_semanales_gas_2024"
FOR INSERT 
TO authenticated 
USING (true);

-- Gas 2025
CREATE POLICY IF NOT EXISTS "allow_authenticated_insert_gas_2025" 
ON public."lecturas_semanales_gas_2025"
FOR INSERT 
TO authenticated 
USING (true);

-- PTAR
CREATE POLICY IF NOT EXISTS "allow_authenticated_insert_ptar" 
ON public."lecturas_ptar"
FOR INSERT 
TO authenticated 
USING (true);

-- ============================================================
-- VERIFICACIÓN
-- ============================================================

-- Verificar que la función fue creada correctamente
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'insert_bulk_data';

-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename LIKE '%Lecturas%' OR tablename LIKE '%lecturas%'
ORDER BY tablename, policyname;

-- ============================================================
-- NOTAS IMPORTANTES
-- ============================================================
-- 
-- 1. SECURITY DEFINER: La función se ejecuta con los permisos
--    del creador (superusuario), no del usuario que la llama.
--    Esto permite insertar en tablas sin exponer permisos directos.
--
-- 2. Las políticas RLS permiten INSERT solo a usuarios autenticados.
--    Si necesitas permitir a usuarios anónimos, cambia 'authenticated'
--    por 'anon' o 'public'.
--
-- 3. Esta función es segura porque usa format() con %I para
--    sanitizar nombres de tablas y evitar SQL injection.
--
-- 4. Si una tabla no existe, la función fallará con un error claro.
--
-- ============================================================
