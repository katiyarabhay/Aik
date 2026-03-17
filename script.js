document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    // Modal Logic
    const modal = document.getElementById('enquireModal');
    const openBtn = document.getElementById('openEnquireModal');
    const closeBtn = document.querySelector('.close-btn');
    const dobInput = document.getElementById('dob');
    const ageInput = document.getElementById('age');
    const enquireForm = document.getElementById('enquireForm');

    if (openBtn && modal) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            // slight delay to allow display block to apply before transition
            setTimeout(() => modal.classList.add('show'), 10);
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        });

        // Open automatically on page load after 1.5s
        setTimeout(() => {
            if (!modal.classList.contains('show')) {
                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('show'), 10);
            }
        }, 1500);
    }

    if (dobInput && ageInput) {
        dobInput.addEventListener('change', () => {
            const dobDate = new Date(dobInput.value);
            // Target date: 31 July 2026
            const targetDate = new Date('2026-07-31');

            if (!isNaN(dobDate.getTime())) {
                let years = targetDate.getFullYear() - dobDate.getFullYear();
                let months = targetDate.getMonth() - dobDate.getMonth();
                let days = targetDate.getDate() - dobDate.getDate();

                if (days < 0) {
                    months--;
                    const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
                    days += prevMonth.getDate();
                }

                if (months < 0) {
                    years--;
                    months += 12;
                }
                
                if (years < 0 || (years === 0 && months === 0 && days < 0)) {
                    ageInput.value = 'Not born yet as of target date';
                } else {
                    let ageStr = `${years} Years, ${months} Months`;
                    ageInput.value = ageStr;
                }
            } else {
                ageInput.value = '';
            }
        });
    }

    if (enquireForm) {
        enquireForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your enquiry! We will get back to you soon.');
            enquireForm.reset();
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
            ageInput.value = '';
        });
    }
});
