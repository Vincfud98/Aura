const body = document.body;
const header = document.getElementById("site-header");
const menuToggle = document.querySelector(".open__menu");
const menuClose = document.querySelector(".close__menu");
const navbar = document.querySelector(".navbar");
const filterToggle = document.getElementById("openFilterProjetos");
const filterPanel = document.getElementById("filterProjetos");
const bannerSlides = [...document.querySelectorAll(".kv-slide")];
const bannerPrev = document.querySelector(".swiper-banners-prev");
const bannerNext = document.querySelector(".swiper-banners-next");
const bannerPagination = document.getElementById("banner-pagination");
const aboutSlides = [...document.querySelectorAll(".kv-about-slide")];
const aboutCopies = [...document.querySelectorAll(".kv-about-copy")];
const aboutPrev = document.querySelector(".kv-about-prev");
const aboutNext = document.querySelector(".kv-about-next");
const aboutDots = document.getElementById("about-dots");
let bannerIndex = 0;
let aboutIndex = 0;
let bannerTimer;
let headerReadyToReveal = false;

document.querySelectorAll("a[href]").forEach((link) => {
  const href = link.getAttribute("href");
  if (href) {
    link.dataset.href = href;
  }
  link.removeAttribute("href");
  link.removeAttribute("target");
  link.removeAttribute("rel");
  link.setAttribute("aria-disabled", "true");
});

const setHeaderState = () => {
  const isScrolled = window.scrollY > 24;
  header.classList.toggle("scrolled", isScrolled);
  if (isScrolled) {
    header.classList.add("ui-hidden");
    header.classList.remove("ui-reveal");
    headerReadyToReveal = false;
    setFilterState(false);
  } else {
    header.classList.remove("ui-hidden", "ui-reveal");
    headerReadyToReveal = false;
  }
};

const setMenuState = (isOpen) => {
  header.classList.toggle("menu-open", isOpen);
  body.classList.toggle("menu-open", isOpen);
  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  }
  if (navbar) {
    navbar.setAttribute("aria-hidden", String(!isOpen));
  }
};

const setFilterState = (isOpen) => {
  if (!filterPanel || !filterToggle) {
    return;
  }

  filterPanel.classList.toggle("active", isOpen);
  filterToggle.classList.toggle("active", isOpen);
  filterToggle.setAttribute("aria-expanded", String(isOpen));
};

const renderBannerPagination = () => {
  if (!bannerPagination) {
    return;
  }

  bannerPagination.innerHTML = "";
  bannerSlides.forEach((slide, index) => {
    const bullet = document.createElement("button");
    bullet.type = "button";
    bullet.className = "swiper-pagination-bullet";
    bullet.setAttribute("aria-label", `Ir para ${slide.dataset.title}`);
    if (index === bannerIndex) {
      bullet.classList.add("is-active");
    }
    bullet.addEventListener("click", () => setBanner(index));
    bannerPagination.appendChild(bullet);
  });
};

const setBanner = (index) => {
  bannerSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });
  bannerIndex = index;
  renderBannerPagination();
};

const getRandomBannerIndex = (currentIndex) => {
  if (bannerSlides.length <= 1) {
    return currentIndex;
  }

  let nextIndex = currentIndex;
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * bannerSlides.length);
  }
  return nextIndex;
};

const nextBanner = () => {
  const nextIndex = getRandomBannerIndex(bannerIndex);
  setBanner(nextIndex);
};

const prevBanner = () => {
  const prevIndex = getRandomBannerIndex(bannerIndex);
  setBanner(prevIndex);
};

const startBannerAutoplay = () => {
  clearInterval(bannerTimer);
  bannerTimer = window.setInterval(nextBanner, 5000);
};

const renderAboutDots = () => {
  if (!aboutDots) {
    return;
  }

  aboutDots.innerHTML = "";
  aboutSlides.forEach((_, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = index + 1;
    if (index === aboutIndex) {
      item.classList.add("is-active");
    }
    button.addEventListener("click", () => setAbout(index));
    item.appendChild(button);
    aboutDots.appendChild(item);
  });
};

const setAbout = (index) => {
  aboutSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });
  aboutCopies.forEach((copy, copyIndex) => {
    copy.classList.toggle("is-active", copyIndex === index);
  });
  aboutIndex = index;
  renderAboutDots();
};

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.contains("menu-open");
    setMenuState(!isOpen);
  });
}

if (menuClose) {
  menuClose.addEventListener("click", () => setMenuState(false));
}

document.querySelectorAll(".navbar .menu a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

if (filterToggle) {
  filterToggle.addEventListener("click", () => {
    const isOpen = filterPanel.classList.contains("active");
    setFilterState(!isOpen);
  });
}

if (bannerPrev) {
  bannerPrev.addEventListener("click", () => {
    prevBanner();
    startBannerAutoplay();
  });
}

if (bannerNext) {
  bannerNext.addEventListener("click", () => {
    nextBanner();
    startBannerAutoplay();
  });
}

if (aboutPrev) {
  aboutPrev.addEventListener("click", () => {
    const prevIndex = (aboutIndex - 1 + aboutSlides.length) % aboutSlides.length;
    setAbout(prevIndex);
  });
}

if (aboutNext) {
  aboutNext.addEventListener("click", () => {
    const nextIndex = (aboutIndex + 1) % aboutSlides.length;
    setAbout(nextIndex);
  });
}

window.addEventListener("scroll", setHeaderState);
header.addEventListener("mouseleave", () => {
  if (header.classList.contains("scrolled")) {
    headerReadyToReveal = true;
    header.classList.remove("ui-reveal");
  }
});

header.addEventListener("mouseenter", () => {
  if (header.classList.contains("scrolled") && headerReadyToReveal) {
    header.classList.add("ui-reveal");
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
    setFilterState(false);
  }
});

setHeaderState();
setBanner(getRandomBannerIndex(-1));
setAbout(0);
startBannerAutoplay();
