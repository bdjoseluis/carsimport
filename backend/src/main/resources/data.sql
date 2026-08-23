-- ===========================================================================
-- SEED DE DEMOSTRACION
-- ---------------------------------------------------------------------------
-- Todos los datos de este archivo son INVENTADOS. Los anuncios originales que
-- alimentaban esta aplicacion venian de mobile.de e incluian nombre, telefono
-- y WhatsApp de concesionarios alemanes reales, asi que se eliminaron: eran
-- datos personales de terceros y ademas incumplian las condiciones de uso de
-- la fuente.
--
-- Convenciones para que nada de esto pueda confundirse con un dato real:
--   * Los concesionarios se llaman "Demo" o "Muster" y su telefono es
--     +49 000 0000000, que no existe.
--   * Las matriculas espanolas llevan vocales (1234 DEM). La DGT no emite
--     vocales en las tres letras, asi que ninguna puede pertenecer a un coche.
--   * Los anuncios no enlazan a ninguna ficha externa (url_original a NULL).
--
-- Las fotos son de Wikimedia Commons (CC BY-SA / CC BY / CC0). Se enlazan, no
-- se copian al repositorio; la atribucion esta en el README.
--
-- Este archivo se ejecuta en cada arranque. Cada INSERT lleva su guarda
-- WHERE NOT EXISTS, de forma que arrancar dos veces no duplica el catalogo.
-- Sintaxis MySQL: H2 no lo traga, por eso los tests usan
-- spring.sql.init.mode=never.
-- ===========================================================================


-- ---------------------------------------------------------------------------
-- USUARIOS
-- Las dos cuentas comparten la contrasena de demo: "password".
-- ---------------------------------------------------------------------------

INSERT INTO usuarios (username, password, role)
SELECT 'admin', '$2a$10$Z4yrVT.f.UTSAlKhzknJfu8DSkTE1dZo7MnZ1rfqo.KObNBGRCbKS', 'ADMIN'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM usuarios WHERE username = 'admin');

INSERT INTO usuarios (username, password, role)
SELECT 'cliente', '$2a$10$Z4yrVT.f.UTSAlKhzknJfu8DSkTE1dZo7MnZ1rfqo.KObNBGRCbKS', 'USER'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM usuarios WHERE username = 'cliente');


-- ---------------------------------------------------------------------------
-- CATALOGO PROPIO (coches ya matriculados en Espana)
-- Los precios estan en linea con el mercado espanol de ocasion para cada
-- modelo, ano y kilometraje.
--
-- OJO con "potenciacv": el campo de la entidad se llama potenciaCV, con dos
-- mayusculas seguidas, y la estrategia de nombres de Hibernate no mete guion
-- bajo entre ellas. La columna que se crea es potenciacv, no potencia_cv. El
-- data.sql anterior tenia potencia_cv en el bloque comentado, asi que habria
-- impedido arrancar a quien lo descomentase.
-- ---------------------------------------------------------------------------

INSERT INTO coches (marca, modelo, version, anio, precio, descripcion, kilometros,
    matriculacion, combustible, potenciacv, cilindrada, transmision, tipo_carroceria,
    num_puertas, color_exterior, color_interior, estado, es_nacional, revisiones_al_dia,
    garantia, imagen_url, fecha_publicacion)
SELECT 'SEAT', 'Ibiza', '1.0 TSI 95 CV FR', 2019, 12900.00,
    'Ibiza FR de un solo propietario, siempre en garaje. Llantas de 17", climatizador bicona y sensores de aparcamiento traseros. Mantenimiento completo en servicio oficial.',
    68400, '1234 DEM', 'Gasolina', 95, 999, 'Manual', 'Berlina', 5,
    'Blanco Nevada', 'Negro', 'Seminuevo', true, true, true,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Seat_Ibiza_FR_business_intense_%282018%29_front_view.jpg/960px-Seat_Ibiza_FR_business_intense_%282018%29_front_view.jpg,https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Seat_Ibiza_FR_2018_rear_view.jpg/960px-Seat_Ibiza_FR_2018_rear_view.jpg',
    '2026-08-14'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches WHERE matriculacion = '1234 DEM');

INSERT INTO coches (marca, modelo, version, anio, precio, descripcion, kilometros,
    matriculacion, combustible, potenciacv, cilindrada, transmision, tipo_carroceria,
    num_puertas, color_exterior, color_interior, estado, es_nacional, revisiones_al_dia,
    garantia, imagen_url, fecha_publicacion)
