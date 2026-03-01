document.addEventListener('DOMContentLoaded', function () {

    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            let valid = true;

            document.getElementById('pic-error').innerText = '';
            document.getElementById('resume-error').innerText = '';

            const profilePicInput = document.getElementById('profile-pic');
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

                // Simulating saving the files locally by triggering downloads
                if (profilePicInput.files.length > 0) {
                    const imgFile = profilePicInput.files[0];
                    const imgUrl = URL.createObjectURL(imgFile);
                    const imgLink = document.createElement('a');
                    imgLink.href = imgUrl;
                    imgLink.download = "saved_image_" + imgFile.name;
                    document.body.appendChild(imgLink);
                    imgLink.click();
                    document.body.removeChild(imgLink);
                    URL.revokeObjectURL(imgUrl);
                }

                if (resumeInput.files.length > 0) {
                    const docFile = resumeInput.files[0];
                    const docUrl = URL.createObjectURL(docFile);
                    const docLink = document.createElement('a');
                    docLink.href = docUrl;
                    docLink.download = "saved_doc_" + docFile.name;
                    document.body.appendChild(docLink);
                    docLink.click();
                    document.body.removeChild(docLink);
                    URL.revokeObjectURL(docUrl);
                }
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            alert("Login successful!");
            event.preventDefault();
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
