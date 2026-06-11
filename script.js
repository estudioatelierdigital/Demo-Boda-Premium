// =====================================
// CONFIGURACIÓN GENERAL DE LA PLANTILLA
// =====================================

const WEDDING_CONFIG = {

    eventDate: "2026-11-14T17:00:00",

    /*
        Cambia este número por el WhatsApp real del cliente.
        Formato México recomendado: 52 + lada + número.
        Ejemplo: 524491234567
    */
    rsvpPhone: "524XXXXXXXXX",

    rsvpMessage:
        "Hola, confirmo mi asistencia a la boda de Sofía y Alejandro.",

    coupleShortName:
        "Sofía & Alejandro"

};

// =====================================
// UTILIDADES
// =====================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const clamp = (value, min, max) => {
    return Math.max(min, Math.min(value, max));
};

// =====================================
// INICIALIZACIÓN
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    initPremiumLoader();
    initPremiumParticles();
    initPremiumScrollProgress();
    initPremiumReveal();
    initPremiumPhotoEffects();
    initPremiumCardTilt();
    initPremiumButtonRipples();

    initMusic();
    initFadeIn();
    initCountdown();
    initTimeline();
    initPhotoFallbacks();
    initRSVP();
    initDisabledLinks();
    initButtonInteractions();

});


// =====================================
// ANIMACIONES PREMIUM
// =====================================

function prefersReducedMotion(){
    return window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initPremiumLoader(){

    const loader = $("#premiumLoader");

    if(!loader){
        document.body.classList.add("premium-loaded");
        return;
    }

    if(prefersReducedMotion()){
        document.body.classList.add("premium-loaded");
        loader.remove();
        return;
    }

    const hideLoader = () => {
        window.setTimeout(() => {
            document.body.classList.add("premium-loaded");
        }, 520);
    };

    if(document.readyState === "complete"){
        hideLoader();
    }else{
        window.addEventListener("load", hideLoader, { once:true });
        window.setTimeout(hideLoader, 1800);
    }

}

function initPremiumParticles(){

    const particlesContainer = $("#floatingParticles");

    if(!particlesContainer || prefersReducedMotion()) return;

    const fragment = document.createDocumentFragment();
    const particleCount = window.innerWidth <= 430 ? 18 : 30;

    for(let index = 0; index < particleCount; index++){
        const particle = document.createElement("span");

        const size = 2 + Math.random() * 4;
        const left = Math.random() * 100;
        const drift = -42 + Math.random() * 84;
        const duration = 9 + Math.random() * 11;
        const delay = Math.random() * -18;

        particle.style.setProperty("--particle-size", `${size}px`);
        particle.style.setProperty("--particle-left", `${left}%`);
        particle.style.setProperty("--particle-drift", `${drift}px`);
        particle.style.setProperty("--particle-duration", `${duration}s`);
        particle.style.setProperty("--particle-delay", `${delay}s`);

        fragment.appendChild(particle);
    }

    particlesContainer.appendChild(fragment);

}

function initPremiumScrollProgress(){

    const progressBar = $("#scrollProgress");

    if(!progressBar) return;

    let ticking = false;

    const updateProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = documentHeight > 0 ? clamp((scrollTop / documentHeight) * 100, 0, 100) : 0;

        progressBar.style.width = `${progress}%`;
        ticking = false;
    };

    const requestUpdate = () => {
        if(!ticking){
            window.requestAnimationFrame(updateProgress);
            ticking = true;
        }
    };

    window.addEventListener("scroll", requestUpdate, { passive:true });
    window.addEventListener("resize", requestUpdate);

    updateProgress();

}

