// Messages Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const conversationsList = document.getElementById('conversationsList');
    const chatHeader = document.getElementById('chatHeader');
    const messagesArea = document.getElementById('messagesArea');
    const messageInput = document.getElementById('id_body');
    const sendBtn = document.getElementById('sendBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const searchInput = document.getElementById('searchInput');
    const newMessageFloatBtn = document.getElementById('newMessageFloatBtn');
    const sendNewMessageBtn = document.getElementById('sendNewMessageBtn');
    const conversationsSidebar = document.getElementById('conversationsSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    const newMessageModal = new bootstrap.Modal(document.getElementById('newMessageModal'));

    
    // Close sidebar on mobile when conversation is selected
    function closeSidebarOnMobile() {
        if (window.innerWidth <= 768) {
            conversationsSidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
        }
    }



    function scrollToBottom() {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }


    if (messageInput) {
        messageInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        messageInput.addEventListener('input', function () {
            typingIndicator.style.display = 'block';
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                typingIndicator.style.display = 'none';
            }, 1000);
        });
    }

    // Sidebar overlay click to close
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function () {
            conversationsSidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
        });
    }

    // New message button
    if (newMessageFloatBtn) {
        newMessageFloatBtn.addEventListener('click', () => newMessageModal.show());
    }

    if (sendNewMessageBtn) {
        sendNewMessageBtn.addEventListener('click', function () {
            const recipient = recipientSelect?.value;
            const message = document.getElementById('newMessageText')?.value;
            if (recipient && message) {
                alert(`New message would be sent to ${recipient}`);
                newMessageModal.hide();
                document.getElementById('newMessageText').value = '';
            } else {
                alert('Please fill in recipient and message');
            }
        });
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', renderConversations);
    }

    // Handle window resize - reset sidebar state
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            conversationsSidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
        }
    });

    // Mobile sidebar toggle
    const mobileConvToggle = document.getElementById('mobileConvToggle');

    if (mobileConvToggle) {

        mobileConvToggle.addEventListener('click', function () {

            conversationsSidebar.classList.add('open');
            sidebarOverlay.classList.add('active');

        });

    }

    scrollToBottom();

});