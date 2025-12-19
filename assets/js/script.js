// Wedding Invitation Interactive Script

document.addEventListener("DOMContentLoaded", () => {
    // Initialize all components
    initDynamicData() // NEW: Inject dynamic data first
    initNavigation()
    initCountdown()
    initMusic()
    initParticles()
    initScrollAnimations()
    initRSVPForm()
    initMobileMenu()
})

// Music Player Logic
function initMusic() {
    const musicControl = document.getElementById('musicControl');
    const vinylIcon = musicControl.querySelector('.vinyl-icon');
    const params = new URLSearchParams(window.location.search);
    let musicUrl = params.get('song');

    // Default Fallback
    if (!musicUrl) {
        musicUrl = "assets/media/shehnai.mp3";
    } else {
        // Ensure decoded
        musicUrl = decodeURIComponent(musicUrl);
    }

    console.log("Initializing Music Player with:", musicUrl);

    const audio = new Audio();
    audio.src = musicUrl;
    audio.loop = true;
    audio.volume = 0.5;

    let isPlaying = false;

    // Error Handling
    audio.addEventListener('error', (e) => {
        console.error("Audio playback error:", e);
        // Fallback to default if custom song fails and it's not already the default
        if (musicUrl !== "assets/media/shehnai.mp3") {
            console.log("Falling back to default music...");
            audio.src = "assets/media/shehnai.mp3";
            // Try playing again if it was supposed to be playing
            if (isPlaying) audio.play();
        } else {
            alert("Could not play background music.");
        }
    });

    // Toggle Play/Pause
    musicControl.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicControl.classList.remove('playing');
            if (vinylIcon) vinylIcon.style.animationPlayState = 'paused';
        } else {
            audio.play().then(() => {
                musicControl.classList.add('playing');
                if (vinylIcon) vinylIcon.style.animationPlayState = 'running';
            }).catch(e => console.warn("Audio play blocked", e));
        }
        isPlaying = !isPlaying;
    });

    // Auto-play attempt
    const attemptPlay = () => {
        audio.play().then(() => {
            isPlaying = true;
            musicControl.classList.add('playing');
            if (vinylIcon) vinylIcon.style.animationPlayState = 'running';
            console.log("Autoplay successful");
        }).catch(error => {
            console.log("Autoplay prevented by browser. Waiting for interaction.");
            // Add one-time listener to body to start music on first click
            document.body.addEventListener('click', function unlockAudio() {
                if (!isPlaying) {
                    audio.play().then(() => {
                        isPlaying = true;
                        musicControl.classList.add('playing');
                        if (vinylIcon) vinylIcon.style.animationPlayState = 'running';
                    });
                }
                document.body.removeEventListener('click', unlockAudio);
            }, { once: true });
        });
    };

    attemptPlay();
}

// Dynamic Data Injection
function initDynamicData() {
    const params = new URLSearchParams(window.location.search);
    // ... rest of data injection ...
    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el && val) el.textContent = val;
    }

    const bride = params.get('b');
    const groom = params.get('g');
    const date = params.get('d');

    const venue = params.get('v');

    if (bride) setText('brideName', bride);
    if (groom) setText('groomName', groom);
    if (date) setText('weddingDate', date);
    if (date) setText('footerDate', date);
    if (venue) setText('mainVenue', venue);
}

// Navigation
function initNavigation() {
    // ... existing navigation code ...
    const nav = document.querySelector(".nav")

    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            nav.classList.add("scrolled")
        } else {
            nav.classList.remove("scrolled")
        }
    })

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault()
            const target = document.querySelector(this.getAttribute("href"))
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
                // Close mobile menu if open
                document.getElementById("mobileMenu").classList.remove("active")
            }
        })
    })
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")
    const mobileMenu = document.getElementById("mobileMenu")

    mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("active")
        mobileMenuBtn.classList.toggle("active")
    })
}