SELECT 'Renault', 'Clio', 'TCe 100 CV Zen', 2020, 11400.00,
    'Clio de quinta generacion con pantalla EasyLink de 7", camara de marcha atras y frenada automatica de emergencia. Ideal como primer coche o para ciudad.',
    54200, '2345 DEM', 'Gasolina', 100, 999, 'Manual', 'Berlina', 5,
    'Azul Iron', 'Negro', 'Seminuevo', true, true, true,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/2020_Renault_Clio_Play_TCe_-_999cc_1.0_%28100PS%29_Petrol_-_Iron_Blue_-_05-2024%2C_Front.jpg/960px-2020_Renault_Clio_Play_TCe_-_999cc_1.0_%28100PS%29_Petrol_-_Iron_Blue_-_05-2024%2C_Front.jpg,https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/2020_Renault_Clio_Play_TCe_-_999cc_1.0_%28100PS%29_Petrol_-_Iron_Blue_-_05-2024%2C_Rear.jpg/960px-2020_Renault_Clio_Play_TCe_-_999cc_1.0_%28100PS%29_Petrol_-_Iron_Blue_-_05-2024%2C_Rear.jpg',
    '2026-08-13'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches WHERE matriculacion = '2345 DEM');

INSERT INTO coches (marca, modelo, version, anio, precio, descripcion, kilometros,
    matriculacion, combustible, potenciacv, cilindrada, transmision, tipo_carroceria,
    num_puertas, color_exterior, color_interior, estado, es_nacional, revisiones_al_dia,
    garantia, imagen_url, fecha_publicacion)
SELECT 'Peugeot', '208', '1.2 PureTech 100 CV Allure', 2020, 13250.00,
    'Segunda generacion del 208 con i-Cockpit 3D, navegador y carga inalambrica. Neumaticos cambiados hace 8.000 km y ultima revision pasada en junio.',
    47800, '3456 DEM', 'Gasolina', 100, 1199, 'Manual', 'Berlina', 5,
    'Rojo Elixir', 'Negro', 'Seminuevo', true, true, true,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Peugeot_208_II_1.2_PureTech_100_%282020%29_%2852066302142%29.jpg/960px-Peugeot_208_II_1.2_PureTech_100_%282020%29_%2852066302142%29.jpg,https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Peugeot_208_II_GT_Line_rouge_%28avant%29.jpg/960px-Peugeot_208_II_GT_Line_rouge_%28avant%29.jpg,https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Peugeot_208_II_GT_Line_rouge_%28arri%C3%A8re%29.jpg/960px-Peugeot_208_II_GT_Line_rouge_%28arri%C3%A8re%29.jpg',
    '2026-08-12'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches WHERE matriculacion = '3456 DEM');

INSERT INTO coches (marca, modelo, version, anio, precio, descripcion, kilometros,
    matriculacion, combustible, potenciacv, cilindrada, transmision, tipo_carroceria,
    num_puertas, color_exterior, color_interior, estado, es_nacional, revisiones_al_dia,
    garantia, imagen_url, fecha_publicacion)
SELECT 'Toyota', 'Corolla', 'Touring Sports 125H Active Tech', 2019, 16900.00,
    'Familiar hibrido con 581 litros de maletero y etiqueta ECO. Consumo real en torno a 4,5 l/100 km. Bateria con garantia de fabricante hasta 2029.',
    89300, '4567 DEM', 'Híbrido', 122, 1798, 'Automático', 'Familiar', 5,
    'Gris Plata', 'Negro', 'Usado', true, true, true,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/2019_Toyota_Corolla_Touring_Sport_Icon_Tech_VVTi_Hybrid_Estate_1.8.jpg/960px-2019_Toyota_Corolla_Touring_Sport_Icon_Tech_VVTi_Hybrid_Estate_1.8.jpg,https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Toyota_Corolla_Touring_Sports_Monrepos_2019_IMG_1902.jpg/960px-Toyota_Corolla_Touring_Sports_Monrepos_2019_IMG_1902.jpg,https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Toyota_Corolla_Touring_Sports_Monrepos_2019_IMG_1903.jpg/960px-Toyota_Corolla_Touring_Sports_Monrepos_2019_IMG_1903.jpg',
    '2026-08-11'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches WHERE matriculacion = '4567 DEM');

INSERT INTO coches (marca, modelo, version, anio, precio, descripcion, kilometros,
    matriculacion, combustible, potenciacv, cilindrada, transmision, tipo_carroceria,
    num_puertas, color_exterior, color_interior, estado, es_nacional, revisiones_al_dia,
    garantia, imagen_url, fecha_publicacion)
SELECT 'Ford', 'Focus', '1.0 EcoBoost 125 CV Titanium', 2019, 12600.00,
    'Focus Titanium con navegador SYNC 3, control de crucero adaptativo y faros LED. Coche de empresa, kilometros de autopista y libro de mantenimiento al dia.',
    92100, '5678 DEM', 'Gasolina', 125, 999, 'Manual', 'Berlina', 5,
    'Gris Magnético', 'Negro', 'Usado', true, true, false,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Ford_Focus_Mk_IV_Leonberg_2019_IMG_0049.jpg/960px-Ford_Focus_Mk_IV_Leonberg_2019_IMG_0049.jpg,https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/2019_Ford_Focus_Hatchback_Rear.jpg/960px-2019_Ford_Focus_Hatchback_Rear.jpg',
    '2026-08-10'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches WHERE matriculacion = '5678 DEM');

