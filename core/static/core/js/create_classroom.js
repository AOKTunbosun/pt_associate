
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
    const form = document.getElementById('createClassForm');
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


    // Dynamic sessions 
    const academicSession = document.getElementById('academicSession')

    const currentYear = new Date().getFullYear();
    const previousYearSession = `${currentYear-1}/${currentYear}`;
    const nextYearSession = `${currentYear}/${currentYear + 1}`;

    const previousYearOption = document.createElement('option');
    previousYearOption.value = previousYearSession;
    previousYearOption.textContent = previousYearSession;

    const nextYearOption = document.createElement('option');
    nextYearOption.value = nextYearSession;
    nextYearOption.textContent = nextYearSession;

    academicSession.appendChild(previousYearOption);
    academicSession.appendChild(nextYearOption);

    
    // Generate class code automatically (optional)
    const classNameSelect = document.getElementById('className');
    const classCodeInput = document.getElementById('classCode');
    
    classNameSelect.addEventListener('change', function() {
        if (!classCodeInput.value) {
            const selectedClass = this.value;
            const session = document.getElementById('academicSession').value;
            if (selectedClass && session) {
                const prefix = selectedClass.substring(0, 3).toUpperCase().replace(/\s/g, '');
                const sessionYear = session.split('/')[0];
                classCodeInput.value = `${prefix}-${sessionYear}`;
            }
        }
    });
    
    document.getElementById('academicSession').addEventListener('change', function() {
        if (!classCodeInput.value && classNameSelect.value) {
            const selectedClass = classNameSelect.value;
            const session = this.value;
            if (selectedClass && session) {
                const prefix = selectedClass.substring(0, 3).toUpperCase().replace(/\s/g, '');
                const sessionYear = session.split('/')[0];
                classCodeInput.value = `${prefix}-${sessionYear}`;
            }
        }
    });
    
    form.addEventListener('submit', function(e) {
                
        const className = document.getElementById('className').value;
        const classCode = document.getElementById('classCode').value.trim();
        const academicSession = document.getElementById('academicSession').value;
        const classTeacher = document.getElementById('classTeacher').value;
        const maxCapacity = document.getElementById('maxCapacity').value;
        
        if (!className || !classCode || !academicSession || !classTeacher || !maxCapacity) {
            showToast('Please fill in all required fields', false);
            return;
        }
        
        const submitBtn = form.querySelector('.btn-primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        submitBtn.disabled = true;
        
        // setTimeout(() => {
        //     showToast(`Class "${className}" created successfully!`);
            
        //     submitBtn.innerHTML = originalText;
        //     submitBtn.disabled = false;
        //     form.reset();
            
        //     // Refresh page or redirect
        //     setTimeout(() => {
        //         location.reload();
        //     }, 1500);
        // }, 1500);
    });
})
