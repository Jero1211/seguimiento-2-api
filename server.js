const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Base de Datos en Memoria (con función de reinicio a valores iniciales)
const getInitialFleet = () => [
  {
    id: "DRN-101",
    model: "Valkyrie-X4 Carga Pesada",
    sector: "Alfa",
    status: "en_vuelo",
    battery: 78,
    speedKmh: 64.2,
    altitudeM: 120,
    coordinates: { lat: 4.7110, lng: -74.0721 },
    maxPayloadKg: 12.0,
    currentPayloadKg: 6.5,
    headingDeg: 142,
    activeMissionId: "MSN-8801",
    lastMaintenance: "2026-09-15",
    telemetryHistory: [
      { hora: "17:45", bateria: 85, velocidad: 60.0, altitud: 110 },
      { hora: "17:50", bateria: 82, velocidad: 63.5, altitud: 118 },
      { hora: "17:55", bateria: 78, velocidad: 64.2, altitud: 120 }
    ]
  },
  {
    id: "DRN-102",
    model: "AeroGlide Rotor Basculante Mk II",
    sector: "Beta",
    status: "acoplado",
    battery: 98,
    speedKmh: 0.0,
    altitudeM: 0,
    coordinates: { lat: 4.6097, lng: -74.0817 },
    maxPayloadKg: 8.0,
    currentPayloadKg: 0.0,
    headingDeg: 0,
    activeMissionId: null,
    lastMaintenance: "2026-10-01",
    telemetryHistory: [
      { hora: "17:30", bateria: 98, velocidad: 0.0, altitud: 0 }
    ]
  },
  {
    id: "DRN-103",
    model: "SkyCourier Cápsula Express",
    sector: "Alfa",
    status: "en_vuelo",
    battery: 42,
    speedKmh: 78.5,
    altitudeM: 145,
    coordinates: { lat: 4.6533, lng: -74.0558 },
    maxPayloadKg: 5.0,
    currentPayloadKg: 3.2,
    headingDeg: 285,
    activeMissionId: "MSN-8802",
    lastMaintenance: "2026-09-28",
    telemetryHistory: [
      { hora: "17:40", bateria: 55, velocidad: 76.0, altitud: 140 },
      { hora: "17:50", bateria: 48, velocidad: 77.8, altitud: 144 },
      { hora: "17:55", bateria: 42, velocidad: 78.5, altitud: 145 }
    ]
  },
  {
    id: "DRN-104",
    model: "Titan Transporte de Largo Alcance",
    sector: "Gamma",
    status: "acoplado",
    battery: 100,
    speedKmh: 0.0,
    altitudeM: 0,
    coordinates: { lat: 4.6889, lng: -74.1205 },
    maxPayloadKg: 20.0,
    currentPayloadKg: 0.0,
    headingDeg: 90,
    activeMissionId: null,
    lastMaintenance: "2026-10-10",
    telemetryHistory: [
      { hora: "17:00", bateria: 100, velocidad: 0.0, altitud: 0 }
    ]
  },
  {
    id: "DRN-105",
    model: "AeroGlide Rotor Basculante Mk II",
    sector: "Beta",
    status: "retornando",
    battery: 19,
    speedKmh: 52.0,
    altitudeM: 85,
    coordinates: { lat: 4.6215, lng: -74.0734 },
    maxPayloadKg: 8.0,
    currentPayloadKg: 0.0,
    headingDeg: 12,
    activeMissionId: "MSN-8799",
    lastMaintenance: "2026-09-20",
    telemetryHistory: [
      { hora: "17:40", bateria: 32, velocidad: 65.0, altitud: 120 },
      { hora: "17:50", bateria: 24, velocidad: 58.0, altitud: 95 },
      { hora: "17:55", bateria: 19, velocidad: 52.0, altitud: 85 }
    ]
  },
  {
    id: "DRN-106",
    model: "Valkyrie-X4 Carga Pesada",
    sector: "Delta",
    status: "mantenimiento",
    battery: 65,
    speedKmh: 0.0,
    altitudeM: 0,
    coordinates: { lat: 4.7345, lng: -74.0412 },
    maxPayloadKg: 12.0,
    currentPayloadKg: 0.0,
    headingDeg: 0,
    activeMissionId: null,
    lastMaintenance: "2026-10-16",
    telemetryHistory: [
      { hora: "16:00", bateria: 65, velocidad: 0.0, altitud: 0 }
    ]
  }
];

const getInitialMissions = () => [
  {
    id: "MSN-8801",
    droneId: "DRN-101",
    cargoType: "Kit de Emergencia Médica y Vacunas",
    weightKg: 6.5,
    origin: "Centro Logístico Norte Sector Alfa",
    destination: "Hospital San Carlos Sector Alfa",
    priority: "ALTA",
    status: "en_transito",
    etaMinutes: 14,
    dispatchedAt: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: "MSN-8802",
    droneId: "DRN-103",
    cargoType: "Lote Urgente de Microelectrónica",
    weightKg: 3.2,
    origin: "TechLab Hub Central",
    destination: "Distrito Financiero Hub Beta",
    priority: "MEDIA",
    status: "en_transito",
    etaMinutes: 8,
    dispatchedAt: new Date(Date.now() - 8 * 60000).toISOString()
  },
  {
    id: "MSN-8799",
    droneId: "DRN-105",
    cargoType: "Muestras Biológicas de Laboratorio",
    weightKg: 2.1,
    origin: "Centro de Investigación Sector Gamma",
    destination: "Instalación de Pruebas Central Hub Beta",
    priority: "ALTA",
    status: "completada",
    etaMinutes: 0,
    dispatchedAt: new Date(Date.now() - 45 * 60000).toISOString()
  }
];

