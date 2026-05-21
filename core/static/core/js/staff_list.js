// Staff List Page JavaScript - Only for interactivity
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');
    const staffTableBody = document.getElementById('staffTableBody');
    const filterEmptyState = document.getElementById('filterEmptyState');
    const tableRows = () => document.querySelectorAll('#staffTableBody tr:not(#emptyTableRow)');
    const emptyTableRow = document.getElementById('emptyTableRow');
    
    // Modal elements
    const removeModal = new bootstrap.Modal(document.getElementById('removeModal'));
    let staffToRemove = null;
    
    // Toast
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
    
    // Filter function - hides/shows rows based on search and role filter
    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const roleValue = roleFilter.value;
        
        let visibleCount = 0;
        
        tableRows().forEach(row => {
            const name = row.getAttribute('data-name') || '';
            const email = row.getAttribute('data-email') || '';
            const role = row.getAttribute('data-role') || '';
            
            let matchesSearch = true;
            let matchesRole = true;
            
            if (searchTerm) {
                matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
            }
            
            if (roleValue !== 'all') {
                matchesRole = role === roleValue;
            }
            
            if (matchesSearch && matchesRole) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        // Show/hide filter empty state
        if (visibleCount === 0 && tableRows().length > 0) {
            filterEmptyState.style.display = 'block';
        } else {
            filterEmptyState.style.display = 'none';
        }
    }
    
    // Remove staff button click handlers
    document.querySelectorAll('.remove-staff-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            staffToRemove = { id, name };
            document.getElementById('removeStaffName').textContent = name;
        });
    });
    
    // Confirm remove
    document.getElementById('confirmRemoveBtn')?.addEventListener('click', function() {
        if (staffToRemove) {
            // Send POST request to Django backend
            fetch(`/staff/${staffToRemove.id}/remove/`, {
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
                    const row = document.querySelector(`.remove-staff-btn[data-id="${staffToRemove.id}"]`).closest('tr');
                    row.remove();
                    showToast(`Staff "${staffToRemove.name}" removed successfully`, true);
                    
                    // Update total staff count
                    const totalStaffSpan = document.querySelector('.bg-primary .fw-bold');
                    if (totalStaffSpan) {
                        const currentCount = parseInt(totalStaffSpan.textContent);
                        totalStaffSpan.textContent = currentCount - 1;
                    }
                    
                    // Check if table is empty
                    if (tableRows().length === 0) {
                        location.reload();
                    }
                } else {
                    showToast(data.error || 'Failed to remove staff', false);
                }
            })
            .catch(error => {
                showToast('An error occurred. Please try again.', false);
            });
            
            removeModal.hide();
            staffToRemove = null;
        }
    });
    
    // Event listeners
    searchInput?.addEventListener('input', filterTable);
    roleFilter?.addEventListener('change', filterTable);
    
    // Initialize filters (ensures empty state is correct on page load)
    filterTable();
});