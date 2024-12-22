const translations = {
    en: {
      tab_header: "Koraniel",
    },
    ru: {
      tab_header: "Кораниэль",
    },
  };
  
  const languageSelector = document.getElementById('theme-lang');
  const elementsWithKeys = document.querySelectorAll('[data-key]');
  
  window.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  });
  
  languageSelector.addEventListener('click', (event) => {
    const lang = event.target.getAttribute('data-lang');
    if (lang) {
      setLanguage(lang);
      localStorage.setItem('language', lang); // Сохраняем выбор пользователя
    }
  });
  
  function setLanguage(lang) {
    elementsWithKeys.forEach((element) => {
      const key = element.getAttribute('data-key');
      element.textContent = translations[lang][key];
    });
  }
  