INSERT INTO coches (marca, modelo, version, anio, precio, descripcion, kilometros,
    matriculacion, combustible, potenciacv, cilindrada, transmision, tipo_carroceria,
    num_puertas, color_exterior, color_interior, estado, es_nacional, revisiones_al_dia,
    garantia, imagen_url, fecha_publicacion)
SELECT 'Volkswagen', 'Polo', '1.0 TSI 95 CV Advance', 2018, 11750.00,
    'Polo de sexta generacion, el mismo motor que monta el Ibiza pero con acabado Advance: pantalla Composition Media, App-Connect y climatizador. Distribucion hecha.',
    76500, '6789 DEM', 'Gasolina', 95, 999, 'Manual', 'Berlina', 5,
    'Blanco Puro', 'Negro', 'Usado', true, true, false,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2018_Volkswagen_Polo_SE_1.0_Front.jpg/960px-2018_Volkswagen_Polo_SE_1.0_Front.jpg',
    '2026-08-09'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches WHERE matriculacion = '6789 DEM');

INSERT INTO coches (marca, modelo, version, anio, precio, descripcion, kilometros,
    matriculacion, combustible, potenciacv, cilindrada, transmision, tipo_carroceria,
    num_puertas, color_exterior, color_interior, estado, es_nacional, revisiones_al_dia,
    garantia, imagen_url, fecha_publicacion)
SELECT 'Audi', 'A3', 'Sportback 30 TDI 116 CV S line S tronic', 2020, 21900.00,
    'A3 Sportback con acabado S line, Virtual Cockpit y asientos deportivos. Cambio automatico de doble embrague. Etiqueta C y consumo medio de 4,6 l/100 km.',
    78900, '7890 DEM', 'Diésel', 116, 1968, 'Automático', 'Berlina', 5,
    'Gris Daytona', 'Negro', 'Seminuevo', true, true, true,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/AUDI_A3_SPORTBACK_%28Typ_8Y%29_China_%284%29.jpg/960px-AUDI_A3_SPORTBACK_%28Typ_8Y%29_China_%284%29.jpg,https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/AUDI_A3_SPORTBACK_%28Typ_8Y%29_China_%289%29.jpg/960px-AUDI_A3_SPORTBACK_%28Typ_8Y%29_China_%289%29.jpg',
    '2026-08-08'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches WHERE matriculacion = '7890 DEM');

INSERT INTO coches (marca, modelo, version, anio, precio, descripcion, kilometros,
    matriculacion, combustible, potenciacv, cilindrada, transmision, tipo_carroceria,
    num_puertas, color_exterior, color_interior, estado, es_nacional, revisiones_al_dia,
    garantia, imagen_url, fecha_publicacion)
SELECT 'SEAT', 'León', '1.5 TSI 150 CV FR', 2021, 19400.00,
    'Leon de cuarta generacion en acabado FR: faros Full LED, doble pantalla, iluminacion ambiental y llantas de 18". Un propietario y garantia de fabricante en vigor.',
    51200, '8901 DEM', 'Gasolina', 150, 1498, 'Manual', 'Berlina', 5,
    'Gris Magnético', 'Negro', 'Seminuevo', true, true, true,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Seat_Leon_FR_%28IV%29_%E2%80%93_f_01012023.jpg/960px-Seat_Leon_FR_%28IV%29_%E2%80%93_f_01012023.jpg,https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Seat_Leon_FR_%28IV%29_%E2%80%93_h_01012023.jpg/960px-Seat_Leon_FR_%28IV%29_%E2%80%93_h_01012023.jpg',
    '2026-08-07'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches WHERE matriculacion = '8901 DEM');


