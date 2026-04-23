document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    // const menuBtn = document.querySelector('.mobile-menu-btn');
    // const nav = document.querySelector('.main-nav');
    
    // if (menuBtn && nav) {
    //     menuBtn.addEventListener('click', function() {
    //         if (nav.style.display === 'flex') {
    //             nav.style.display = 'none';
    //         } else {
    //             nav.style.display = 'flex';
    //             nav.style.flexDirection = 'column';
    //             nav.style.position = 'absolute';
    //             nav.style.top = '60px';
    //             nav.style.left = '0';
    //             nav.style.right = '0';
    //             nav.style.backgroundColor = 'white';
    //             nav.style.padding = '20px';
    //             nav.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    //         }
    //     });
    // }
    
    // Sample classroom data
    let classrooms = [
        {
            id: 1,
            name: 'Basic 5A',
            code: 'B5A-2024',
            teacher: 'Mrs. Adeyemi',
            teacherId: 5,
            students: 28,
            capacity: 35,
            session: '2024/2025',
            level: 'primary'
        },
        {
            id: 2,
            name: 'JSS 2B',
            code: 'J2B-2024',
            teacher: 'Mr. Okafor',
            teacherId: 3,
            students: 32,
            capacity: 35,
            session: '2024/2025',
            level: 'jss'
        },
        {
            id: 3,
            name: 'SSS 1A',
            code: 'S1A-2024',
            teacher: 'Dr. Eze',
            teacherId: 7,
            students: 30,
            capacity: 40,
            session: '2024/2025',
            level: 'sss'
        },
        {
            id: 4,
            name: 'Nursery 2',
            code: 'N2-2024',
            teacher: 'Ms. Grace',
            teacherId: 2,
            students: 20,
            capacity: 25,
            session: '2024/2025',
            level: 'nursery'
        },
        {
            id: 5,
            name: 'Basic 3B',
            code: 'B3B-2024',
            teacher: 'Mr. Chukwu',
            teacherId: 4,
            students: 25,
            capacity: 30,
            session: '2024/2025',
            level: 'primary'
        }
    ];
    
    // DOM elements
    const classesGrid = document.getElementById('classesGrid');
    const emptyState = document.getElementById('emptyState');
    const totalClassesSpan = document.getElementById('totalClasses');
    const totalStudentsSpan = document.getElementById('totalStudents');
    const avgClassSizeSpan = document.getElementById('avgClassSize');
    const sessionFilter = document.getElementById('sessionFilter');
    const levelFilter = document.getElementById('levelFilter');
    const searchInput = document.getElementById('searchInput');
    
    // Delete modal elements
    const deleteModal = document.getElementById('deleteModal');
    const deleteClassNameSpan = document.getElementById('deleteClassName');
    let classToDelete = null;
    
    // Toast
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    function showToast(message, isSuccess = true) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        if (!isSuccess) {
            toast.querySelector('i').className = 'fas fa-exclamation-circle';
            toast.querySelector('i').style.color = '#ff4757';
        } else {
            toast.querySelector('i').className = 'fas fa-check-circle';
            toast.querySelector('i').style.color = '#4CAF50';
        }
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    function renderClasses() {
        let filtered = [...classrooms];
        
        // Filter by session
        const session = sessionFilter.value;
        if (session !== 'all') {
            filtered = filtered.filter(c => c.session === session);
        }
        
        // Filter by level
        const level = levelFilter.value;
        if (level !== 'all') {
            filtered = filtered.filter(c => c.level === level);
        }
        
        // Filter by search
        const search = searchInput.value.toLowerCase();
        if (search) {
            filtered = filtered.filter(c => 
                c.name.toLowerCase().includes(search) ||
                c.teacher.toLowerCase().includes(search) ||
                c.code.toLowerCase().includes(search)
            );
        }
        
        // Update stats
        const totalClasses = filtered.length;
        const totalStudents = filtered.reduce((sum, c) => sum + c.students, 0);
        const avgClassSize = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
        
        totalClassesSpan.textContent = totalClasses;
        totalStudentsSpan.textContent = totalStudents;
        avgClassSizeSpan.textContent = avgClassSize;
        
        // Show/hide empty state
        if (filtered.length === 0) {
            classesGrid.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            classesGrid.style.display = 'grid';
            emptyState.style.display = 'none';
        }
        
        // Render cards
        classesGrid.innerHTML = filtered.map(classroom => `
            <div class="class-card" data-id="${classroom.id}">
                <div class="class-header">
                    <span class="class-name">${classroom.name}</span>
                    <span class="class-code">${classroom.code}</span>
                </div>
                <div class="class-body">
                    <div class="class-info">
                        <i class="fas fa-chalkboard-user"></i>
                        <span>${classroom.teacher}</span>
                    </div>
                    <div class="class-stats">
                        <div class="class-stat">
                            <span class="class-stat-value">${classroom.students}</span>
                            <span class="class-stat-label">Enrolled</span>
                        </div>
                        <div class="class-stat">
                            <span class="class-stat-value">${classroom.capacity}</span>
                            <span class="class-stat-label">Capacity</span>
                        </div>
                        <div class="class-stat">
                            <span class="class-stat-value">${Math.round((classroom.students / classroom.capacity) * 100)}%</span>
                            <span class="class-stat-label">Full</span>
                        </div>
                    </div>
                </div>
                <div class="class-footer">
                    <span class="class-session"><i class="fas fa-calendar"></i> ${classroom.session}</span>
                    <div class="class-actions">
                        <button class="edit-btn" onclick="editClass(${classroom.id})"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" onclick="deleteClass(${classroom.id}, '${classroom.name}')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Edit function (global for onclick)
    window.editClass = function(id) {
        window.location.href = `edit_class.html?id=${id}`;
    };
    
    // Delete function
    window.deleteClass = function(id, name) {
        classToDelete = { id, name };
        deleteClassNameSpan.textContent = name;
        deleteModal.classList.add('show');
    };
    
    // Confirm delete
    document.querySelector('.modal-confirm').addEventListener('click', function() {
        if (classToDelete) {
            classrooms = classrooms.filter(c => c.id !== classToDelete.id);
            renderClasses();
            showToast(`Class "${classToDelete.name}" deleted successfully`);
            deleteModal.classList.remove('show');
            classToDelete = null;
        }
    });
    
    // Cancel delete
    document.querySelector('.modal-cancel').addEventListener('click', function() {
        deleteModal.classList.remove('show');
        classToDelete = null;
    });
    
    document.querySelector('.modal-close').addEventListener('click', function() {
        deleteModal.classList.remove('show');
        classToDelete = null;
    });
    
    // Close modal when clicking outside
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            deleteModal.classList.remove('show');
            classToDelete = null;
        }
    });
    
    // Event listeners for filters
    sessionFilter.addEventListener('change', renderClasses);
    levelFilter.addEventListener('change', renderClasses);
    searchInput.addEventListener('input', renderClasses);
    
    // Initial render
    renderClasses();
});