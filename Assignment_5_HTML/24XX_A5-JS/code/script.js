document.addEventListener('DOMContentLoaded', function () {

    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            let valid = true;

            document.getElementById('signup-email-error').innerText = '';
            document.getElementById('signup-password-error').innerText = '';
            document.getElementById('pic-error').innerText = '';
            document.getElementById('resume-error').innerText = '';

            const emailInput = document.getElementById('signup-email');
            const passwordInput = document.getElementById('signup-password');
            const profilePicInput = document.getElementById('profile-pic');

            // Email Validation
            const emailValue = emailInput.value.trim().toLowerCase();
            if (!emailValue.endsWith('@gmail.com')) {
                document.getElementById('signup-email-error').innerText = 'Only @gmail.com emails are allowed.';
                valid = false;
            }

            // Password Validation
            const passwordValue = passwordInput.value;
            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
            if (!strongPasswordRegex.test(passwordValue)) {
                document.getElementById('signup-password-error').innerText = 'Password must be at least 8 characters long, and include an uppercase letter, lowercase letter, number, and special character.';
                valid = false;
            }



            if (profilePicInput.files.length > 0) {
                const fileSize = profilePicInput.files[0].size;
                const maxSize = 2 * 1024 * 1024;

                if (fileSize > maxSize) {
                    document.getElementById('pic-error').innerText = 'Error: Image size must be less than 2MB.';
                    valid = false;
                }
            } else {
                document.getElementById('pic-error').innerText = 'Please select a profile image.';
                valid = false;
            }

            const resumeInput = document.getElementById('resume-file');
            if (resumeInput.files.length > 0) {
                const fileName = resumeInput.files[0].name;
                const fileExt = fileName.split('.').pop().toLowerCase();

                if (fileExt !== 'pdf' && fileExt !== 'docx') {
                    document.getElementById('resume-error').innerText = 'Error: Only .pdf or .docx files are allowed.';
                    valid = false;
                }
            } else {
                document.getElementById('resume-error').innerText = 'Please select a document file (.pdf or .docx).';
                valid = false;
            }

            if (!valid) {
                event.preventDefault();
            } else {
                alert("Registration credentials and files submitted successfully!");
                event.preventDefault();

                // Form submission logic complete. Removed automatic downloading of files.
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            alert("Login successful!");
            event.preventDefault();
        });
    }

    // Toggle Password Visibility functionality
    const toggleLoginPw = document.getElementById('toggle-login-password');
    const loginPwInput = document.getElementById('login-password');
    if (toggleLoginPw && loginPwInput) {
        toggleLoginPw.addEventListener('click', function () {
            const type = loginPwInput.getAttribute('type') === 'password' ? 'text' : 'password';
            loginPwInput.setAttribute('type', type);
            this.src = type === 'password' ? '../img/close.png' : '../img/open.png';
        });
    }

    const toggleSignupPw = document.getElementById('toggle-signup-password');
    const signupPwInput = document.getElementById('signup-password');
    if (toggleSignupPw && signupPwInput) {
        toggleSignupPw.addEventListener('click', function () {
            const type = signupPwInput.getAttribute('type') === 'password' ? 'text' : 'password';
            signupPwInput.setAttribute('type', type);
            this.src = type === 'password' ? '../img/close.png' : '../img/open.png';
        });
    }

});

// Using a basic jQuery animation
$(document).ready(function () {

    // Simple fade in effect when the page loads
    $("#auth-box").hide().fadeIn(1000);

    // Toggle forms
    $("#tab-signup").click(function (e) {
        e.preventDefault();
        $("#login-form").hide();
        $("#signup-form").fadeIn(500);
        $("#tab-login").removeClass("active");
        $(this).addClass("active");
    });

    $("#tab-login").click(function (e) {
        e.preventDefault();
        $("#signup-form").hide();
        $("#login-form").fadeIn(500);
        $("#tab-signup").removeClass("active");
        $(this).addClass("active");
    });
});
