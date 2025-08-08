import 'loaders.css/loaders.min.css';

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
let currentCategory = null;
let perPage = 8;

async function fetchCategories() {
    try {
        showLoader();
        const res = await fetch(`${API_BASE}/categories`);
        const data = await res.json();
        renderCategories(data);
    } catch (error) {
        console.error('Помилка завантаження', error);
    } finally {
        hideLoader();
    }
}

function renderCategories(categories) {
  categoriesContainer.innerHTML = '';

  const categoryImg = {
  "Всі товари": '../img/furniture-img/stylish.jpg',
  "М'які меблі": '../img/furniture-img/modern.jpg',
  "Шафи та системи зберігання": '../img/furniture-img/sleek.jpg',
  "Ліжка та матраци": '../img/furniture-img/queen.jpg',
  "Столи": '../img/furniture-img/oak.jpg',
  "Стільці та табурети": '../img/furniture-img/set.jpg',
  "Кухні": '../img/furniture-img/kitchen.jpg',
  "Меблі для дитячої": '../img/furniture-img/bright.jpg',
  "Меблі для офісу": '../img/furniture-img/home.jpg',
  "Меблі для передпокою": '../img/furniture-img/entryway.jpg',
  "Меблі для ванної кімнати": '../img/furniture-img/contemporary.jpg',
  "Садові та вуличні меблі": '../img/furniture-img/cozy.jpg',
  "Декор та аксесуари": '../img/furniture-img/curated.jpg',
  };

  const allBtn = document.createElement('button');
  allBtn.classList.add('category-button');
  allBtn.innerHTML = `
    <img src="${categoryImg['Всі товари']}" alt="Всі товари" />
    <span>Всі товари</span>
  `;
  allBtn.classList.add('active');
  allBtn.addEventListener('click', () => handleCategoryClick(null));
  categoriesContainer.appendChild(allBtn);

  categories.forEach(category => {
    const btn = document.createElement('button');
    btn.classList.add('category-button');

    const imgSrc = categoryImg[category.name];

btn.classList.add('category-button');
btn.innerHTML = `
  <img src="${imgSrc}" alt="${category.name}" />
  <span>${category.name}</span>
`;

    btn.addEventListener('click', () => handleCategoryClick(category.name));
    categoriesContainer.appendChild(btn);
  });
}


function handleCategoryClick(category) {
    currentCategory = category; 
    visibleProducts = [];

    const buttons = categoriesContainer.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === (category || 'Всі товари')) {
            btn.classList.add('active');
        }
    });
    showFilteredProducts();
}

async function fetchProducts() {
    try {
        showLoader();
        const res = await fetch (`${API_BASE}/furnitures`);
        const data = await res.json();
        console.log(data);

        const products = data?.furnitures;

        if (!Array.isArray(products)) {
            throw new Error();
        }

        allProducts = products;
        showFilteredProducts();
    } catch (error) {
        console.error('Помилка завантаження товарів', error.message || error);
    } finally {
        hideLoader();
    }
}

function showFilteredProducts() {
    furnitureList.innerHTML = '';
    visibleProducts = [];

    const filtered = currentCategory ? allProducts.filter(p => p.category?.name === currentCategory) : allProducts;

    if (!Array.isArray(allProducts)) {
        console.error(allProducts);
        furnitureList.innerHTML = 'Помилка завантаження';
        loadMoreBtn.style.display = 'none';
        return;
    }

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
        li.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" />
            <div class="info">
                <h3 class="title">${product.name}</h3>
                <div class="color-container">
                    <span class="set color-common"> </span>
                    <span class="set color-light"> </span>
                    <span class="set color-dark"> </span>
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
    const filtered = currentCategory ? allProducts.filter(p => p.category.name === currentCategory) : allProducts;
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