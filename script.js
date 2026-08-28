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
 *  10. Dark Mode Toggle
 *  11. Navbar Logo Rotation
 *  12. Upcoming Events (date-filtered renderer)
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
  initThemeToggle();
  initNavbarLogoRotation();
  initUpcomingEvents();
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
   * Close the mobile menu (and any open dropdowns).
   */
  function closeMobileMenu() {
    hamburger.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    document
      .querySelectorAll(".dropdown")
      .forEach((d) => d.classList.remove("is-open"));
  }

  /**
   * Close the mobile menu when a nav link is clicked.
   * Skip the dropdown trigger li — that should toggle the submenu, not close the menu.
   */
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (link.classList.contains("dropdown")) return;
      closeMobileMenu();
    });
  });

  /**
   * Archives dropdown: toggle open/closed on click/tap.
   * stopPropagation prevents the event reaching the li close-handler above.
   */
  document.querySelectorAll(".dropbtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dropdown = btn.closest(".dropdown");
      const isOpen = dropdown.classList.toggle("is-open");
      // Close any other open dropdowns
      document.querySelectorAll(".dropdown").forEach((d) => {
        if (d !== dropdown) d.classList.remove("is-open");
      });
    });
  });

  /**
   * Close the menu when clicking outside of the navbar.
   */
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) {
      closeMobileMenu();
    }
    // Close desktop dropdown when clicking outside it
    if (!e.target.closest(".dropdown")) {
      document
        .querySelectorAll(".dropdown")
        .forEach((d) => d.classList.remove("is-open"));
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
  form.querySelectorAll(".form-input, .form-select").forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      // Clear error on typing if field was invalid
      if (input.classList.contains("is-invalid")) {
        validateField(input);
      }
    });
    input.addEventListener("change", () => {
      if (input.classList.contains("is-invalid")) {
        validateField(input);
      }
    });
  });

  /**
   * Form submission handler — submits to Netlify Forms via AJAX so the
   * page doesn't reload. Netlify parses the static HTML for the
   * `data-netlify="true"` form at deploy time and stores/emails
   * submissions; no backend code is needed here.
   */
  const encodeFormData = (data) =>
    Object.keys(data)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`,
      )
      .join("&");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validate all required fields
    const fields = form.querySelectorAll(".form-input, .form-select");
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });

    // Consent checkbox (contact page form) has no .form-input/.form-select
    // class, so it needs its own required check.
    const consent = form.querySelector("#consent");
    if (consent && consent.required && !consent.checked) {
      isValid = false;
      consent.focus();
    }

    if (!isValid) return;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    const formData = Object.fromEntries(new FormData(form).entries());

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeFormData(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Form submission failed (${res.status})`);
        showFormFeedback(
          "success",
          "✓ Your message has been sent. We will be in touch shortly.",
        );
        form.reset();
        form.querySelectorAll(".form-input").forEach((f) => {
          f.classList.remove("is-invalid");
        });
        form.querySelectorAll(".form-error").forEach((e) => {
          e.textContent = "";
        });
      })
      .catch(() => {
        showFormFeedback(
          "error",
          "✗ Something went wrong sending your message. Please try again or email us directly.",
        );
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      });
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

/* ============================================================
   10. DARK MODE TOGGLE
   The <html data-theme="..."> attribute is what style.css keys
   off of. An inline script in each page's <head> already sets it
   before first paint (to avoid a light/dark flash); this just
   wires up the button and keeps localStorage in sync.
   ============================================================ */
function initThemeToggle() {
  const btn = document.getElementById("theme-toggle-btn");
  if (!btn) return;

  const root = document.documentElement;

  const reflectTheme = (theme) => {
    btn.setAttribute("aria-pressed", String(theme === "dark"));
    btn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
    );
  };

  reflectTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    reflectTheme(next);
  });
}

/* ============================================================
   11. NAVBAR LOGO ROTATION
   Picks one image at random, on every page load, for the small
   logo in the top-left of the navbar.

   To add more diocesan logo/crest images to the rotation: drop the
   image files into the images/ folder and list their filenames
   below (no path — the correct "images/" or "../images/" prefix is
   worked out automatically from the current logo's src). Only one
   file is listed by default, so nothing changes until more are
   added here.
   ============================================================ */
