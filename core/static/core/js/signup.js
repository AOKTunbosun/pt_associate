function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    strengthBar.className = 'password-strength-bar';
    strengthText.className = 'password-strength-text';

    if (password.length === 0) {
        strengthText.textContent = '';
    } else if (strength <= 1) {
        strengthBar.classList.add('weak');
        strengthText.classList.add('weak');
        strengthText.textContent = 'Weak password';
    } else if (strength <= 3) {
        strengthBar.classList.add('medium');
        strengthText.classList.add('medium');
        strengthText.textContent = 'Medium strength';
    } else {
        strengthBar.classList.add('strong');
        strengthText.classList.add('strong');
        strengthText.textContent = 'Strong password';
    }
}

// Form validation
document.getElementById('signupForm').addEventListener('submit', function (e) {

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));

    let isValid = true;

    // Validate first name
    const firstName = document.getElementById('firstName').value.trim();
    if (firstName === '') {
        document.getElementById('firstNameError').classList.add('show');
        isValid = false;
    }

    // Validate last name
    const lastName = document.getElementById('lastName').value.trim();
    if (lastName === '') {
        document.getElementById('lastNameError').classList.add('show');
        isValid = false;
    }

    // Validate email
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').classList.add('show');
        isValid = false;
    }

    // Validate phone
    const phone = document.getElementById('phone').value.trim();
    if (phone === '') {
        document.getElementById('phoneError').classList.add('show');
        isValid = false;
    }

    // Validate password
    const password = document.getElementById('password').value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        document.getElementById('passwordError').classList.add('show');
        isValid = false;
    }

    // Validate password confirmation
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
        e.preventDefault();
        document.getElementById('confirmPasswordError').classList.add('show');
        isValid = false;
    }

    // Validate terms
    const terms = document.getElementById('terms').checked;
    if (!terms) {
        alert('Please accept the Terms of Service and Privacy Policy');
        isValid = false;
    }

    if (isValid) {
        // Form is valid, submit it
        console.log('Form is valid, proceeding to role selection...');
        alert('Account created successfully! You will now be redirected to set up your role(s).');
        // this.submit(); // Uncomment when ready to actually submit
    }
});