-- ---------------------------------------------------------------------------
-- ANUNCIOS IMPORTADOS (lo que en produccion traeria la ingesta de mobile.de)
--
-- precio_con_comision = precio_original * (1 + comision), con la misma escala
-- que aplica IngestaCochesService: 18% por debajo de 5.000 EUR, 15% hasta
-- 15.000, 13% hasta 30.000 y 12% a partir de ahi. Los valores estan calculados
-- para que cuadren con lo que devuelve la calculadora de la ficha.
--
-- Los atributos van en el idioma en que llegan del scraper (Diesel, Automatic,
-- Used...), que es lo que esperan los filtros del front.
-- ---------------------------------------------------------------------------

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-001', 'mobile.de', 'VW Golf 2.0 TDI DSG Style LED ACC Navi',
    'Volkswagen', 'Golf', '62.000 km', 'Diesel', 'Automatic', '03/2021',
    21900.00, 24747.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/2020_Volkswagen_Golf_Style_1.5_Front.jpg/960px-2020_Volkswagen_Golf_Style_1.5_Front.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'Golf VIII acabado Style con cambio DSG de 7 velocidades. Faros IQ.Light LED Matrix, control de crucero adaptativo, Discover Media y camara trasera. Vehiculo de empresa con mantenimiento completo en concesionario oficial.',
    '["Faros LED Matrix","Control de crucero adaptativo","Navegador Discover Media","Camara trasera","Sensores de aparcamiento","Climatizador bizona","Apple CarPlay / Android Auto","Asientos calefactables"]',
    'Autohaus Demo Nord GmbH', '+49 000 0000000', '+49 000 0000000', 4.6,
    '110 kW (150 hp)', '4,8 l/100 km (comb.)', '127 g/km (comb.)', 'Grey',
    'Cloth, Black', '1', '03/2027', 'Used', 'Euro 6d', '5', 'Good price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-001');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-002', 'mobile.de', 'BMW 320d Touring xDrive M Sport AHK Pano',
    'BMW', '320d', '88.000 km', 'Diesel', 'Automatic', '06/2020',
    28500.00, 32205.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/BMW_3-Series_Touring_%28G21%29_320i_%282019%29_%2852915543930%29.jpg/960px-BMW_3-Series_Touring_%28G21%29_320i_%282019%29_%2852915543930%29.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'Serie 3 Touring G21 con traccion total xDrive y paquete M Sport. Techo panoramico, enganche electrico abatible, Live Cockpit Professional y suspension deportiva. Segunda mano de un unico propietario.',
    '["Paquete M Sport","Traccion xDrive","Techo panoramico","Enganche de remolque electrico","Live Cockpit Professional","Asientos deportivos","Head-Up Display","Portón trasero electrico"]',
    'Muster Automobile Hamburg', '+49 000 0000000', NULL, 4.8,
    '140 kW (190 hp)', '5,1 l/100 km (comb.)', '134 g/km (comb.)', 'Black',
    'Part leather, Black', '1', '06/2027', 'Used', 'Euro 6d-TEMP', '5', 'Fair price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-002');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-003', 'mobile.de', 'Audi A4 Avant 35 TDI S line S tronic Virtual',
    'Audi', 'A4', '96.000 km', 'Diesel', 'Automatic', '09/2020',
    25900.00, 29267.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Audi_A4_Avant_B9_Leonberg_2019_IMG_0087.jpg/960px-Audi_A4_Avant_B9_Leonberg_2019_IMG_0087.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'A4 Avant B9 restyling con acabado S line exterior. Virtual Cockpit, MMI Navigation plus, faros LED y portón electrico. Kilometros mayoritariamente de autopista, historial de revisiones completo.',
    '["Acabado S line","Audi Virtual Cockpit","MMI Navigation plus","Faros LED","Portón trasero electrico","Sensores delanteros y traseros","Climatizador tricona","Bluetooth"]',
    'Demo Autozentrum Koln', '+49 000 0000000', '+49 000 0000000', 4.4,
    '120 kW (163 hp)', '4,9 l/100 km (comb.)', '129 g/km (comb.)', 'White',
    'Cloth, Black', '2', '09/2027', 'Used', 'Euro 6d-TEMP', '5', 'Good price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-003');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-004', 'autoscout24', 'Mercedes-Benz C 220 d Avantgarde Kamera Navi',
    'Mercedes-Benz', 'Clase C', '112.000 km', 'Diesel', 'Automatic', '04/2019',
    22750.00, 25708.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Mercedes-Benz_C-Class_W205_facelift_China_2019-03-14.jpg/960px-Mercedes-Benz_C-Class_W205_facelift_China_2019-03-14.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'Clase C W205 restyling con linea Avantgarde. Cambio automatico 9G-Tronic, camara de marcha atras, navegador Garmin y faros LED High Performance. Coche de flota con dos propietarios.',
    '["Linea Avantgarde","Cambio 9G-Tronic","Camara de marcha atras","Faros LED High Performance","Navegador","Asientos calefactables","Sensor de lluvia","Bluetooth"]',
    'Musterhaus Automobile Stuttgart', '+49 000 0000000', NULL, 4.2,
    '143 kW (194 hp)', '5,4 l/100 km (comb.)', '142 g/km (comb.)', 'Silver',
    'Part leather, Black', '2', '04/2027', 'Used', 'Euro 6d-TEMP', '5', 'Fair price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-004');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-005', 'mobile.de', 'VW Tiguan 2.0 TSI 4Motion Highline DSG AHK',
    'Volkswagen', 'Tiguan', '54.000 km', 'Gasoline', 'Automatic', '02/2021',
    31400.00, 35168.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/VW_Tiguan_II_Facelift_front.jpg/960px-VW_Tiguan_II_Facelift_front.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'Tiguan restyling con traccion total 4Motion y acabado Highline. Enganche de remolque, Discover Pro, faros IQ.Light y asientos ergoActive. Un propietario, sin accidentes declarados.',
    '["Traccion 4Motion","Faros IQ.Light LED","Discover Pro","Enganche de remolque","Asientos ergoActive","Portón electrico","Camara 360","Climatizador tricona"]',
    'Autohaus Demo Nord GmbH', '+49 000 0000000', '+49 000 0000000', 4.6,
    '140 kW (190 hp)', '8,1 l/100 km (comb.)', '184 g/km (comb.)', 'Blue',
    'Cloth, Grey', '1', '02/2027', 'Used', 'Euro 6d', '5', 'Fair price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-005');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-006', 'mobile.de', 'Skoda Octavia Combi 1.5 TSI Style Canton',
    'Skoda', 'Octavia', '71.000 km', 'Gasoline', 'Manual gearbox', '05/2021',
    19800.00, 22374.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Skoda_Octavia_IV_Combi_1X7A0209.jpg/960px-Skoda_Octavia_IV_Combi_1X7A0209.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'Octavia Combi de cuarta generacion, el familiar con mas maletero de su categoria (640 litros). Equipo de sonido Canton, Columbus con navegador, faros LED Matrix y los tipicos detalles Simply Clever.',
    '["Equipo de sonido Canton","Navegador Columbus","Faros LED Matrix","Asientos calefactables","Portón electrico","Sensores delanteros y traseros","Volante multifuncion en cuero","Detalles Simply Clever"]',
    'Demo Autozentrum Koln', '+49 000 0000000', NULL, 4.4,
    '110 kW (150 hp)', '5,6 l/100 km (comb.)', '128 g/km (comb.)', 'Grey',
    'Cloth, Black', '1', '05/2027', 'Used', 'Euro 6d', '5', 'Very good price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-006');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-007', 'mobile.de', 'BMW 118i Sport Line Navi LED Sitzheizung',
    'BMW', '118i', '47.000 km', 'Gasoline', 'Manual gearbox', '11/2020',
    20450.00, 23109.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/BMW_F40_Leonberg_2019_IMG_0016.jpg/960px-BMW_F40_Leonberg_2019_IMG_0016.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'Serie 1 F40 con acabado Sport Line. Pocos kilometros para su ano, navegador Business, faros LED y asientos calefactables. Coche de particular con historial de mantenimiento en BMW.',
    '["Acabado Sport Line","Navegador Business","Faros LED","Asientos calefactables","Control de crucero","Sensores traseros","Llantas de 17","Apple CarPlay"]',
    'Muster Automobile Hamburg', '+49 000 0000000', NULL, 4.8,
    '103 kW (140 hp)', '5,9 l/100 km (comb.)', '135 g/km (comb.)', 'White',
    'Cloth, Black', '1', '11/2027', 'Used', 'Euro 6d-TEMP', '5', 'Good price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-007');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-008', 'mobile.de', 'Audi Q3 35 TFSI S tronic Advanced Kamera',
    'Audi', 'Q3', '39.000 km', 'Gasoline', 'Automatic', '07/2021',
    28900.00, 32657.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Audi_Q3_F3_DSC_7494.jpg/960px-Audi_Q3_F3_DSC_7494.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'Q3 de segunda generacion con acabado Advanced y cambio S tronic. Solo 39.000 km, camara de marcha atras, Virtual Cockpit y banqueta trasera deslizante. Garantia de fabricante hasta 2026.',
    '["Cambio S tronic","Audi Virtual Cockpit","Camara de marcha atras","Banqueta trasera deslizante","Faros LED","Portón electrico","Climatizador bizona","Audi pre sense front"]',
    'Autohaus Demo Nord GmbH', '+49 000 0000000', '+49 000 0000000', 4.6,
    '110 kW (150 hp)', '6,4 l/100 km (comb.)', '146 g/km (comb.)', 'Grey',
    'Cloth, Black', '1', '07/2027', 'Used', 'Euro 6d', '5', 'Fair price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-008');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-009', 'autoscout24', 'Mercedes-Benz GLC 300 e 4MATIC Hybrid AMG Line',
    'Mercedes-Benz', 'GLC', '58.000 km', 'Electric/Gasoline', 'Automatic', '01/2021',
    38500.00, 43120.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Mercedes-Benz_GLC_facelift.jpg/960px-Mercedes-Benz_GLC_facelift.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'GLC 300 e hibrido enchufable con traccion 4MATIC y paquete AMG Line. Unos 40 km de autonomia electrica reales, MBUX con pantalla de 10,25", techo panoramico y camara 360. En Espana le corresponde etiqueta CERO.',
    '["Hibrido enchufable","Traccion 4MATIC","Paquete AMG Line","MBUX 10,25\"","Techo panoramico","Camara 360","Asientos calefactables","Portón electrico"]',
    'Musterhaus Automobile Stuttgart', '+49 000 0000000', '+49 000 0000000', 4.2,
    '235 kW (320 hp)', '2,5 l/100 km (comb.)', '57 g/km (comb.)', 'Black',
    'Leather, Black', '1', '01/2027', 'Used', 'Euro 6d', '5', 'Good price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-009');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-010', 'mobile.de', 'Tesla Model 3 Long Range AWD Autopilot',
    'Tesla', 'Model 3', '66.000 km', 'Electric', 'Automatic', '08/2021',
    29900.00, 33787.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/2021_Tesla_Model_3_Long_Range_AWD_%2865528%29.jpg/960px-2021_Tesla_Model_3_Long_Range_AWD_%2865528%29.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'Model 3 Long Range con doble motor y unos 560 km de autonomia WLTP. Autopilot basico incluido, techo de cristal y acceso a la red de Superchargers. Al ser electrico el impuesto de matriculacion en Espana es del 0%.',
    '["Doble motor AWD","Autopilot","Techo de cristal","Bomba de calor","Asientos calefactables","Preparado para Supercharger","Actualizaciones OTA","Camaras de vision 360"]',
    'Demo Elektro Automobile Berlin', '+49 000 0000000', '+49 000 0000000', 4.5,
    '324 kW (440 hp)', '16,0 kWh/100 km (comb.)', '0 g/km (comb.)', 'White',
    'Part leather, Black', '1', '08/2027', 'Used', 'Electric', '5', 'Good price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-010');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-011', 'mobile.de', 'VW ID.3 Pro Performance 1st Plus Warmepumpe',
    'Volkswagen', 'ID.3', '42.000 km', 'Electric', 'Automatic', '10/2020',
    19450.00, 21979.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/2020_Volkswagen_ID.3_1st_Front.jpg/960px-2020_Volkswagen_ID.3_1st_Front.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'ID.3 Pro Performance de la serie de lanzamiento 1st Plus, con bateria de 58 kWh y unos 420 km WLTP. Lleva bomba de calor, que es justo lo que se echa de menos en los ID.3 mas baratos. Etiqueta CERO en Espana.',
    '["Bateria 58 kWh","Bomba de calor","Carga rapida 100 kW","Navegador Discover Pro","Camara trasera","Faros LED Matrix","Asientos calefactables","Head-Up Display"]',
    'Demo Elektro Automobile Berlin', '+49 000 0000000', NULL, 4.5,
    '150 kW (204 hp)', '15,4 kWh/100 km (comb.)', '0 g/km (comb.)', 'Blue',
    'Cloth, Grey', '1', '10/2027', 'Used', 'Electric', '5', 'Very good price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-011');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-012', 'mobile.de', 'Opel Corsa 1.2 Elegance Klimaautomatik PDC',
    'Opel', 'Corsa', '51.000 km', 'Gasoline', 'Manual gearbox', '06/2020',
    11900.00, 13685.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Opel_Corsa_%2848810328736%29.jpg/960px-Opel_Corsa_%2848810328736%29.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'Corsa F acabado Elegance, la generacion que comparte plataforma con el Peugeot 208. Climatizador automatico, sensores de aparcamiento, pantalla Multimedia y volante calefactable. Utilitario barato de mantener.',
    '["Climatizador automatico","Sensores de aparcamiento","Pantalla Multimedia","Volante calefactable","Faros LED","Control de crucero","Bluetooth","Llantas de 16"]',
    'Muster Automobile Hamburg', '+49 000 0000000', NULL, 4.8,
    '55 kW (75 hp)', '5,2 l/100 km (comb.)', '119 g/km (comb.)', 'Red',
    'Cloth, Black', '2', '06/2027', 'Used', 'Euro 6d-TEMP', '5', 'Fair price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-012');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-013', 'autoscout24', 'Porsche Macan S 3.0 V6 PDK Luftfederung Bose',
    'Porsche', 'Macan', '78.000 km', 'Gasoline', 'Automatic', '05/2019',
    46900.00, 52528.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/2019_Porsche_Macan_S-A_facelift_2.0_Front.jpg/960px-2019_Porsche_Macan_S-A_facelift_2.0_Front.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'Macan S restyling con el V6 biturbo de 354 CV, cambio PDK y suspension neumatica. Sonido Bose, techo panoramico y asientos deportivos adaptativos. Ojo al impuesto de matriculacion en Espana: por emisiones se va al tramo alto.',
    '["Motor V6 biturbo","Cambio PDK","Suspension neumatica","Sonido Bose","Techo panoramico","Asientos deportivos adaptativos","Chrono Package","Camara 360"]',
    'Musterhaus Automobile Stuttgart', '+49 000 0000000', NULL, 4.2,
    '260 kW (354 hp)', '9,8 l/100 km (comb.)', '223 g/km (comb.)', 'Green',
    'Leather, Black', '1', '05/2027', 'Used', 'Euro 6d-TEMP', '5', 'Increased price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-013');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-014', 'mobile.de', 'BMW X1 sDrive18d Advantage Navi PDC',
    'BMW', 'X1', '104.000 km', 'Diesel', 'Automatic', '03/2019',
    18900.00, 21357.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/2019_BMW_X1_sDrive18i_Sport_Automatic_facelift_1.5.jpg/960px-2019_BMW_X1_sDrive18i_Sport_Automatic_facelift_1.5.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'X1 F48 restyling con acabado Advantage y cambio automatico. SUV compacto muy practico, con banqueta trasera deslizante y 505 litros de maletero. Kilometros altos pero todas las revisiones hechas en concesionario.',
    '["Cambio automatico","Navegador Business","Banqueta trasera deslizante","Sensores de aparcamiento","Faros LED","Control de crucero","Climatizador bizona","Enganche de remolque"]',
    'Autohaus Demo Nord GmbH', '+49 000 0000000', NULL, 4.6,
    '110 kW (150 hp)', '5,0 l/100 km (comb.)', '132 g/km (comb.)', 'Grey',
    'Cloth, Black', '2', '03/2027', 'Used', 'Euro 6d-TEMP', '5', 'Good price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-014');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-015', 'mobile.de', 'Dacia Sandero 1.0 SCe Essential Klima',
    'Dacia', 'Sandero', '74.000 km', 'Gasoline', 'Manual gearbox', '04/2021',
    8450.00, 9718.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/2021_Dacia_Sandero_Stepway_Prestige_TCE_1.0_Front.jpg/960px-2021_Dacia_Sandero_Stepway_Prestige_TCE_1.0_Front.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'Sandero de tercera generacion en acabado de acceso Essential. Aire acondicionado, elevalunas electricos y poco mas: es el coche barato de verdad del catalogo. Mecanica atmosferica sin turbo, la mas sencilla de mantener.',
    '["Aire acondicionado","Elevalunas electricos","Radio DAB","Bluetooth","Limitador de velocidad","Frenada de emergencia","Direccion asistida","Llantas de 15"]',
    'Demo Autozentrum Koln', '+49 000 0000000', NULL, 4.4,
    '49 kW (67 hp)', '5,4 l/100 km (comb.)', '123 g/km (comb.)', 'Grey',
    'Cloth, Black', '1', '04/2027', 'Used', 'Euro 6d', '5', 'Very good price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-015');

