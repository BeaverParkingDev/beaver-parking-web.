function handleReserva(event) {
    event.preventDefault();
    
    const reserva = {
        id: Date.now(),
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        placas: document.getElementById('placas').value,
        tipoVehiculo: document.getElementById('tipoVehiculo').value,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        estado: 'Pendiente'
    };
    
    // Guardar reserva
    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));
    
    alert('¡Reserva realizada exitosamente! Te contactaremos pronto.');
    
    // Simular envío a webhook de n8n
    console.log('Enviando a n8n:', reserva);
    
    // Redirigir
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}
