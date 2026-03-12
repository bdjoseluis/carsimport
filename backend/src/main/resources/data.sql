INSERT INTO usuarios (username, password, role)
SELECT 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7i.f2q.Ky', 'ADMIN'
WHERE NOT EXISTS (SELECT * FROM usuarios WHERE username = 'admin');

INSERT INTO usuarios (username, password, role)
SELECT 'cliente', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7i.f2q.Ky', 'USER'
WHERE NOT EXISTS (SELECT * FROM usuarios WHERE username = 'cliente');

/*
INSERT INTO coches (
    marca, modelo, version, anio, precio, descripcion,
    kilometros, matriculacion, combustible, potencia_cv,
    cilindrada, transmision, tipo_carroceria, num_puertas,
    color_exterior, color_interior, estado,
    es_nacional, revisiones_al_dia, garantia,
    imagen_url, fecha_publicacion
)
SELECT 'Mercedes', 'Clase A', 'AMG Line', 2022, 35000.00,
    'Compacto de lujo en perfecto estado',
    15000, '1234ABC', 'Gasolina', 163,
    1332, 'Automática', 'Berlina', 5,
    'Negro', 'Negro', 'Seminuevo',
    true, true, true,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/2018_Mercedes-Benz_A200_AMG_Line_Premium_Automatic_1.3_Front.jpg/1200px-2018_Mercedes-Benz_A200_AMG_Line_Premium_Automatic_1.3_Front.jpg',
    '2026-03-08'
WHERE NOT EXISTS (SELECT * FROM coches WHERE modelo = 'Clase A');

INSERT INTO coches (
    marca, modelo, version, anio, precio, descripcion,
    kilometros, matriculacion, combustible, potencia_cv,
    cilindrada, transmision, tipo_carroceria, num_puertas,
    color_exterior, color_interior, estado,
    es_nacional, revisiones_al_dia, garantia,
    imagen_url, fecha_publicacion
)
SELECT 'Volkswagen', 'Golf', 'GTI', 2021, 28000.00,
    'Golf GTI en excelente estado, revisiones al día',
    22000, '5678DEF', 'Gasolina', 245,
    1984, 'Manual', 'Berlina', 5,
    'Blanco', 'Negro', 'Usado',
    true, true, false,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/2020_Volkswagen_Golf_GTI_Mk8%2C_front_8.22.20.jpg/1200px-2020_Volkswagen_Golf_GTI_Mk8%2C_front_8.22.20.jpg',
    '2026-03-08'
WHERE NOT EXISTS (SELECT * FROM coches WHERE modelo = 'Golf');
*/