INSERT INTO coches_importados (apify_id, fuente, titulo, marca, modelo, kilometraje,
    combustible, cambio, matriculacion, precio_original, precio_con_comision, imagen_url,
    url_original, fecha_ingesta, activo, description, features_json, dealer_name,
    dealer_phone, dealer_whatsapp, dealer_score, power, fuel_consumption, co2, color,
    interior_design, num_owners, hu, vehicle_condition, emission_class_val, num_seats,
    price_rating)
SELECT 'demo-016', 'autoscout24', 'Nissan Qashqai 1.3 DIG-T N-Connecta Panorama',
    'Nissan', 'Qashqai', '83.000 km', 'Gasoline', 'Manual gearbox', '09/2019',
    14500.00, 16675.00,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/2019_Nissan_Qashqai_Acenta_Premium_Front.jpg/960px-2019_Nissan_Qashqai_Acenta_Premium_Front.jpg',
    NULL, '2026-08-01 09:00:00', true,
    'Qashqai J11 restyling con acabado N-Connecta: techo panoramico, camara 360, navegador NissanConnect y llantas de 18". El SUV compacto mas vendido de Europa durante anos, con recambios baratos.',
    '["Techo panoramico","Camara 360","Navegador NissanConnect","Llantas de 18","Faros LED","Sensores delanteros y traseros","Climatizador bizona","Apple CarPlay"]',
    'Muster Automobile Hamburg', '+49 000 0000000', NULL, 4.8,
    '103 kW (140 hp)', '6,3 l/100 km (comb.)', '143 g/km (comb.)', 'Blue',
    'Cloth, Black', '2', '09/2027', 'Used', 'Euro 6d-TEMP', '5', 'Fair price'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM coches_importados WHERE apify_id = 'demo-016');


