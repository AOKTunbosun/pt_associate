

document.addEventListener('DOMContentLoaded', function() {
    // // Mobile menu toggle
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
    
    // Form submission
    const form = document.getElementById('addStaffForm');
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
    
    form.addEventListener('submit', function(e) {
        
        const email = document.getElementById('teacherEmail').value.trim();
        
        if (!email) {
            showToast('Please enter an email address', false);
            return;
        }
        
        // Simulate API call
        const submitBtn = form.querySelector('.btn-primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // setTimeout(() => {
        //     // Simulate response based on email domain
        //     if (email.includes('new')) {
        //         showToast('Invitation sent! Teacher will receive signup link');
        //         addToRecentList(email, 'Invite Sent');
        //     } else {
        //         showToast('Teacher added successfully! Notification email sent');
        //         addToRecentList(email, 'Active');
        //     }
            
        //     submitBtn.innerHTML = originalText;
        //     submitBtn.disabled = false;
        //     document.getElementById('teacherEmail').value = '';
        // }, 1500);
    });
    
    // function addToRecentList(email, status) {
    //     const tbody = document.getElementById('recentTeachersList');
    //     const row = document.createElement('tr');
    //     const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
    //     const statusClass = status === 'Active' ? 'active' : 'pending';
    //     const nameDisplay = status === 'Active' ? email.split('@')[0] : '—';
        
    //     row.innerHTML = `
    //         <td>${nameDisplay}</td>
    //         <td>${email}</td>
    //         <td><span class="status ${statusClass}">${status}</span></td>
    //         <td>${date}</td>
    //     `;
        
    //     tbody.insertBefore(row, tbody.firstChild);
        
    //     // Keep only last 5
    //     while (tbody.children.length > 5) {
    //         tbody.removeChild(tbody.lastChild);
    //     }
    // }
});