function initPremiumReveal(){

    const revealSelectors = [
        ".details-block .section-kicker",
        ".details-block .section-title",
        ".count-box",
        ".event-card",
        ".timeline-block .section-kicker",
        ".timeline-block .section-title",
        ".final-block .section-icon",
        ".final-block .section-kicker",
        ".final-block .section-title",
        ".dresscode-style",
        ".dresscode-text",
        ".palette-section",
        ".gift-section",
        ".rsvp-section",
        ".brand-divider",
        ".brand-logo",
        ".brand-created",
        ".brand-name",
        ".brand-text",
        ".brand-social",
        ".brand-contact-btn"
    ].join(", ");

    const revealElements = $$(revealSelectors);

    if(!revealElements.length) return;

    revealElements.forEach((element, index) => {
        element.classList.add("premium-reveal");
        element.dataset.premiumDelay = String((index % 5) + 1);
    });

    if(prefersReducedMotion() || !("IntersectionObserver" in window)){
        revealElements.forEach((element) => element.classList.add("visible"));
        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if(entry.isIntersecting){
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold:0.16, rootMargin:"0px 0px -8% 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));

}

function initPremiumPhotoEffects(){

    const photoSections = $$(".photo-section");

    if(!photoSections.length) return;

    if("IntersectionObserver" in window){
        const photoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if(entry.isIntersecting){
                        entry.target.classList.add("in-view");
                    }
                });
            },
            { threshold:0.28 }
        );

        photoSections.forEach((section) => photoObserver.observe(section));
    }else{
        photoSections.forEach((section) => section.classList.add("in-view"));
    }

    if(prefersReducedMotion()) return;

    let ticking = false;

    const updatePhotos = () => {
        const viewportHeight = window.innerHeight;

        photoSections.forEach((section) => {
            const image = section.querySelector("img");
            if(!image) return;

            const rect = section.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const distanceFromCenter = viewportHeight / 2 - center;
            const photoMovement = clamp(distanceFromCenter * 0.045, -28, 28);
            const sectionMovement = clamp(distanceFromCenter * -0.012, -7, 7);
            const scale = 1.04 + Math.abs(photoMovement) / 2400;

            image.style.setProperty("--photo-parallax", `${photoMovement}px`);
            image.style.setProperty("--photo-motion-scale", scale.toFixed(4));
            section.style.setProperty("--section-parallax", `${sectionMovement}px`);
        });

        ticking = false;
    };

    const requestUpdate = () => {
        if(!ticking){
            window.requestAnimationFrame(updatePhotos);
            ticking = true;
        }
    };

    window.addEventListener("scroll", requestUpdate, { passive:true });
    window.addEventListener("resize", requestUpdate);

    updatePhotos();

}

function initPremiumCardTilt(){

    if(prefersReducedMotion() || !window.matchMedia("(hover:hover)").matches) return;

    const tiltCards = $$(".family-card, .event-card, .count-box, .timeline-content");

    tiltCards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            const rotateX = (0.5 - y) * 5;
            const rotateY = (x - 0.5) * 5;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });
    });

}

function initPremiumButtonRipples(){

    if(prefersReducedMotion()) return;

    const buttons = $$(".primary-btn, .secondary-btn, .rsvp-btn, .brand-contact-btn, .music-btn-float");

    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const ripple = document.createElement("span");
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            ripple.className = "button-ripple";
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            button.appendChild(ripple);

            window.setTimeout(() => ripple.remove(), 760);
        });
    });

}

// =====================================
// MÚSICA
// =====================================

function initMusic(){

    const music = $("#bgMusic");
    const playBtn = $("#playBtn");

    if(!music || !playBtn) return;

    let isPlaying = false;

    const setButtonState = () => {
        playBtn.innerHTML = isPlaying
            ? '<i class="fa-solid fa-pause"></i>'
            : '<i class="fa-solid fa-music"></i>';

        playBtn.setAttribute(
            "aria-label",
            isPlaying ? "Pausar música" : "Reproducir música"
        );

        playBtn.classList.toggle("is-playing", isPlaying);
    };

    const playMusic = async () => {
        try{
            await music.play();
            isPlaying = true;
            setButtonState();
        }catch(error){
            isPlaying = false;
            setButtonState();
            console.warn(
                "El navegador bloqueó la reproducción automática o no existe musica.mp3.",
                error
            );
        }
    };

    const pauseMusic = () => {
        music.pause();
        isPlaying = false;
        setButtonState();
    };

    playBtn.addEventListener("click", () => {
        if(isPlaying){
            pauseMusic();
        }else{
            playMusic();
        }
    });

    setButtonState();

}

// =====================================
// FADE IN
// =====================================

function initFadeIn(){

    const fadeElements = $$(".fade-in");

    if(!fadeElements.length) return;

    if(!("IntersectionObserver" in window)){
        fadeElements.forEach((element) => element.classList.add("visible"));
        return;
    }

    const fadeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if(entry.isIntersecting){
                    entry.target.classList.add("visible");
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold:0.15 }
    );

    fadeElements.forEach((element) => fadeObserver.observe(element));

}

// =====================================
// CUENTA REGRESIVA
// =====================================

