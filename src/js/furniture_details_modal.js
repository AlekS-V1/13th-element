let allFurnitures = [];

window.addEventListener('DOMContentLoaded', () => {
  fetchFurnitureAndRenderModal();

  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  document.getElementById('orderBtn').addEventListener('click', openOrderForm);
  document.getElementById('orderCloseBtn').addEventListener('click', closeOrderForm);

  // Додатковий обробник для кнопки "Перейти до замовлення"
  const orderTriggerBtn = document.getElementById('orderBtn');
  const backdrop = document.getElementById('orderForm');
  const form = document.getElementById('orderForm').querySelector('form');

  orderTriggerBtn.addEventListener('click', () => {
    closeModal(); // Закриває поточне модальне вікно
    backdrop.classList.remove('hidden'); // Відкриває форму замовлення
    document.body.classList.add('modal-open'); // Забороняє скрол сторінки
    form.reset(); // Скидає форму
    clearAllErrors(); // Очищає помилки (функція має бути реалізована)
    form.elements.email.focus(); // Фокус на поле email
  });
});

// Закриття по кліку поза модальним вікном
document.addEventListener('click', (e) => {
  const modal = document.getElementById('modal');
  const orderForm = document.getElementById('orderForm');

  if (!modal.classList.contains('hidden') && e.target === modal) {
    closeModal();
  }

  if (!orderForm.classList.contains('hidden') && e.target === orderForm) {
    closeOrderForm();
  }
});

// Закриття по Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeOrderForm();
  }
});

function openModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

function openOrderForm() {
  const form = document.getElementById('orderForm');
  form.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function closeOrderForm() {
  const form = document.getElementById('orderForm');
  form.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

async function fetchFurnitureAndRenderModal() {
  try {
    const response = await fetch('https://furniture-store.b.goit.study/api/furnitures');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    if (!data.furnitures || !Array.isArray(data.furnitures)) {
      throw new Error('Невірна структура відповіді API');
    }

    allFurnitures = data.furnitures;
    const firstFurniture = allFurnitures[0];

    if (!firstFurniture) throw new Error('Меблі не знайдені');

    renderFurnitureDetails(firstFurniture);
    openModal();
  } catch (error) {
    console.error('Помилка при отриманні меблів:', error.message);

    const testFurniture = {
      name: 'Стілець Amazonka',
      type: 'Стілець',
      price: 1200,
      rate: 4.5,
      description: 'Зручний стілець з натурального дерева.',
      sizes: '45x45x90 см',
      images: [
        'https://via.placeholder.com/400x300?text=Main',
        'https://via.placeholder.com/200x150?text=Side',
        'https://via.placeholder.com/200x150?text=Back'
      ],
      colors: ['#FF0000', '#00FF00', '#0000FF']
    };

    renderFurnitureDetails(testFurniture);
    openModal();
  }
}

function renderFurnitureDetails(furniture) {
  document.querySelector('.model-name').textContent = furniture.name;
  document.querySelector('.model-name').classList.add('highlight-name');

  document.querySelector('.category').textContent = furniture.type;
  document.querySelector('.category').classList.add('highlight-type');

  document.querySelector('.price').textContent = `${furniture.price} грн`;
  document.querySelector('.price').classList.add('price-style');

  document.querySelector('.rating').textContent = '★'.repeat(Math.round(furniture.rate));
  document.querySelector('.rating').classList.add('rating-style');

  document.querySelector('.description').textContent = furniture.description;
  document.querySelector('.description').classList.add('description-style');

  document.querySelector('.dimensions').textContent = `Розміри: ${furniture.sizes}`;
  document.querySelector('.dimensions').classList.add('dimensions-style');

  const mainImage = document.querySelector('.main-image');
  mainImage.src = furniture.images[0];
  mainImage.alt = furniture.name;

  const thumbsContainer = document.querySelector('.thumbs');
  thumbsContainer.innerHTML = '';
  furniture.images.slice(1).forEach((imgUrl, index) => {
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = `${furniture.name} view ${index + 2}`;
    img.classList.add('thumb-image');
    thumbsContainer.appendChild(img);
  });

  renderColorFilters(furniture);
}

function renderColorFilters(furniture) {
  const container = document.getElementById('color-filters');
  container.innerHTML = '';

  let colors = furniture.colors || furniture.color || furniture.colours;

  if (typeof colors === 'string') {
    colors = colors.split(',').map(c => c.trim());
  }

  if (typeof colors === 'object' && !Array.isArray(colors)) {
    colors = Object.values(colors);
  }

  if (!colors || !Array.isArray(colors)) {
    console.warn('Кольори не знайдені або мають неправильний формат:', colors);
    container.innerHTML = '<p>Кольори недоступні</p>';
    return;
  }

  colors.forEach((color, index) => {
    const label = document.createElement('label');

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'color';
    input.value = color;
    input.id = `color-${index}`;
    input.classList.add('color-checkbox');

    const circle = document.createElement('span');
    circle.classList.add('color-circle');
    circle.style.backgroundColor = color;

    label.appendChild(input);
    label.appendChild(circle);
    container.appendChild(label);
  });
}

function clearAllErrors() {
  const errors = document.querySelectorAll('.error-message');
  errors.forEach(err => err.textContent = '');
}
