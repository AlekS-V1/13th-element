let allFurnitures = [];

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.body.classList.remove('modal-open');
}

function openModal() {
  document.getElementById('modal').style.display = 'flex';
  document.body.classList.add('modal-open');
}

function openOrderForm() {
  closeModal();
  // Тут можна додати логіку відкриття форми замовлення
}

async function fetchFurnitureAndRenderModal() {
  try {
    const response = await fetch('https://furniture-store.b.goit.study/api/furnitures');
    const data = await response.json();
    allFurnitures = data.furnitures;

    renderFurnitureDetails(allFurnitures[0]);
    openModal();
  } catch (error) {
    console.error('Помилка при отриманні меблів:', error);
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

  furniture.color.forEach(color => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="checkbox" value="${color}" class="color-checkbox" onchange="filterByColor()" />
      <span class="color-circle" style="background:${color};"></span>
    `;
    container.appendChild(label);
  });
}

function filterByColor() {
  const checkedColors = Array.from(document.querySelectorAll('#color-filters input:checked'))
    .map(input => input.value);

  const filtered = checkedColors.length === 0
    ? allFurnitures[0]
    : allFurnitures.find(item =>
        item.color.some(c => checkedColors.includes(c))
      );

  if (filtered) {
    renderFurnitureDetails(filtered);
  } else {
    document.querySelector('.model-name').textContent = 'Немає меблів з таким кольором';
    document.querySelector('.main-image').src = '';
    document.querySelector('.thumbs').innerHTML = '';
    document.querySelector('.category').textContent = '';
    document.querySelector('.price').textContent = '';
    document.querySelector('.rating').textContent = '';
    document.querySelector('.description').textContent = '';
    document.querySelector('.dimensions').textContent = '';
  }
}