function initNavbarLogoRotation() {
  const LOGO_FILES = ["logo-transperent.png"];

  if (LOGO_FILES.length <= 1) return;

  const logoImg = document.querySelector(".navbar__brand .navbar__logo img");
  if (!logoImg) return;

  const currentSrc = logoImg.getAttribute("src");
  const basePath = currentSrc.slice(0, currentSrc.lastIndexOf("/") + 1);
  const pick = LOGO_FILES[Math.floor(Math.random() * LOGO_FILES.length)];

  logoImg.src = basePath + pick;
}

/* ============================================================
   12. UPCOMING EVENTS
   Renders the "Upcoming Events" section on the homepage from the
   EVENTS list below. An event automatically stops showing once its
   date has passed — no manual removal needed.

   To add a new event: add an entry to the EVENTS array with a date
   in "YYYY-MM-DD" format. To remove one, delete its entry (or just
   let its date pass). Only the 5 soonest, not-yet-passed events are
   shown, soonest first.
   ============================================================ */
const EVENTS_FALLBACK = [
  {
    date: "2026-08-20",
    time: "10:00 AM",
    event:
      "One Year Anniversary Mass of the Death of Frs. Vincent Ogu and Felix Ikpatusi",
    location: "St. Mary's Pro-Cathedral, Okigwe",
    title: "Death Anniversary",
  },
  {
    date: "2026-08-15",
    time: "10:00 AM",
    event: "Family Day Celebration",
    location: "Immaculate Conception Cathedral Podium, Okigwe",
    title: "Human Life Commission",
  },
  {
    date: "2026-08-29",
    time: "10:00 AM",
    event: "Catechists' Day Ceremony",
    location: "St. Thomas Aquinas Seminary, Ihitte",
    title: "Catechists",
  },
  {
    date: "2026-09-18",
    time: "10:00 AM",
    event: "Okigwe Diocesan Priestly Ordination",
    location: "Immaculate Conception Cathedral, Okigwe",
    title: "Ordination",
  },
  {
    date: "2026-09-23",
    time: "10:00 AM",
    event: "Okigwe Diocesan Plenary Meeting",
    location: "Bishop Anthony Okezie Ilonu Memorial Retreat Center, Okigwe",
    title: "Priests' Plenary",
  },
  {
    date: "2026-10-15",
    time: "10:00 AM",
    event: "2nd Theological Conference for the Year, 2026",
    location: "Bishop Anthony Okezie Ilonu Memorial Retreat Center, Okigwe",
    title: "Theological Conference",
  },
  {
    date: "2026-10-03",
    time: "10:00 AM",
    event: "Holy Childhood Celebration",
    location: "Immaculate Conception Cathedral, Okigwe",
    title: "Holy Childhood",
  },
];

const MAX_EVENTS_SHOWN = 5;
const MAX_PAST_EVENTS_SHOWN = 10;
const EVENT_MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Parse an event's "YYYY-MM-DD" string as a local-time date so
 * comparisons aren't shifted by timezone offsets.
 */
function parseEventDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`);
}

function eventCardHtml(event, eventDate) {
  const fullDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `
    <article class="event-card">
      <div class="event-card__date" aria-hidden="true">
        <span class="event-card__date-month">${EVENT_MONTH_LABELS[eventDate.getMonth()]}</span>
        <span class="event-card__date-day">${eventDate.getDate()}</span>
      </div>
      <div class="event-card__body">
        <span class="event-card__category">${event.title}</span>
        <h3 class="event-card__title">${event.event}</h3>
        <div class="event-card__meta">
          <span class="event-card__meta-item">
            <time datetime="${event.date}">${fullDate}</time>${event.time ? ` · ${event.time}` : ""}
          </span>
          ${event.location ? `<span class="event-card__meta-item">📍 ${event.location}</span>` : ""}
        </div>
      </div>
    </article>
  `;
}

/* CURRENT_EVENTS starts as the offline fallback and is replaced with the
   real content/events.json list the moment cms.js fetches it — same
   fallback-then-overwrite pattern used for the priest roll on
   pages/priests.html. Kept in module scope so the "View Past Events"
   toggle always archives against whatever is currently live. */
let CURRENT_EVENTS = EVENTS_FALLBACK;

function initUpcomingEvents() {
  renderUpcomingEvents(CURRENT_EVENTS, "events-grid", "events-empty");
  renderSidebarEventList(
    CURRENT_EVENTS,
    "sidebar-events-list",
    "sidebar-events-empty",
  );
  initPastEventsToggle();

  document.addEventListener("cms:data:events", (e) => {
    const items =
      e.detail && Array.isArray(e.detail.items) ? e.detail.items : null;
    if (!items || !items.length) return;
    CURRENT_EVENTS = items;
    renderUpcomingEvents(CURRENT_EVENTS, "events-grid", "events-empty");
    renderSidebarEventList(
      CURRENT_EVENTS,
      "sidebar-events-list",
      "sidebar-events-empty",
    );
  });
}

/**
 * Renders the soonest MAX_EVENTS_SHOWN not-yet-passed events, soonest
 * first, into the grid/empty elements named by gridId/emptyId — reused
 * for both the homepage widget and the news page's sidebar widget.
 */
function renderUpcomingEvents(EVENTS, gridId, emptyId) {
  const grid = document.getElementById(gridId);
  const emptyMsg = document.getElementById(emptyId);
  if (!grid) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = EVENTS.filter((event) => parseEventDate(event.date) >= today)
    .sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date))
    .slice(0, MAX_EVENTS_SHOWN);

  if (!upcoming.length) {
    grid.hidden = true;
    if (emptyMsg) emptyMsg.hidden = false;
    return;
  }

  grid.hidden = false;
  if (emptyMsg) emptyMsg.hidden = true;

  grid.innerHTML = upcoming
    .map((event) => eventCardHtml(event, parseEventDate(event.date)))
    .join("");
}

/**
 * Compact variant of the upcoming-events list, using the ".event-item"
 * markup styled on pages/news.html's sidebar (a narrower layout than the
 * homepage's ".event-card" grid). MAX_SIDEBAR_EVENTS_SHOWN keeps it short
 * since it's a supporting widget, not the main content.
 */
const MAX_SIDEBAR_EVENTS_SHOWN = 6;
const SIDEBAR_MONTH_LABELS = EVENT_MONTH_LABELS;

function renderSidebarEventList(EVENTS, listId, emptyId) {
  const list = document.getElementById(listId);
  const emptyMsg = document.getElementById(emptyId);
  if (!list) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = EVENTS.filter((event) => parseEventDate(event.date) >= today)
    .sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date))
    .slice(0, MAX_SIDEBAR_EVENTS_SHOWN);

  if (!upcoming.length) {
    list.hidden = true;
    if (emptyMsg) emptyMsg.hidden = false;
    return;
  }

  list.hidden = false;
  if (emptyMsg) emptyMsg.hidden = true;

  list.innerHTML = upcoming
    .map((event) => {
      const eventDate = parseEventDate(event.date);
      return `
        <div class="event-item">
          <div class="event-item__date">
            <span class="event-item__date-day">${eventDate.getDate()}</span
            ><span class="event-item__date-mon">${SIDEBAR_MONTH_LABELS[eventDate.getMonth()]}</span>
          </div>
          <div class="event-item__info">
            <h4>${event.event}</h4>
            <p>${event.location || ""}${event.location && event.time ? " · " : ""}${event.time || ""}</p>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * "View Past Events" toggle on the homepage — events don't get deleted
 * once their date passes, they just drop out of the upcoming list above
 * and become available here, newest-first, on demand.
 */
function initPastEventsToggle() {
  const toggleBtn = document.getElementById("past-events-toggle");
  const pastWrap = document.getElementById("past-events-wrap");
  const pastGrid = document.getElementById("past-events-grid");
  const pastEmpty = document.getElementById("past-events-empty");
  if (!toggleBtn || !pastWrap || !pastGrid) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = !pastWrap.hidden;
    if (isOpen) {
      pastWrap.hidden = true;
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.textContent = "View Past Events";
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const past = CURRENT_EVENTS.filter(
      (event) => parseEventDate(event.date) < today,
    )
      .sort((a, b) => parseEventDate(b.date) - parseEventDate(a.date))
      .slice(0, MAX_PAST_EVENTS_SHOWN);

    if (!past.length) {
      pastGrid.hidden = true;
      if (pastEmpty) pastEmpty.hidden = false;
    } else {
      pastGrid.hidden = false;
      if (pastEmpty) pastEmpty.hidden = true;
      pastGrid.innerHTML = past
        .map((event) => eventCardHtml(event, parseEventDate(event.date)))
        .join("");
    }

    pastWrap.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
    toggleBtn.textContent = "Hide Past Events";
  });
}
