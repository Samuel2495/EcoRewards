// User Dashboard Functionality
class UserDashboard {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userTasks = [];
        this.userStreak = 0;
        this.initializeDashboard();
        this.setupEventListeners();
    }

    initializeDashboard() {
        this.updateUserInfo();
        this.loadDailyTasks();
        this.updateStats();
        this.loadRecyclingHistory();
        this.loadSocialPosts();
        this.updateLeaderboard();
        this.initializeStreakCalendar();
    }

    updateUserInfo() {
        document.getElementById('userName').textContent = this.currentUser.fullName;
        document.getElementById('userEmail').textContent = this.currentUser.email;
    }

    loadDailyTasks() {
        // Get today's date to check if tasks need to be refreshed
        const today = new Date().toDateString();
        let dailyTasks = JSON.parse(localStorage.getItem(`dailyTasks_${this.currentUser.id}`));
        
        if (!dailyTasks || dailyTasks.date !== today) {
            // Generate new tasks if none exist or if it's a new day
            this.userTasks = this.generateDailyTasks();
            localStorage.setItem(`dailyTasks_${this.currentUser.id}`, JSON.stringify({
                date: today,
                tasks: this.userTasks
            }));
        } else {
            this.userTasks = dailyTasks.tasks;
        }

        this.displayTasks();
    }

    generateDailyTasks() {
        // Get 5 random tasks from taskDatabase
        return [...taskDatabase]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5)
            .map(task => ({
                ...task,
                status: 'incomplete',
                verificationPending: false
            }));
    }

    displayTasks() {
        const tasksContainer = document.querySelector('.tasks-container');
        tasksContainer.innerHTML = this.userTasks.map(task => `
            <div class="task-card" data-task-id="${task.id}">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <div class="task-details">
                    <div class="rewards">
                        <span class="reward-item">
                            <i class="fas fa-star"></i> ${task.points} points
                        </span>
                        <span class="reward-item">
                            <i class="fas fa-coins"></i> ${task.credits} credits
                        </span>
                    </div>
                    <div class="task-actions">
                        ${this.getTaskActionButton(task)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getTaskActionButton(task) {
        if (task.status === 'complete') {
            return '<span class="task-status status-complete">Completed</span>';
        } else if (task.verificationPending) {
            return '<span class="task-status status-pending">Pending Verification</span>';
        } else {
            return `<button onclick="userDashboard.submitTaskForVerification(${task.id})" class="verify-btn">Submit for Verification</button>`;
        }
    }

    submitTaskForVerification(taskId) {
        const task = this.userTasks.find(t => t.id === taskId);
        if (task) {
            task.verificationPending = true;
            this.saveTasksToStorage();
            this.displayTasks();

            // Add to verification queue
            const verificationQueue = JSON.parse(localStorage.getItem('verificationQueue') || '[]');
            verificationQueue.push({
                userId: this.currentUser.id,
                taskId: taskId,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('verificationQueue', JSON.stringify(verificationQueue));
        }
    }

    updateStats() {
        document.getElementById('totalPoints').textContent = this.currentUser.points || 0;
        document.getElementById('totalCredits').textContent = this.currentUser.credits || 0;
        document.getElementById('tasksCompleted').textContent = 
            this.userTasks.filter(task => task.status === 'complete').length;
        document.getElementById('currentStreak').textContent = `${this.userStreak} days`;
    }

    loadRecyclingHistory() {
        const recyclingHistory = JSON.parse(localStorage.getItem(`recycling_${this.currentUser.id}`) || '[]');
        const tableBody = document.querySelector('#recyclingTable tbody');
        
        let totalWaste = 0;
        let totalEarnings = 0;

        tableBody.innerHTML = recyclingHistory.map(record => {
            totalWaste += record.weight;
            totalEarnings += record.amount;
            return `
                <tr>
                    <td>${new Date(record.date).toLocaleDateString()}</td>
                    <td>${record.location}</td>
                    <td>${record.weight} kg</td>
                    <td>${record.credits}</td>
                    <td>₹${record.amount}</td>
                </tr>
            `;
        }).join('');

        document.getElementById('totalWaste').textContent = `${totalWaste} kg`;
        document.getElementById('totalEarnings').textContent = `₹${totalEarnings}`;
    }

    loadSocialPosts() {
        const socialPosts = JSON.parse(localStorage.getItem(`social_${this.currentUser.id}`) || '[]');
        const postsGrid = document.querySelector('.posts-grid');
        
        postsGrid.innerHTML = socialPosts.map(post => `
            <div class="social-post">
                ${post.image ? `<img src="${post.image}" alt="Post Image">` : ''}
                <p>${post.content}</p>
                <div class="post-meta">
                    <span>${new Date(post.timestamp).toLocaleDateString()}</span>
                    <span>${post.points} points earned</span>
                </div>
            </div>
        `).join('');
    }

    updateLeaderboard() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const topUsers = users
            .sort((a, b) => b.points - a.points)
            .slice(0, 5);

        const leaderboardContainer = document.querySelector('.top-recyclers');
        leaderboardContainer.innerHTML = topUsers.map((user, index) => `
            <div class="leaderboard-item ${index < 3 ? 'top-three' : ''}">
                <span class="rank">#${index + 1}</span>
                <span class="name">${user.fullName}</span>
                <span class="points">${user.points} points</span>
            </div>
        `).join('');
    }

    initializeStreakCalendar() {
        // Implementation for streak calendar visualization
        const streakData = JSON.parse(localStorage.getItem(`streak_${this.currentUser.id}`) || '[]');
        this.userStreak = this.calculateCurrentStreak(streakData);
        this.updateStats();
    }

    calculateCurrentStreak(streakData) {
        // Calculate current streak based on consecutive days of activity
        let streak = 0;
        const today = new Date().toDateString();
        
        for (let i = streakData.length - 1; i >= 0; i--) {
            if (new Date(streakData[i]).toDateString() === today) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    setupEventListeners() {
        // Handle social post form submission
        document.getElementById('socialPostForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSocialPost(e);
        });

        // Handle dashboard navigation
        document.querySelectorAll('.dashboard-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(e.target.getAttribute('href').substring(1));
            });
        });
    }

    handleSocialPost(e) {
        const content = e.target.querySelector('textarea').value;
        const imageFile = e.target.querySelector('#postImage').files[0];

        if (content) {
            const newPost = {
                content,
                timestamp: new Date().toISOString(),
                points: 10 // Base points for social post
            };

            if (imageFile) {
                // In a real app, you'd upload the image to a server
                // Here we're just using a placeholder
                newPost.image = URL.createObjectURL(imageFile);
                newPost.points += 5; // Extra points for including an image
            }

            // Save post and update user points
            const socialPosts = JSON.parse(localStorage.getItem(`social_${this.currentUser.id}`) || '[]');
            socialPosts.push(newPost);
            localStorage.setItem(`social_${this.currentUser.id}`, JSON.stringify(socialPosts));

            this.currentUser.points += newPost.points;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

            this.loadSocialPosts();
            this.updateStats();
            e.target.reset();
        }
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

    saveTasksToStorage() {
        localStorage.setItem(`dailyTasks_${this.currentUser.id}`, JSON.stringify({
            date: new Date().toDateString(),
            tasks: this.userTasks
        }));
    }
}

// Initialize dashboard when document is ready
document.addEventListener('DOMContentLoaded', () => {
    const userDashboard = new UserDashboard();
    window.userDashboard = userDashboard; // Make it globally accessible
});

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'index.html';
    }
    return user;
}

// Initialize dashboard
function initializeDashboard() {
    const user = checkAuth();
    
    // Set user name in sidebar
    document.getElementById('userName').textContent = user.fullName;
    
    // Load tasks
    loadTasks(user);
    
    // Set streak
    document.getElementById('streakCount').textContent = user.streak || 0;
    
    // Load profile info
    loadProfile(user);
}

// Get random tasks from database
function getRandomTasksFromDatabase() {
    // Make sure taskDatabase exists and has tasks
    if (!window.taskDatabase || !window.taskDatabase.length) {
        console.error('Task database not found or empty');
        return [];
    }
    
    // Shuffle and get 5 random tasks
    const shuffled = [...window.taskDatabase].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
}

// Load tasks
function loadTasks(user) {
    const tasksList = document.getElementById('tasksList');
    
    // If user doesn't have tasks assigned or tasks are undefined, assign new ones
    if (!user.currentTasks || user.currentTasks.length === 0 || user.currentTasks[0].title === undefined) {
        user.currentTasks = getRandomTasksFromDatabase();
        // Update user in localStorage
        const users = JSON.parse(localStorage.getItem('users'));
        const updatedUsers = users.map(u => u.id === user.id ? {...u, currentTasks: user.currentTasks} : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    tasksList.innerHTML = user.currentTasks.map((task, index) => `
        <div class="task-card">
            <div class="task-header">
                <h3>${task.title}</h3>
                <span class="task-status">Pending</span>
            </div>
            <p>${task.description}</p>
            <div class="task-rewards">
                <span><i class="fas fa-star"></i> ${task.points || 20} Points</span>
                <span><i class="fas fa-coins"></i> ${task.credits || 20} Credits</span>
            </div>
            <button class="complete-btn" onclick="completeTask(${index})">
                Mark Complete
            </button>
        </div>
    `).join('');
}

// Load profile information
function loadProfile(user) {
    document.getElementById('profileName').textContent = user.fullName;
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profilePhone').textContent = user.phoneNumber;
    document.getElementById('profilePoints').textContent = user.points;
    document.getElementById('profileCredits').textContent = user.credits;
    document.getElementById('profileTasks').textContent = user.tasksCompleted;
}

// Handle section switching
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links and sections
        document.querySelectorAll('.sidebar a').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Show corresponding section
        const sectionId = link.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Complete task function
function completeTask(index) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.currentTasks && user.currentTasks[index]) {
        // Update user points and credits
        user.points = (user.points || 0) + (user.currentTasks[index].points || 20);
        user.credits = (user.credits || 0) + (user.currentTasks[index].credits || 20);
        user.tasksCompleted = (user.tasksCompleted || 0) + 1;
        
        // Remove completed task
        user.currentTasks.splice(index, 1);
        
        // If all tasks completed, assign new ones
        if (user.currentTasks.length === 0) {
            user.currentTasks = getRandomTasksFromDatabase();
            user.streak = (user.streak || 0) + 1;
        }
        
        // Update localStorage
        const users = JSON.parse(localStorage.getItem('users'));
        const updatedUsers = users.map(u => u.id === user.id ? {...u, ...user} : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Reload tasks
        loadTasks(user);
        // Update profile if visible
        if (document.getElementById('profilePoints')) {
            loadProfile(user);
        }
    }
} 