// Countdown Timer
function initCountdown() {
    // Try to parse date from URL, else default
    const params = new URLSearchParams(window.location.search);
    let dateStr = params.get('d') || "February 14, 2026"; // UPDATED default year

    // Append a time if just a date (for accurate countdown)
    if (!dateStr.includes(":")) dateStr += " 10:00:00";

    let weddingDate = new Date(dateStr).getTime()

    // Safety check: If date is invalid or past, set to 1 month from now
    if (isNaN(weddingDate) || weddingDate < Date.now()) {
        const future = new Date();
        future.setMonth(future.getMonth() + 1);
        weddingDate = future.getTime();
        // console.log("Date was past/invalid, defaulted to +1 month");
    }

    function updateCountdown() {
        const now = new Date().getTime()
        const distance = weddingDate - now

        if (distance < 0) {
            // Should not happen with safety check, but just in case
            document.getElementById("days").textContent = "00"
            document.getElementById("hours").textContent = "00"
            document.getElementById("minutes").textContent = "00"
            document.getElementById("seconds").textContent = "00"
            return
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        document.getElementById("days").textContent = days.toString().padStart(2, "0")
        document.getElementById("hours").textContent = hours.toString().padStart(2, "0")
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0")
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0")
    }

    updateCountdown()
    setInterval(updateCountdown, 1000)
}

// Floating Particles
function initParticles() {
    const particlesContainer = document.getElementById("particles")
    // Check if particles container exists
    if (!particlesContainer) return;

    const particleCount = 30

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer)
    }
}

function createParticle(container) {
    const particle = document.createElement("div")
    particle.className = "particle"

    // Random position
    particle.style.left = Math.random() * 100 + "%"

    // Random size
    const size = Math.random() * 6 + 4
    particle.style.width = size + "px"
    particle.style.height = size + "px"

    // Random animation duration and delay
    const duration = Math.random() * 10 + 10
    const delay = Math.random() * 15
    particle.style.animationDuration = duration + "s"
    particle.style.animationDelay = delay + "s"

    // Random opacity
    particle.style.opacity = Math.random() * 0.5 + 0.3

    container.appendChild(particle)
}

// Scroll Animations
function initScrollAnimations() {
    const revealElements = document.querySelectorAll(".couple-card, .event-card, .gallery-item, .love-story, .rsvp-form")

    revealElements.forEach((el) => {
        el.classList.add("reveal")
    })

    function checkReveal() {
        const windowHeight = window.innerHeight
        const revealPoint = 150

        revealElements.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top

            if (elementTop < windowHeight - revealPoint) {
                el.classList.add("active")
            }
        })
    }

    window.addEventListener("scroll", checkReveal)
    checkReveal() // Check on load
}

// RSVP Form
function initRSVPForm() {
    const form = document.getElementById("rsvpForm")
    const successMessage = document.getElementById("rsvpSuccess")

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        // Collect form data
        const formData = new FormData(form)
        const data = {}
        formData.forEach((value, key) => {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value)
                } else {
                    data[key] = [data[key], value]
                }
            } else {
                data[key] = value
            }
        })

        // Simulate form submission
        console.log("RSVP Data:", data)

        // Show success message
        form.style.display = "none"
        successMessage.classList.add("show")

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: "smooth", block: "center" })
    })
}

// Parallax Effect for Hero
window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const hero = document.querySelector(".hero-content")
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`
        hero.style.opacity = 1 - scrolled / window.innerHeight
    }
})

// Gallery Lightbox Effect (simple implementation)
document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", function () {
        const img = this.querySelector("img")
        if (img) {
            // Add a subtle scale animation on click
            this.style.transform = "scale(0.95)"
            setTimeout(() => {
                this.style.transform = ""
            }, 150)
        }
    })
})

// Add smooth entrance animation for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
}

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
        }
    })
}, observerOptions)

document.querySelectorAll("section").forEach((section) => {
    if (section.id !== "home") {
        section.style.opacity = "0"
        section.style.transform = "translateY(30px)"
        section.style.transition = "opacity 0.8s ease, transform 0.8s ease"
        sectionObserver.observe(section)
    }
})
