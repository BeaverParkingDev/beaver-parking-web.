// Simulación de base de datos en localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Registro
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('Name').value;
    const lastName = document.getElementById('LastName').value;
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    const userRole = document.getElementById('UserRole').value;
    
    const users = getUsers();
    
    if (users.find(u => u.email === email)) {
        showError('Este email ya está registrado');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        lastName,
        email,
        password,
        userRole: parseInt(userRole)
    };
    
    saveUser(newUser);
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    window.location.href = 'login.html';
}

// Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        setCurrentUser(user);
        window.location.href = 'dashboard.html';
    } else {
        showError('Email o contraseña incorrectos');
    }
}

// Mostrar mensaje de error
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

// Verificar autenticación
function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
    }
    return user;
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
