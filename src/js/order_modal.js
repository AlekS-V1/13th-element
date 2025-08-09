
const backdrop = document.getElementById('orderModalBackdrop');
const closeBtn = document.getElementById('orderModalCloseBtn');
const orderForm = document.getElementById('orderForm');

let modelId = null;
const COLOR = '#1212ca';

function openOrderFormWithModel(id) {
  modelId = id;

  backdrop.classList.remove('is-hidden');
  document.body.classList.add('no-scroll');
  orderForm.reset();
  clearAllErrors();
  orderForm.elements.email.focus();
}

// Закрити модалку

function closeOrderModal() {
  backdrop.classList.add('is-hidden');
  document.body.classList.remove('no-scroll');
  orderForm.reset();
  clearAllErrors();
}

closeBtn.addEventListener('click', closeOrderModal);

backdrop.addEventListener('click', e => {
  if (e.target === backdrop) closeOrderModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !backdrop.classList.contains('is-hidden')) {
    closeOrderModal();
  }
});
// Обробка форми

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
    await axios.post('https://furniture-store.b.goit.study/api/orders', requestBody);

    iziToast.success({
      title: 'Готово',
      message: 'Заявка успішно надіслана!',
      position: 'topRight',
    });

    closeOrderModal();
  } catch (err) {
    iziToast.error({
      title: 'Помилка',
      message: err.response?.data?.message || 'Не вдалося надіслати заявку',
      position: 'topRight',
    });
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Надіслати заявку';
    submitBtn.style.cursor = 'pointer';
  }
});


// Функції для помилок 
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