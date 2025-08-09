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

  return `
    <div class="rating rating-static rating-small value-${fullStars} ${
    hasHalf ? 'half' : ''
  } star-icon">
      <div class="star-container">
        ${Array.from(
          { length: 5 },
          () => `
          <div class="star">
            <svg class="star-empty">
              <use href="./img/feedback/star-rating_icons.svg#star-empty"></use>
            </svg>
            <svg class="star-half">
              <use href="./img/feedback/star-rating_icons.svg#star-half"></use>
            </svg>
            <svg class="star-filled">
              <use href="./img/feedback/star-rating_icons.svg#star-filled"></use>
            </svg>
          </div>
        `
        ).join('')}
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
