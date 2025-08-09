import axios from 'axios';

import 'loaders.css/loaders.min.css';

import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import 'css-star-rating/css/star-rating.min.css';

// === DOM Elements ===
const feedbackContainer = document.querySelector('.feedback-list');
const loader = document.querySelector('.loader');
const leftButton = document.querySelector('.feedback-btn-left');
const rightButton = document.querySelector('.feedback-btn-right');
const navWrap = document.querySelector('.feedback-pagination-btn-wrap');

// === Global state ===
let swiper;
let eventsBound = false;

// === API ===
async function getFeedback() {
  const FEEDBACK_URL = 'https://furniture-store.b.goit.study/api/feedbacks';
  const PARAMS = new URLSearchParams({
    page: 1,
    limit: 10,
  });
  const res = await axios(`${FEEDBACK_URL}?${PARAMS}`);
  return res.data;
}

// === UI Feedback ===
function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

function onError(message) {
  iziToast.error({
    message: message,
    backgroundColor: '#ef4040',
    messageColor: '#fff',
    position: 'topRight',
  });
}

function updateNavButtons() {
  const isFirst = swiper.isBeginning;
  const isLast = swiper.isEnd;

  leftButton.disabled = isFirst;
  rightButton.disabled = isLast;
}

// === Create Star Rating ===


function createStarRating(rate) {
  const roundedRate = Math.round(rate * 2) / 2;
  const fullStars = Math.floor(roundedRate);
  const hasHalf = roundedRate % 1 !== 0;

  const starFilled = `
    <svg class="star-icon" id="star-filled" viewBox="0 0 34 32" >
            <title>star-filled</title>
            <path class="path-star-filled"
                  d="M16.941 25.621l10.179 6.144-2.701-11.579 8.993-7.791-11.842-1.005-4.628-10.92-4.628 10.92-11.842 1.005 8.993 7.791-2.701 11.579z" fill="#000000"/>
    </svg>
  `;
  const starHalf = `
    <svg viewBox="0 0 24 24" width="24" height="24">
  <defs>
    <clipPath id="left-half">
      <rect x="0" y="0" width="12" height="24" />
    </clipPath>
    <clipPath id="right-half">
      <rect x="12" y="0" width="12" height="24" />
    </clipPath>
  </defs>

  <!-- Ліва половина — заповнена -->
  <path
    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
       9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    fill="#000000"
    stroke="#000000"
    stroke-width="2"
    clip-path="url(#left-half)"
  />

  <!-- Права половина — тільки контур -->
  <path
    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
       9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    fill="none"
    stroke="#000000"
    stroke-width="2"
    clip-path="url(#right-half)"
  />
</svg>
  `;

  const starEmpty = `
    <svg viewBox="0 0 24 24" width="24" height="24">
  <path
    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
       9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    fill="none"
    stroke="#000000"
    stroke-width="2"
  />
</svg>
  `;

  let starsMarkup = '';

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsMarkup += `<div class="star">${starFilled}</div>`;
    } else if (i === fullStars && hasHalf) {
      starsMarkup += `<div class="star">${starHalf}</div>`;
    } else {
      starsMarkup += `<div class="star">${starEmpty}</div>`;
    }
  }

  return `
    <div class="rating rating-static rating-small star-icon">
      <div class="star-container">
        ${starsMarkup}
      </div>
    </div>
  `;
}

// === Create HTML Markup ===

function createFeedbackMarkup(arr) {
  return arr
    .map(
      ({ descr, name, rate }) => `
      <div class="feedback-card swiper-slide">
        ${createStarRating(rate)}
        <p class="feedback-text feedback-opinion">"${descr}"</p>
        <p class="feedback-text feedback-user">${name}</p>
      </div>
    `
    )
    .join('');
}

// === Main Render Function ===
async function renderFeedback() {
  showLoader();

  try {
    const data = await getFeedback();
    const markup = createFeedbackMarkup(data.feedbacks);

    feedbackContainer.insertAdjacentHTML('beforeend', markup);

    // Ініціалізуємо swiper після рендеру

    if (!swiper) {
      swiper = new Swiper('.swiper', {
        modules: [Pagination],
        direction: 'horizontal',
        loop: false,
        slidesPerView: 1,
        slidesPerGroup: 1,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets',
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            slidesPerGroup: 1,
          },
          1440: {
            slidesPerView: 3,
            slidesPerGroup: 1,
          },
        },
        on: {
          slideChange: updateNavButtons,
        },
      });
      updateNavButtons();
    }

    // Перевірка, щоб не дублювати слухачі

    if (!eventsBound) {
      leftButton.addEventListener('click', () => swiper.slidePrev());
      rightButton.addEventListener('click', () => swiper.slideNext());
      eventsBound = true;
    }

    navWrap.classList.remove('hidden');
  } catch (error) {
    onError('Failed to fetch data from API.');
  } finally {
    hideLoader();
  }
}

renderFeedback();
