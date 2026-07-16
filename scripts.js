document.addEventListener("DOMContentLoaded", () => {
    // =============================================
    // HAMBURGER MENU
    // =============================================
    const menuToggle = document.querySelector(".menu-toggle");
    const menuLinks = document.querySelector(".links");
    const navAnchors = document.querySelectorAll(".links a");

    if (menuToggle && menuLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = menuLinks.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", isOpen);
        });

        navAnchors.forEach((link) => {
            link.addEventListener("click", () => {
                menuLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", (e) => {
            if (!menuToggle.contains(e.target) && !menuLinks.contains(e.target)) {
                menuLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && menuLinks.classList.contains("open")) {
                menuLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.focus();
            }
        });
    }

    // =============================================
    // ACTIVE NAV LINK ON SCROLL
    // =============================================
    const sections = document.querySelectorAll("main section[id]");

    function updateActiveLink() {
        const scrollY = window.scrollY + 100;

        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollY >= top && scrollY < top + height) {
                navAnchors.forEach((a) => a.classList.remove("active"));
                const activeLink = document.querySelector(`.links a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();

    // =============================================
    // SCROLL TO TOP BUTTON
    // =============================================
    const scrollTopBtn = document.querySelector(".scroll-top");

    if (scrollTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add("visible");
            } else {
                scrollTopBtn.classList.remove("visible");
            }
        }, { passive: true });

        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // =============================================
    // FORMULÁRIO DE CONTATO
    // =============================================
    const contactForm = document.querySelector("#form-contato");
    const formStatus = document.querySelector(".form-status");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.querySelector("#form-nome");
            const email = document.querySelector("#form-email");
            const message = document.querySelector("#form-mensagem");
            const submitBtn = contactForm.querySelector(".btn-submit");

            formStatus.textContent = "";
            formStatus.className = "form-status";

            const nameVal = name.value.trim();
            const emailVal = email.value.trim();
            const messageVal = message.value.trim();

            if (!nameVal || !emailVal || !messageVal) {
                formStatus.textContent = "Por favor, preencha todos os campos.";
                formStatus.classList.add("error");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailVal)) {
                formStatus.textContent = "Por favor, insira um email válido.";
                formStatus.classList.add("error");
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = "Enviando...";

            setTimeout(() => {
                formStatus.textContent = `Obrigado, ${nameVal}! Sua mensagem foi enviada. Responderemos em breve.`;
                formStatus.classList.add("success");
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = "Enviar mensagem";
            }, 1200);
        });
    }

    // =============================================
    // GALERIA — MODAL COM NAVEGAÇÃO
    // =============================================
    const galleryImages = document.querySelectorAll("#galeria .gallery img");
    let currentModalIndex = 0;

    function openModal(index) {
        currentModalIndex = index;
        const img = galleryImages[index];

        const modal = document.createElement("div");
        modal.classList.add("image-modal");
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-label", "Visualizar imagem ampliada");
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-nav modal-prev" aria-label="Imagem anterior">&#8249;</button>
                <img src="${img.src}" alt="${img.alt}">
                <button class="modal-nav modal-next" aria-label="Próxima imagem">&#8250;</button>
                <button class="close-modal" aria-label="Fechar visualização">&times;</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = "hidden";

        modal.querySelector(".close-modal").focus();

        modal.querySelector(".close-modal").addEventListener("click", closeModal);
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });

        modal.querySelector(".modal-prev").addEventListener("click", (e) => {
            e.stopPropagation();
            closeModal();
            const prevIndex = (currentModalIndex - 1 + galleryImages.length) % galleryImages.length;
            openModal(prevIndex);
        });

        modal.querySelector(".modal-next").addEventListener("click", (e) => {
            e.stopPropagation();
            closeModal();
            const nextIndex = (currentModalIndex + 1) % galleryImages.length;
            openModal(nextIndex);
        });

        function handleKeydown(e) {
            if (e.key === "Escape") {
                closeModal();
            } else if (e.key === "ArrowLeft") {
                closeModal();
                const prevIndex = (currentModalIndex - 1 + galleryImages.length) % galleryImages.length;
                openModal(prevIndex);
            } else if (e.key === "ArrowRight") {
                closeModal();
                const nextIndex = (currentModalIndex + 1) % galleryImages.length;
                openModal(nextIndex);
            }
        }

        document.addEventListener("keydown", handleKeydown);

        function closeModal() {
            document.removeEventListener("keydown", handleKeydown);
            modal.remove();
            document.body.style.overflow = "";
            galleryImages[currentModalIndex].focus();
        }
    }

    galleryImages.forEach((img, index) => {
        img.addEventListener("click", () => openModal(index));
        img.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModal(index);
            }
        });
    });
});
