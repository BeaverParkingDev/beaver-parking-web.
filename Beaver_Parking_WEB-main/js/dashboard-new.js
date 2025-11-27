// Cargar auth.js
let currentUser = null;
let selectedVehicleId = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    currentUser = checkAuth();
    initDashboard();
});

function initDashboard() {
    // Mostrar nombre y rol del usuario
    const nombreCompleto = `${currentUser.name} ${currentUser.lastName}`;
    const roleNames = ['Estudiante', 'Maestro', 'Directivo', 'Trabajador', 'Administrador'];
    const roleName = roleNames[currentUser.userRole] || 'Usuario';
    
    document.getElementById('userName').textContent = nombreCompleto;
    document.getElementById('userRole').textContent = roleName;
    
    // Configurar según rol (3=Trabajador, 4=Administrador)
    if (currentUser.userRole === 3) {
        document.getElementById('controlAccesoPanel').style.display = 'block';
        document.getElementById('registrosPanel').style.display = 'block';
        document.getElementById('espaciosCard').style.display = 'block';
        document.getElementById('lugaresDisponiblesCard').style.display = 'block';
        document.getElementById('registroLugarPanel').style.display = 'block';
        document.getElementById('lugarSelectRow').style.display = 'block';
        initParkingGrid();
        loadRegistrosTable();
    }
    
    if (currentUser.userRole === 4) {
        document.getElementById('usuariosBtn').style.display = 'flex';
    }
    
    // Cargar lugares disponibles en el select
    loadLugaresSelect();
    
    // Cargar datos iniciales
    updateStats();
    loadAllVehicles();
    initParkingGrid();
    
    // Mostrar sección inicial
    showSection('inicio');
}

// Navegación entre secciones
function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionName + 'Section').classList.add('active');
}

// Cambiar entre tabs
function switchTab(tabName) {
    const parentTab = event.target.closest('.tab-container');
    
    // Actualizar botones
    parentTab.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Actualizar contenido
    parentTab.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    parentTab.querySelector(`#${tabName}`).classList.add('active');
}

// Estadísticas
function updateStats() {
    const vehicles = getVehicles().filter(v => v.idUsuario === currentUser.id);
    
    if (currentUser.userRole === 3) { // Trabajador
        const lugares = getLugares();
        const ocupados = lugares.filter(l => l.estado === 'Ocupado').length;
        const disponibles = lugares.filter(l => l.estado === 'Disponible').length;
        
        const espaciosOcupadosEl = document.getElementById('espaciosOcupados');
        const lugaresDisponiblesEl = document.getElementById('lugaresDisponibles');
        
        if (espaciosOcupadosEl) espaciosOcupadosEl.textContent = ocupados;
        if (lugaresDisponiblesEl) lugaresDisponiblesEl.textContent = disponibles;
    }
}

