// Initialize user database with default users if not exists
if (!localStorage.getItem('users')) {
    const defaultUsers = [
        {
            id: '1',
            fullName: 'Admin',
            username: 'admin_123',
            email: 'admin@ecorewards.in',
            phone: '9876543210',
            password: 'admin123',
            role: 'admin',
            points: 1000,
            credits: 500,
            tasks: []
        },
        {
            id: '2',
            fullName: 'Sharaun V R',
            username: 'Sharaun_2006',
            email: 'sharaun@ecorewards.in',
            phone: '9847562310',
            password: 'sharaun2006',
            role: 'user',
            points: 100,
            credits: 50,
            tasks: []
        },
        {
            id: '3',
            fullName: 'Samuel Simon Jose',
            username: 'samuel_2005',
            email: 'samuel@ecorewards.in',
            phone: '9847562311',
            password: 'samuel2005',
            role: 'user',
            points: 100,
            credits: 50,
            tasks: []
        },
        {
            id: '4',
            fullName: 'Sreeraj V R',
            username: 'sreeraj_2005',
            email: 'sreeraj@ecorewards.in',
            phone: '9745831269',
            password: 'sreeraj2005',
            role: 'user',
            points: 100,
            credits: 50,
            tasks: []
        }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    console.log('Default users initialized');
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const isAdminLogin = document.getElementById('loginTypeToggle').checked;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        if (isAdminLogin && user.role !== 'admin') {
            alert('Invalid admin credentials');
            return;
        }
        if (!isAdminLogin && user.role === 'admin') {
            alert('Please use admin login for admin accounts');
            return;
        }
        
        // Store current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect based on role
        if (user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
    } else {
        alert('Invalid username or password');
    }
}

// Handle Signup
function handleSignup(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
        alert('Username already exists');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        fullName,
        username,
        email,
        phone,
        password,
        role: 'user',
        points: 0,
        credits: 0,
        tasks: []
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login and redirect
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    window.location.href = 'user-dashboard.html';
}

// Modal Control Functions
function showLoginModal() {
    console.log('Opening login modal');
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error('Login modal not found');
    }
}

function showSignupModal() {
    console.log('Opening signup modal');
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error('Signup modal not found');
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function switchToSignup() {
    closeLoginModal();
    showSignupModal();
}

function switchToLogin() {
    closeSignupModal();
    showLoginModal();
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
}

// Add this with your other functions
function toggleLoginType() {
    const toggle = document.getElementById('loginTypeToggle');
    const loginTypeText = document.getElementById('loginTypeText');
    
    if (toggle.checked) {
        loginTypeText.textContent = 'Admin Login';
    } else {
        loginTypeText.textContent = 'User Login';
    }
} 