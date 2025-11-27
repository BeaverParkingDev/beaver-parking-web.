/**
 * ============================================
 * SISTEMA DE CAMBIO DE TEMA CLARO/OSCURO
 * ============================================
 * 
 * Este módulo maneja el cambio entre modo claro y oscuro.
 * Características:
 * - Persistencia en localStorage
 * - Creación automática del botón de cambio
 * - Actualización dinámica del icono
 * - Aplicación inmediata del tema guardado
 */

(function() {
    'use strict';
    
    /**
     * Obtener el tema guardado en localStorage
     * Por defecto usa 'dark' si no hay tema guardado
     */
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    /**
     * Aplicar el tema al elemento HTML al cargar la página
     */
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    /**
     * Alternar entre modo claro y oscuro
     */
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Aplicar el nuevo tema
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('theme', newTheme);
        
        // Actualizar el icono del botón
        updateThemeIcon(newTheme);
    }
    
    /**
     * Actualizar el icono del botón según el tema activo
     */
    function updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-toggle .material-symbols-outlined');
        if (themeIcon) {
            // Icono inverso al tema actual (sol en oscuro, luna en claro)
            themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }
    
    /**
     * Crear el botón de cambio de tema dinámicamente
     */
    function createThemeToggle() {
        // Evitar crear múltiples botones
        if (document.querySelector('.theme-toggle')) {
            return;
        }
        
        // Crear el botón
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Cambiar tema');
        button.setAttribute('title', 'Cambiar tema');
        
        // Añadir icono apropiado
        button.innerHTML = `<span class="material-symbols-outlined">${savedTheme === 'dark' ? 'light_mode' : 'dark_mode'}</span>`;
        
        // Asignar evento de click
        button.onclick = toggleTheme;
        
        // Agregar al DOM
        document.body.appendChild(button);
    }
    
    /**
     * Inicialización del módulo
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createThemeToggle);
    } else {
        createThemeToggle();
    }
    
    /**
     * Exponer la función toggleTheme globalmente
     */
    window.toggleTheme = toggleTheme;
    
})();
