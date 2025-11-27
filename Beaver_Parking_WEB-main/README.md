# Beaver Parking 🦫

Sistema de gestión de estacionamiento inteligente con interfaz web moderna y responsive.

## � DCaracterísticas

- **Sistema de Autenticación**: Login y registro de usuarios con diferentes roles
- **Dashboard Interactivo**: Gestión completa de vehículos y lugares de estacionamiento
- **Temas Claro/Oscuro**: Cambio de tema con persistencia en localStorage
- **Diseño Responsive**: Optimizado para desktop, tablet y móvil
- **Modal de Contacto**: Múltiples opciones de contacto (Chatbot, WhatsApp, Instagram, Facebook)
- **Auto-scroll**: Carrusel de servicios con avance automático

## 📁 Estructura del Proyecto

```
Beaver_Parking_WEB-main/
├── index.html              # Página principal
├── login.html              # Inicio de sesión
├── registro.html           # Registro de usuarios
├── dashboard.html          # Panel de control
├── coming-soon.html        # Página de próximamente
├── terminos.html           # Términos de servicio
├── privacidad.html         # Política de privacidad
├── css/
│   └── styles.css          # Estilos principales
├── js/
│   ├── theme.js            # Sistema de cambio de tema
│   ├── main.js             # Funciones principales
│   ├── auth.js             # Autenticación
│   └── dashboard-new.js    # Funcionalidad del dashboard
└── images/                 # Imágenes y logos
```

## 🎨 Temas

El proyecto incluye soporte para temas claro y oscuro:

- **Tema Oscuro** (por defecto): Fondo oscuro con acentos azules
- **Tema Claro**: Fondo blanco con mejor contraste
- **Persistencia**: La preferencia del usuario se guarda en localStorage

## 🛠️ Tecnologías

- HTML5
- CSS3 (Variables CSS, Flexbox, Grid)
- JavaScript (ES6+)
- Material Symbols (Iconos)
- Google Fonts (Inter)

## 📦 Instalación

1. Clona el repositorio o descarga los archivos
2. Abre `index.html` en tu navegador
3. ¡Listo! No requiere instalación de dependencias

## 🌐 Despliegue

### Servidor Web Local

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
```

### Hosting Estático

El proyecto puede desplegarse en cualquier servicio de hosting estático:

- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Firebase Hosting

## 👥 Roles de Usuario

El sistema soporta 5 tipos de roles:

- **Estudiante** (0): Acceso básico
- **Maestro** (1): Acceso intermedio
- **Directivo** (2): Acceso avanzado
- **Trabajador** (3): Control de acceso y lugares
- **Administrador** (4): Acceso completo

## 🚗 Tipos de Vehículos

- Moto (0)
- Coche (1)
- Camioneta (2)
- Camión (3)
- Bicicleta (4)

## 🔧 Configuración

### Cambiar Colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary: #0D80F2;
    --background: #0D141C;
    --surface: #1B2838;
    /* ... más variables */
}
```

### Actualizar Contenido

- **Servicios**: Edita el array `services` en `js/main.js`
- **Testimonios**: Edita el array `testimonials` en `js/main.js`

## 📱 Responsive

El proyecto está optimizado para:

- **Desktop**: 1440px+
- **Tablet**: 768px - 1439px
- **Mobile**: < 768px

## 🔐 Seguridad

⚠️ **Nota**: Este proyecto usa localStorage para almacenamiento de datos (solo para desarrollo).

Para producción, se recomienda:

- Implementar backend con API REST
- Usar autenticación JWT
- Base de datos real (MySQL, PostgreSQL, MongoDB)
- Encriptación de contraseñas
- HTTPS

## 🚀 Próximos Pasos

- [ ] Conectar con backend real
- [ ] Implementar autenticación JWT
- [ ] Sistema de QR para entrada/salida
- [ ] Reportes y estadísticas
- [ ] Notificaciones en tiempo real
- [ ] PWA (Progressive Web App)

## 📄 Licencia

© 2024 Beaver Parking. Todos los derechos reservados.

## 📞 Contacto

- **Email**: info@beaverparking.com
- **Website**: [beaverparking.com](https://beaverparking.com)

---

**Versión**: 1.0.0  
**Estado**: ✅ Listo para producción
