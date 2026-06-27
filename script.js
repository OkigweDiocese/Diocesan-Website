/**
 * ================================================================
 * CATHOLIC DIOCESE OF OKIGWE — JAVASCRIPT
 * script.js
 *
 * Features:
 *  1. Mobile Navbar Toggle
 *  2. Sticky Header Shadow on Scroll
 *  3. Active Navigation Link Highlighting (Scroll Spy)
 *  4. Smooth Scrolling
 *  5. Scroll Reveal Animations (IntersectionObserver)
 *  6. Statistics Counter Animation
 *  7. Contact Form Validation & Feedback
 *  8. Back to Top Button
 *  9. Footer Year Update
 * ================================================================
 */

/* ============================================================
   Initialise everything once the DOM is fully loaded
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initActiveNavLink();
  initScrollSpy();
  initSmoothScroll();
  initRevealAnimations();
  initStatCounters();
  initContactForm();
  initBackToTop();
  initFooterYear();
});

/* ============================================================
   1. MOBILE NAVBAR TOGGLE
   ============================================================ */
function initNavbar() {
  const hamburger = document.getElementById("hamburger-btn");
  const navLinks = document.getElementById("navbar-links");
  const header = document.getElementById("site-header");

  if (!hamburger || !navLinks) return;

  /**
   * Toggle the mobile navigation menu open/closed.
   */
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("is-open");
    navLinks.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  /**
   * Close the mobile menu when a nav link is clicked
   * (smooth scroll handles the actual scrolling).
   */
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("is-open");
      navLinks.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  /**
   * Close the menu when clicking outside of the navbar.
   */
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) {
      hamburger.classList.remove("is-open");
      navLinks.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });

  /**
   * Add shadow class to header when page is scrolled.
   */
  const handleHeaderScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Run once on load in case page is already scrolled
}

/* ============================================================
   2. ACTIVE NAVIGATION LINK (CURRENT PAGE)
   ============================================================ */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll(".navbar__links .nav-link");
  if (!navLinks.length) return;

  const currentPage = getNavPageName(window.location.pathname);

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    let linkPage;
    try {
      linkPage = getNavPageName(new URL(href, window.location.href).pathname);
    } catch {
      return;
    }

    link.classList.toggle("active", linkPage === currentPage);
  });
}

function getNavPageName(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  const file = parts[parts.length - 1] || "index.html";
  if (!file.includes(".")) return "index.html";
  return file.toLowerCase();
}

/* ============================================================
   3. ACTIVE NAVIGATION LINK (SCROLL SPY)
   ============================================================ */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  const navHeight =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--navbar-height",
      ),
    ) || 80;

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.dataset.section === id);
          });
        }
      });
    },
    {
      // Trigger when section enters the top 25% of the viewport
      rootMargin: `-${navHeight}px 0px -70% 0px`,
      threshold: 0,
    },
  );

  sections.forEach((section) => observer.observe(section));
}

/* ============================================================
   4. SMOOTH SCROLLING
   ============================================================ */
function initSmoothScroll() {
  const navHeight =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--navbar-height",
      ),
    ) || 80;

  /**
   * Intercept all anchor clicks that point to an #id on this page
   * and scroll smoothly with navbar offset.
   */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const offsetTop =
        target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    });
  });
}

/* ============================================================
   5. SCROLL REVEAL ANIMATIONS
   ============================================================ */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right",
  );

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Stop observing after animation triggers (performance)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ============================================================
   6. STATISTICS COUNTER ANIMATION
   ============================================================ */
function initStatCounters() {
  const counters = document.querySelectorAll(".stat-card__number[data-target]");
  if (!counters.length) return;

  /**
   * Animates a number from 0 to its data-target value.
   * Uses requestAnimationFrame for smooth performance.
   */
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const duration = 2000; // ms
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic easing
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);

      // Format large numbers (e.g. 200000 → 200,000)
      el.textContent = value.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
        // Append "+" for large figures
        if (target >= 1000) {
          el.textContent = target.toLocaleString() + "+";
        }
      }
    };

    requestAnimationFrame(update);
  };

  /**
   * Trigger counter animation when stat cards scroll into view.
   */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* ============================================================
   7. CONTACT FORM VALIDATION & FEEDBACK
   ============================================================ */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("form-submit-btn");
  const feedback = document.getElementById("form-feedback");

  if (!form) return;

  /**
   * Validate a single field and show/clear error.
   * Returns true if valid, false otherwise.
   */
  const validateField = (input) => {
    const group = input.closest(".form-group");
    const error = group ? group.querySelector(".form-error") : null;

    let message = "";

    if (input.required && !input.value.trim()) {
      message = "This field is required.";
    } else if (input.type === "email" && input.value.trim()) {
      // Basic email format check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(input.value.trim())) {
        message = "Please enter a valid email address.";
      }
    }

    input.classList.toggle("is-invalid", !!message);
    if (error) error.textContent = message;

    return !message;
  };

  /**
   * Live validation — validate field when user leaves it.
   */
  form.querySelectorAll(".form-input").forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      // Clear error on typing if field was invalid
      if (input.classList.contains("is-invalid")) {
        validateField(input);
      }
    });
  });

  /**
   * Form submission handler.
   *
   * TODO: Replace the simulated submission below with a real
   * backend API call, e.g.:
   *
   *   fetch('/api/contact', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ name, email, subject, message }),
   *   })
   *   .then(res => res.json())
   *   .then(data => { ... })
   *   .catch(err => { ... });
   *
   * Or integrate with a service like Formspree, EmailJS, etc.
   */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validate all required fields
    const fields = form.querySelectorAll(".form-input");
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) return;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    // --- SIMULATED ASYNC SUBMISSION ---
    // Remove this simulation when connecting to a real backend.
    setTimeout(() => {
      showFormFeedback(
        "success",
        "✓ Your message has been sent. We will be in touch shortly.",
      );
      form.reset();
      // Remove validation states after reset
      form.querySelectorAll(".form-input").forEach((f) => {
        f.classList.remove("is-invalid");
      });
      form.querySelectorAll(".form-error").forEach((e) => {
        e.textContent = "";
      });
    }, 1600);

    // Reset button after "send"
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }, 1700);
  });

  /**
   * Display a success or error feedback message below the form.
   */
  function showFormFeedback(type, message) {
    if (!feedback) return;
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // Auto-hide after 6 seconds
    setTimeout(() => {
      feedback.className = "form-feedback";
      feedback.textContent = "";
    }, 6000);
  }
}

/* ============================================================
   8. BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  const SHOW_THRESHOLD = 400; // px from top before button appears

  /**
   * Show/hide the button based on scroll position.
   */
  const toggleVisibility = () => {
    btn.classList.toggle("is-visible", window.scrollY > SHOW_THRESHOLD);
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();

  /**
   * Scroll back to the top of the page.
   */
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ============================================================
   9. FOOTER YEAR — AUTO-UPDATE
   ============================================================ */
function initFooterYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
