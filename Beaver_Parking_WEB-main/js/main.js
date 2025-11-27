// Servicios
const services = [
    { icon: 'school', title: 'Escuelas', description: 'Organiza el flujo vehicular y mejora la seguridad en horas pico.' },
    { icon: 'storefront', title: 'Centros Comerciales', description: 'Ofrece una experiencia fluida y sin estrés desde la llegada del cliente.' },
    { icon: 'local_hospital', title: 'Hospitales', description: 'Controla el acceso de personal y pacientes con asignación inteligente.' },
    { icon: 'flight_takeoff', title: 'Aeropuertos', description: 'Optimiza la rotación de vehículos y reduce tiempos de espera.' },
    { icon: 'hotel', title: 'Hoteles', description: 'Brinda una experiencia premium a huéspedes con estacionamiento inteligente.' },
    { icon: 'apartment', title: 'Oficinas Corporativas', description: 'Administra permisos y accesos para empleados y visitantes.' },
    { icon: 'event', title: 'Eventos', description: 'Gestiona el aparcamiento temporal de manera eficiente y segura.' },
    { icon: 'home', title: 'Residenciales', description: 'Aumenta la seguridad y control del acceso de vehículos en condominios.' },
    { icon: 'directions_car', title: 'Estaciones de Servicio', description: 'Facilita el flujo vehicular y mejora la experiencia del cliente.' }
];

// Testimonios
const testimonials = [
    {
        text: 'Beaver Parking ha transformado nuestra operativa. La gestión del aparcamiento en el centro comercial es ahora más eficiente y fluida que nunca.',
        author: 'Carlos Jiménez',
        role: 'Director, CC Gran Vía',
        image: 'images/beaver_work.png'
    },
    {
        text: 'La seguridad y la organización en el parking del colegio han mejorado drásticamente. Es una solución robusta y muy fácil de usar.',
        author: 'Ana Torres',
        role: 'Directora, Colegio El Pilar',
        image: 'images/beaver_user.png'
    },
    {
        text: 'Gracias a Beaver Parking, hemos optimizado el flujo vehicular en nuestro hospital, reduciendo tiempos de espera y mejorando la experiencia de nuestros pacientes.',
        author: 'Dr. Luis Fernández',
        role: 'Administrador, Hospital Central',
        image: 'images/beaver_user.png'
    }
];

// ============================================
// CARRUSEL CON AUTO-AVANCE
// ============================================

let carouselInterval = null;
let isUserInteracting = false;

