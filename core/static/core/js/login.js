
// Form validation
document.getElementById('loginForm').addEventListener('submit', function (e) {
    

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));

    let isValid = true;

    // Validate email
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').classList.add('show');
        isValid = false;
    }

    // Validate password
    const password = document.getElementById('password').value;
    if (password === '') {
        document.getElementById('passwordError').classList.add('show');
        isValid = false;
    }

    if (isValid) {
        // Form is valid, submit it
        console.log('Login form submitted');
        // this.submit(); // Uncomment when ready to actually submit
    }
});
