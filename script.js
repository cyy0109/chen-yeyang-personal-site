const PROJECT_LINKS = {
  qunxiang: "https://qunxiangmap-egfyjqp6.manus.space/",
};

document.querySelectorAll("[data-project-link]").forEach((link) => {
  const projectKey = link.dataset.projectLink;
  const projectUrl = PROJECT_LINKS[projectKey]?.trim();

  if (!projectUrl) return link.remove();

  link.href = projectUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.querySelector("span").textContent = "查看项目";

  const projectCard = link.closest("[data-project-card]");
  projectCard?.classList.add("has-project-link");
  projectCard?.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    window.open(projectUrl, "_blank", "noopener,noreferrer");
  });
});

const year = document.querySelector("#current-year");
if (year) year.textContent = new Date().getFullYear();

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");

const closeMenu = () => {
  if (!menuButton || !navLinks) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "打开导航菜单");
  navLinks.classList.remove("open");
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "打开导航菜单" : "关闭导航菜单");
  navLinks?.classList.toggle("open", !isOpen);
});

navLinks?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("click", (event) => {
  if (!navLinks?.classList.contains("open")) return;
  if (!navLinks.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
});

const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 18);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal:not(.is-visible)");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -48px" });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const sections = [...document.querySelectorAll("main section[id]")];
const navigationItems = [...document.querySelectorAll(".nav-links a[href^='#']")];

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navigationItems.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  }, { rootMargin: "-28% 0px -62%", threshold: [0, 0.2, 0.5] });
  sections.forEach((section) => sectionObserver.observe(section));
}