let fleet = getInitialFleet();
let missions = getInitialMissions();

const getFleetStats = () => {
  const totalDrones = fleet.length;
  const airborne = fleet.filter(d => d.status === 'en_vuelo').length;
  const docked = fleet.filter(d => d.status === 'acoplado').length;
  const returning = fleet.filter(d => d.status === 'retornando').length;
  const maintenance = fleet.filter(d => d.status === 'mantenimiento').length;
  const avgBattery = Math.round(fleet.reduce((acc, d) => acc + d.battery, 0) / (totalDrones || 1));
  const activePayload = fleet.reduce((acc, d) => acc + (d.currentPayloadKg || 0), 0);

  return {
    totalDrones,
    airborne,
    docked,
    returning,
    maintenance,
    avgBattery,
    activePayloadKg: parseFloat(activePayload.toFixed(1)),
    totalMissions: missions.length
  };
};

/* ==========================================================================
   ENDPOINTS DE LA API REST
   ========================================================================== */

/**
 * 1. GET /api/drones
 * Obtener lista de drones con filtros opcionales (status, minBattery, sector)
 */
app.get('/api/drones', (req, res) => {
  let result = [...fleet];
  const { status, minBattery, sector } = req.query;

  if (status) {
    // Acepta tanto términos en español como sinónimos
    const s = status.toLowerCase();
    result = result.filter(d => 
      d.status.toLowerCase() === s ||
      (s === 'airborne' && d.status === 'en_vuelo') ||
      (s === 'docked' && d.status === 'acoplado') ||
      (s === 'returning' && d.status === 'retornando') ||
      (s === 'maintenance' && d.status === 'mantenimiento')
    );
  }

  if (minBattery) {
    const min = parseInt(minBattery, 10);
    if (!isNaN(min)) {
      result = result.filter(d => d.battery >= min);
    }
  }

  if (sector) {
    result = result.filter(d => d.sector.toLowerCase() === sector.toLowerCase());
  }

  res.json({
    exito: true,
    total: result.length,
    marcaTiempo: new Date().toISOString(),
    filtrosAplicados: {
      estado: status || null,
      bateriaMinima: minBattery || null,
      sector: sector || null
    },
    datos: result
  });
});

/**
 * 2. GET /api/drones/:id
 * Obtener telemetría detallada y diagnóstico de un dron específico
 */
app.get('/api/drones/:id', (req, res) => {
  const { id } = req.params;
  const drone = fleet.find(d => d.id.toUpperCase() === id.toUpperCase());

  if (!drone) {
    return res.status(404).json({
      exito: false,
      error: "DronNoEncontrado",
      mensaje: `No existe ningún dron registrado con el identificador '${id}'.`,
      identificadoresDisponibles: fleet.map(d => d.id)
    });
  }

  const activeMission = drone.activeMissionId
    ? missions.find(m => m.id === drone.activeMissionId)
    : null;

  res.json({
    exito: true,
    marcaTiempo: new Date().toISOString(),
    datos: {
      ...drone,
      detallesMisionActiva: activeMission
    }
  });
});

/**
 * 3. POST /api/missions
 * Despachar una nueva misión de carga para un dron disponible
 */