// Cargar mis vehículos en la página principal
function cargarMisVehiculos() {
    const vehicles = getVehicles().filter(v => v.idUsuario === currentUser.id);
    const container = document.getElementById('misVehiculosContainer');
    
    if (vehicles.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center;">No tienes vehículos registrados</p>';
        return;
    }
    
    const typeNames = ['Moto', 'Coche', 'Camioneta', 'Camión', 'Bicicleta'];
    
    container.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 2px solid var(--border);">
                    <th style="padding: 0.75rem; text-align: left; color: var(--muted);">Placas</th>
                    <th style="padding: 0.75rem; text-align: left; color: var(--muted);">Tipo</th>
                    <th style="padding: 0.75rem; text-align: left; color: var(--muted);">Estado</th>
                    <th style="padding: 0.75rem; text-align: center; color: var(--muted);">QR</th>
                </tr>
            </thead>
            <tbody>
                ${vehicles.map(v => `
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem; color: var(--on-surface);">${v.plates}</td>
                        <td style="padding: 0.75rem; color: var(--on-surface);">${typeNames[v.type] || v.typeName || 'N/A'}</td>
                        <td style="padding: 0.75rem;">
                            <span class="badge ${v.esRecurrente ? 'badge-success' : 'badge-warning'}">
                                ${v.esRecurrente ? 'Recurrente' : 'Temporal'}
                            </span>
                        </td>
                        <td style="padding: 0.75rem; text-align: center;">
                            <button class="btn-action" onclick="generateQR('${v.plates}', ${v.id})" style="padding: 0.5rem;">
                                <span class="material-symbols-outlined">qr_code</span>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
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

function addVehicle(event) {
    event.preventDefault();
    
    const plates = document.getElementById('Plates').value;
    const type = parseInt(document.getElementById('Type').value);
    const esRecurrente = document.getElementById('esRecurrente').checked;
    
    // Mapeo de tipos: 0=Moto, 1=Coche, 2=Camioneta, 3=Camión, 4=Bicicleta
    const typeNames = ['Moto', 'Coche', 'Camioneta', 'Camión', 'Bicicleta'];
    
    const newVehicle = {
        id: Date.now(),
        plates,
        type,
        typeName: typeNames[type],
        esRecurrente,
        idUsuario: currentUser.id
    };
    
    saveVehicle(newVehicle);
    document.getElementById('vehicleForm').reset();
    loadAllVehicles();
    updateStats();
    cargarMisVehiculos();
    showMessage('Vehículo registrado exitosamente', 'success');
}

// Función para mostrar mensajes
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById(type === 'success' ? 'successMessage' : 'errorMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

function loadAllVehicles() {
    // Trabajadores (rol 3) pueden ver todos los vehículos, otros usuarios solo los suyos
    const vehicles = currentUser.userRole === 3 
        ? getVehicles() 
        : getVehicles().filter(v => v.idUsuario === currentUser.id);
    
    const tbody = document.getElementById('vehiclesTableBody');
    const typeNames = ['Moto', 'Coche', 'Camioneta', 'Camión', 'Bicicleta'];
    
    if (vehicles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No hay vehículos registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = vehicles.map(v => `
        <tr>
            <td><input type="radio" name="selectedVehicle" value="${v.id}" onchange="selectedVehicleId=${v.id}"></td>
            <td>${v.plates}</td>
            <td>${typeNames[v.type] || v.typeName || 'N/A'}</td>
            <td><span class="badge ${v.esRecurrente ? 'badge-success' : 'badge-warning'}">${v.esRecurrente ? 'Recurrente' : 'Temporal'}</span></td>
            <td>
                <button class="btn-action" onclick="generateQR('${v.plates}', ${v.id})" style="padding: 0.5rem; font-size: 0.875rem;">
                    <span class="material-symbols-outlined" style="font-size: 1.25rem;">qr_code</span>
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteSelectedVehicle() {
    if (!selectedVehicleId) {
        alert('Por favor selecciona un vehículo');
        return;
    }
    
    if (!confirm('¿Estás seguro de eliminar este vehículo?')) {
        return;
    }
    
    const vehicles = getVehicles();
    const filtered = vehicles.filter(v => v.id !== selectedVehicleId);
    localStorage.setItem('vehicles', JSON.stringify(filtered));
    
    selectedVehicleId = null;
    loadAllVehicles();
    updateStats();
    alert('Vehículo eliminado');
}

function updateSelectedVehicle() {
    if (!selectedVehicleId) {
        alert('Por favor selecciona un vehículo');
        return;
    }
    
    const vehicles = getVehicles();
    const vehicle = vehicles.find(v => v.id === selectedVehicleId);
    
    if (!vehicle) return;
    
    // Llenar formulario con datos actuales
    document.getElementById('placas').value = vehicle.placas;
    document.getElementById('modelo').value = vehicle.modelo;
    document.getElementById('color').value = vehicle.color;
    document.getElementById('tipo').value = vehicle.tipo;
    document.getElementById('esRecurrente').checked = vehicle.esRecurrente;
    
    // Cambiar a tab de registro
    switchTab('registroVehiculo');
    
    // Eliminar el vehículo actual para que se cree uno nuevo al guardar
    deleteSelectedVehicle();
}

// Sistema de lugares
function getLugares() {
    let lugares = JSON.parse(localStorage.getItem('lugares') || '[]');
    if (lugares.length === 0) {
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

function loadLugaresSelect() {
    const lugares = getLugares().filter(l => l.estado === 'Disponible');
    const select = document.getElementById('lugarAsignado');
    
    if (!select) return;
    
    select.innerHTML = '<option value="">Asignar automáticamente</option>' +
        lugares.map(l => `<option value="${l.id}">${l.nombre} - ${l.descripcion}</option>`).join('');
}

function registrarLugar(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('lugarNombre').value;
    const descripcion = document.getElementById('lugarDescripcion').value;
    
    const lugares = getLugares();
    const newLugar = {
        id: lugares.length + 1,
        nombre,
        descripcion,
        estado: 'Disponible'
    };
    
    lugares.push(newLugar);
    localStorage.setItem('lugares', JSON.stringify(lugares));
    
    document.getElementById('lugarForm').reset();
    initParkingGrid();
    loadLugaresSelect();
    updateStats();
    alert('Lugar registrado exitosamente');
}

function initParkingGrid() {
    const lugares = getLugares();
    const grid = document.getElementById('parkingGrid');
    
    if (!grid) return;
    
    grid.innerHTML = lugares.map(lugar => `
        <div class="parking-spot ${lugar.estado === 'Disponible' ? 'available' : 'occupied'}"
             data-id="${lugar.id}"
             title="${lugar.descripcion}">
            <strong>${lugar.nombre}</strong>
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

// Control de acceso
function procesarEntrada() {
    const qrInput = document.getElementById('qrInput').value.trim();
    if (!qrInput) {
        alert('Por favor ingresa un código QR o placas');
        return;
    }
    
    const vehicles = getVehicles();
    let vehicle = vehicles.find(v => v.placas === qrInput);
    
    if (!vehicle) {
        vehicle = {
            id: Date.now(),
            placas: qrInput,
            modelo: 'Desconocido',
            color: 'Desconocido',
            tipo: 'Coche',
            esRecurrente: false,
            idUsuario: null
        };
        saveVehicle(vehicle);
    }
    
    const lugares = getLugares();
    const lugarDisponible = lugares.find(l => l.estado === 'Disponible');
    
    if (!lugarDisponible) {
        alert('No hay lugares disponibles');
        return;
    }
    
    const registro = {
        id: Date.now(),
        fechaEntrada: new Date().toISOString(),
        fechaSalida: null,
        idVehiculo: vehicle.id,
        idLugar: lugarDisponible.id,
        idUsuario: vehicle.idUsuario
    };
    
    saveRegistro(registro);
    updateLugar(lugarDisponible.id, 'Ocupado');
    
    alert(`Entrada registrada. Lugar asignado: ${lugarDisponible.nombre}`);
    document.getElementById('qrInput').value = '';
    initParkingGrid();
    loadRegistrosTable();
    updateStats();
}

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
    
    updateRegistro(registro.id, { fechaSalida: new Date().toISOString() });
    updateLugar(registro.idLugar, 'Disponible');
    
    if (!vehicle.esRecurrente) {
        const allVehicles = getVehicles();
        const filtered = allVehicles.filter(v => v.id !== vehicle.id);
        localStorage.setItem('vehicles', JSON.stringify(filtered));
    }
    
    alert('Salida registrada exitosamente');
    document.getElementById('qrInput').value = '';
    initParkingGrid();
    loadRegistrosTable();
    updateStats();
}

function loadRegistrosTable() {
    const registros = getRegistros();
    const vehicles = getVehicles();
    const lugares = getLugares();
    const tbody = document.getElementById('registrosTableBody');
    
    if (!tbody) return;
    
    if (registros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No hay registros</td></tr>';
        return;
    }
    
    tbody.innerHTML = registros.slice(-20).reverse().map(r => {
        const vehicle = vehicles.find(v => v.id === r.idVehiculo);
        const lugar = lugares.find(l => l.id === r.idLugar);
        return `
            <tr>
                <td>${vehicle ? vehicle.placas : 'N/A'}</td>
                <td>${vehicle ? vehicle.modelo : 'N/A'}</td>
                <td>${lugar ? lugar.nombre : 'N/A'}</td>
                <td>${new Date(r.fechaEntrada).toLocaleString()}</td>
                <td>${r.fechaSalida ? new Date(r.fechaSalida).toLocaleString() : '-'}</td>
                <td><span class="badge ${r.fechaSalida ? 'badge-success' : 'badge-warning'}">${r.fechaSalida ? 'Completado' : 'Activo'}</span></td>
            </tr>
        `;
    }).join('');
}

// Gestión de usuarios
function loadAllUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filter = document.getElementById('userFilterSelect').value;
    const tbody = document.getElementById('usersTableBody');
    
    let filteredUsers = users;
    if (filter) {
        filteredUsers = users.filter(u => u.rol === filter);
    }
    
    if (filteredUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">No hay usuarios</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredUsers.map(u => `
        <tr>
            <td>${u.nombre}</td>
            <td>${u.apellidoPaterno} ${u.apellidoMaterno}</td>
            <td>${u.email}</td>
            <td><span class="badge badge-info">${u.rol}</span></td>
        </tr>
    `).join('');
    
    // Actualizar info del usuario actual
    document.getElementById('currentUserDisplay').textContent = 
        `${currentUser.nombre} ${currentUser.apellidoPaterno} ${currentUser.apellidoMaterno}`;
    document.getElementById('currentUserRoleDisplay').textContent = currentUser.rol;
}


// ============================================
// GENERACIÓN DE CÓDIGO QR
// ============================================

let currentQRCode = null;
let currentPlates = '';

/**
 * Generar código QR para un vehículo
 */
function generateQR(plates, vehicleId) {
    currentPlates = plates;
    
    // Limpiar QR anterior
    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = '';
    
    // Mostrar placas
    document.getElementById('qrPlacas').textContent = `Placas: ${plates}`;
    
    // Generar nuevo QR
    currentQRCode = new QRCode(qrcodeContainer, {
        text: plates,
        width: 256,
        height: 256,
        colorDark: '#0D80F2',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Mostrar modal
    document.getElementById('qrModal').classList.add('active');
}

/**
 * Cerrar modal de QR
 */
function closeQRModal() {
    document.getElementById('qrModal').classList.remove('active');
}

/**
 * Descargar código QR como imagen
 */
function downloadQR() {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        alert('Error al generar el código QR');
        return;
    }
    
    // Convertir canvas a imagen
    const url = canvas.toDataURL('image/png');
    
    // Crear enlace de descarga
    const link = document.createElement('a');
    link.download = `QR_${currentPlates}.png`;
    link.href = url;
    link.click();
    
    showMessage(`Código QR descargado: QR_${currentPlates}.png`, 'success');
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(event) {
    const modal = document.getElementById('qrModal');
    if (event.target === modal) {
        closeQRModal();
    }
});
