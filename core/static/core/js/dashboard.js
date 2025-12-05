// Dashboard with Role Switching and Mobile Menu
document.addEventListener('DOMContentLoaded', function () {
    // ====================================
    // MOBILE MENU FUNCTIONALITY
    // ====================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function (e) {
            e.stopPropagation();

            // Toggle mobile menu class
            mainNav.classList.toggle('mobile-open');

            // Toggle icon and body scroll
            if (mainNav.classList.contains('mobile-open')) {
                this.innerHTML = '<i class="fas fa-times"></i>';
                document.body.style.overflow = 'hidden';
            } else {
                this.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 900 &&
                mainNav.classList.contains('mobile-open') &&
                !mainNav.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {

                mainNav.classList.remove('mobile-open');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 900 && mainNav.classList.contains('mobile-open')) {
                    mainNav.classList.remove('mobile-open');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // ====================================
    // ROLE SWITCHING FUNCTIONALITY
    // ====================================
    const roleButtons = document.querySelectorAll('.role-btn');
    const parentDashboard = document.getElementById('parent-dashboard');
    const teacherDashboard = document.getElementById('teacher-dashboard');
    const currentRoleElement = document.getElementById('current-role');
    const userRoleElement = document.querySelector('.user-role');

    // Function to switch between roles
    function switchRole(role) {
        // Update role buttons
        roleButtons.forEach(btn => {
            if (btn.dataset.role === role) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update dashboards visibility
        if (role === 'parent') {
            parentDashboard.classList.add('active');
            teacherDashboard.classList.remove('active');
            currentRoleElement.textContent = 'Parent';
            if (userRoleElement) {
                userRoleElement.textContent = 'Viewing as Parent';
            }
        } else if (role === 'teacher') {
            parentDashboard.classList.remove('active');
            teacherDashboard.classList.add('active');
            currentRoleElement.textContent = 'Teacher';
            if (userRoleElement) {
                userRoleElement.textContent = 'Viewing as Teacher';
            }
        }

        // Update browser tab title
        document.title = `Dashboard (${role.charAt(0).toUpperCase() + role.slice(1)}) - PT-Associate`;

        // Store preference in localStorage
        localStorage.setItem('pt-associate-role', role);
    }

    // Add click events to role buttons
    roleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const role = this.dataset.role;
            switchRole(role);
        });
    });

    // Load saved role preference or default to parent
    const savedRole = localStorage.getItem('pt-associate-role') || 'parent';
    switchRole(savedRole);

    // ====================================
    // TEACHER DASHBOARD SPECIFIC FUNCTIONALITY
    // ====================================

    // To-Do List checkboxes
    const todoCheckboxes = document.querySelectorAll('.todo-item input[type="checkbox"]');
    todoCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.opacity = '0.6';
                console.log(`Task completed: ${label.querySelector('.todo-title').textContent}`);
            } else {
                label.style.opacity = '1';
            }
        });
    });

    // Add new task functionality
    const addTaskBtn = document.querySelector('.add-task .btn-small');
    const addTaskInput = document.querySelector('.add-task input');

    if (addTaskBtn && addTaskInput) {
        addTaskBtn.addEventListener('click', function () {
            const taskText = addTaskInput.value.trim();
            if (taskText) {
                const todoList = document.querySelector('.todo-list');
                const taskId = 'todo' + (todoCheckboxes.length + 1);

                const newTask = `
                    <div class="todo-item">
                        <input type="checkbox" id="${taskId}">
                        <label for="${taskId}">
                            <span class="todo-title">${taskText}</span>
                            <span class="todo-desc">New task</span>
                            <span class="todo-date">Due: Soon</span>
                        </label>
                    </div>
                `;

                todoList.insertAdjacentHTML('beforeend', newTask);
                addTaskInput.value = '';

                // Add event listener to new checkbox
                const newCheckbox = document.getElementById(taskId);
                newCheckbox.addEventListener('change', function () {
                    const label = this.nextElementSibling;
                    if (this.checked) {
                        label.style.opacity = '0.6';
                    } else {
                        label.style.opacity = '1';
                    }
                });

                console.log(`New task added: ${taskText}`);
            }
        });

        // Allow Enter key to add task
        addTaskInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                addTaskBtn.click();
            }
        });
    }

    // Publish announcement button
    const publishAnnouncementBtn = document.querySelector('.announcement-creator .btn-primary');
    if (publishAnnouncementBtn) {
        publishAnnouncementBtn.addEventListener('click', function () {
            const textarea = document.querySelector('.announcement-creator textarea');
            const announcementText = textarea.value.trim();

            if (announcementText) {
                const sendEmail = document.getElementById('sendEmail').checked;
                const classSelect = document.querySelector('.announcement-creator select');
                const selectedClass = classSelect.value;

                console.log('Publishing announcement:', {
                    text: announcementText,
                    sendEmail: sendEmail,
                    class: selectedClass
                });

                // Show success message
                alert(`Announcement published successfully to ${selectedClass}!`);

                // Clear textarea
                textarea.value = '';
            } else {
                alert('Please write an announcement before publishing.');
            }
        });
    }

    // Class action buttons
    const classActionBtns = document.querySelectorAll('.class-actions button');
    classActionBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const action = this.querySelector('i').className.includes('edit') ? 'Edit' : 'View';
            const className = this.closest('.class-item').querySelector('h4').textContent;
            console.log(`${action} class: ${className}`);
        });
    });

    // ====================================
    // COMMON FUNCTIONALITY
    // ====================================

    // Message item click handlers
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        item.addEventListener('click', function () {
            this.classList.remove('unread');
            console.log('Opening message thread...');
        });
    });

    // Notification bell click handler
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function () {
            console.log('Showing notifications...');
        });
    }

    // User profile dropdown
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.addEventListener('click', function () {
            console.log('Showing user menu...');
        });
    }

    // Update date in welcome card
    const dateElement = document.querySelector('.date-info span');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }

    // New message buttons
    const newMessageBtns = document.querySelectorAll('.new-message-btn .btn-primary');
    newMessageBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            console.log('Opening new message form...');
        });
    });

    // Quick action buttons
    const actionItems = document.querySelectorAll('.action-item');
    actionItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const actionText = this.querySelector('span').textContent;
            console.log(`Action clicked: ${actionText}`);
        });
    });

    // ====================================
    // WINDOW RESIZE HANDLER
    // ====================================
    window.addEventListener('resize', function () {
        // Reset mobile menu on desktop
        if (window.innerWidth > 900) {
            if (mainNav) {
                mainNav.classList.remove('mobile-open');
            }
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
            document.body.style.overflow = '';
        }
    });

    // ====================================
    // INITIALIZATION
    // ====================================

    // Initialize mobile menu state
    if (window.innerWidth <= 900 && mainNav) {
        mainNav.classList.remove('mobile-open');
    }

    console.log('PT-Associate Dashboard loaded successfully!');
});