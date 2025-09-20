// Smooth scrolling for navigation
        document.addEventListener('DOMContentLoaded', function() {
            // Generate floating particles
            generateParticles();
            
            // Initialize scroll reveal animations
            initScrollReveal();
            
            // Initialize guestbook
            loadMessages();
        });

        // Generate floating particles
        function generateParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Scroll reveal animation
        function initScrollReveal() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);

            // Observe all elements with reveal class
            document.querySelectorAll('.reveal, .bio-paragraph, .timeline-item, .memory-card, .achievement-item, .tree-node, .quote-card').forEach(el => {
                observer.observe(el);
            });
        }

        // Lightbox functionality
        function openLightbox(element) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const img = element.querySelector('img');
            
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.style.display = 'flex';
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.style.display = 'none';
            
            // Restore body scrolling
            document.body.style.overflow = 'auto';
        }

        // Guestbook functionality
        document.getElementById('guestbook-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('visitor-name').value;
            const email = document.getElementById('visitor-email').value;
            const message = document.getElementById('visitor-message').value;
            
            if (name && message) {
                const newMessage = {
                    name: name,
                    email: email,
                    message: message,
                    date: new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })
                };
                
                // Save to localStorage
                let messages = JSON.parse(localStorage.getItem('guestbookMessages') || '[]');
                messages.unshift(newMessage); // Add to beginning of array
                localStorage.setItem('guestbookMessages', JSON.stringify(messages));
                
                // Display the new message
                displayMessage(newMessage);
                
                // Clear form
                this.reset();
                
                // Show success message
                alert('Thank you for sharing your memory. Your message has been added to the guestbook.');
            }
        });

        function loadMessages() {
            const messages = JSON.parse(localStorage.getItem('guestbookMessages') || '[]');
            messages.forEach(message => {
                displayMessage(message);
            });
        }

        function displayMessage(message) {
            const messagesContainer = document.getElementById('messages-container');
            const messageCard = document.createElement('div');
            messageCard.className = 'message-card';
            messageCard.innerHTML = `
                <div class="message-author">${escapeHtml(message.name)}</div>
                <div class="message-date">${message.date}</div>
                <div class="message-text">${escapeHtml(message.message)}</div>
            `;
            
            // Insert after the sample message
            const sampleMessage = messagesContainer.querySelector('.message-card');
            if (sampleMessage && sampleMessage.nextSibling) {
                messagesContainer.insertBefore(messageCard, sampleMessage.nextSibling);
            } else {
                messagesContainer.appendChild(messageCard);
            }
        }

        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        }

        // Share website function
        function shareWebsite() {
            if (navigator.share) {
                navigator.share({
                    title: 'Memorial for Juan "Lolo" Dela Cruz',
                    text: 'Please join us in remembering our beloved grandfather.',
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('Website link copied to clipboard!');
                });
            }
        }

        // Keyboard navigation for lightbox
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });

        // Handle form submission with Enter key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                e.target.form.dispatchEvent(new Event('submit'));
            }
        });