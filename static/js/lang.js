const translations = {
    en: {
      tab_header: "Koraniel",
      full_name: "Lev Rymarev",
      occupation: "Student of AMI FCS HSE",
      about_me_button: "About me in a nutshell",
      job_exp_button: "My job experience",
      partnership_button: "Partnership",
      contact_me_button: "Contact me",
      dark_light_theme_button: "Dark/White theme",
      header1: "This is my site made for Deep Python course",
      text1: "Я&nbsp;&mdash; студент Высшей Школы Экономики, ПМИ ФКН ВШЭ, <br> Учусь хорошо, мечтаю начать ходить на покру.",
      contact_me_button2: "Contact me",

    },
    ru: {
      tab_header: "Кораниэль",
      full_name: "Рымарев Лев",
      occupation: "Студент ПМИ ФКН ВШЭ",
      about_me_button: "Вкратце обо мне",
      job_exp_button: "Мой опыт работы",
      partnership_button: "Сотрудничество",
      contact_me_button: "Написать мне",
      dark_light_theme_button: "Тёмная/Светлая тема",
      header1: "Это сайт-визитка для ДЗ по углубленному питону",
      text1: "Я&nbsp;&mdash; студент Высшей Школы Экономики, ПМИ ФКН ВШЭ, <br> Учусь хорошо, мечтаю начать ходить на покру.",
      contact_me_button2: "Написать мне",
      
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
  