// Renderizar servicios
function renderServices() {
    const carousel = document.getElementById('servicesCarousel');
    if (!carousel) return;

    carousel.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="icon">
                <span class="material-symbols-outlined">${service.icon}</span>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        </div>
    `).join('');
}

// Renderizar testimonios
function renderTestimonials() {
    const grid = document.querySelector('.testimonials-grid');
    if (!grid) return;

    grid.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card">
            <p>"${testimonial.text}"</p>
            <div class="testimonial-author">
                <img src="${testimonial.image}" alt="${testimonial.author}">
                <div class="author-info">
                    <h4>${testimonial.author}</h4>
                    <p>${testimonial.role}</p>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Avanzar el carrusel automáticamente
 */
function autoAdvanceCarousel() {
    const carousel = document.getElementById('servicesCarousel');
    if (!carousel) return;

    const scrollAmount = 350;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    if (carousel.scrollLeft >= maxScroll - 10) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

/**
 * Iniciar auto-avance del carrusel
 */
function startCarouselAutoplay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }

    carouselInterval = setInterval(() => {
        if (!isUserInteracting) {
            autoAdvanceCarousel();
        }
    }, 5000);
}

/**
 * Detener auto-avance del carrusel
 */
function stopCarouselAutoplay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

/**
 * Scroll manual del carrusel (botones prev/next)
 */
function scrollCarousel(direction) {
    const carousel = document.getElementById('servicesCarousel');
    const scrollAmount = 350;

    isUserInteracting = true;
    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });

    setTimeout(() => {
        isUserInteracting = false;
    }, 3000);
}

/**
 * Configurar eventos del carrusel
 */
function setupCarouselEvents() {
    const carousel = document.getElementById('servicesCarousel');
    if (!carousel) return;

    carousel.addEventListener('scroll', () => {
        isUserInteracting = true;
        clearTimeout(carousel.scrollTimeout);
        carousel.scrollTimeout = setTimeout(() => {
            isUserInteracting = false;
        }, 3000);
    });

    carousel.addEventListener('mouseenter', () => {
        isUserInteracting = true;
    });

    carousel.addEventListener('mouseleave', () => {
        isUserInteracting = false;
    });

    carousel.addEventListener('touchstart', () => {
        isUserInteracting = true;
    });

    carousel.addEventListener('touchend', () => {
        setTimeout(() => {
            isUserInteracting = false;
        }, 3000);
    });
}

// Toggle menu móvil
function toggleMenu() {
    const nav = document.querySelector('.nav');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// Modal de contacto
let contactModalOpen = false;

function toggleContactModal() {
    const modal = document.getElementById('contactModal');
    contactModalOpen = !contactModalOpen;
    modal.classList.toggle('active', contactModalOpen);
}

// Funciones para abrir opciones de contacto
function openChatbot() {
    toggleContactModal(); // Cerrar modal de contacto
    const chatbotModal = document.getElementById('chatbotModal');
    chatbotModal.classList.add('active');
    
    if (document.getElementById('chatMessages').children.length === 0) {
        addBotMessage('¡Hola! Soy el asistente de Beaver Parking. ¿En qué puedo ayudarte?');
    }
}

function closeChatbot() {
    const chatbotModal = document.getElementById('chatbotModal');
    chatbotModal.classList.remove('active');
}

function openWhatsApp() {
    // Redirigir a coming soon
    window.location.href = 'coming-soon.html';
}

function openInstagram() {
    // Redirigir a coming soon
    window.location.href = 'coming-soon.html';
}

function openFacebook() {
    // Redirigir a coming soon
    window.location.href = 'coming-soon.html';
}

// Chatbot (mantener compatibilidad)
let chatbotOpen = false;

function toggleChatbot() {
    const modal = document.getElementById('chatbotModal');
    chatbotOpen = !chatbotOpen;
    modal.classList.toggle('active', chatbotOpen);
    
    if (chatbotOpen && document.getElementById('chatMessages').children.length === 0) {
        addBotMessage('¡Hola! Soy el asistente de Beaver Parking. ¿En qué puedo ayudarte?');
    }
}

function addBotMessage(text) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addUserMessage(text) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addUserMessage(message);
    input.value = '';
    
    // Simular respuesta del bot
    setTimeout(() => {
        const responses = {
            'hola': '¡Hola! ¿Cómo puedo ayudarte con tu estacionamiento?',
            'precio': 'Nuestros precios varían según el tipo de servicio. ¿Te gustaría agendar una consulta?',
            'reserva': 'Puedes hacer una reserva desde nuestro formulario. ¿Necesitas ayuda con eso?',
            'horario': 'Nuestro estacionamiento está disponible 24/7.',
            'default': 'Gracias por tu mensaje. Un agente se pondrá en contacto contigo pronto.'
        };
        
        const lowerMessage = message.toLowerCase();
        let response = responses.default;
        
        for (let key in responses) {
            if (lowerMessage.includes(key)) {
                response = responses[key];
                break;
            }
        }
        
        addBotMessage(response);
    }, 1000);
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
    // Renderizar contenido
    renderServices();
    renderTestimonials();
    
    // Configurar carrusel
    setupCarouselEvents();
    startCarouselAutoplay();
    
    // Chat input
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});

/**
 * Limpiar intervalos cuando la página se oculta
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopCarouselAutoplay();
    } else {
        startCarouselAutoplay();
    }
});

/**
 * Detener autoplay cuando el usuario cambia de pestaña
 */
window.addEventListener('blur', () => {
    stopCarouselAutoplay();
});

window.addEventListener('focus', () => {
    startCarouselAutoplay();
});
