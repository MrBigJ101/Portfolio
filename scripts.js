
const cursor = document.querySelector(".cursor");

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

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

const interactiveElements = document.querySelectorAll("a, .project, .service");

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

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const offset = (window.innerHeight / 2 - rect.top) * 0.025;
      visual.style.transform = `translateY(${offset}px)`;
    }
  });
});

const contactButton = document.querySelector(".email");

if (contactButton) {
  contactButton.addEventListener("mousemove", event => {
    const rect = contactButton.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    contactButton.style.transform =
      `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });

  contactButton.addEventListener("mouseleave", () => {
    contactButton.style.transform = "translate(0, 0)";
  });
}

const year = new Date().getFullYear();
const footerYear = document.querySelector(".footer-middle span");

if (footerYear) {
  footerYear.textContent = `© ${year} Barsam Jahanvash`;
}
