// Main interactions: year, print, active nav, theme toggle, i18n, burger, smooth scroll
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // Year & Print
  $('#year').textContent = new Date().getFullYear();
  $('#printCv').addEventListener('click', e => { e.preventDefault(); window.print(); });

  // Active nav on scroll
  const sections = $$('#about, #education, #publications, #skills, #timeline, #goals, #talks, #testimonials, #contact');
  const links = $$('#mainnav a');
  function onScroll(){
    const y = window.scrollY + 120; let cur = sections[0].id;
    for(const s of sections){ if (y >= s.offsetTop) cur = s.id; }
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // Theme toggle (persisted)
  const themeToggle = $('#themeToggle');
  const setTheme = (t) => { document.documentElement.setAttribute('data-theme', t); localStorage.setItem('theme', t); themeToggle.textContent = t === 'dark' ? '☀' : '☾'; };
  setTheme(localStorage.getItem('theme') || 'light');
  themeToggle.addEventListener('click', () => setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'));

  // i18n
  const dict = {
    ru: {
      'nav.about':'Обо мне','nav.edu':'Образование','nav.pubs':'Публикации','nav.skills':'Навыки','nav.timeline':'Путь','nav.goals':'Цели','nav.talks':'Выступления','nav.contact':'Контакты',
      'hero.badge':'Ищу возможности для сотрудничества','hero.title':'Ваше имя — исследователь / инженер','hero.tagline':'Кто вы и чем занимаетесь. Прикладная математика, статистика, ML, R&D.','hero.cta1':'Связаться','hero.cta2':'Смотреть публикации','hero.cta3':'Скачать резюме (PDF)',
      'about.h':'Обо мне','about.sub':'Кем вы являетесь, чем увлекаетесь, что вас драйвит.','about.locationK':'Локация','about.roleK':'Роль','about.focusK':'Фокус','about.emailK':'Email',
      'edu.h':'Образование','edu.sub':'ВУЗ, программа, годы, релевантные курсы.',
      'pubs.h':'Публикации','pubs.sub':'Научные статьи, препринты, тезисы конференций.',
      'skills.h':'Навыки','skills.sub':'Технологии, методологии, инструменты.',
      'timeline.h':'Путь','timeline.sub':'Ключевые вехи, опыт, достижения.',
      'goals.h':'Цели','goals.sub':'Чего вы стремитесь достичь в ближайшие 1–3 года.','goals.g1':'Магистратура в топ‑университете (JP)','goals.g2':'Ресёрч‑портфолио',
      'talks.h':'Выступления и медиа','talks.sub':'Доклады, интервью, подкасты, курсы.',
      'testi.h':'Рекомендации','testi.sub':'Короткие цитаты, если есть.',
      'contact.h':'Контакты','contact.sub':'Свяжитесь любым удобным способом.'
    },
    en: {
      'nav.about':'About','nav.edu':'Education','nav.pubs':'Publications','nav.skills':'Skills','nav.timeline':'Timeline','nav.goals':'Goals','nav.talks':'Talks','nav.contact':'Contact',
      'hero.badge':'Open to collaborations','hero.title':'Your Name — Researcher / Engineer','hero.tagline':'One‑liner about you. Applied math, statistics, ML, R&D.','hero.cta1':'Contact','hero.cta2':'View publications','hero.cta3':'Download CV (PDF)',
      'about.h':'About','about.sub':'Who you are, what you do, what drives you.','about.locationK':'Location','about.roleK':'Role','about.focusK':'Focus','about.emailK':'Email',
      'edu.h':'Education','edu.sub':'University, program, years, relevant courses.',
      'pubs.h':'Publications','pubs.sub':'Journal articles, preprints, conference abstracts.',
      'skills.h':'Skills','skills.sub':'Technologies, methodologies, tools.',
      'timeline.h':'Timeline','timeline.sub':'Key milestones and experience.',
      'goals.h':'Goals','goals.sub':'What you aim to achieve in 1–3 years.','goals.g1':'Master’s in a top JP university','goals.g2':'Research portfolio',
      'talks.h':'Talks & Media','talks.sub':'Talks, interviews, podcasts, courses.',
      'testi.h':'Testimonials','testi.sub':'Short quotes, if available.',
      'contact.h':'Contact','contact.sub':'Reach out in any convenient way.'
    }
  };
  function applyI18n(lang){
    document.documentElement.setAttribute('data-lang', lang);
    $$("[data-i18n]").forEach(el => { const key = el.getAttribute('data-i18n'); const msg = dict[lang][key]; if (msg) el.textContent = msg; });
    localStorage.setItem('lang', lang);
    $('#langToggle').textContent = lang === 'ru' ? 'EN' : 'RU';
  }
  applyI18n(localStorage.getItem('lang') || 'ru');
  $('#langToggle').addEventListener('click', () => { const lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'en' : 'ru'; applyI18n(lang); });

  // Smooth scroll
})();