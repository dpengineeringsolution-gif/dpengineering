document.addEventListener("DOMContentLoaded", () => {
    // Loader
    const loader = document.getElementById("loader");
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
            }, 500);
        }, 800);
    }

    // Header Scroll Effect
    const header = document.getElementById("navbar");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("header-scrolled");
                header.classList.remove("py-4");
            } else {
                header.classList.remove("header-scrolled");
                header.classList.add("py-4");
            }
        });
    }

    // Mobile Menu Toggle
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-up, .fade-in");
    fadeElements.forEach(el => observer.observe(el));

    // FAQ Toggle
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const button = item.querySelector("button");
        const icon = item.querySelector(".faq-icon");
        const content = item.querySelector(".faq-content");

        if (button && icon && content) {
            button.addEventListener("click", () => {
                const isOpen = content.style.maxHeight;

                // Close all other FAQs
                document.querySelectorAll(".faq-content").forEach(el => {
                    if (el !== content) el.style.maxHeight = null;
                });
                document.querySelectorAll(".faq-icon").forEach(el => {
                    if (el !== icon) el.style.transform = "rotate(0deg)";
                });

                if (!isOpen) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    icon.style.transform = "rotate(45deg)";
                } else {
                    content.style.maxHeight = null;
                    icon.style.transform = "rotate(0deg)";
                }
            });
        }
    });
});
