-- ============================================================
-- INSERTS para tabla: lecturas_ptar
-- Archivo fuente: PTAR _TRIMESTRES (1).xlsx
-- Fecha de generación: 2025-11-21 06:04:33
-- Total de registros: 32
-- ============================================================

-- Iniciar transacción
BEGIN;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2023-12-31', '09:00 a. m.', 58416.03, 2854730.0, NULL, NULL, NULL, NULL)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-01', '9:00 AM', 58416.03, 2854730.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-02', '9:00 AM', 58416.03, 2854730.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-03', '9:00 AM', 58416.03, 2854730.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-04', '9:00 AM', 58416.03, 2854872.0, 0.0, 142.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-05', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-06', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-07', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-08', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-09', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-10', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-11', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-12', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-13', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-14', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-15', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-16', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-17', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-18', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-19', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-20', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-21', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-22', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-23', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-24', '9:00 AM', 58416.03, 2854872.0, 0.0, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-25', '9:00 AM', 58699.93, 2854872.0, 283.9, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-26', '9:00 AM', 58828.5, 2854872.0, 128.57, 0.0, NULL, 0.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-27', '9:00 AM', 59077.5, 2855007.0, 249.0, 135.0, NULL, 0.54)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-28', '9:00 AM', 59195.29, 2855107.0, 117.79, 100.0, NULL, 0.85)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-29', '9:00 AM', 59306.02, 2855173.0, 110.73, 66.0, NULL, 0.6)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-30', '9:00 AM', 59470.51, 2855289.0, 164.49, 116.0, NULL, 0.71)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;

INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('2024-01-31', '9:00 AM', 59689.87, 2855509.0, 219.36, 220.0, NULL, 1.0)
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;


-- Confirmar transacción
COMMIT;

-- ============================================================
-- Total de INSERTs generados: 32
-- ============================================================
