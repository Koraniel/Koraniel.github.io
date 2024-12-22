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
      text1: "I am a student at the Higher School of Economics, AMI FCS HSE. I study well, and I dream of starting to take classes offline. There is not a lot of information about me/dreams of work/study here, since I want to meet all the deadlines.",
      contact_me_button2: "Contact me",
      about_me: "About me",
      about_me_text: "I am a bachelor's student in \"Applied Mathematics and Information Science\" at the Faculty of Computer Science at the Higher School of Economics. I am interested in everything that can be described by mathematics. Was an intern at Huawei RRI.",
      education_header: "Education",
      university: "HSE University",
      period_of_education1: "September 2023 – June 2027",
      description_of_degree: "I study mathematics and programming. I plan to go to the Stiolo.",
      exp_header: "Experience",
      work1: "Huawei RRI",
      period_of_work1: "July 2024 – September 2024",
      description_of_work1: "Tortured PyTorch as an intern",
      skills_header: "Skills",
      description_of_skills: "Python, C, Pillow, PyTest, Multiprocessing & Threading, Asyncio, Git, LaTeX",
      partnership_header: "Partnership",
      partnership_text: "If you are interested in what I can do for you, here is my contact information:",
      telegram_button: "Write in Telegram",
      email_button: "Email me",
      footer: "Made with coffe in the middle of the second year at the University.",
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
      text1: "Я - студент Высшей Школы Экономики, ПМИ ФКН ВШЭ, Учусь хорошо, мечтаю начать ходить на покру. Многой информации обо мне/мечтах работы/учебы тут нет, так как я хочу успеть за всеми дедлайнами.",
      contact_me_button2: "Написать мне",
      about_me: "Обо мне",
      about_me_text: "Я студент бакалавриата \"Прикладная Математика и Информатика\" факультета компьютерных наук ВШЭ. Интересуюсь всем, что может быть описано математикой. Стажировался в Хуавее.",
      education_header: "Образование",
      university: "НИУ ВШЭ",
      period_of_education1: "Сентябрь 2023 – Июнь 2027",
      description_of_degree: "Занимаюсь изучением математики и программирования. Планирую идти на МОП.",
      exp_header: "Опыт работы",
      work1: "Huawei RRI",
      period_of_work1: "Июль 2024 – Сентябрь 2024",
      description_of_work1: "Мучал пайторч в качестве стажера",
      skills_header: "Навыки",
      description_of_skills: "Python, C, Pillow, PyTest, Multiprocessing & Threading, Asyncio, Git, LaTeX",
      partnership_header: "Сотрудничество",
      partnership_text: "Если интересно, что я могу для вас сделать, пишите:",
      telegram_button: "Написать в Telegram",
      email_button: "Написать на почту",
      footer: "Cделано с кофе в сессию 2 курса.",
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
  