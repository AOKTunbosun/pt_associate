document.addEventListener('DOMContentLoaded', function() {
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    let announcementToDelete = null;
    
    document.querySelectorAll('.delete-announcement').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const title = this.getAttribute('data-title');
            announcementToDelete = { id, title };
            document.getElementById('deleteAnnouncementTitle').textContent = title;
            deleteModal.show();
        });
    });
    
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', function() {
        if (announcementToDelete) {
            fetch(`/announcement/${announcementToDelete.id}/delete/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value || '',
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const row = document.querySelector(`.delete-announcement[data-id="${announcementToDelete.id}"]`).closest('.list-group-item');
                    row.remove();
                    showToast('Announcement deleted');
                    deleteModal.hide();
                }
            });
        }
    });
    
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    const toastMessage = document.getElementById('toastMessage');
    
    function showToast(message) {
        toastMessage.textContent = message;
        toast.show();
    }
    
    if (window.location.search === '?success=true') {
        showToast('Announcement published');
    }
});