import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'loaders.css/loaders.min.css';

const backdrop = document.getElementById('orderModalBackdrop');  // Фон модального вікна
const closeBtn = document.getElementById('orderModalCloseBtn');  // Кнопка закриття модалки
const orderForm = document.getElementById('orderForm');          // Форма замовлення

let modelId = null;              
const COLOR = '#1212ca';          

const loader = document.getElementById('loader'); // лоадер

// Відкрити форму замовлення з id моделі
function openOrderFormWithModel(id) {
  modelId = id;                   

  backdrop.classList.remove('is-hidden'); 
  document.body.classList.add('no-scroll'); 
  orderForm.reset();                      
  clearAllErrors();                     
  orderForm.elements.email.focus();     
}

// Закрити модальне вікно
function closeOrderModal() {
  backdrop.classList.add('is-hidden');    
  document.body.classList.remove('no-scroll');  
  orderForm.reset();                       
  clearAllErrors();                       
}

closeBtn.addEventListener('click', closeOrderModal);

// Закриття модалки при кліку поза формою
backdrop.addEventListener('click', e => {
  if (e.target === backdrop) closeOrderModal();
});

// Закриття модалки при натисканні Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !backdrop.classList.contains('is-hidden')) {
    closeOrderModal();
  }
});

function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

// Обробка відправки форми
orderForm.addEventListener('submit', async e => {
  e.preventDefault();

  const emailInput = orderForm.elements.email;
  const phoneInput = orderForm.elements.tel;
  const commentInput = orderForm.elements.comment;

  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const comment = commentInput.value.trim();

  clearAllErrors();

  let hasError = false;

  if (!email) {
    showError(emailInput, 'Поле Email обов’язкове');
    hasError = true;
  }

  if (!phone) {
    showError(phoneInput, 'Поле Телефон обов’язкове');
    hasError = true;
  }

  if (hasError) {
    iziToast.error({
      title: 'Помилка',
      message: 'Заповніть всі обов’язкові поля.',
      position: 'topRight',
    });
    return;
  }

  showLoader();

  const requestBody = {
    email,
    phone,
    modelId,
    color: COLOR,
    comment,
  };

  const submitBtn = orderForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Надсилання...';
  submitBtn.style.cursor = 'wait';

  try {
    console.log('Відправка заявки:', requestBody);
    const response = await fetch('https://furniture-store.b.goit.study/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Не вдалося надіслати заявку');
    }
    const result = await response.json();
    console.log('Відповідь сервера:', result);


    iziToast.success({
      title: 'Готово',
      message: 'Заявка успішно надіслана!',
      position: 'topRight',
    });

    closeOrderModal();
  } catch (err) {
    iziToast.error({
      title: 'Помилка',
      message: err.message,
      position: 'topRight',
    });
  } finally {
    hideLoader();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Надіслати заявку';
    submitBtn.style.cursor = 'pointer';
  }
});

// Показати помилку під полем
function showError(input, message) {
  input.classList.add('input-error');

  let error = input.nextElementSibling;
  if (error && error.classList.contains('error-message')) {
    error.textContent = message;
    return;
  }

  error = document.createElement('div');
  error.className = 'error-message';
  error.textContent = message;
  input.insertAdjacentElement('afterend', error);
}

function clearError(input) {
  input.classList.remove('input-error');

  const error = input.nextElementSibling;
  if (error && error.classList.contains('error-message')) {
    error.remove();
  }
}

function clearAllErrors() {
  clearError(orderForm.elements.email);
  clearError(orderForm.elements.tel);
}
