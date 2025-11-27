// Cargar auth.js
let currentUser = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    currentUser = checkAuth();
    initDashboard();
});

function initDashboard() {
    document.getElementById('userName').textContent = currentUser.nombre;
    
    // Mostrar opciones según rol
    if (currentUser.rol === 'Trabajador') {
        document.getElementById('controlLink').style.display = 'flex';
        document.getElementById('registrosLink').style.display = 'flex';
        document.getElementById('espaciosCard').style.display = 'block';
        initParkingGrid();
    }
    
    loadVehicles();
    updateStats();
}

// Gestión de vehículos
function getVehicles() {
    return JSON.parse(localStorage.getItem('vehicles') || '[]');
}

function saveVehicle(vehicle) {
    const vehicles = getVehicles();
    vehicles.push(vehicle);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
}

function loadVehicles() {
    const vehicles = getVehicles().filter(v => v.idUsuario === currentUser.id);
    const container = document.getElementById('vehiculosList');
    
    if (vehicles.length === 0) {
        container.innerHTML = '<p style="color: var(--muted);">No tienes vehículos registrados.</p>';
        return;
    }
    
    container.innerHTML = vehicles.map(v => `
        <div class="vehicle-card">
            <h3>${v.placas}</h3>
            <p><strong>Modelo:</strong> ${v.modelo || 'N/A'}</p>
            <p><strong>Color:</strong> ${v.color || 'N/A'}</p>
            <p><strong>Tipo:</strong> ${v.tipo}</p>
            <p><strong>Estado:</strong> ${v.esRecurrente ? 'Recurrente' : 'Temporal'}</p>
            <span class="badge">${v.tipo}</span>
        </div>
    `).join('');
}

function showAddVehicleModal() {
    document.getElementById('vehicleModal').classList.add('active');
}

function closeModal() {
    document.getElementById('vehicleModal').classList.remove('active');
    document.getElementById('vehicleForm').reset();
}

function addVehicle(event) {
    event.preventDefault();
    
    const placas = document.getElementById('placas').value;
    const modelo = document.getElementById('modelo').value;
    const color = document.getElementById('color').value;
    const tipo = document.getElementById('tipo').value;
    const esRecurrente = document.getElementById('esRecurrente').checked;
    
    const newVehicle = {
        id: Date.now(),
        placas,
        modelo,
        color,
        tipo,
        esRecurrente,
        idUsuario: currentUser.id
    };
    
    saveVehicle(newVehicle);
    closeModal();
    loadVehicles();
    updateStats();
    alert('Vehículo agregado exitosamente');
}

// Navegación entre secciones
function showSection(sectionName) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
    });
    
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(sectionName + 'Section').style.display = 'block';
    event.target.closest('a').classList.add('active');
    
    if (sectionName === 'registros') {
        loadRegistros();
    }
}

// Estadísticas
function updateStats() {
    const vehicles = getVehicles().filter(v => v.idUsuario === currentUser.id);
    document.getElementById('vehiculosCount').textContent = vehicles.length;
    
    if (currentUser.rol === 'Trabajador') {
        const registros = getRegistros().filter(r => !r.fechaSalida);
        document.getElementById('espaciosOcupados').textContent = registros.length;
    }
}

// Sistema de lugares de estacionamiento
function getLugares() {
    let lugares = JSON.parse(localStorage.getItem('lugares') || '[]');
    if (lugares.length === 0) {
        // Inicializar 20 lugares
        lugares = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            nombre: `A-${i + 1}`,
            descripcion: `Lugar de estacionamiento ${i + 1}`,
            estado: 'Disponible'
        }));
        localStorage.setItem('lugares', JSON.stringify(lugares));
    }
    return lugares;
}

function updateLugar(id, estado) {
    const lugares = getLugares();
    const lugar = lugares.find(l => l.id === id);
    if (lugar) {
        lugar.estado = estado;
        localStorage.setItem('lugares', JSON.stringify(lugares));
    }
}

function initParkingGrid() {
    const lugares = getLugares();
    const grid = document.getElementById('parkingGrid');
    
    grid.innerHTML = lugares.map(lugar => `
        <div class="parking-spot ${lugar.estado === 'Disponible' ? 'available' : 'occupied'}"
             data-id="${lugar.id}">
            <span>${lugar.nombre}</span>
            <small>${lugar.estado === 'Disponible' ? 'Libre' : 'Ocupado'}</small>
        </div>
    `).join('');
}

