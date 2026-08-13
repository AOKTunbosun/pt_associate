document.addEventListener("DOMContentLoaded", function () {

    const fileBtn = document.getElementById("fileBtn");
    const fileInput = document.getElementById("fileInput");
    const messageInput = document.getElementById("id_body");
    const filePreview = document.getElementById("filePreview");

    if (fileInput) {
        fileInput.addEventListener("change", function () {

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];

                filePreview.innerHTML = `
                📎 <strong>${file.name}</strong>
                <span style="margin-left:8px; color:gray;">
                    (${(file.size / 1024).toFixed(1)} KB)
                </span>
            `;
            } else {
                filePreview.innerHTML = "";
            }

        });
    }

    // 📎 Open hidden file picker
    if (fileBtn && fileInput) {
        fileBtn.addEventListener("click", function () {
            fileInput.click();
        });
    }

    // ⌨️ Press Enter to submit form
    if (messageInput) {
        messageInput.addEventListener("keypress", function (e) {

            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                this.closest("form").requestSubmit();
            }

        });
    }


    const mobileConvToggle = document.getElementById("mobileConvToggle");
    const conversationsSidebar = document.getElementById("conversationsSidebar");
    const closeSidebar = document.getElementById("closeSidebar");

    mobileConvToggle.addEventListener("click", function () {
        conversationsSidebar.style.left = 0;
    });

    closeSidebar.addEventListener("click", function () {
        conversationsSidebar.style.left = '-100%';
    });

});