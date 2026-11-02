const bookingForm = document.querySelector('#booking-form');

if (bookingForm) {
  const dateInput = bookingForm.querySelector('#date');
  const result = document.querySelector('#booking-result');
  const pad = (value) => String(value).padStart(2, '0');
  const dateString = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const tomorrow = new Date();
  tomorrow.setHours(12, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const lastDay = new Date(tomorrow);
  lastDay.setDate(lastDay.getDate() + 59);
  dateInput.min = dateString(tomorrow);
  dateInput.max = dateString(lastDay);

  dateInput.addEventListener('change', () => dateInput.setCustomValidity(''));

  document.querySelectorAll('[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      bookingForm.querySelector('#service').value = link.dataset.service;
      bookingForm.classList.remove('was-validated');
      result.hidden = true;
    });
  });

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    result.hidden = true;
    dateInput.setCustomValidity('');

    if (dateInput.value && (dateInput.value < dateInput.min || dateInput.value > dateInput.max)) {
      dateInput.setCustomValidity('Выберите дату в ближайшие 60 дней.');
    }

    bookingForm.classList.add('was-validated');
    if (!bookingForm.checkValidity()) {
      bookingForm.querySelector(':invalid')?.focus();
      return;
    }

    const data = new FormData(bookingForm);
    const chosenDate = new Date(`${data.get('date')}T12:00:00`);
    const formattedDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(chosenDate);
    result.replaceChildren();

    const heading = document.createElement('strong');
    heading.textContent = 'Вариант записи готов';
    const details = document.createElement('p');
    details.textContent = `${data.get('name')}, ${data.get('service')} — ${formattedDate} в ${data.get('time')}. Мастер: ${data.get('master')}.`;
    const note = document.createElement('p');
    note.textContent = 'Это демонстрация: время не забронировано, данные никуда не отправлены.';
    result.append(heading, details, note);
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

document.querySelectorAll('#mainNavbar .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    const menu = document.querySelector('#mainNavbar');
    if (menu?.classList.contains('show') && window.bootstrap?.Collapse) {
      window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});

if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll('.section-space .section-title, .intro__statement, .intro__image, .service-list, .services__image, .featured-service, .approach__lead, .approach__points > div, .masters__image, .master-entry, .price-item, .looks figure, .booking form');
  targets.forEach((target) => target.classList.add('reveal'));
  document.documentElement.classList.add('has-motion');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px 8% 0px', threshold: 0.05 });
  targets.forEach((target) => observer.observe(target));
}
