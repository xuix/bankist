'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//for (let i = 0; i < btnsOpenModal.length; i++)
//  btnsOpenModal[i].addEventListener('click', openModal);

// btnsOpenModal.forEach(btnOpenModal =>
//   btnOpenModal.addEventListener('click', openModal)
// );

// btnCloseModal.addEventListener('click', closeModal);
// overlay.addEventListener('click', closeModal);

// document.addEventListener('keydown', function (e) {
//   if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
//     closeModal();
//   }
// });

//<<<<<<<<<<<<< END OF MODAL >>>>>>>>>>>>>>>>>>
//button scrolling

buttonScrollTo.addEventListener('click', e => {
  //console.log('=click');
  //const s1coords = section1.getBoundingClientRect();
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});
// Page navigation
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', e => {
//     e.preventDefault();
//     console.log('click', e.target);
//     const id = el.getAttribute('href');
//     console.log('id=', id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
//Add event listenter to common parent element
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  //determine what element originated the event
  if (e.target.classList.contains('nav__link')) {
    //  console.log('=link');
    //  console.log('click', e.target);
    const id = e.target.getAttribute('href');
    console.log('id=', id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//TABBED COMPONENNT

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  // if click on container instead of tab, there is no parent operations_tab, so just return
  // it is called a guard clause
  if (!clicked) return;
  // console.log('clicked=', clicked);
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  //activate the content area
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade animantion

// using the scroll - don't use as inefficient
// const handleMouseHover = (e, opacity) => {
//   console.log('opacity=', opacity);
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = opacity;
//     });
//     logo.style.opacity = opacity;
//   }
// };

// nav.addEventListener('mouseover', e => handleMouseHover(e, 0.5));
// nav.addEventListener('mouseout', e => handleMouseHover(e, 1));

// //sticky navigation
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', () => {
//   //alert('sticky');

//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

//obeserver pattern

const stickynav = entries => {
  // in our case there is only 1 entry. this is the equivalent of entries[0]
  const [entry] = entries;
  entry.isIntersecting
    ? nav.classList.remove('sticky')
    : nav.classList.add('sticky');
};

const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(stickynav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // console.log('entry.target=', entry.target);
  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});
//Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImage = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //replace the src attribute with data-src
  //dataset = data-srb
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
    imageObserver.unobserve(entry.target);
  });
};

const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(image => {
  imageObserver.observe(image);
});

// SLIDER
const slider = () => {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  console.log('slides=', slides);
  const maxSlides = slides.length;
  let currentSlide = maxSlides;
  const dotContainer = document.querySelector('.dots');
  // slider.style.transform = 'scale(0.3)';
  // slider.style.overflow = 'visible';

  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = slide => {
    console.log('activateDot=', activateDot);
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
      const sslide = +slide - 1;

      console.log('=!!=', sslide, '-', document.querySelector(`.dots__dot`));
      document
        .querySelector(`.dots__dot[data-slide="${sslide}"]`)
        .classList.add('dots__dot--active');
    });
  };

  const gotoSlide = slide => {
    console.log('slide=', slide);
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide + 1) * 100}%)`;
    });
  };

  const nextSlide = () => {
    currentSlide--;
    if (currentSlide < 1) currentSlide = maxSlides;
    gotoSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = () => {
    currentSlide++;
    if (currentSlide > maxSlides) currentSlide = 1;
    gotoSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = () => {
    gotoSlide(maxSlides);
    createDots();
    activateDot(maxSlides);
  };

  init();
  //event handlers
  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide();

    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      const sslide = +slide + 1;
      gotoSlide(sslide);
      console.log('sslide=', sslide);
      activateDot(sslide);
    }
  });
};
slider();
