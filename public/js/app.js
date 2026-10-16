/**
 * AeroPulse - Lógica del Frontend
 * Monitoreo de telemetría, interacción con la API REST y suite de pruebas Postman
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado de la Aplicación
  const state = {
    fleet: [],
    stats: null,
    filterStatus: '',
    filterSector: '',
    activeTab: 'dashboard-view'
  };

  // Elementos del DOM
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const dronesContainer = document.getElementById('drones-container');
  const dispatchSelect = document.getElementById('dispatch-drone-select');
  const filterStatusSelect = document.getElementById('filter-status-select');
  const filterSectorSelect = document.getElementById('filter-sector-select');
  const refreshBtn = document.getElementById('btn-refresh-fleet');
  const resetBtn = document.getElementById('btn-reset-data');
  const dispatchForm = document.getElementById('dispatch-form');
  const dispatchAlert = document.getElementById('dispatch-alert');

  // Elementos de Estadísticas
  const statAirborne = document.getElementById('stat-airborne-count');
  const statDocked = document.getElementById('stat-docked-count');
  const statAvgBattery = document.getElementById('stat-avg-battery');
  const statPayload = document.getElementById('stat-total-payload');

  // Elementos del Modal
  const modalBackdrop = document.getElementById('drone-detail-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDroneId = document.getElementById('modal-drone-id');
  const modalBodyContent = document.getElementById('modal-body-content');

  // Mapeo amigable de estados
  const statusLabels = {
    'en_vuelo': 'En Vuelo',
    'acoplado': 'Acoplado',
    'retornando': 'Retornando',
    'mantenimiento': 'Mantenimiento'
  };

  /* ==========================================================================
     Servicios de Consulta a la API
     ========================================================================== */

  async function fetchFleet() {
    try {
      let url = '/api/drones';
      const params = new URLSearchParams();
      if (state.filterStatus) params.append('status', state.filterStatus);
      if (state.filterSector) params.append('sector', state.filterSector);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.exito) {
        state.fleet = json.datos;
        renderFleetGrid(state.fleet);
        populateDispatchSelect();
      }
    } catch (err) {
      console.error('Error al consultar flota:', err);
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (json.exito) {
        state.stats = json.datos;
        statAirborne.textContent = state.stats.airborne;
        statDocked.textContent = state.stats.docked;
        statAvgBattery.textContent = `${state.stats.avgBattery}%`;
        statPayload.textContent = `${state.stats.activePayloadKg} kg`;
      }
    } catch (err) {
      console.error('Error al consultar estadísticas:', err);
    }
  }

  async function fetchDroneDetail(droneId) {
    try {
      const res = await fetch(`/api/drones/${droneId}`);
      const json = await res.json();
      if (json.exito) {
        openDroneModal(json.datos);
      }
    } catch (err) {
      console.error('Error al consultar detalle del dron:', err);
    }
  }

  /* ==========================================================================
     Renderizado de la Interfaz
     ========================================================================== */

  function renderFleetGrid(drones) {
    if (!drones || drones.length === 0) {
      dronesContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 32px; text-align: center; color: var(--text-muted); background: var(--bg-surface-subtle); border-radius: var(--radius-md);">
          No se encontraron drones que coincidan con los filtros seleccionados.
        </div>
      `;
      return;
    }

    dronesContainer.innerHTML = drones.map(drone => {
      const batteryClass = drone.battery > 50 ? 'battery-high' : drone.battery > 25 ? 'battery-medium' : 'battery-low';
      const badgeText = statusLabels[drone.status] || drone.status;

      return `
        <article class="drone-card" data-drone-id="${drone.id}">
          <div class="drone-card-top">
            <div>
              <div class="drone-id">${drone.id}</div>
              <div class="drone-model">${drone.model} • Sector ${drone.sector}</div>
            </div>
            <span class="status-badge ${drone.status}">
              ${badgeText}
            </span>
          </div>

          <div class="telemetry-row">
            <div class="telemetry-item">
              <span class="telemetry-key">Velocidad</span>
              <span class="telemetry-val tabular-nums">${drone.speedKmh} km/h</span>
            </div>
            <div class="telemetry-item">
              <span class="telemetry-key">Altitud</span>
              <span class="telemetry-val tabular-nums">${drone.altitudeM} m</span>
            </div>
            <div class="telemetry-item">
              <span class="telemetry-key">Carga</span>
              <span class="telemetry-val tabular-nums">${drone.currentPayloadKg}/${drone.maxPayloadKg} kg</span>
            </div>
          </div>

          <div class="battery-container">
            <div class="battery-header">
              <span>Nivel de Batería</span>
              <span class="tabular-nums" style="font-weight: 600;">${drone.battery}%</span>
            </div>
            <div class="battery-meter" role="progressbar" aria-valuenow="${drone.battery}" aria-valuemin="0" aria-valuemax="100">
              <div class="battery-fill ${batteryClass}" style="width: ${drone.battery}%"></div>
            </div>
          </div>

          <div class="card-actions">
            <button type="button" class="btn-secondary btn-inspect" data-id="${drone.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Telemetría
            </button>
            ${drone.status === 'en_vuelo' ? `
              <button type="button" class="btn-secondary btn-recall" data-id="${drone.id}" style="color: var(--status-warning);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                Retornar
              </button>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');

    // Eventos de botones en tarjetas
    document.querySelectorAll('.btn-inspect').forEach(btn => {
      btn.addEventListener('click', () => fetchDroneDetail(btn.dataset.id));
    });

    document.querySelectorAll('.btn-recall').forEach(btn => {
      btn.addEventListener('click', () => handleRecallDrone(btn.dataset.id));
    });
  }

  function populateDispatchSelect() {
    const eligibleDrones = state.fleet.filter(d => d.status === 'acoplado' && d.battery >= 25);
    
    dispatchSelect.innerHTML = '<option value="">Seleccione un dron acoplado disponible...</option>' +
      eligibleDrones.map(d => `
        <option value="${d.id}">${d.id} — ${d.model} (Capacidad: ${d.maxPayloadKg}kg, Bat: ${d.battery}%)</option>
      `).join('');
  }

  function openDroneModal(drone) {
    modalDroneId.textContent = `${drone.id} — Diagnóstico de Telemetría`;
    const badgeText = statusLabels[drone.status] || drone.status;

    modalBodyContent.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-bottom: var(--space-md);">
        <div style="background: var(--bg-surface-raised); padding: var(--space-md); border-radius: var(--radius-sm);">
          <div style="font-size: 0.8125rem; color: var(--text-muted); text-transform: uppercase;">Estado Actual</div>
          <div style="font-size: 1.125rem; font-weight: 600; color: var(--accent-cyan); text-transform: uppercase;">${badgeText}</div>
        </div>
        <div style="background: var(--bg-surface-raised); padding: var(--space-md); border-radius: var(--radius-sm);">
          <div style="font-size: 0.8125rem; color: var(--text-muted); text-transform: uppercase;">Coordenadas GPS</div>
          <div style="font-family: var(--font-mono); font-size: 0.875rem;">${drone.coordinates.lat.toFixed(4)}, ${drone.coordinates.lng.toFixed(4)}</div>
        </div>
      </div>

      <div style="margin-bottom: var(--space-md);">
        <h4 style="font-size: 0.8125rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: var(--space-sm);">Datos de la Misión Asignada</h4>
        ${drone.detallesMisionActiva ? `
          <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-medium); padding: var(--space-md); border-radius: var(--radius-sm);">
            <div style="display: flex; justify-content: space-between; font-weight: 600; margin-bottom: 4px;">
              <span>${drone.detallesMisionActiva.id} (${drone.detallesMisionActiva.priority})</span>
              <span style="color: var(--accent-cyan)">ETA: ${drone.detallesMisionActiva.etaMinutes} min</span>
            </div>
            <div style="font-size: 0.8125rem; color: var(--text-secondary);">${drone.detallesMisionActiva.cargoType} (${drone.detallesMisionActiva.weightKg} kg)</div>
            <div style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 4px;">Destino: ${drone.detallesMisionActiva.destination}</div>
          </div>
        ` : `
          <p style="font-size: 0.8125rem; color: var(--text-muted);">No hay ninguna misión de carga asignada a esta unidad actualmente.</p>
        `}
      </div>

      <div>
        <h4 style="font-size: 0.8125rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: var(--space-sm);">Flujo de Telemetría JSON (Respuesta de la API REST)</h4>
        <pre class="code-display active">${JSON.stringify(drone, null, 2)}</pre>
      </div>
    `;
    modalBackdrop.classList.add('open');
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
  }

  /* ==========================================================================
     Manejadores de Eventos
     ========================================================================== */

  // Cambio de pestañas
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTabId = btn.dataset.tab;
      state.activeTab = targetTabId;
      tabContents.forEach(content => {
        content.style.display = content.id === targetTabId ? (targetTabId === 'dashboard-view' ? 'grid' : 'flex') : 'none';
      });
    });
  });

  // Filtros
  filterStatusSelect.addEventListener('change', (e) => {
    state.filterStatus = e.target.value;
    fetchFleet();
  });

  filterSectorSelect.addEventListener('change', (e) => {
    state.filterSector = e.target.value;
    fetchFleet();
  });

  refreshBtn.addEventListener('click', () => {
    fetchFleet();
    fetchStats();
  });

  // Botón de reinicio de semillas
  resetBtn.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const json = await res.json();
      if (json.exito) {
        showDispatchAlert(json.mensaje, 'success');
        fetchFleet();
        fetchStats();
      }
    } catch (err) {
      showDispatchAlert('Error al reiniciar la base de datos de prueba.', 'error');
    }
  });

  // Envío del formulario de despacho (POST /api/missions)
  dispatchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const droneId = dispatchSelect.value;
    const cargoType = document.getElementById('cargo-type-input').value.trim();
    const weightKg = parseFloat(document.getElementById('cargo-weight-input').value);
    const destination = document.getElementById('destination-input').value.trim();
    const priority = document.getElementById('priority-select').value;

    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ droneId, cargoType, weightKg, destination, priority })
      });

      const json = await res.json();

      if (res.ok && json.exito) {
        showDispatchAlert(`¡Misión ${json.datos.id} despachada! El dron ${droneId} está ahora EN VUELO.`, 'success');
        dispatchForm.reset();
        fetchFleet();
        fetchStats();
      } else {
        showDispatchAlert(json.mensaje || 'Error al despachar la misión.', 'error');
      }
    } catch (err) {
      showDispatchAlert(`Error de conexión con la API: ${err.message}`, 'error');
    }
  });

  async function handleRecallDrone(droneId) {
    try {
      const res = await fetch(`/api/drones/${droneId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'retornando', reason: 'Operador ordenó retorno a base' })
      });
      const json = await res.json();
      if (res.ok && json.exito) {
        showDispatchAlert(`Dron ${droneId} retornando. Estado actualizado a RETORNANDO.`, 'success');
        fetchFleet();
        fetchStats();
      }
    } catch (err) {
      console.error('Error al retornar el dron:', err);
    }
  }

  function showDispatchAlert(message, type) {
    dispatchAlert.className = `alert-box ${type}`;
    dispatchAlert.textContent = message;
    dispatchAlert.style.display = 'flex';
    setTimeout(() => {
      dispatchAlert.style.display = 'none';
    }, 6000);
  }

  // Eventos del modal
  modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  /* ==========================================================================
     Ejecutor Interactivo de Consultas Postman
     ========================================================================== */

  const postmanExecutors = {
    q1: async () => {
      const origin = window.location.origin;
      const url = '/api/drones?status=en_vuelo';
      const start = performance.now();
      const res = await fetch(url);
      const data = await res.json();
      const timeMs = Math.round(performance.now() - start);
      return {
        metodo: "GET",
        url: `${origin}/api/drones?status=en_vuelo`,
        codigoEstado: `${res.status} ${res.statusText || 'OK'}`,
        tiempoRespuesta: `${timeMs} ms`,
        cuerpoRespuesta: data
      };
    },

    q2: async () => {
      const origin = window.location.origin;
      const url = '/api/drones/DRN-101';
      const start = performance.now();
      const res = await fetch(url);
      const data = await res.json();
      const timeMs = Math.round(performance.now() - start);
      return {
        metodo: "GET",
        url: `${origin}/api/drones/DRN-101`,
        codigoEstado: `${res.status} ${res.statusText || 'OK'}`,
        tiempoRespuesta: `${timeMs} ms`,
        cuerpoRespuesta: data
      };
    },

    q3: async () => {
      const origin = window.location.origin;
      const url = '/api/missions';
      const payload = {
        droneId: "DRN-102",
        cargoType: "Kit de Emergencia Médica y Vacunas",
        weightKg: 4.2,
        destination: "Hospital San Carlos Sector Alfa",
        priority: "ALTA"
      };
      const start = performance.now();
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const timeMs = Math.round(performance.now() - start);
      
      if (res.ok) {
        fetchFleet();
        fetchStats();
      }

      return {
        metodo: "POST",
        url: `${origin}/api/missions`,
        cuerpoEnviado: payload,
        codigoEstado: `${res.status} ${res.statusText || (res.status === 201 ? 'Created' : 'OK')}`,
        tiempoRespuesta: `${timeMs} ms`,
        cuerpoRespuesta: data
      };
    },

    q4: async () => {
      const origin = window.location.origin;
      const url = '/api/drones/DRN-105/status';
      const payload = {
        status: "acoplado",
        reason: "Batería recargada al 100% en plataforma de carga"
      };
      const start = performance.now();
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const timeMs = Math.round(performance.now() - start);

      if (res.ok) {
        fetchFleet();
        fetchStats();
      }

      return {
        metodo: "PATCH",
        url: `${origin}/api/drones/DRN-105/status`,
        cuerpoEnviado: payload,
        codigoEstado: `${res.status} ${res.statusText || 'OK'}`,
        tiempoRespuesta: `${timeMs} ms`,
        cuerpoRespuesta: data
      };
    }
  };

  document.querySelectorAll('.query-run-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const queryKey = btn.dataset.query;
      const outputElem = document.getElementById(`${queryKey}-output`);
      
      btn.disabled = true;
      const originalText = btn.innerHTML;
      btn.innerHTML = `Ejecutando...`;

      try {
        const result = await postmanExecutors[queryKey]();
        outputElem.textContent = JSON.stringify(result, null, 2);
        outputElem.classList.add('active');
      } catch (err) {
        outputElem.textContent = `Error al ejecutar la consulta: ${err.message}`;
        outputElem.classList.add('active');
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    });
  });

  // Carga inicial
  fetchFleet();
  fetchStats();
});
