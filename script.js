import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBjcMCJj12mUufAGy2ME5pXOfLIcdq_E_A",
    authDomain: "aikyam-ananda.firebaseapp.com",
    projectId: "aikyam-ananda",
    storageBucket: "aikyam-ananda.firebasestorage.app",
    messagingSenderId: "6461778063",
    appId: "1:6461778063:web:83a531d5ab034cb1d728fa",
    measurementId: "G-DRWZE8LMN8",
    databaseURL: "https://aikyam-ananda-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-loaded');
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
    const admissionBanner = document.getElementById('admission-banner');

    if (openBtn && modal) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            // slight delay to allow display block to apply before transition
            setTimeout(() => modal.classList.add('show'), 10);
        });

        if (admissionBanner) {
            admissionBanner.addEventListener('click', () => {
                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('show'), 10);
            });
        }

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
        enquireForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const parentName = document.getElementById('parentName').value;
            const childName = document.getElementById('childName').value;
            const dob = document.getElementById('dob').value;
            const ageAsOfTargetDate = ageInput.value;
            const residence = document.getElementById('residence').value;
            const contactNo = document.getElementById('contactNo').value;
            const email = document.getElementById('email').value;
            const reason = document.getElementById('reason').value;
            const openHouse = document.getElementById('openHouse').checked;

            const submitBtn = enquireForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            try {
                await push(ref(db, "enquiries"), {
                    parentName,
                    childName,
                    dob,
                    ageAsOfTargetDate,
                    residence,
                    contactNo,
                    email,
                    reason,
                    openHouse,
                    timestamp: new Date().toISOString()
                });

                // --- EmailJS Integration Placeholder ---
                const templateParams = {
                    parentName,
                    childName,
                    dob,
                    ageAsOfTargetDate,
                    residence,
                    contactNo,
                    email,
                    reason,
                    openHouse: openHouse ? "Yes" : "No"
                };
                
                // You must configure the serviceID and templateID here from your EmailJS dashboard:
                const serviceID = "service_7fma4qx";
                const templateID = "template_vhjapz3";
                
                try {
                    await emailjs.send(serviceID, templateID, templateParams);
                    console.log("Email notification sent via EmailJS");
                } catch (emailErr) {
                    console.error("Failed to send email check your EmailJS keys", emailErr);
                }
                // ---------------------------------------

                alert('Thank you for your enquiry! We will get back to you soon.');
                enquireForm.reset();
                modal.classList.remove('show');
                setTimeout(() => modal.style.display = 'none', 300);
                ageInput.value = '';
            } catch (error) {
                console.error("Error adding document: ", error);
                alert("There was an error submitting your enquiry. Please try again.");
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Intersection Observer for Animations (e.g. animated titles)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            } else {
                entry.target.classList.remove('animate');
            }
        });
    }, observerOptions);

    const animatedTitles = document.querySelectorAll('.animated-title');
    animatedTitles.forEach(title => {
        observer.observe(title);
    });
});
