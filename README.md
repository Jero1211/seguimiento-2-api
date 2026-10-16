# 🚁 AeroPulse — API REST de Logística y Telemetría de Drones Autónomos

Sistema completo de **API REST** para monitoreo de telemetría y despacho de misiones de drones autónomos de carga, acompañado de una **consola web interactiva** con diseño Impeccable y una **suite de pruebas oficial para Postman**.

Desarrollado para la entrega de **Seguimiento 2**.

---

## 📋 Características Principales

- **Servidor RESTful robusto**: Desarrollado con Node.js y Express con validaciones estrictas y respuestas JSON uniformes en español.
- **Base de datos semilla**: 6 unidades industriales de drones categorizadas por sectores aéreos (*Alfa, Beta, Gamma, Delta*), estados operativos (*en_vuelo, acoplado, retornando, mantenimiento*) y sensores de altitud, velocidad, batería y GPS.
- **Consola Web de Mando (Frontend)**: Construida con HTML5 y Vanilla CSS bajo el estándar de diseño **Impeccable**, cumpliendo accesibilidad WCAG AA, números tabulares para telemetría y paleta de cabina aeronáutica.
- **Probador interactivo de Postman en navegador**: Pestaña dedicada para probar las 4 consultas directamente con 1 clic sin salir de la interfaz.
- **Colección de Postman exportada**: Archivo `postman_collection.json` v2.1.0 listo para importar.

---

## 🚀 Instalación y Puesta en Marcha

1. **Clonar o descargar el repositorio**:
   ```bash
   git clone https://github.com/Jero1211/seguimiento-2-api.git
   cd "seguimiento 2 api"
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor**:
   ```bash
   npm start
   ```

4. **Abrir la interfaz web**:
   Visita en tu navegador:
   👉 **http://localhost:3001**

---

## 📬 Las 4 Consultas de Postman (Seguimiento 2)

El archivo [`postman_collection.json`](./postman_collection.json) incluye las 4 consultas configuradas:

### 1. Listar Drones en Vuelo (GET con Filtro)
- **Método**: `GET`
- **URL**: `http://localhost:3001/api/drones?status=en_vuelo`
- **Descripción**: Filtra y retorna únicamente los drones activos en el aire con sus datos de altitud, velocidad y GPS.
- **Código esperado**: `200 OK`

### 2. Consultar Telemetría por ID (GET con Parámetro de Ruta)
- **Método**: `GET`
- **URL**: `http://localhost:3001/api/drones/DRN-101`
- **Descripción**: Obtiene el diagnóstico completo, sensores en tiempo real y detalles de la misión activa del dron `DRN-101`.
- **Código esperado**: `200 OK`

### 3. Despachar Nueva Misión de Carga (POST con Cuerpo JSON)
- **Método**: `POST`
- **URL**: `http://localhost:3001/api/missions`
- **Headers**: `Content-Type: application/json`
- **Cuerpo JSON**:
  ```json
  {
    "droneId": "DRN-102",
    "cargoType": "Kit de Emergencia Médica y Vacunas",
    "weightKg": 4.2,
    "destination": "Hospital San Carlos Sector Alfa",
    "priority": "ALTA"
  }
  ```
- **Descripción**: Asigna una misión a un dron acoplado disponible, valida capacidad de carga y batería, y actualiza el estado a `en_vuelo`.
- **Código esperado**: `201 Created`

### 4. Actualizar Estado Operativo del Dron (PATCH con Cuerpo JSON)
- **Método**: `PATCH`
- **URL**: `http://localhost:3001/api/drones/DRN-105/status`
- **Headers**: `Content-Type: application/json`
- **Cuerpo JSON**:
  ```json
  {
    "status": "acoplado",
    "reason": "Batería recargada al 100% en plataforma de carga"
  }
  ```
- **Descripción**: Modifica el estado operativo del dron (por ejemplo, transicionar de `retornando` a `acoplado`) y registra auditoría.
- **Código esperado**: `200 OK`

---

## 📥 Cómo Importar en Postman

1. Abre **Postman**.
2. Haz clic en **Import** (arriba a la izquierda).
3. Arrastra o selecciona el archivo `postman_collection.json` de la raíz del proyecto (o descárgalo desde la pestaña de la aplicación web).
4. Ejecuta cualquiera de las 4 consultas con el servidor encendido.

---

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express, CORS.
- **Frontend**: HTML5 Semántico, Vanilla CSS (Sistema de diseño aeronáutico), Vanilla JavaScript.
- **Tipografías**: Syne (Display), DM Sans (Cuerpo), Azeret Mono (Telemetría numérica).
- **Pruebas de API**: Postman Collection Schema v2.1.0.
- **Estándar de Calidad**: Impeccable Design System.

---

Desarrollado por **Jerónimo Mesa Carvajal** (`Jero1211`).
