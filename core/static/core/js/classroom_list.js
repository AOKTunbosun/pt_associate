// Classroom List Page - Only for interactivity (filters, modals, toasts)
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sessionFilter = document.getElementById('sessionFilter');
    const levelFilter = document.getElementById('levelFilter');
    const searchInput = document.getElementById('searchInput');
    const classesGrid = document.getElementById('classesGrid');
    const filterEmptyState = document.getElementById('filterEmptyState');
    const totalStudentsSpan = document.getElementById('totalStudents');
    
    // Get all classroom card items
    function getClassroomItems() {
        return document.querySelectorAll('.class-card-item');
    }
    
    // Update total students count
    function updateTotalStudents() {
        let total = 0;
        getClassroomItems().forEach(item => {
            if (item.style.display !== 'none') {
                const enrolledSpan = item.querySelector('.text-primary');
                if (enrolledSpan && enrolledSpan.closest('.col-6')) {
                    const enrolledText = enrolledSpan.textContent;
                    const enrolled = parseInt(enrolledText) || 0;
                    total += enrolled;
                }
            }
        });
        if (totalStudentsSpan) {
            totalStudentsSpan.textContent = total;
        }
    }
    
    // Filter function
    function filterTable() {
        const sessionValue = sessionFilter?.value || 'all';
        const levelValue = levelFilter?.value || 'all';
        const searchTerm = searchInput?.value.toLowerCase() || '';
        
        let visibleCount = 0;
        
        getClassroomItems().forEach(item => {
            const itemSession = item.getAttribute('data-session') || '';
            const itemLevel = item.getAttribute('data-level') || '';
            const itemName = item.getAttribute('data-name') || '';
            const itemTeacher = item.getAttribute('data-teacher') || '';
            
            let matchesSession = true;
            let matchesLevel = true;
            let matchesSearch = true;
            
            if (sessionValue !== 'all') {
                matchesSession = itemSession === sessionValue;
            }
            
            if (levelValue !== 'all') {
                matchesLevel = itemLevel === levelValue;
            }
            
            if (searchTerm) {
                matchesSearch = itemName.includes(searchTerm) || itemTeacher.includes(searchTerm);
            }
            
            if (matchesSession && matchesLevel && matchesSearch) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide filter empty state
        const hasItems = getClassroomItems().length > 0;
        if (visibleCount === 0 && hasItems) {
            if (filterEmptyState) filterEmptyState.style.display = 'block';
            if (classesGrid) classesGrid.style.display = 'none';
        } else {
            if (filterEmptyState) filterEmptyState.style.display = 'none';
            if (classesGrid) classesGrid.style.display = 'flex';
        }
        
        // Update total students
        updateTotalStudents();
    }
    
    // Delete modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    let classToDelete = null;
    
    // Delete button handlers
    document.querySelectorAll('.delete-class').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            classToDelete = { id, name };
            document.getElementById('deleteClassName').textContent = name;
            deleteModal.show();
        });
    });
    
    // Confirm delete
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', function() {
        if (classToDelete) {
            // Send POST request to Django backend
            fetch(`/classroom/${classToDelete.id}/delete/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value || '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove row from DOM
                    const row = document.querySelector(`.delete-class[data-id="${classToDelete.id}"]`).closest('.class-card-item');
                    row.remove();
                    showToast(`Classroom "${classToDelete.name}" deleted successfully`, true);
                    
                    // Update total classes count
                    const totalClassesSpan = document.querySelector('.bg-primary .fw-bold');
                    if (totalClassesSpan) {
                        const currentCount = parseInt(totalClassesSpan.textContent);
                        totalClassesSpan.textContent = currentCount - 1;
                    }
                    
                    // Update total students
                    updateTotalStudents();
                    
                    // Check if grid is empty
                    if (getClassroomItems().length === 0) {
                        location.reload();
                    }
                } else {
                    showToast(data.error || 'Failed to delete classroom', false);
                }
            })
            .catch(error => {
                showToast('An error occurred. Please try again.', false);
            });
            
            deleteModal.hide();
            classToDelete = null;
        }
    });
    
    // Edit button handlers
    document.querySelectorAll('.edit-class').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            window.location.href = `/classroom/${id}/edit/`;
        });
    });
    
    // Toast function
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    const toastMessage = document.getElementById('toastMessage');
    
    function showToast(message, isSuccess = true) {
        toastMessage.textContent = message;
        const toastHeader = document.querySelector('#liveToast .toast-header i');
        if (isSuccess) {
            toastHeader.className = 'fas fa-check-circle text-success me-2';
        } else {
            toastHeader.className = 'fas fa-exclamation-circle text-danger me-2';
        }
        toast.show();
    }
    
    // Event listeners
    sessionFilter?.addEventListener('change', filterTable);
    levelFilter?.addEventListener('change', filterTable);
    searchInput?.addEventListener('input', filterTable);
    
    // Initialize
    filterTable();
});