-- ---------------------------------------------------------------------------
-- RESERVAS DE DEMO
-- Contacto inventado bajo dominio example.com, reservado por el RFC 2606
-- precisamente para esto. Sirven para que el panel de administracion no salga
-- vacio en la demo.
-- ---------------------------------------------------------------------------

INSERT INTO reservas (nombre, telefono, email, comentario, fecha_solicitud, estado, coche_id)
SELECT 'Cliente de prueba 1', '+34 000 000 001', 'cliente1@example.com',
    'Me interesa el Ibiza. Puedo pasar a verlo el sabado por la manana?',
    '2026-08-15 10:24:00', 'PENDIENTE', (SELECT id FROM coches WHERE matriculacion = '1234 DEM')
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM reservas WHERE email = 'cliente1@example.com')
  AND EXISTS (SELECT * FROM coches WHERE matriculacion = '1234 DEM');

INSERT INTO reservas (nombre, telefono, email, comentario, fecha_solicitud, estado, coche_id)
SELECT 'Cliente de prueba 2', '+34 000 000 002', 'cliente2@example.com',
    'Acepta entrega de mi coche actual como parte del pago?',
    '2026-08-14 17:03:00', 'ATENDIDA', (SELECT id FROM coches WHERE matriculacion = '4567 DEM')
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM reservas WHERE email = 'cliente2@example.com')
  AND EXISTS (SELECT * FROM coches WHERE matriculacion = '4567 DEM');

