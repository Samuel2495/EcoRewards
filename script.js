// List of 25 eco-friendly tasks
const allTasks = [
    "Collect and segregate household waste",
    "Plant a tree in your neighborhood",
    "Organize a local cleanup drive",
    "Create compost from kitchen waste",
    "Replace regular bulbs with LED lights",
    "Fix any water leaks at home",
    "Use public transport today",
    "Collect plastic bottles for recycling",
    "Start a small kitchen garden",
    "Educate neighbors about waste segregation",
    "Reduce paper usage at work/school",
    "Create art from recycled materials",
    "Install water-saving fixtures",
    "Use reusable shopping bags",
    "Collect e-waste for proper disposal",
    "Create awareness about energy conservation",
    "Maintain a compost pit",
    "Organize waste collection drive",
    "Reduce single-use plastic usage",
    "Install rainwater harvesting system",
    "Use bicycle for short distances",
    "Create recycling bins for community",
    "Conduct environmental awareness session",
    "Start waste segregation at source",
    "Maintain local garden/park"
];

// Function to get random tasks
function getRandomTasks(count) {
    const shuffled = [...allTasks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Initialize local storage with default data if not exists
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
        {
            id: Date.now().toString(),
            fullName: 'Samuel Johnson',
            username: 'samuel_2005',
            email: 'samuel_2005@gmail.com',
            phoneNumber: '+91 9847563210',
            password: 'samuel2005',
            points: 750,
            credits: 150,
            status: 'active',
            streak: 5,
            tasksCompleted: 12,
            currentTasks: getRandomTasks(5),
            disposalHistory: []
        },
        {
            id: (Date.now() + 1).toString(),
            fullName: 'Sharaun Kumar',
            email: 'Sharaun_2006@gmail.com',
            phoneNumber: '+91 9956243211',
            password: 'sharaun2006',
            points: 620,
            credits: 125,
            status: 'active',
            address: '456 Lake View, Trivandrum, Kerala',
            joinDate: '2024-01-20',
            tasksCompleted: 8,
            wasteRecycled: 32,
            currentTasks: getRandomTasks(5),
            taskProgress: {
                completed: 2,
                pending: 3
            }
        },
        {
            id: (Date.now() + 2).toString(),
            fullName: 'Sreeraj Menon',
            email: 'sreeraj_2005@gmail.com',
            phoneNumber: '+91 9745843212',
            password: 'sreeraj2005',
            points: 890,
            credits: 180,
            status: 'active',
            address: '789 Hill Road, Kozhikode, Kerala',
            joinDate: '2024-01-10',
            tasksCompleted: 15,
            wasteRecycled: 58,
            currentTasks: getRandomTasks(5),
            taskProgress: {
                completed: 4,
                pending: 1
            }
        }
    ]));
}

if (!localStorage.getItem('admins')) {
    localStorage.setItem('admins', JSON.stringify([
        {
            id: 'admin123',
            password: 'admin123'
        }
    ]));
}

// Login form submission
document.getElementById('userLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'user-dashboard.html';
    } else {
        alert('Invalid credentials');
    }
});

// Signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('signupEmail').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        alert('User already exists');
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        fullName,
        email,
        phoneNumber,
        password,
        points: 0,
        credits: 0,
        wasteRecycled: 0,
        tasksCompleted: 0
    };

    // Add new user to the array
    users.push(newUser);
    
    // Update localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alert('Registration successful!');
    document.getElementById('signupModal').style.display = 'none';
    updateUIForLoggedInUser(newUser);
});

// Admin login form submission
document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const adminId = document.getElementById('adminId').value;
    const password = document.getElementById('adminPassword').value;

    const admins = JSON.parse(localStorage.getItem('admins'));
    const admin = admins.find(a => a.id === adminId && a.password === password);

    if (admin) {
        localStorage.setItem('currentAdmin', JSON.stringify(admin));
        window.location.href = 'admin-dashboard.html';
    } else {
        alert('Invalid credentials');
    }
});

// Function to update UI for logged-in user
function updateUIForLoggedInUser(user) {
    document.querySelector('.login-btn').style.display = 'none';
    document.querySelector('.signup-btn').style.display = 'none';
    
    // Show user profile section
    document.getElementById('user-profile').style.display = 'block';
    document.getElementById('userPoints').textContent = user.points;
    document.getElementById('userCredits').textContent = user.credits;
}

// Function to update UI for admin
function updateUIForAdmin() {
    document.querySelector('.login-btn').style.display = 'none';
    document.querySelector('.signup-btn').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    
    // Display user statistics
    const users = JSON.parse(localStorage.getItem('users'));
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('activeUsers').textContent = users.length; // Simplified

    // Populate users table
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber}</td>
            <td>${user.points}</td>
            <td>${user.credits}</td>
            <td>${new Date(parseInt(user.id)).toLocaleDateString()}</td>
            <td>${user.status}</td>
        </tr>
    `).join('');
}

// Modify the window load event listener
window.addEventListener('load', () => {
    const currentUser = localStorage.getItem('currentUser');
    const currentAdmin = localStorage.getItem('currentAdmin');
    const currentPath = window.location.pathname;

    // Redirect logic
    if (currentPath.includes('admin-dashboard.html')) {
        if (!currentAdmin) {
            window.location.href = 'index.html';
            return;
        }
    } else if (currentPath.includes('user-dashboard.html')) {
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }
    }

    // Update UI based on login status
    if (currentUser) {
        updateUIForLoggedInUser(JSON.parse(currentUser));
    } else if (currentAdmin) {
        updateUIForAdmin();
    }
});

// Modal handling code
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close');
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');

loginBtn.addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'block';
});

signupBtn.addEventListener('click', () => {
    document.getElementById('signupModal').style.display = 'block';
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signupModal').style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signupModal').style.display = 'none';
    document.getElementById('loginModal').style.display = 'block';
});

// Tab switching in login modal
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentAdmin');
    // If using separate files:
    window.location.href = 'index.html';
    // If using sections:
    // document.getElementById('main-content').style.display = 'block';
    // document.getElementById('user-dashboard').style.display = 'none';
    // document.getElementById('admin-dashboard').style.display = 'none';
}

// Burger menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerIcon = document.querySelector('.burger-icon');
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);

    burgerIcon.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
    });

    menuOverlay.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
    });

    // Close menu when clicking menu items
    document.querySelectorAll('.menu-items a').forEach(item => {
        item.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
        });
    });
});

// Add this function to check admin auth on admin dashboard
function checkAdminAuth() {
    const admin = localStorage.getItem('currentAdmin');
    if (!admin) {
        window.location.href = 'index.html';
    }
}