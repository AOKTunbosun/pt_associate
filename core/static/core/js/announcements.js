// Announcements Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Delete modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    let announcementToDelete = null;
    
    // Delete button handlers
    document.querySelectorAll('.delete-announcement').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const title = this.getAttribute('data-title');
            announcementToDelete = { id, title };
            document.getElementById('deleteAnnouncementTitle').textContent = title;
            deleteModal.show();
        });
    });
    
    // Confirm delete
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', function() {
        if (announcementToDelete) {
            fetch(`/announcement/${announcementToDelete.id}/delete/`, {
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
                    const row = document.querySelector(`.delete-announcement[data-id="${announcementToDelete.id}"]`).closest('.announcement-item');
                    row.remove();
                    showToast('Announcement deleted successfully', true);
                    deleteModal.hide();
                    announcementToDelete = null;
                    
                    // Check if list is empty
                    if (document.querySelectorAll('.announcement-item').length === 0) {
                        location.reload();
                    }
                } else {
                    showToast(data.error || 'Failed to delete announcement', false);
                }
            })
            .catch(error => {
                showToast('An error occurred. Please try again.', false);
            });
        }
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
    
    // Show success toast after form submission
    if (window.location.search === '?success=true') {
        showToast('Announcement published to parents', true);
    }
});