/* =========================================================
   Sample data — se carga si no hay datos en localStorage.
   Reemplazado al cargar un Excel desde la barra superior.
   ========================================================= */

window.SAMPLE_DATA = {
  config: {
    nombre_estudio: "estudioarq.",
    saldo_inicial_caja: 5000000,
    moneda: "ARS"
  },

  obras: [
    { id: "OB001", nombre: "Casa Olivos",              cliente: "Fam. Gómez",                presupuesto: 18500000, ejecucion_pct: 69, estado: "En curso",   fecha_inicio: "2025-04-15", fecha_fin_estimada: "2026-08-30" },
    { id: "OB002", nombre: "Oficinas Belgrano",        cliente: "Belgrano Corp.",            presupuesto: 26000000, ejecucion_pct: 68, estado: "En curso",   fecha_inicio: "2025-06-01", fecha_fin_estimada: "2026-09-15" },
    { id: "OB003", nombre: "Local Comercial Nordelta", cliente: "Emprendimientos del Norte", presupuesto:  9800000, ejecucion_pct: 66, estado: "En exceso",  fecha_inicio: "2025-08-10", fecha_fin_estimada: "2026-05-20" },
    { id: "OB004", nombre: "Vivienda Los Alisos",      cliente: "Fam. Rodríguez",            presupuesto: 15200000, ejecucion_pct: 70, estado: "En curso",   fecha_inicio: "2025-05-20", fecha_fin_estimada: "2026-07-10" },
    { id: "OB005", nombre: "Remodelación Palermo",     cliente: "Estudio Jurídico Lex",      presupuesto:  6400000, ejecucion_pct: 64, estado: "Atención",   fecha_inicio: "2025-09-05", fecha_fin_estimada: "2026-04-30" },
    { id: "OB006", nombre: "Casa Pilar",               cliente: "Fam. Santoro",              presupuesto: 22000000, ejecucion_pct: 63, estado: "En curso",   fecha_inicio: "2025-07-01", fecha_fin_estimada: "2026-10-15" }
  ],

  proveedores: [
    { id: "PR001", nombre: "Aceros del Sur S.A.",     rubro: "Hierros y aceros",   contacto: "Marcos Pereyra",  telefono: "+54 11 4567-1230", email: "ventas@acerosdelsur.com.ar" },
    { id: "PR002", nombre: "Cementera Pampeana",      rubro: "Cemento y áridos",   contacto: "Lucía Fernández", telefono: "+54 11 4567-9821", email: "pedidos@cementerapampeana.com" },
    { id: "PR003", nombre: "Maderas Norte",           rubro: "Madera y carpintería", contacto: "Carlos Ríos",   telefono: "+54 11 4789-2200", email: "contacto@maderasnorte.com.ar" },
    { id: "PR004", nombre: "ElectroObra SRL",         rubro: "Eléctrico",          contacto: "Romina Soto",     telefono: "+54 11 5678-1100", email: "info@electroobra.com.ar" },
    { id: "PR005", nombre: "Sanitarios Premium",      rubro: "Sanitarios y griferías", contacto: "Diego Maldonado", telefono: "+54 11 4912-7700", email: "ventas@sanitariospremium.com" },
    { id: "PR006", nombre: "Vidriería Belgrano",      rubro: "Vidrios y aberturas", contacto: "Andrea López",   telefono: "+54 11 4781-3344", email: "contacto@vidrieriabelgrano.com" },
    { id: "PR007", nombre: "Mano de Obra Construir",  rubro: "Mano de obra",       contacto: "Roberto Casas",   telefono: "+54 11 4555-9988", email: "rcasas@construirmo.com.ar" }
  ],

  // Movimientos de costos — spread 2025-2026 para cubrir período actual
  costos: [
    // Casa Olivos (total ≈ 12.85M)
    { id: "C001", obra_id: "OB001", fecha: "2025-05-10", categoria: "Materiales",   descripcion: "Hierros estructurales", monto: 1850000, proveedor_id: "PR001" },
    { id: "C002", obra_id: "OB001", fecha: "2025-08-22", categoria: "Materiales",   descripcion: "Cemento y áridos",      monto: 1200000, proveedor_id: "PR002" },
    { id: "C003", obra_id: "OB001", fecha: "2025-11-15", categoria: "Mano de obra", descripcion: "Cuadrilla albañilería", monto: 2400000, proveedor_id: "PR007" },
    { id: "C004", obra_id: "OB001", fecha: "2026-01-12", categoria: "Materiales",   descripcion: "Carpintería interior",  monto: 1600000, proveedor_id: "PR003" },
    { id: "C005", obra_id: "OB001", fecha: "2026-02-20", categoria: "Eléctrico",    descripcion: "Tablero y cableado",    monto:  950000, proveedor_id: "PR004" },
    { id: "C006", obra_id: "OB001", fecha: "2026-03-15", categoria: "Sanitarios",   descripcion: "Griferías y sanitarios",monto: 1300000, proveedor_id: "PR005" },
    { id: "C007", obra_id: "OB001", fecha: "2026-04-08", categoria: "Mano de obra", descripcion: "Terminaciones",         monto: 3550000, proveedor_id: "PR007" },

    // Oficinas Belgrano (total ≈ 17.6M)
    { id: "C008", obra_id: "OB002", fecha: "2025-07-05", categoria: "Materiales",   descripcion: "Estructura metálica",   monto: 3200000, proveedor_id: "PR001" },
    { id: "C009", obra_id: "OB002", fecha: "2025-09-18", categoria: "Materiales",   descripcion: "Cemento y hormigón",    monto: 2400000, proveedor_id: "PR002" },
    { id: "C010", obra_id: "OB002", fecha: "2025-12-10", categoria: "Mano de obra", descripcion: "Estructura y losas",    monto: 3800000, proveedor_id: "PR007" },
    { id: "C011", obra_id: "OB002", fecha: "2026-01-25", categoria: "Eléctrico",    descripcion: "Instalación general",   monto: 2100000, proveedor_id: "PR004" },
    { id: "C012", obra_id: "OB002", fecha: "2026-02-14", categoria: "Aberturas",    descripcion: "Vidrios DVH",           monto: 2800000, proveedor_id: "PR006" },
    { id: "C013", obra_id: "OB002", fecha: "2026-03-22", categoria: "Mano de obra", descripcion: "Terminaciones",         monto: 1700000, proveedor_id: "PR007" },
    { id: "C014", obra_id: "OB002", fecha: "2026-04-10", categoria: "Materiales",   descripcion: "Pisos técnicos",        monto: 1600000, proveedor_id: "PR003" },

    // Local Comercial Nordelta (total ≈ 6.5M)
    { id: "C015", obra_id: "OB003", fecha: "2025-09-12", categoria: "Materiales",   descripcion: "Estructura",            monto: 1500000, proveedor_id: "PR001" },
    { id: "C016", obra_id: "OB003", fecha: "2025-11-25", categoria: "Mano de obra", descripcion: "Albañilería",           monto: 1800000, proveedor_id: "PR007" },
    { id: "C017", obra_id: "OB003", fecha: "2026-02-08", categoria: "Eléctrico",    descripcion: "Iluminación comercial", monto:  900000, proveedor_id: "PR004" },
    { id: "C018", obra_id: "OB003", fecha: "2026-03-18", categoria: "Aberturas",    descripcion: "Vidriera frente",       monto: 1400000, proveedor_id: "PR006" },
    { id: "C019", obra_id: "OB003", fecha: "2026-04-15", categoria: "Mano de obra", descripcion: "Terminaciones",         monto:  900000, proveedor_id: "PR007" },

    // Vivienda Los Alisos (total ≈ 9.9M)
    { id: "C020", obra_id: "OB004", fecha: "2025-06-15", categoria: "Materiales",   descripcion: "Movimiento de suelos",  monto:  900000, proveedor_id: "PR002" },
    { id: "C021", obra_id: "OB004", fecha: "2025-08-30", categoria: "Materiales",   descripcion: "Hierros y cemento",     monto: 1700000, proveedor_id: "PR001" },
    { id: "C022", obra_id: "OB004", fecha: "2025-11-08", categoria: "Mano de obra", descripcion: "Estructura",            monto: 2100000, proveedor_id: "PR007" },
    { id: "C023", obra_id: "OB004", fecha: "2026-01-20", categoria: "Materiales",   descripcion: "Carpintería",           monto: 1400000, proveedor_id: "PR003" },
    { id: "C024", obra_id: "OB004", fecha: "2026-02-25", categoria: "Eléctrico",    descripcion: "Instalación",           monto:  900000, proveedor_id: "PR004" },
    { id: "C025", obra_id: "OB004", fecha: "2026-03-10", categoria: "Sanitarios",   descripcion: "Baños completos",       monto: 1300000, proveedor_id: "PR005" },
    { id: "C026", obra_id: "OB004", fecha: "2026-04-12", categoria: "Mano de obra", descripcion: "Terminaciones",         monto: 1600000, proveedor_id: "PR007" },

    // Remodelación Palermo (total ≈ 4.1M)
    { id: "C027", obra_id: "OB005", fecha: "2025-10-08", categoria: "Materiales",   descripcion: "Demolición y retiro",   monto:  600000, proveedor_id: "PR002" },
    { id: "C028", obra_id: "OB005", fecha: "2025-12-15", categoria: "Mano de obra", descripcion: "Demolición",            monto:  800000, proveedor_id: "PR007" },
    { id: "C029", obra_id: "OB005", fecha: "2026-02-10", categoria: "Materiales",   descripcion: "Pisos y revestimientos",monto: 1100000, proveedor_id: "PR003" },
    { id: "C030", obra_id: "OB005", fecha: "2026-03-25", categoria: "Eléctrico",    descripcion: "Cableado nuevo",        monto:  600000, proveedor_id: "PR004" },
    { id: "C031", obra_id: "OB005", fecha: "2026-04-18", categoria: "Mano de obra", descripcion: "Terminaciones",         monto: 1000000, proveedor_id: "PR007" },

    // Casa Pilar (total ≈ 13.8M)
    { id: "C032", obra_id: "OB006", fecha: "2025-08-12", categoria: "Materiales",   descripcion: "Movimiento de suelos",  monto: 1100000, proveedor_id: "PR002" },
    { id: "C033", obra_id: "OB006", fecha: "2025-10-22", categoria: "Materiales",   descripcion: "Hierros estructurales", monto: 2200000, proveedor_id: "PR001" },
    { id: "C034", obra_id: "OB006", fecha: "2025-12-05", categoria: "Mano de obra", descripcion: "Estructura",            monto: 2800000, proveedor_id: "PR007" },
    { id: "C035", obra_id: "OB006", fecha: "2026-01-18", categoria: "Materiales",   descripcion: "Carpintería interior",  monto: 2100000, proveedor_id: "PR003" },
    { id: "C036", obra_id: "OB006", fecha: "2026-02-28", categoria: "Eléctrico",    descripcion: "Instalación completa",  monto: 1400000, proveedor_id: "PR004" },
    { id: "C037", obra_id: "OB006", fecha: "2026-03-20", categoria: "Sanitarios",   descripcion: "Baños y cocina",        monto: 1900000, proveedor_id: "PR005" },
    { id: "C038", obra_id: "OB006", fecha: "2026-04-14", categoria: "Mano de obra", descripcion: "Terminaciones",         monto: 2300000, proveedor_id: "PR007" }
  ],

  // Movimientos de ingresos (cobranzas a clientes)
  ingresos: [
    // Casa Olivos
    { id: "I001", obra_id: "OB001", fecha: "2025-05-01", descripcion: "Anticipo 30%",            monto: 5550000, cliente: "Fam. Gómez" },
    { id: "I002", obra_id: "OB001", fecha: "2025-09-15", descripcion: "Avance de obra 20%",      monto: 3700000, cliente: "Fam. Gómez" },
    { id: "I003", obra_id: "OB001", fecha: "2026-01-20", descripcion: "Avance de obra 20%",      monto: 3700000, cliente: "Fam. Gómez" },
    { id: "I004", obra_id: "OB001", fecha: "2026-04-05", descripcion: "Avance de obra 15%",      monto: 2775000, cliente: "Fam. Gómez" },

    // Oficinas Belgrano
    { id: "I005", obra_id: "OB002", fecha: "2025-06-15", descripcion: "Anticipo 30%",            monto: 7800000, cliente: "Belgrano Corp." },
    { id: "I006", obra_id: "OB002", fecha: "2025-10-10", descripcion: "Avance 25%",              monto: 6500000, cliente: "Belgrano Corp." },
    { id: "I007", obra_id: "OB002", fecha: "2026-02-05", descripcion: "Avance 20%",              monto: 5200000, cliente: "Belgrano Corp." },
    { id: "I008", obra_id: "OB002", fecha: "2026-04-15", descripcion: "Avance 15%",              monto: 3900000, cliente: "Belgrano Corp." },

    // Local Comercial Nordelta
    { id: "I009", obra_id: "OB003", fecha: "2025-08-20", descripcion: "Anticipo 30%",            monto: 2940000, cliente: "Emprendimientos del Norte" },
    { id: "I010", obra_id: "OB003", fecha: "2025-12-05", descripcion: "Avance 25%",              monto: 2450000, cliente: "Emprendimientos del Norte" },
    { id: "I011", obra_id: "OB003", fecha: "2026-03-15", descripcion: "Avance 20%",              monto: 1960000, cliente: "Emprendimientos del Norte" },

    // Vivienda Los Alisos
    { id: "I012", obra_id: "OB004", fecha: "2025-05-25", descripcion: "Anticipo 30%",            monto: 4560000, cliente: "Fam. Rodríguez" },
    { id: "I013", obra_id: "OB004", fecha: "2025-10-18", descripcion: "Avance 25%",              monto: 3800000, cliente: "Fam. Rodríguez" },
    { id: "I014", obra_id: "OB004", fecha: "2026-02-22", descripcion: "Avance 20%",              monto: 3040000, cliente: "Fam. Rodríguez" },
    { id: "I015", obra_id: "OB004", fecha: "2026-04-10", descripcion: "Avance 15%",              monto: 2280000, cliente: "Fam. Rodríguez" },

    // Remodelación Palermo
    { id: "I016", obra_id: "OB005", fecha: "2025-09-15", descripcion: "Anticipo 40%",            monto: 2560000, cliente: "Estudio Jurídico Lex" },
    { id: "I017", obra_id: "OB005", fecha: "2026-01-25", descripcion: "Avance 30%",              monto: 1920000, cliente: "Estudio Jurídico Lex" },
    { id: "I018", obra_id: "OB005", fecha: "2026-04-15", descripcion: "Avance 20%",              monto: 1280000, cliente: "Estudio Jurídico Lex" },

    // Casa Pilar
    { id: "I019", obra_id: "OB006", fecha: "2025-07-10", descripcion: "Anticipo 30%",            monto: 6600000, cliente: "Fam. Santoro" },
    { id: "I020", obra_id: "OB006", fecha: "2025-11-25", descripcion: "Avance 25%",              monto: 5500000, cliente: "Fam. Santoro" },
    { id: "I021", obra_id: "OB006", fecha: "2026-02-15", descripcion: "Avance 20%",              monto: 4400000, cliente: "Fam. Santoro" },
    { id: "I022", obra_id: "OB006", fecha: "2026-04-20", descripcion: "Avance 15%",              monto: 3300000, cliente: "Fam. Santoro" }
  ]
};
