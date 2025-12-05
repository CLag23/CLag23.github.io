// How It's Used page interactions | Author: CL
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".pill-tab");
    const panels = document.querySelectorAll(".usage-card");

    const setActivePanel = (id) => {
        panels.forEach((panel) => {
            const isMatch = panel.id === id;
            panel.dataset.show = isMatch ? "true" : "false";
            panel.setAttribute("aria-hidden", isMatch ? "false" : "true");
        });
        tabs.forEach((tab) => {
            const isMatch = tab.dataset.target === id;
            tab.dataset.state = isMatch ? "active" : "inactive";
            tab.setAttribute("aria-selected", isMatch ? "true" : "false");
        });
    };

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => setActivePanel(tab.dataset.target));
        tab.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActivePanel(tab.dataset.target);
            }
        });
    });

    const slides = document.querySelectorAll(".code-slide");
    const dots = document.querySelectorAll(".dot");
    const prev = document.querySelector('[data-dir="prev"]');
    const next = document.querySelector('[data-dir="next"]');
    let index = 0;

    const showSlide = (i) => {
        index = (i + slides.length) % slides.length;
        slides.forEach((slide, idx) => {
            const active = idx === index;
            slide.dataset.show = active ? "true" : "false";
            slide.setAttribute("aria-hidden", active ? "false" : "true");
        });
        dots.forEach((dot, idx) => {
            dot.dataset.state = idx === index ? "active" : "inactive";
        });
    };

    if (prev && next) {
        prev.addEventListener("click", () => showSlide(index - 1));
        next.addEventListener("click", () => showSlide(index + 1));
    }
    dots.forEach((dot) => dot.addEventListener("click", () => showSlide(Number(dot.dataset.index))));
});
