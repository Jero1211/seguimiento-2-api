# 📚 Documentación Técnica Oficial — AeroPulse REST API (Seguimiento 2)

**Proyecto:** AeroPulse — Sistema de Telemetría y Despacho de Drones Autónomos  
**Asignatura / Entrega:** Seguimiento 2  
**Autor:** Jerónimo Mesa Carvajal (`Jero1211`)  
**URL Base de la API:** `http://localhost:3001`  
**Interfaz Web:** `http://localhost:3001/`  
**Colección de Postman:** [`postman_collection.json`](./postman_collection.json)

---

## 📑 Tabla de Contenidos

1. [Visión General del Sistema](#1-visión-general-del-sistema)
2. [Arquitectura y Tecnologías](#2-arquitectura-y-tecnologías)
3. [Modelos de Datos](#3-modelos-de-datos)
4. [Especificación de las 4 Consultas Obligatorias](#4-especificación-de-las-4-consultas-obligatorias)
   - [Consulta 1: Listar Drones en Vuelo (GET)](#consulta-1-listar-drones-en-vuelo-get)
   - [Consulta 2: Consultar Dron por ID (GET)](#consulta-2-consultar-dron-por-id-get)
   - [Consulta 3: Despachar Nueva Misión de Carga (POST)](#consulta-3-despachar-nueva-misión-de-carga-post)
   - [Consulta 4: Actualizar Estado Operativo (PATCH)](#consulta-4-actualizar-estado-operativo-patch)
5. [Endpoints Adicionales](#5-endpoints-adicionales)
6. [Manejo de Errores y Códigos HTTP](#6-manejo-de-errores-y-códigos-http)
7. [Guía de Pruebas en Postman](#7-guía-de-pruebas-en-postman)
8. [Interfaz Web y Diseño Impeccable](#8-interfaz-web-y-diseño-impeccable)

---

## 1. Visión General del Sistema

AeroPulse es una plataforma telemática orientada a la gestión de flotas de drones autónomos para transporte de carga médica e industrial en entornos metropolitanos. 

El sistema resuelve tres necesidades clave:
1. **Monitoreo en Tiempo Real**: Visualización de métricas de vuelo críticas (altitud, velocidad, nivel de batería, coordenadas GPS y sector).
2. **Despacho Automatizado**: Asignación de misiones con validación de peso máximo y niveles de seguridad energética.
3. **Control Operativo**: Transición de estados de las unidades (acoplamiento, vuelo, retorno a base o mantenimiento).

---

## 2. Arquitectura y Tecnologías

| Componente | Tecnología | Propósito |
|---|---|---|
| **Servidor / API** | Node.js + Express.js | Enrutamiento RESTful, validación de payloads y procesamiento de peticiones. |
| **Persistencia** | Base de Datos en Memoria | Estructura de datos con función de reinicio (`/api/reset`) para pruebas reproducibles. |
| **Frontend** | HTML5 Semántico + Vanilla CSS | Consola de monitoreo y control sin dependencias externas pesadas. |
| **Diseño / UI** | Impeccable Design System | Paleta de alto contraste para cabina de mando, números tabulares y WCAG AA. |
| **Testing** | Postman Collection v2.1.0 | Suite formal de pruebas con variables de entorno y ejemplos. |

---

## 3. Modelos de Datos

### Modelo: Dron (`Drone`)

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|---|---|---|---|---|
| `id` | `String` | Sí | Identificador único alfanumérico del dron | `"DRN-101"` |
| `model` | `String` | Sí | Nombre del modelo industrial del dron | `"Valkyrie-X4 Carga Pesada"` |
| `sector` | `String` | Sí | Sector aéreo asignado (Alfa, Beta, Gamma, Delta) | `"Alfa"` |
| `status` | `String` | Sí | Estado operativo (`en_vuelo`, `acoplado`, `retornando`, `mantenimiento`) | `"en_vuelo"` |
| `battery` | `Number` | Sí | Porcentaje de batería restante (0 - 100) | `78` |
| `speedKmh` | `Number` | Sí | Velocidad horizontal actual en km/h | `64.2` |
| `altitudeM` | `Number` | Sí | Altitud de vuelo sobre el nivel del suelo en metros | `120` |
| `coordinates` | `Object` | Sí | Latitud (`lat`) y longitud (`lng`) GPS | `{ lat: 4.7110, lng: -74.0721 }` |
| `maxPayloadKg` | `Number` | Sí | Capacidad de carga útil máxima soportada en kg | `12.0` |
| `currentPayloadKg` | `Number` | Sí | Peso de la carga transportada actualmente en kg | `6.5` |
| `headingDeg` | `Number` | Sí | Rumbo en grados sexagesimales (0 - 360) | `142` |
| `activeMissionId` | `String` | No | ID de la misión activa asignada (si existe) | `"MSN-8801"` |
| `telemetryHistory` | `Array` | Sí | Historial cronológico de sensores de vuelo | `[{ hora, bateria, velocidad, altitud }]` |

### Modelo: Misión (`Mission`)

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|---|---|---|---|---|
| `id` | `String` | Sí | Código de rastreo generado automáticamente | `"MSN-8801"` |
| `droneId` | `String` | Sí | Dron asignado para la ejecución | `"DRN-101"` |
| `cargoType` | `String` | Sí | Descripción de la mercancía | `"Kit de Emergencia Médica y Vacunas"` |
| `weightKg` | `Number` | Sí | Masa del paquete en kilogramos | `4.2` |
| `origin` | `String` | Sí | Punto de origen / plataforma de carga | `"Centro Logístico Norte Sector Alfa"` |
| `destination` | `String` | Sí | Coordenada o instalación de destino | `"Hospital San Carlos Sector Alfa"` |
| `priority` | `String` | Sí | Prioridad de vuelo (`ALTA`, `MEDIA`, `BAJA`) | `"ALTA"` |
| `status` | `String` | Sí | Estado (`en_transito`, `completada`, `cancelada`) | `"en_transito"` |
| `etaMinutes` | `Number` | Sí | Tiempo estimado de arribo en minutos | `14` |
| `dispatchedAt` | `String` | Sí | Marca de tiempo ISO-8601 del despegue | `"2026-10-16T23:09:30.436Z"` |

---

## 4. Especificación de las 4 Consultas Obligatorias

### Consulta 1: Listar Drones en Vuelo (GET)
Permite obtener el listado de drones aplicando filtros en la URL (*query parameters*).

- **Método:** `GET`
- **Ruta:** `/api/drones`
- **Parámetros Query:**
  - `status` (opcional): Filtra por estado (`en_vuelo`, `acoplado`, `retornando`, `mantenimiento`).
  - `sector` (opcional): Filtra por sector geográfico (`Alfa`, `Beta`, `Gamma`, `Delta`).
  - `minBattery` (opcional): Filtra drones con batería mayor o igual al valor numérico.
- **URL de Prueba en Postman:** `http://localhost:3001/api/drones?status=en_vuelo`
- **Código de Respuesta:** `200 OK`
- **Ejemplo de Respuesta:**
```json
{
  "exito": true,
  "total": 2,
  "marcaTiempo": "2026-10-16T23:19:36.650Z",
  "filtrosAplicados": {
    "estado": "en_vuelo",
    "bateriaMinima": null,
    "sector": null
  },
  "datos": [
    {
      "id": "DRN-101",
      "model": "Valkyrie-X4 Carga Pesada",
      "sector": "Alfa",
      "status": "en_vuelo",
      "battery": 78,
      "speedKmh": 64.2,
      "altitudeM": 120,
      "coordinates": { "lat": 4.711, "lng": -74.0721 },
      "maxPayloadKg": 12,
      "currentPayloadKg": 6.5,
      "activeMissionId": "MSN-8801"
    },
    {
      "id": "DRN-103",
      "model": "SkyCourier Cápsula Express",
      "sector": "Alfa",
      "status": "en_vuelo",
      "battery": 42,
      "speedKmh": 78.5,
      "altitudeM": 145,
      "coordinates": { "lat": 4.6533, "lng": -74.0558 },
      "maxPayloadKg": 5,
      "currentPayloadKg": 3.2,
      "activeMissionId": "MSN-8802"
    }
  ]
}
```

---

### Consulta 2: Consultar Dron por ID (GET)
Recupera el detalle exhaustivo, la telemetría viva y la misión asignada de un dron específico mediante un parámetro de ruta.

- **Método:** `GET`
- **Ruta:** `/api/drones/:id`
- **Parámetro de Ruta:** `id` (Identificador del dron, ej. `DRN-101`).
- **URL de Prueba en Postman:** `http://localhost:3001/api/drones/DRN-101`
- **Código de Respuesta:** `200 OK` (o `404 Not Found` si el ID no existe).
- **Ejemplo de Respuesta:**
```json
{
  "exito": true,
  "marcaTiempo": "2026-10-16T23:19:36.677Z",
  "datos": {
    "id": "DRN-101",
    "model": "Valkyrie-X4 Carga Pesada",
    "sector": "Alfa",
    "status": "en_vuelo",
    "battery": 78,
    "speedKmh": 64.2,
    "altitudeM": 120,
    "coordinates": {
      "lat": 4.711,
      "lng": -74.0721
    },
    "maxPayloadKg": 12,
    "currentPayloadKg": 6.5,
    "headingDeg": 142,
    "activeMissionId": "MSN-8801",
    "lastMaintenance": "2026-09-15",
    "telemetryHistory": [
      { "hora": "17:45", "bateria": 85, "velocidad": 60, "altitud": 110 },
      { "hora": "17:50", "bateria": 82, "velocidad": 63.5, "altitud": 118 },
      { "hora": "17:55", "bateria": 78, "velocidad": 64.2, "altitud": 120 }
    ],
    "detallesMisionActiva": {
      "id": "MSN-8801",
      "droneId": "DRN-101",
      "cargoType": "Kit de Emergencia Médica y Vacunas",
      "weightKg": 6.5,
      "origin": "Centro Logístico Norte Sector Alfa",
      "destination": "Hospital San Carlos Sector Alfa",
      "priority": "ALTA",
      "status": "en_transito",
      "etaMinutes": 14,
      "dispatchedAt": "2026-10-16T23:04:18.852Z"
    }
  }
}
```

---

### Consulta 3: Despachar Nueva Misión de Carga (POST)
Crea una nueva misión de transporte aéreo, valida las restricciones aeronáuticas y coloca al dron seleccionado en estado de vuelo.

- **Método:** `POST`
- **Ruta:** `/api/missions`
- **Headers:** `Content-Type: application/json`
- **Validaciones del Servidor:**
  1. Verifica que el dron exista en el inventario.
  2. Verifica que el dron esté en estado `acoplado` (no puede despacharse si ya está volando o en mantenimiento).
  3. Verifica que la batería sea superior al 25% (reserva mínima de seguridad).
  4. Verifica que el peso no exceda la capacidad máxima del dron (`maxPayloadKg`).
- **Cuerpo JSON:**
```json
{
  "droneId": "DRN-102",
  "cargoType": "Kit de Emergencia Médica y Vacunas",
  "weightKg": 4.2,
  "destination": "Hospital San Carlos Sector Alfa",
  "priority": "ALTA"
}
```
- **Código de Respuesta:** `201 Created`
- **Ejemplo de Respuesta:**
```json
{
  "exito": true,
  "mensaje": "Misión MSN-6303 despachada exitosamente con el dron DRN-102.",
  "datos": {
    "id": "MSN-6303",
    "droneId": "DRN-102",
    "cargoType": "Kit de Emergencia Médica y Vacunas",
    "weightKg": 4.2,
    "origin": "Centro Logístico Sector Beta",
    "destination": "Hospital San Carlos Sector Alfa",
    "priority": "ALTA",
    "status": "en_transito",
    "etaMinutes": 22,
    "dispatchedAt": "2026-10-16T23:19:36.699Z"
  },
  "estadoActualizadoDron": {
    "id": "DRN-102",
    "estado": "en_vuelo",
    "velocidadKmh": 62,
    "altitudM": 110,
    "cargaActualKg": 4.2
  }
}
```

---

### Consulta 4: Actualizar Estado Operativo (PATCH)
Modifica el estado de una aeronave (por ejemplo, registrar su acoplamiento tras completar un recorrido o activar retorno a base) y almacena un registro de auditoría.

- **Método:** `PATCH`
- **Ruta:** `/api/drones/:id/status`
- **Headers:** `Content-Type: application/json`
- **Cuerpo JSON:**
```json
{
  "status": "acoplado",
  "reason": "Batería recargada al 100% en plataforma de carga"
}
```
- **Código de Respuesta:** `200 OK`
- **Ejemplo de Respuesta:**
```json
{
  "exito": true,
  "mensaje": "El estado del dron 'DRN-105' cambió de 'retornando' a 'acoplado'.",
  "marcaTiempo": "2026-10-16T23:19:36.704Z",
  "auditoria": {
    "droneId": "DRN-105",
    "estadoAnterior": "retornando",
    "estadoNuevo": "acoplado",
    "motivo": "Batería recargada al 100% en plataforma de carga"
  },
  "datos": {
    "id": "DRN-105",
    "model": "AeroGlide Rotor Basculante Mk II",
    "sector": "Beta",
    "status": "acoplado",
    "battery": 19,
    "speedKmh": 0,
    "altitudeM": 0,
    "coordinates": {
      "lat": 4.6215,
      "lng": -74.0734
    },
    "maxPayloadKg": 8,
    "currentPayloadKg": 0
  }
}
```

---

## 5. Endpoints Adicionales

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/stats` | Retorna el resumen consolidado de la flota (total de drones, en vuelo, acoplados, batería media y carga total). |
| `GET` | `/api/missions` | Retorna el historial de todas las misiones registradas. |
| `POST` | `/api/reset` | Reinicia todos los datos a los valores semilla iniciales. |

---

## 6. Manejo de Errores y Códigos HTTP

La API utiliza estándares HTTP y respuestas JSON semánticas ante fallos:

| Código | Significado | Motivo Típico | Estructura de Respuesta |
|---|---|---|---|
| `200` | OK | Petición exitosa en lecturas o actualizaciones PATCH | `{ exito: true, datos: ... }` |
| `201` | Created | Creación exitosa de misión en POST | `{ exito: true, mensaje: ..., datos: ... }` |
| `400` | Bad Request | Faltan campos obligatorios, peso inválido o batería < 25% | `{ exito: false, error: "...", mensaje: "..." }` |
| `404` | Not Found | Identificador de dron inexistente en la ruta | `{ exito: false, error: "DronNoEncontrado", ... }` |
| `409` | Conflict | Dron seleccionado no está acoplado (ya está volando o en taller) | `{ exito: false, error: "DronNoDisponible", ... }` |

---

## 7. Guía de Pruebas en Postman

1. **Importación:**
   - Abre **Postman**.
   - Haz clic en **Import** y selecciona el archivo `postman_collection.json`.
2. **Variable de Entorno Automática:**
   - La colección incluye la variable `{{baseUrl}}` preconfigurada con el valor `http://localhost:3001`.
3. **Ejecución en Cadena:**
   - Puedes ejecutar la Consulta 1 para ver drones en vuelo.
   - Ejecutar la Consulta 2 para inspeccionar un dron.
   - Ejecutar la Consulta 3 para lanzar una misión con el dron `DRN-102`.
   - Ejecutar la Consulta 4 para acoplar el dron `DRN-105`.

---

## 8. Interfaz Web y Diseño Impeccable

La aplicación cuenta con una interfaz web servida directamente en la raíz `http://localhost:3001`:

- **Consola de Flota:** Tarjetas interactivas con indicadores de batería de cambio de color dinámico, odómetro de velocidad, altitud y sector.
- **Formulario de Lanzamiento:** Despacho de misiones en tiempo real con validación visual.
- **Probador de Consultas Postman:** Pestaña con las 4 consultas donde el evaluador puede hacer clic en *"Ejecutar Consulta"* y observar la petición HTTP, código de estado, tiempo en milisegundos y el JSON devuelto con resaltado sintáctico.
- **Descarga Directa:** Botón para descargar el archivo `postman_collection.json` directamente desde el navegador.