function initCountdown(){

    const daysEl = $("#days");
    const hoursEl = $("#hours");
    const minutesEl = $("#minutes");
    const secondsEl = $("#seconds");

    if(!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const eventDate = new Date(WEDDING_CONFIG.eventDate).getTime();

    const setCountdownValue = (element, value) => {
        if(!element) return;

        if(element.textContent !== value){
            element.textContent = value;
            element.parentElement.classList.remove("is-ticking");
            void element.parentElement.offsetWidth;
            element.parentElement.classList.add("is-ticking");
        }
    };

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if(distance <= 0){
            setCountdownValue(daysEl, "00");
            setCountdownValue(hoursEl, "00");
            setCountdownValue(minutesEl, "00");
            setCountdownValue(secondsEl, "00");
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdownValue(daysEl, String(days).padStart(2, "0"));
        setCountdownValue(hoursEl, String(hours).padStart(2, "0"));
        setCountdownValue(minutesEl, String(minutes).padStart(2, "0"));
        setCountdownValue(secondsEl, String(seconds).padStart(2, "0"));
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);

}

// =====================================
// TIMELINE
// =====================================

function initTimeline(){

    const timelineSection = $("#timelineSection");
    const timelineProgress = $("#timelineProgress");
    const timelineItems = $$(".timeline-item");

    if(!timelineSection || !timelineProgress || !timelineItems.length) return;

    let ticking = false;

    const updateTimeline = () => {
        const sectionRect = timelineSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const progressStart = windowHeight * 0.78;
        const progressEnd = sectionRect.height * 0.92;
        const rawProgress = ((progressStart - sectionRect.top) / progressEnd) * 100;
        const progress = clamp(rawProgress, 0, 100);

        timelineProgress.style.height = `${progress}%`;

        timelineItems.forEach((item) => {
            const itemRect = item.getBoundingClientRect();

            if(itemRect.top < windowHeight * 0.78){
                item.classList.add("active");
            }else{
                item.classList.remove("active");
            }
        });

        ticking = false;
    };

    const requestUpdate = () => {
        if(!ticking){
            window.requestAnimationFrame(updateTimeline);
            ticking = true;
        }
    };

    window.addEventListener("scroll", requestUpdate, { passive:true });
    window.addEventListener("resize", requestUpdate);

    updateTimeline();

}

// =====================================
// FALLBACK PARA FOTOS
// =====================================

function initPhotoFallbacks(){

    const photoSections = $$(".photo-section");

    if(!photoSections.length) return;

    photoSections.forEach((section) => {
        const image = section.querySelector("img");

        if(!image){
            section.classList.add("photo-fallback");
            return;
        }

        const handleError = () => {
            section.classList.add("photo-fallback");
            image.remove();
        };

        const handleLoad = () => {
            section.classList.add("photo-loaded");
        };

        image.addEventListener("error", handleError);
        image.addEventListener("load", handleLoad);

        if(image.complete){
            if(image.naturalWidth === 0){
                handleError();
            }else{
                handleLoad();
            }
        }
    });

}

// =====================================
// RSVP WHATSAPP
// =====================================

function initRSVP(){

    const rsvpBtn = $("#rsvpBtn");

    if(!rsvpBtn) return;

    const phone = WEDDING_CONFIG.rsvpPhone.trim();
    const message = encodeURIComponent(WEDDING_CONFIG.rsvpMessage);

    const hasValidPhone =
        phone &&
        !phone.includes("X") &&
        phone.replace(/\D/g, "").length >= 10;

    if(!hasValidPhone){
        rsvpBtn.classList.add("is-disabled");
        rsvpBtn.removeAttribute("target");

        rsvpBtn.addEventListener("click", (event) => {
            event.preventDefault();
            alert("Demo: en la invitación final este botón abre WhatsApp con el número del cliente.");
        });

        return;
    }

    rsvpBtn.href = `https://wa.me/${phone}?text=${message}`;

}

// =====================================
// LINKS DESACTIVADOS
// =====================================

function initDisabledLinks(){

    const disabledLinks = $$(".disabled-link");

    disabledLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const message =
                link.dataset.disabledMessage ||
                "Este enlace está pendiente de configuración.";

            alert(message);
        });
    });

}

// =====================================
// INTERACCIONES DE BOTONES
// =====================================

function initButtonInteractions(){

    const buttons = $$(
        ".primary-btn, .secondary-btn, .rsvp-btn, .brand-contact-btn, .music-btn-float"
    );

    buttons.forEach((button) => {
        button.addEventListener("pointerdown", () => {
            button.style.transform = "scale(.97)";
        });

        button.addEventListener("pointerup", () => {
            button.style.transform = "";
        });

        button.addEventListener("pointerleave", () => {
            button.style.transform = "";
        });
    });

}