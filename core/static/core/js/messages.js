document.addEventListener('DOMContentLoaded', function () {

    const roleButtons = document.querySelectorAll('.role-btn');
    const parentMessages = document.getElementById('parent-section');
    const teacherMessages = document.getElementById('teacher-section');
    const currentRoleElement = document.getElementById('current-role');
    const userRoleElement = document.querySelector('.user-role');

    function switchRole(role) {
        roleButtons.forEach(btn => {
            if (btn.dataset.role === role) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (role === 'parent') {
            parentMessages.classList.add('active');
            teacherMessages.classList.remove('active');
            currentRoleElement.textContent = 'Parent';
            if (userRoleElement) {
                userRoleElement.textContent = 'Viewing as Parent';
            }
        } else if (role === 'teacher') {
            parentMessages.classList.remove('active');
            teacherMessages.classList.add('active');
            currentRoleElement.textContent = 'Teacher';
            if (userRoleElement) {
                userRoleElement.textContent = 'Viewing as Teacher';
            }
        }

         document.title = `Messages (${role.charAt(0).toUpperCase() + role.slice(1)}) - PT-Associate`;

        // Store preference in localStorage
        localStorage.setItem('pt-associate-role', role);

    }

    roleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const role = this.dataset.role;
            switchRole(role);
        });
    });

    const savedRole = localStorage.getItem('pt-associate-role') || 'parent';
    switchRole(savedRole);



})