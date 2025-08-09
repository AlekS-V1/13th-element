
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function openOrderForm() {
  closeModal();
}

async function fetchFurnitureAndRenderModal() {
  try {
    const response = await fetch('https://furniture-store.b.goit.study/api/furnitures');
    const data = await response.json();
      const furniture = data.furnitures[0];
      
  const modelName = document.querySelector('.model-name');
  modelName.textContent = furniture.name;
  modelName.classList.add('highlight-name');

  const modelType = document.querySelector('.category');
  modelType.textContent = furniture.type;
  modelType.classList.add('highlight-type');
      
    const priceEl = document.querySelector('.price');
   priceEl.textContent = `${furniture.price} грн`;
priceEl.classList.add('price-style');

const ratingEl = document.querySelector('.rating');
ratingEl.textContent = '★'.repeat(Math.round(furniture.rate));
ratingEl.classList.add('rating-style');

const descriptionEl = document.querySelector('.description');
descriptionEl.textContent = furniture.description;
descriptionEl.classList.add('description-style');

const dimensionsEl = document.querySelector('.dimensions');
dimensionsEl.textContent = `Розміри: ${furniture.sizes}`;
dimensionsEl.classList.add('dimensions-style');


    const mainImage = document.querySelector('.main-image');
    mainImage.src = furniture.images[0];
    mainImage.alt = furniture.name;

const thumbsContainer = document.querySelector('.thumbs');
thumbsContainer.innerHTML = '';

furniture.images.forEach((imgUrl, index) => {
  if (index > 0) {
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = `${furniture.name} view ${index + 1}`;
    img.classList.add('thumb-image');
    thumbsContainer.appendChild(img);
  }
});


  } catch (error) {
    console.error('Помилка при отриманні меблів:', error);
  }
}

function openModal() {
  document.getElementById('modal').style.display = 'flex';
  document.body.classList.add('modal-open');
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.body.classList.remove('modal-open');
}
