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
    
    // Set max date for DOB (cannot be future date)
    const dobInput = document.getElementById('dob');
    const today = new Date().toISOString().split('T')[0];
    dobInput.max = today;
    
    // Toast
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    // function showToast(message, isSuccess = true) {
    //     toastMessage.textContent = message;
    //     toast.classList.add('show');
        
    //     if (!isSuccess) {
    //         toast.querySelector('i').className = 'fas fa-exclamation-circle';
    //         toast.querySelector('i').style.color = '#ff4757';
    //     } else {
    //         toast.querySelector('i').className = 'fas fa-check-circle';
    //         toast.querySelector('i').style.color = '#4CAF50';
    //     }
        
    //     setTimeout(() => {
    //         toast.classList.remove('show');
    //     }, 3000);
    // }
    
    // Form submission
    const form = document.getElementById('createStudentForm');
    
    form.addEventListener('submit', function(e) {
        // e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const middleName = document.getElementById('middleName').value.trim();
        const dob = document.getElementById('dob').value;
        const gender = document.querySelector('input[name="gender"]:checked');
        const parentEmail = document.getElementById('parentEmail').value.trim();
        
        // Validation
        if (!firstName) {
            showToast('Please enter first name', false);
            return;
        }
        
        if (!lastName) {
            showToast('Please enter last name', false);
            return;
        }
        
        if (!dob) {
            showToast('Please select date of birth', false);
            return;
        }
        
        if (!gender) {
            showToast('Please select gender', false);
            return;
        }
        
        if (!parentEmail) {
            showToast('Please enter parent email', false);
            return;
        }
        
        // Simulate API call
        const submitBtn = form.querySelector('.btn-primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
        submitBtn.disabled = true;
        
        // setTimeout(() => {
        //     // Simulate response
        //     // If parent email exists -> success
        //     // If parent email doesn't exist -> invite sent
        //     const random = Math.random();
            
        //     if (random > 0.3) {
        //         showToast(`Student ${firstName} ${lastName} registered successfully! Parent has been notified.`);
        //         form.reset();
        //     } else {
        //         showToast(`Parent account not found. Invitation sent to ${parentEmail} to sign up.`, true);
        //         form.reset();
        //     }
            
        //     submitBtn.innerHTML = originalText;
        //     submitBtn.disabled = false;
        // }, 1500);
    });
});