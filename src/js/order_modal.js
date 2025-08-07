const openModalBtn = document.getElementById('openModalBtn');
const backdrop = document.getElementById('orderModalBackdrop');
const closeBtn = document.getElementById('orderModalCloseBtn');
const form = document.getElementById('orderForm');

const modelId = '682f9bbf8acbdf505592ac36';
const color = '#1212ca';

// Відкрити модалку
openModalBtn.addEventListener('click', () => {
  backdrop.classList.remove('is-hidden');
  document.body.classList.add('no-scroll');
  form.reset();
  clearAllErrors();
  form.elements.email.focus();
});

// Закрити модалку
function closeModal() {
  backdrop.classList.add('is-hidden');
  document.body.classList.remove('no-scroll');
  form.reset();
  clearAllErrors();
}

closeBtn.addEventListener('click', closeModal);

backdrop.addEventListener('click', e => {
  if (e.target === backdrop) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !backdrop.classList.contains('is-hidden')) {
    closeModal();
  }
});

// Обробка форми
form.addEventListener('submit', async e => {
  e.preventDefault();

  const emailInput = form.elements.email;
  const phoneInput = form.elements.tel;
  const commentInput = form.elements.comment;

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
    color,
    comment,
  };

  const submitBtn = form.querySelector('button[type="submit"]');
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

    closeModal();
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

// ======== Функції для помилок ===========

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
  clearError(form.elements.email);
  clearError(form.elements.tel);
}
