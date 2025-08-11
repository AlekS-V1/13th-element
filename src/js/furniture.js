<<<<<<< Updated upstream
=======
import 'loaders.css/loaders.min.css';
import stylish from '../img/furniture-img/stylish.jpg';
import modern from '../img/furniture-img/modern.jpg';
import sleek from '../img/furniture-img/sleek.jpg';
import queen from '../img/furniture-img/queen.jpg';
import oak from '../img/furniture-img/oak.jpg';
import set from '../img/furniture-img/set.jpg';
import kitchen from '../img/furniture-img/kitchen.jpg';
import bright from '../img/furniture-img/bright.jpg';
import home from '../img/furniture-img/home.jpg';
import entryway from '../img/furniture-img/entryway.jpg';
import contemporary from '../img/furniture-img/contemporary.jpg';
import cozy from '../img/furniture-img/cozy.jpg';
import curated from '../img/furniture-img/curated.jpg';

const loader = document.querySelector('.loader');

function showLoader() {
    loadMoreBtn.classList.remove('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

const API_BASE = 'https://furniture-store.b.goit.study/api';

const categoriesContainer = document.querySelector('.categories-filter');
const furnitureList = document.querySelector('.furniture-list');
const loadMoreBtn = document.querySelector('.load-more-btn');

let allProducts = [];
let visibleProducts = [];
let currentCategoryId = null;
let perPage = 8;

let allCategories = [];

async function fetchCategories() {
  try {
    showLoader();
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    allCategories = data;
    renderCategories(data);
  } catch (error) {
    console.error('Помилка завантаження категорій', error);
  } finally {
    hideLoader();
  }
}

function renderCategories(categories) {
  categoriesContainer.innerHTML = '';

  const categoryImg = {
  "Всі товари": stylish,
  "М'які меблі": modern,
  "Шафи та системи зберігання": sleek,
  "Ліжка та матраци": queen,
  "Столи": oak,
  "Стільці та табурети": set,
  "Кухні": kitchen,
  "Меблі для дитячої": bright,
  "Меблі для офісу": home,
  "Меблі для передпокою": entryway,
  "Меблі для ванної кімнати": contemporary,
  "Садові та вуличні меблі": cozy,
  "Декор та аксесуари": curated,
};

  const allBtn = document.createElement('li');
  allBtn.classList.add('category-button');
  allBtn.dataset.categoryId = '';
  allBtn.innerHTML = `
    <img src="${categoryImg['Всі товари']}" alt="Всі товари" />
    <span>Всі товари</span>
  `;
  allBtn.classList.add('active');
  allBtn.addEventListener('click', () => handleCategoryClick(''));
  categoriesContainer.appendChild(allBtn);

  categories.forEach(category => {
  const btn = document.createElement('li');
  btn.classList.add('category-button');
  btn.dataset.categoryId = category._id;

  const imgSrc = categoryImg[category.name];

  btn.innerHTML = `
    <img src="${imgSrc}" alt="${category.name}" />
    <span>${category.name}</span>
  `;

  btn.addEventListener('click', () => handleCategoryClick(category._id));
  categoriesContainer.appendChild(btn);
});
}

function handleCategoryClick(categoryId) {
  currentCategoryId = categoryId || null;
  visibleProducts = [];

  const buttons = categoriesContainer.querySelectorAll('li');
  buttons.forEach(btn => {
    if (btn.dataset.categoryId === String(categoryId)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  showFilteredProducts();
}

async function fetchProducts() {
  try {
    showLoader();

    const perPage = 10;
    let page = 1;
    let allFetched = [];
    let totalPages = 8;

    do {
      const res = await fetch(`${API_BASE}/furnitures?page=${page}&limit=${perPage}`);
      const data = await res.json();

      if (!Array.isArray(data.furnitures)) throw new Error('Неправильна відповідь API');

      allFetched = allFetched.concat(data.furnitures);

      if (page === 8 && data.total) {
        totalPages = Math.ceil(data.total / perPage);
      }

      page++;
    } while (page <= totalPages);

    allProducts = allFetched;
    showFilteredProducts();
  } catch (error) {
    console.error('Помилка завантаження товарів:', error);
  } finally {
    hideLoader();
  }
}

function showFilteredProducts() {
  furnitureList.innerHTML = '';
  visibleProducts = [];

  if (!Array.isArray(allProducts)) {
    console.error('Дані не є масивом:', allProducts);
    furnitureList.innerHTML = 'Помилка завантаження';
    loadMoreBtn.style.display = 'none';
    return;
  }

  const filtered = currentCategoryId
    ? allProducts.filter(p => String(p.category?._id) === String(currentCategoryId))
    : allProducts;

  if (filtered.length === 0) {
    furnitureList.innerHTML = 'Товарів не знайдено';
    loadMoreBtn.style.display = 'none';
    return;
  }

  loadMoreBtn.style.display = 'block';
  loadNextBatch(filtered);
}

function loadNextBatch(filteredList) {
    const nextProducts = filteredList.slice(visibleProducts.length, visibleProducts.length + perPage);
    visibleProducts = visibleProducts.concat(nextProducts);

    nextProducts.forEach(product => {
        const li = document.createElement('li');
        li.classList.add('furniture-card');

        const colorCircles = (product.color || []).map(color => `<span class="set" style="background-color: ${color};"></span>`).join('');
        li.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" />
            <div class="info">
                <h3 class="title">${product.name}</h3>
                <div class="color-container">
                    ${colorCircles}
                    </div>
                <p class="price">${product.price} грн</p>
                <button class="details-btn" data-id="${product._id}">Детальніше</button>
            </div>
        `;
        furnitureList.appendChild(li);
    });

    if (visibleProducts.length >= filteredList.length) {
        loadMoreBtn.style.display = 'none';
    }
}

loadMoreBtn.addEventListener('click', () => {
  const filtered = currentCategoryId
    ? allProducts.filter(p => p.category?._id === currentCategoryId)
    : allProducts;
  loadNextBatch(filtered);
});

furnitureList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('details-btn')) {
        const id = e.target.dataset.id;
        try {
            showLoader();
            const res = await fetch(`${API_BASE}/furnitures/${id}`);
            const product = await res.json();
            showModal(product);
        } catch (error) {
            console.error('Помилка завантаження деталей товару', error);
        } finally {
            hideLoader();
        }
    }
});

fetchCategories();
fetchProducts();
>>>>>>> Stashed changes