app.post('/api/missions', (req, res) => {
  const { droneId, cargoType, weightKg, destination, priority, origin } = req.body;

  if (!droneId || !cargoType || weightKg === undefined || !destination) {
    return res.status(400).json({
      exito: false,
      error: "ErrorDeValidacion",
      mensaje: "Faltan parámetros requeridos de la misión: 'droneId', 'cargoType', 'weightKg', 'destination'."
    });
  }

  const drone = fleet.find(d => d.id.toUpperCase() === droneId.toUpperCase());
  if (!drone) {
    return res.status(404).json({
      exito: false,
      error: "DronNoEncontrado",
      mensaje: `El dron objetivo '${droneId}' no existe.`
    });
  }

  if (drone.status === 'en_vuelo' || drone.status === 'retornando') {
    return res.status(409).json({
      exito: false,
      error: "DronNoDisponible",
      mensaje: `El dron '${drone.id}' se encuentra actualmente en operación (${drone.status}). Seleccione un dron acoplado.`
    });
  }

  if (drone.status === 'mantenimiento') {
    return res.status(409).json({
      exito: false,
      error: "DronEnMantenimiento",
      mensaje: `El dron '${drone.id}' está en tierra por mantenimiento preventivo.`
    });
  }

  if (drone.battery < 25) {
    return res.status(400).json({
      exito: false,
      error: "BateriaInsuficiente",
      mensaje: `La batería del dron '${drone.id}' (${drone.battery}%) es inferior a la reserva mínima de vuelo (25%).`
    });
  }

  const numWeight = parseFloat(weightKg);
  if (isNaN(numWeight) || numWeight <= 0) {
    return res.status(400).json({
      exito: false,
      error: "PesoInvalido",
      mensaje: "El peso de la carga debe ser un número positivo en kilogramos."
    });
  }

  if (numWeight > drone.maxPayloadKg) {
    return res.status(400).json({
      exito: false,
      error: "CapacidadExcedida",
      mensaje: `El peso de la carga (${numWeight} kg) supera la capacidad máxima de carga del dron (${drone.maxPayloadKg} kg).`
    });
  }

  const newMissionId = `MSN-${Math.floor(1000 + Math.random() * 9000)}`;
  const newMission = {
    id: newMissionId,
    droneId: drone.id,
    cargoType,
    weightKg: numWeight,
    origin: origin || `Centro Logístico Sector ${drone.sector}`,
    destination,
    priority: (priority || "MEDIA").toUpperCase(),
    status: "en_transito",
    etaMinutes: Math.floor(10 + Math.random() * 25),
    dispatchedAt: new Date().toISOString()
  };

  missions.unshift(newMission);

  drone.status = "en_vuelo";
  drone.currentPayloadKg = numWeight;
  drone.activeMissionId = newMissionId;
  drone.speedKmh = Math.floor(55 + Math.random() * 20);
  drone.altitudeM = 110;

  res.status(201).json({
    exito: true,
    mensaje: `Misión ${newMissionId} despachada exitosamente con el dron ${drone.id}.`,
    datos: newMission,
    estadoActualizadoDron: {
      id: drone.id,
      estado: drone.status,
      velocidadKmh: drone.speedKmh,
      altitudM: drone.altitudeM,
      cargaActualKg: drone.currentPayloadKg
    }
  });
});

/**
 * 4. PATCH /api/drones/:id/status
 * Actualizar el estado operativo del dron (acoplado, en_vuelo, retornando, mantenimiento)
 */
app.patch('/api/drones/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  const validStatuses = ['acoplado', 'en_vuelo', 'retornando', 'mantenimiento', 'docked', 'airborne', 'returning', 'maintenance'];
  if (!status || !validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({
      exito: false,
      error: "EstadoInvalido",
      mensaje: "El estado debe ser uno de: acoplado, en_vuelo, retornando, mantenimiento."
    });
  }

  const drone = fleet.find(d => d.id.toUpperCase() === id.toUpperCase());
  if (!drone) {
    return res.status(404).json({
      exito: false,
      error: "DronNoEncontrado",
      mensaje: `No existe ningún dron registrado con el identificador '${id}'.`
    });
  }

  // Normalizar a términos en español
  let normalizedStatus = status.toLowerCase();
  if (normalizedStatus === 'docked') normalizedStatus = 'acoplado';
  if (normalizedStatus === 'airborne') normalizedStatus = 'en_vuelo';
  if (normalizedStatus === 'returning') normalizedStatus = 'retornando';
  if (normalizedStatus === 'maintenance') normalizedStatus = 'mantenimiento';

  const previousStatus = drone.status;
  drone.status = normalizedStatus;

  if (drone.status === 'acoplado' || drone.status === 'mantenimiento') {
    drone.speedKmh = 0;
    drone.altitudeM = 0;
    drone.currentPayloadKg = 0;
    drone.activeMissionId = null;
  } else if (drone.status === 'retornando') {
    drone.speedKmh = Math.min(drone.speedKmh || 50, 55);
    drone.altitudeM = 80;
  }

  res.json({
    exito: true,
    mensaje: `El estado del dron '${drone.id}' cambió de '${previousStatus}' a '${drone.status}'.`,
    marcaTiempo: new Date().toISOString(),
    auditoria: {
      droneId: drone.id,
      estadoAnterior: previousStatus,
      estadoNuevo: drone.status,
      motivo: reason || "Intervención manual de operador"
    },
    datos: drone
  });
});

app.get('/api/missions', (req, res) => {
  res.json({
    exito: true,
    total: missions.length,
    marcaTiempo: new Date().toISOString(),
    datos: missions
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    exito: true,
    marcaTiempo: new Date().toISOString(),
    datos: getFleetStats()
  });
});

app.post('/api/reset', (req, res) => {
  fleet = getInitialFleet();
  missions = getInitialMissions();
  res.json({
    exito: true,
    mensaje: "Telemetría de la flota y registros de misiones reiniciados a su estado original.",
    estadisticas: getFleetStats()
  });
});

app.all('/api/*', (req, res) => {
  res.status(404).json({
    exito: false,
    error: "RutaNoEncontrada",
    mensaje: `El recurso '${req.method} ${req.url}' no existe en la API de AeroPulse.`
  });
});

app.listen(PORT, () => {
  console.log(`[AeroPulse API] En línea y escuchando en http://localhost:${PORT}`);
});
