
const burgerBtn = document.querySelector(".burger-btn");
const burgerMenu = document.getElementById("burgerMenu");
const closeBtn = document.querySelector(".nav-close-btn");
const scrollBtn = document.getElementById("scrollBtn");
const scrollBtnMob = document.getElementById("scrollBtnMob");

// Відкриття меню
burgerBtn.addEventListener("click", toggleBurgerMenu);

// Закриття меню
closeBtn.addEventListener("click", closeMenu);

// Закриття по Escape
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeMenu();
});

// Закриття при кліку поза меню
document.addEventListener("click", e => {
  if (!burgerMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
    closeMenu();
  }
});

// Функція відкриття/закриття меню
function toggleBurgerMenu() {
  burgerMenu.classList.toggle("active");
  burgerMenu.classList.toggle("hidden");
  document.body.classList.toggle("lock-scroll");
}

// Функція закриття меню
function closeMenu() {
  burgerMenu.classList.remove("active");
  burgerMenu.classList.add("hidden");
  document.body.classList.remove("lock-scroll");
}

// Плавний скрол до секції
scrollBtn.addEventListener("click", () => {
  const section = document.getElementById("furniture");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
    closeMenu();
  }
});
scrollBtnMob.addEventListener("click", () => {
  const section = document.getElementById("furniture");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
    closeMenu();
  }
});

// Плавний скрол для всіх посилань
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      closeMenu();
    }
  });
});

burgerBtn.addEventListener("click", () => {
  burgerMenu.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  burgerMenu.classList.add("hidden");
});
