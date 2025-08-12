window.addEventListener('load', () => {
  fetchFurnitureAndRenderModal();
  setupDetailsButtons();
  

  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  } else {
    console.warn('Кнопка .close-btn не знайдена');
  }
});

// document.querySelector('.close-btn').addEventListener('click', closeModal);

let allFurnitures = [];
let selectedFurniture = null;


export function closeModal() {
  //document.getElementById('modal').style.display = 'none';
  // document.getElementById('orderModalCloseBtn')?.addEventListener('click', () => {
  document.getElementById('modal').classList.add('is-hidden');
  document.body.classList.remove('modal-open');
// });

}

function openModal() {
  //document.getElementById('modal').style.display = 'flex';
  document.body.classList.add('modal-open');
}
document.querySelector('.order-btn')?.addEventListener('click', openOrderForm);

function openOrderForm() {
  closeModal(); // закриває попереднє модальне вікно
  const backdrop = document.getElementById('orderModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('is-hidden');
    document.body.classList.add('modal-open');
  } else {
    console.warn('Backdrop модального вікна замовлення не знайдено');
  }
  const requestBody = {
  email,
  phone: phone.replace(/\D/g, ''),
  modelId: selectedFurniture?._id,
  color: selectedFurniture?.color?.[0] || '#000000',
  comment,
};

}


async function fetchFurnitureAndRenderModal() {
  try {
    const response = await fetch('https://furniture-store.b.goit.study/api/furnitures');
    const data = await response.json();
    allFurnitures = data.furnitures;

    const firstFurniture = allFurnitures[0];
    renderFurnitureDetails(firstFurniture);
    renderColorFilters(firstFurniture);
   // openModal();
  } catch (error) {
    console.error('Помилка при отриманні меблів:', error);
  }
}

function setupDetailsButtons() {
  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const furniture = allFurnitures.find(item => item.id === id);
      if (furniture) {
        renderFurnitureDetails(furniture);
        document.getElementById('modal').classList.remove('is-hidden');
        document.body.classList.add('modal-open');
      } else {
        console.warn('Меблі з таким ID не знайдено:', id);
      }
    });
  });
}

export function renderFurnitureDetails(furniture) {
  document.querySelector('.order-btn').dataset.id = furniture.id;
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
  if (Array.isArray(furniture.images) && furniture.images.length > 0) {
  mainImage.src = furniture.images[0];
  mainImage.alt = furniture.name;
} else {
  mainImage.src = 'default.jpg'; // або інше резервне зображення
  mainImage.alt = 'Зображення недоступне';
}

  // mainImage.src = furniture.images[0];
  // mainImage.alt = furniture.name;

  const thumbsContainer = document.querySelector('.thumbs');
  thumbsContainer.innerHTML = '';

  if (Array.isArray(furniture.images) && furniture.images.length > 1) {
  furniture.images.slice(1).forEach((imgUrl, index) => {
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = `${furniture.name} view ${index + 2}`;
    img.classList.add('thumb-image');
    thumbsContainer.appendChild(img);
  });
}

  if (!Array.isArray(furniture.images) || furniture.images.length === 0) {
  mainImage.src = 'default.jpg'; // 
  mainImage.alt = 'Зображення недоступне';
}

  // furniture.images.slice(1).forEach((imgUrl, index) => {
  //   const img = document.createElement('img');
  //   img.src = imgUrl;
  //   img.alt = `${furniture.name} view ${index + 2}`;
  //   img.classList.add('thumb-image');
  //   thumbsContainer.appendChild(img);
  // });

  renderColorFilters(furniture); // оновлюємо кольори при зміні товару
  selectedFurniture = furniture; // збережемо товар

}

function renderColorFilters(furniture) {
  const container = document.getElementById('color-filters');
  container.innerHTML = '';

if (Array.isArray(furniture.color)) {
  furniture.color.forEach(color => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="checkbox" value="${color}" class="color-checkbox" onchange="filterByColor()" />
      <span class="color-circle" style="background:${color};"></span>
    `;
    container.appendChild(label);
  });
} else {
  console.warn('Поле color відсутнє або не є масивом:', furniture);
}

  // furniture.color.forEach(color => {
  //   const label = document.createElement('label');
  //   label.innerHTML = `
  //     <input type="checkbox" value="${color}" class="color-checkbox" onchange="filterByColor()" />
  //     <span class="color-circle" style="background:${color};"></span>
  //   `;
  //   container.appendChild(label);
  // });
}

function filterByColor() {
  const checkedColors = Array.from(document.querySelectorAll('#color-filters input:checked'))
    .map(input => input.value);

  if (checkedColors.length === 0) {
    renderFurnitureDetails(allFurnitures[0]);
    return;
  }

  const filtered = allFurnitures.find(item =>
    item.color.some(c => checkedColors.includes(c))
  );

  if (filtered) {
    renderFurnitureDetails(filtered);
  } else {
    alert('Немає меблів з таким кольором');
  }
}
