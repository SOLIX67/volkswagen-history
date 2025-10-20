// Specs tabs functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener ('click', function() {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const target = this.getAttribute('data-target');

            tabContents.forEach(content => {
                if (content.getAttribute('data-content') === target) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });
});

// Video Controls for Specs Page Only
function initSpecsVideoControls() {
    const video = document.getElementById('specsVideo');
    const muteBtn = document.getElementById('muteBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    // Only initialize if on specs page
    if (window.location.pathname.includes('specs.html')) {
        if (video && muteBtn) {
            muteBtn.addEventListener('click', function() {
                video.muted = !video.muted;
                muteBtn.innerHTML = video.muted ? 
                    '<i class="fas fa-volume-mute"></i>' : 
                    '<i class="fas fa-volume-up"></i>';
                muteBtn.title = video.muted ? 'Unmute Video' : 'Mute Video';
            });
        }

        if (video && pauseBtn) {
            pauseBtn.addEventListener('click', function() {
                if (video.paused) {
                    video.play();
                    pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    pauseBtn.title = 'Pause Video';
                } else {
                    video.pause();
                    pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    pauseBtn.title = 'Play Video';
                }
            });
        }
    }
}

// Call this in your DOMContentLoaded event
// initSpecsVideoControls();

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
});
