const cursor = document.querySelector(".cursor");
const languageSwitch = document.querySelector("#languageSwitch");

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

const translations = {};

window.addEventListener("mousemove", event => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

function animateCursor() {
  currentX += (mouseX - currentX) * 0.15;
  currentY += (mouseY - currentY) * 0.15;

  cursor.style.left = `${currentX}px`;
  cursor.style.top = `${currentY}px`;

  requestAnimationFrame(animateCursor);
}

animateCursor();

function getTranslation(object, path) {
  return path.split(".").reduce((current, key) => {
    return current?.[key];
  }, object);
}

async function loadLanguage(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`);

    if (!response.ok) {
      throw new Error(`Language file not found: ${lang}`);
    }

    translations[lang] = await response.json();

    const translation = translations[lang];

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";

    document.body.classList.remove("lang-fa", "lang-en");
    document.body.classList.add(`lang-${lang}`);

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      const value = getTranslation(translation, key);

      if (value !== undefined) {
        element.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(element => {
      const key = element.dataset.i18nAlt;
      const value = getTranslation(translation, key);

      if (value !== undefined) {
        element.alt = value;
      }
    });

    const description = getTranslation(translation, "meta.description");
    const title = getTranslation(translation, "meta.title");

    if (description) {
      document.querySelector('meta[name="description"]').content = description;
    }

    if (title) {
      document.title = title;
    }

    const year = new Date().getFullYear();
    const footerYear = document.querySelector("#footerCopyright");
    const copyrightTemplate = getTranslation(translation, "footer.copyright");

    if (footerYear && copyrightTemplate) {
      footerYear.textContent = copyrightTemplate.replace("{year}", year);
    }

    localStorage.setItem("preferredLanguage", lang);

  } catch (error) {
    console.error(error);
  }
}

languageSwitch.addEventListener("click", () => {
  const currentLanguage = document.documentElement.lang;
  const nextLanguage = currentLanguage === "fa" ? "en" : "fa";

  loadLanguage(nextLanguage);
});

const interactiveElements = document.querySelectorAll(
  "a, .project, .service, .language-switch"
);

interactiveElements.forEach(element => {
  element.addEventListener("mouseenter", () => {
    cursor.style.width = "35px";
    cursor.style.height = "35px";
  });

  element.addEventListener("mouseleave", () => {
    cursor.style.width = "14px";
    cursor.style.height = "14px";
  });
});

const revealElements = document.querySelectorAll(
  ".project, .service, .about-content, .big-text, .contact h2"
);

revealElements.forEach(element => {
  element.classList.add("reveal");
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.12
  }
);

revealElements.forEach(element => {
  observer.observe(element);
});

window.addEventListener("scroll", () => {
  document.querySelectorAll(".project-visual").forEach(visual => {
    const rect = visual.getBoundingClientRect();

    if (
      rect.top < window.innerHeight &&
      rect.bottom > 0
    ) {
      const offset =
        (window.innerHeight / 2 - rect.top) * 0.025;

      visual.style.transform = `translateY(${offset}px)`;
    }
  });
});

const contactButton = document.querySelector(".email");

if (contactButton) {
  contactButton.addEventListener("mousemove", event => {
    const rect = contactButton.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left -
      rect.width / 2;

    const y =
      event.clientY -
      rect.top -
      rect.height / 2;

    contactButton.style.transform =
      `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });

  contactButton.addEventListener("mouseleave", () => {
    contactButton.style.transform = "translate(0, 0)";
  });
}

const savedLanguage = localStorage.getItem("preferredLanguage");

loadLanguage(savedLanguage || "en");