INSERT INTO reservas (nombre, telefono, email, comentario, fecha_solicitud, estado, coche_id)
SELECT 'Cliente de prueba 3', '+34 000 000 003', 'cliente3@example.com',
    'Necesito financiacion a 60 meses. Trabajan con alguna entidad?',
    '2026-08-13 09:47:00', 'PENDIENTE', (SELECT id FROM coches WHERE matriculacion = '7890 DEM')
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM reservas WHERE email = 'cliente3@example.com')
  AND EXISTS (SELECT * FROM coches WHERE matriculacion = '7890 DEM');


-- ---------------------------------------------------------------------------
-- OFERTAS DE VENTA DE DEMO (formulario "Vende tu coche")
-- ---------------------------------------------------------------------------

INSERT INTO ofertas_venta (marca, modelo, version, anio, kilometros, precio, combustible,
    transmision, potencia, carroceria, color, puertas, matricula, itv, descripcion,
    nombre_vendedor, telefono_vendedor, email_vendedor, provincia, fecha_solicitud,
    estado, notas_admin)
SELECT 'Volkswagen', 'Golf', '1.6 TDI Advance', 2016, 148000, 9500.00, 'Diésel',
    'Manual', '110 CV', 'Berlina', 'Gris', 5, '1111 DEM', '05/2027',
    'Golf VII con distribucion y embrague cambiados el ano pasado. Siempre en garaje, no fumador.',
    'Vendedor de prueba 1', '+34 000 000 011', 'vendedor1@example.com', 'Alicante',
    '2026-08-15 12:10:00', 'PENDIENTE', NULL
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM ofertas_venta WHERE matricula = '1111 DEM');

