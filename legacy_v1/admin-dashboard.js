class AdminDashboard {
    constructor() {
        this.currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
        this.initializeDashboard();
        this.setupEventListeners();
    }

    initializeDashboard() {
        this.loadUserManagement();
        this.loadVerificationRequests();
        this.updateStats();
    }

    updateStats() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const verificationQueue = JSON.parse(localStorage.getItem('verificationQueue') || '[]');
        
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('pendingVerifications').textContent = verificationQueue.length;
        
        // Calculate total tasks completed
        const totalTasks = users.reduce((acc, user) => {
            const userTasks = JSON.parse(localStorage.getItem(`dailyTasks_${user.id}`) || '[]');
            return acc + (Array.isArray(userTasks) ? userTasks.filter(task => task.status === 'complete').length : 0);
        }, 0);
        document.getElementById('totalTasksCompleted').textContent = totalTasks;

        // Calculate total waste recycled
        const totalWaste = users.reduce((acc, user) => {
            const recyclingHistory = JSON.parse(localStorage.getItem(`recycling_${user.id}`) || '[]');
            return acc + recyclingHistory.reduce((sum, record) => sum + record.weight, 0);
        }, 0);
        document.getElementById('totalRecycled').textContent = `${totalWaste} kg`;
    }

    loadUserManagement() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const tableBody = document.querySelector('#usersTable tbody');
        
        tableBody.innerHTML = users.map(user => `
            <tr data-user-id="${user.id}">
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.points || 0}</td>
                <td>${user.credits || 0}</td>
                <td>${user.status || 'Active'}</td>
                <td>
                    <button onclick="adminDashboard.editUser('${user.id}')" class="action-btn edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="adminDashboard.toggleUserStatus('${user.id}')" class="action-btn ${user.status === 'Suspended' ? 'activate' : 'suspend'}">
                        <i class="fas fa-${user.status === 'Suspended' ? 'play' : 'pause'}"></i>
                    </button>
                    <button onclick="adminDashboard.deleteUser('${user.id}')" class="action-btn delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadVerificationRequests() {
        const verificationQueue = JSON.parse(localStorage.getItem('verificationQueue') || '[]');
        const verificationContainer = document.querySelector('.verification-requests');
        
        if (!verificationQueue.length) {
            verificationContainer.innerHTML = '<p>No pending verifications</p>';
            return;
        }

        const requests = verificationQueue.map(request => {
            const user = this.getUserById(request.userId);
            const task = this.getTaskById(request.taskId);
            
            return `
                <div class="verification-card" data-request-id="${request.userId}_${request.taskId}">
                    <div class="verification-info">
                        <h4>Task Verification Request</h4>
                        <p><strong>User:</strong> ${user?.fullName || 'Unknown User'}</p>
                        <p><strong>Task:</strong> ${task?.title || 'Unknown Task'}</p>
                        <p><strong>Submitted:</strong> ${new Date(request.timestamp).toLocaleString()}</p>
                    </div>
                    <div class="verification-actions">
                        <button onclick="adminDashboard.verifyTask('${request.userId}', '${request.taskId}', true)" class="approve-btn">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button onclick="adminDashboard.verifyTask('${request.userId}', '${request.taskId}', false)" class="reject-btn">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                </div>
            `;
        });

        verificationContainer.innerHTML = requests.join('');
    }

    getUserById(userId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(user => user.id === userId);
    }

    getTaskById(taskId) {
        return taskDatabase.find(task => task.id === taskId);
    }

    verifyTask(userId, taskId, isApproved) {
        // Get user and their tasks
        const user = this.getUserById(userId);
        const userTasks = JSON.parse(localStorage.getItem(`dailyTasks_${userId}`));
        
        if (!user || !userTasks) return;

        // Find the task in user's tasks
        const task = userTasks.tasks.find(t => t.id === parseInt(taskId));
        if (!task) return;

        if (isApproved) {
            // Update task status
            task.status = 'complete';
            task.verificationPending = false;

            // Award points and credits
            user.points = (user.points || 0) + task.points;
            user.credits = (user.credits || 0) + task.credits;

            // Update streak
            const streakData = JSON.parse(localStorage.getItem(`streak_${userId}`) || '[]');
            streakData.push(new Date().toISOString());
            localStorage.setItem(`streak_${userId}`, JSON.stringify(streakData));
        } else {
            // Reset task status if rejected
            task.status = 'incomplete';
            task.verificationPending = false;
        }

        // Update storage
        localStorage.setItem(`dailyTasks_${userId}`, JSON.stringify(userTasks));
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Remove from verification queue
        const verificationQueue = JSON.parse(localStorage.getItem('verificationQueue') || '[]');
        const updatedQueue = verificationQueue.filter(
            req => !(req.userId === userId && req.taskId === parseInt(taskId))
        );
        localStorage.setItem('verificationQueue', JSON.stringify(updatedQueue));

        // Refresh display
        this.loadVerificationRequests();
        this.updateStats();
    }

    editUser(userId) {
        const user = this.getUserById(userId);
        if (!user) return;

        // Create and show edit modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Edit User</h2>
                <form id="editUserForm">
                    <div class="form-group">
                        <label>Points</label>
                        <input type="number" id="editPoints" value="${user.points || 0}">
                    </div>
                    <div class="form-group">
                        <label>Credits</label>
                        <input type="number" id="editCredits" value="${user.credits || 0}">
                    </div>
                    <button type="submit" class="submit-btn">Save Changes</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Handle form submission
        const form = modal.querySelector('#editUserForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            user.points = parseInt(document.getElementById('editPoints').value);
            user.credits = parseInt(document.getElementById('editCredits').value);

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                users[userIndex] = user;
                localStorage.setItem('users', JSON.stringify(users));
            }

            modal.style.display = 'none';
            this.loadUserManagement();
        };

        // Handle modal close
        modal.querySelector('.close').onclick = () => {
            modal.style.display = 'none';
        };
    }

    toggleUserStatus(userId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].status = users[userIndex].status === 'Suspended' ? 'Active' : 'Suspended';
            localStorage.setItem('users', JSON.stringify(users));
            this.loadUserManagement();
        }
    }

    deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const updatedUsers = users.filter(u => u.id !== userId);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            // Clean up user-related data
            localStorage.removeItem(`dailyTasks_${userId}`);
            localStorage.removeItem(`recycling_${userId}`);
            localStorage.removeItem(`social_${userId}`);
            localStorage.removeItem(`streak_${userId}`);
            
            this.loadUserManagement();
            this.updateStats();
        }
    }

    setupEventListeners() {
        // Handle dashboard navigation
        document.querySelectorAll('.dashboard-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(e.target.getAttribute('href').substring(1));
            });
        });
    }

    navigateToSection(sectionId) {
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.dashboard-menu a').forEach(link => {
            link.classList.remove('active');
        });

        document.getElementById(sectionId).classList.add('active');
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
    }
}

// Initialize dashboard when document is ready
document.addEventListener('DOMContentLoaded', () => {
    const adminDashboard = new AdminDashboard();
    window.adminDashboard = adminDashboard; // Make it globally accessible
});

// Check if user is logged in as admin
function checkAdminAuth() {
    const admin = localStorage.getItem('currentAdmin');
    if (!admin) {
        window.location.href = './index.html';
    }
}

// Initialize dashboard
function initializeDashboard() {
    checkAdminAuth();
    updateStatistics();
    loadUserTable();
}

// Update dashboard statistics
function updateStatistics() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    document.getElementById('totalUsers').textContent = users.length;
    
    // Calculate total waste
    const totalWaste = users.reduce((sum, user) => sum + (user.wasteRecycled || 0), 0);
    document.getElementById('totalWaste').textContent = `${totalWaste} kg`;
    
    // Calculate total tasks
    const totalTasks = users.reduce((sum, user) => sum + (user.tasksCompleted || 0), 0);
    document.getElementById('tasksCompleted').textContent = totalTasks;
}

// Load users table with detailed information
function loadUserTable() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tableBody = document.getElementById('usersTableBody');
    
    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }

    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7">No users registered</td></tr>';
        return;
    }

    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div class="user-name">${user.fullName}</div>
                <div class="user-address">${user.address || 'N/A'}</div>
            </td>
            <td>
                <div class="user-contact">
                    <div>${user.email}</div>
                    <div>${user.phoneNumber || 'N/A'}</div>
                </div>
            </td>
            <td>
                <div class="user-stats">
                    <div>Points: ${user.points || 0}</div>
                    <div>Tasks: ${user.tasksCompleted || 0}</div>
                </div>
            </td>
            <td>
                <div class="task-progress">
                    ${user.currentTasks ? `${user.currentTasks.length} Active Tasks` : '0 Tasks'}
                </div>
            </td>
            <td>${formatDate(user.id)}</td>
            <td>
                <span class="status-badge ${user.status || 'active'}">${user.status || 'active'}</span>
            </td>
            <td>
                <button class="view-details-btn" onclick="viewUserDetails('${user.username}')">
                    View Details
                </button>
            </td>
        </tr>
    `).join('');
}

