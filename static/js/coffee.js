// Variables for Buy Me a Coffee functionality
document.addEventListener('DOMContentLoaded', function() {
    const coffeeBtn = document.getElementById('nav-coffee-btn');
    const coffeeModalOverlay = document.getElementById('coffee-modal-overlay');
    const coffeeModalClose = document.getElementById('coffee-modal-close');
    const copyUpiBtn = document.getElementById('copy-upi-btn');
    
    // Handle responsive text in button based on screen size
    function handleResponsiveText() {
        const buttonText = document.querySelector('.coffee-btn-text');
        if (buttonText) {
            if (window.innerWidth <= 768) {
                buttonText.style.display = 'none';
            } else {
                buttonText.style.display = 'inline';
            }
        }
    }
    
    // Call initially
    handleResponsiveText();
    
    // Add resize listener
    window.addEventListener('resize', handleResponsiveText);

    // Show coffee modal on page load (once per session)
    if (!sessionStorage.getItem('coffeePopupShown')) {
        setTimeout(() => {
            if (coffeeModalOverlay) {
                coffeeModalOverlay.classList.add('active');
                sessionStorage.setItem('coffeePopupShown', 'true');
            }
        }, 2000); // Show after 2 seconds
    }

    // Event listener for coffee button in navbar
    if (coffeeBtn) {
        coffeeBtn.addEventListener('click', function() {
            coffeeModalOverlay.classList.add('active');
        });
    }

    // Event listener for closing the coffee modal
    if (coffeeModalClose) {
        coffeeModalClose.addEventListener('click', function() {
            coffeeModalOverlay.classList.remove('active');
        });
    }

    // Close modal when clicking outside of it
    if (coffeeModalOverlay) {
        coffeeModalOverlay.addEventListener('click', function(e) {
            if (e.target === coffeeModalOverlay) {
                coffeeModalOverlay.classList.remove('active');
            }
        });
    }

    // Copy UPI ID to clipboard
    if (copyUpiBtn) {
        copyUpiBtn.addEventListener('click', function() {
            const upiId = document.getElementById('upi-id').textContent;
            
            // Handle mobile/desktop copying differently
            if (navigator.clipboard) {
                navigator.clipboard.writeText(upiId)
                    .then(() => {
                        const originalText = copyUpiBtn.innerHTML;
                        copyUpiBtn.innerHTML = '<i class="ri-check-line"></i><span>Copied!</span>';
                        setTimeout(() => {
                            copyUpiBtn.innerHTML = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                        // Fallback for mobile
                        copyToClipboardFallback(upiId);
                    });
            } else {
                // Fallback for browsers without clipboard API
                copyToClipboardFallback(upiId);
            }
        });
    }
    
    // Fallback for copying to clipboard on mobile devices
    function copyToClipboardFallback(text) {
        // Create temporary input
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        
        // Select and copy
        tempInput.select();
        document.execCommand('copy');
        
        // Remove temporary element
        document.body.removeChild(tempInput);
        
        // Update button text
        const originalText = copyUpiBtn.innerHTML;
        copyUpiBtn.innerHTML = '<i class="ri-check-line"></i><span>Copied!</span>';
        setTimeout(() => {
            copyUpiBtn.innerHTML = originalText;
        }, 2000);
    }
    
    // Handle escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && coffeeModalOverlay.classList.contains('active')) {
            coffeeModalOverlay.classList.remove('active');
        }
    });
});