INSERT INTO ofertas_venta (marca, modelo, version, anio, kilometros, precio, combustible,
    transmision, potencia, carroceria, color, puertas, matricula, itv, descripcion,
    nombre_vendedor, telefono_vendedor, email_vendedor, provincia, fecha_solicitud,
    estado, notas_admin)
SELECT 'BMW', 'Serie 3', '320d Touring', 2015, 196000, 11200.00, 'Diésel',
    'Automático', '190 CV', 'Familiar', 'Negro', 5, '2222 DEM', '11/2026',
    'Muchos kilometros pero de autopista. Cadena de distribucion revisada a los 180.000.',
    'Vendedor de prueba 2', '+34 000 000 012', 'vendedor2@example.com', 'Murcia',
    '2026-08-12 18:35:00', 'INTERESADO', 'Precio alto para los km que tiene. Contraofertar sobre 9.500.'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM ofertas_venta WHERE matricula = '2222 DEM');

INSERT INTO ofertas_venta (marca, modelo, version, anio, kilometros, precio, combustible,
    transmision, potencia, carroceria, color, puertas, matricula, itv, descripcion,
    nombre_vendedor, telefono_vendedor, email_vendedor, provincia, fecha_solicitud,
    estado, notas_admin)
SELECT 'Renault', 'Megane', '1.5 dCi Business', 2014, 224000, 4200.00, 'Diésel',
    'Manual', '110 CV', 'Berlina', 'Blanco', 5, '3333 DEM', '02/2027',
    'Coche de trabajo, funciona bien pero tiene golpes de aparcamiento en las dos puertas derechas.',
    'Vendedor de prueba 3', '+34 000 000 013', 'vendedor3@example.com', 'Valencia',
    '2026-08-09 08:20:00', 'DESCARTADA', 'Demasiados kilometros y chapa tocada. No encaja en el catalogo.'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM ofertas_venta WHERE matricula = '3333 DEM');