// Helper function to format date
function formatDate(timestamp) {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Handle sidebar navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }

    // Load appropriate content
    if (sectionId === 'user-section') {
        loadUserTable();
    } else if (sectionId === 'task-section') {
        loadTasksTable();
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentAdmin');
    window.location.href = './index.html';
}

// View user details function
function viewUserDetails(username) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    if (user) {
        alert(`
            User Details:
            Name: ${user.fullName}
            Username: ${user.username}
            Email: ${user.email}
            Phone: ${user.phoneNumber}
            Points: ${user.points}
            Tasks Completed: ${user.tasksCompleted}
        `);
    }
}

// Add event listeners for sidebar navigation
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();

    // Add click handlers for sidebar links
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.sidebar a').forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            e.target.classList.add('active');
            
            // Show corresponding section
            const sectionId = e.target.getAttribute('data-section');
            showSection(sectionId);
        });
    });
});

// Add some CSS styles for the status badge
const style = document.createElement('style');
style.textContent = `
    .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
    }
    .status-badge.active {
        background-color: #e6f4ea;
        color: #1e7e34;
    }
`;
document.head.appendChild(style);

// Load tasks table
function loadTasksTable() {
    const tasksTableBody = document.getElementById('tasksTableBody');
    
    if (!tasksTableBody) {
        console.error('Tasks table body not found');
        return;
    }

    // Ensure taskDatabase is available
    if (!window.taskDatabase || !window.taskDatabase.length) {
        console.error('Task database not found or empty');
        return;
    }

    tasksTableBody.innerHTML = window.taskDatabase.map(task => `
        <tr>
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.points || 20}</td>
            <td>${task.credits || 20}</td>
            <td class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Toggle add task form
function toggleAddTaskForm() {
    const form = document.getElementById('addTaskForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Add new task
function addNewTask(event) {
    event.preventDefault();
    
    const newTask = {
        id: window.taskDatabase.length + 1,
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        points: parseInt(document.getElementById('taskPoints').value) || 20,
        credits: parseInt(document.getElementById('taskCredits').value) || 20
    };

    window.taskDatabase.push(newTask);
    
    // Update localStorage
    localStorage.setItem('taskDatabase', JSON.stringify(window.taskDatabase));
    
    // Reset form and hide it
    event.target.reset();
    toggleAddTaskForm();
    
    // Reload tasks table
    loadTasksTable();
}

// Edit task
function editTask(taskId) {
    const task = taskDatabase.find(t => t.id === taskId);
    if (task) {
        // Implement edit functionality
        alert('Edit functionality to be implemented');
    }
}

// Delete task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        const index = taskDatabase.findIndex(t => t.id === taskId);
        if (index !== -1) {
            taskDatabase.splice(index, 1);
            // Update localStorage
            localStorage.setItem('taskDatabase', JSON.stringify(taskDatabase));
            // Reload tasks table
            loadTasksTable();
        }
    }
}

// Initialize task database if not exists
function initializeTaskDatabase() {
    if (!localStorage.getItem('taskDatabase')) {
        localStorage.setItem('taskDatabase', JSON.stringify(window.taskDatabase));
    } else {
        window.taskDatabase = JSON.parse(localStorage.getItem('taskDatabase'));
    }
}

// Add this to your initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeTaskDatabase();
    initializeDashboard();
    // ... rest of your initialization code
}); 