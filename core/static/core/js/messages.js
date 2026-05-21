document.addEventListener("DOMContentLoaded", function () {

    const fileBtn = document.getElementById("fileBtn");
    const fileInput = document.getElementById("fileInput");
    const messageInput = document.getElementById("id_body");

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

});