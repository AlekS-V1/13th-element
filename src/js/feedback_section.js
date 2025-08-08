import axios from 'axios';
import 'loaders.css/loaders.min.css';

import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// === DOM Elements ===
const feedbackContainer = document.querySelector('.feedback-list');
const loader = document.querySelector('.loader');
const leftButton = document.querySelector('.feedback-btn-left');
const rightButton = document.querySelector('.feedback-btn-right');
const navWrap = document.querySelector('.feedback-pagination-btn-wrap');

// === Global state ===
let swiper;
let eventsBound = false;

// leftButton.disabled = true;
// rightButton.disabled = true;

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

function customRound(rate) {
  return Math.round(rate * 2) / 2;
}

// === Create HTML Markup ===
function createMarkup(arr) {
  return arr
    .map(({ descr, name, rate }) => {
      const roundedRate = customRound(rate);
      return `
        <div class="feedback-card swiper-slide">
          <div class="star-rating" data-rating="${roundedRate}"></div>
          <p class="feedback-text feedback-opinion">"${descr}"</p>
          <p class="feedback-text feedback-user">${name}</p>
        </div>
      `;
    })
    .join('');
}

// === Main Render Function ===
async function renderFeedback() {
  showLoader();

  try {
    const data = await getFeedback();
    const markup = createMarkup(data.feedbacks);

    feedbackContainer.insertAdjacentHTML('beforeend', markup);

    // Ініціалізуємо swiper після рендеру

    if (!swiper) {
      swiper = new Swiper('.swiper', {
        modules: [Pagination],
        direction: 'horizontal',
        loop: false,
        slidesPerView: 1,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets',
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          1440: {
            slidesPerView: 3,
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