// Sistema de registros
function getRegistros() {
    return JSON.parse(localStorage.getItem('registros') || '[]');
}

function saveRegistro(registro) {
    const registros = getRegistros();
    registros.push(registro);
    localStorage.setItem('registros', JSON.stringify(registros));
}

function updateRegistro(id, data) {
    const registros = getRegistros();
    const registro = registros.find(r => r.id === id);
    if (registro) {
        Object.assign(registro, data);
        localStorage.setItem('registros', JSON.stringify(registros));
    }
}

// Procesar entrada
function procesarEntrada() {
    const qrInput = document.getElementById('qrInput').value.trim();
    if (!qrInput) {
        alert('Por favor ingresa un código QR o placas');
        return;
    }
    
    const vehicles = getVehicles();
    let vehicle = vehicles.find(v => v.placas === qrInput);
    
    // Si no existe, crear vehículo temporal
    if (!vehicle) {
        vehicle = {
            id: Date.now(),
            placas: qrInput,
            tipo: 'Coche',
            esRecurrente: false,
            idUsuario: null
        };
        saveVehicle(vehicle);
    }
    
    // Buscar lugar disponible
    const lugares = getLugares();
    const lugarDisponible = lugares.find(l => l.estado === 'Disponible');
    
    if (!lugarDisponible) {
        alert('No hay lugares disponibles');
        return;
    }
    
    // Crear registro
    const registro = {
        id: Date.now(),
        fechaEntrada: new Date().toISOString(),
        fechaSalida: null,
        idVehiculo: vehicle.id,
        idLugar: lugarDisponible.id
    };
    
    saveRegistro(registro);
    updateLugar(lugarDisponible.id, 'Ocupado');
    
    alert(`Entrada registrada. Lugar asignado: ${lugarDisponible.nombre}`);
    document.getElementById('qrInput').value = '';
    initParkingGrid();
    updateStats();
}

// Procesar salida
function procesarSalida() {
    const qrInput = document.getElementById('qrInput').value.trim();
    if (!qrInput) {
        alert('Por favor ingresa un código QR o placas');
        return;
    }
    
    const vehicles = getVehicles();
    const vehicle = vehicles.find(v => v.placas === qrInput);
    
    if (!vehicle) {
        alert('Vehículo no encontrado');
        return;
    }
    
    const registros = getRegistros();
    const registro = registros.find(r => r.idVehiculo === vehicle.id && !r.fechaSalida);
    
    if (!registro) {
        alert('No hay registro de entrada para este vehículo');
        return;
    }
    
    // Actualizar registro
    updateRegistro(registro.id, { fechaSalida: new Date().toISOString() });
    updateLugar(registro.idLugar, 'Disponible');
    
    // Si es temporal, eliminar vehículo
    if (!vehicle.esRecurrente) {
        const allVehicles = getVehicles();
        const filtered = allVehicles.filter(v => v.id !== vehicle.id);
        localStorage.setItem('vehicles', JSON.stringify(filtered));
    }
    
    alert('Salida registrada exitosamente');
    document.getElementById('qrInput').value = '';
    initParkingGrid();
    updateStats();
}

// Cargar registros
function loadRegistros() {
    const registros = getRegistros();
    const vehicles = getVehicles();
    const lugares = getLugares();
    const container = document.getElementById('registrosList');
    
    if (registros.length === 0) {
        container.innerHTML = '<p style="color: var(--muted); padding: 1rem;">No hay registros.</p>';
        return;
    }
    
    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Placas</th>
                    <th>Lugar</th>
                    <th>Entrada</th>
                    <th>Salida</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                ${registros.slice(-20).reverse().map(r => {
                    const vehicle = vehicles.find(v => v.id === r.idVehiculo);
                    const lugar = lugares.find(l => l.id === r.idLugar);
                    return `
                        <tr>
                            <td>${vehicle ? vehicle.placas : 'N/A'}</td>
                            <td>${lugar ? lugar.nombre : 'N/A'}</td>
                            <td>${new Date(r.fechaEntrada).toLocaleString()}</td>
                            <td>${r.fechaSalida ? new Date(r.fechaSalida).toLocaleString() : '-'}</td>
                            <td>${r.fechaSalida ? 'Completado' : 'Activo'}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}
