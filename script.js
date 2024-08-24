'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// BTN SCROLL SEC1
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // old way
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // new way
  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matchin strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// TABBED COMPONENT
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;
  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // Active tab
  clicked.classList.add('operations__tab--active');
  //  Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// MENU FADE ANIMATION
const animation = function (e, opac) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', animation.bind(0.5));

nav.addEventListener('mouseout', animation.bind(1));

// STICKY NAVIGATION
// const sec1coords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > sec1coords.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });

// STICKY NAVIGATION: The Intersection Observer API
// const obsCallback = function (entires, observe) {
//   entires.forEach(e => console.log(e));
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entires) {
  const [entry] = entires;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObs = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObs.observe(header);

// REVEALING ELEMENTS ON SCROLL
const allSections = document.querySelectorAll('.section');
const revealSec = function (entires, observer) {
  const [entry] = entires;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObs = new IntersectionObserver(revealSec, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (sec) {
  sectionObs.observe(sec);
  sec.classList.add('section--hidden');
});

// LAZY IMG LOADING
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entires, observer) {
  const [entry] = entires;
  if (!entry.isIntersecting) return;
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObs = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.8,
  // rootMargin: '200px',
});
imgTargets.forEach(im => imgObs.observe(im));

//BUILDING THE SLIDER COMPONENT
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContanier = document.querySelector('.dots');

let currSlide = 0;
const maxSlide = slides.length - 1;

const creatDots = function () {
  slides.forEach(function (_, i) {
    dotContanier.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
creatDots();

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(d => d.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activateDot(0);

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};
goToSlide(0);

// next slide

const nextSlide = function () {
  if (maxSlide === currSlide) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
};

btnRight.addEventListener('click', nextSlide);

// previous slide
const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
};
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  else prevSlide();
});
// dots
dotContanier.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const sld = e.target.dataset.slide;
    goToSlide(sld);
    activateDot(sld);
  }
});
