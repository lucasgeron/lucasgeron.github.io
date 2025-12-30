// Set default language
setLanguage('en');

// Enable dark mode by default
// toggleDarkMode();

// Set current year in footer
document.getElementById('year-copy').textContent = '© ' + new Date().getFullYear() + ' Lucas Geron. All rights reserved.';

function setLanguage(lang) {
  const elements = document.querySelectorAll('[data-language]');
  const buttons = document.querySelectorAll('button[id="en"], button[id="pt"]');
  buttons.forEach(button => {
    if (button.id === lang) {
      button.dataset.active = "true";
    } else {
      button.dataset.active = "false";
    }
  });
  elements.forEach(el => {
    if (el.dataset.language === lang) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
}

function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  console.log('Dark mode toggled');
}

function toggleSection(id) {
  const content = document.getElementById(id);
  const icon = document.getElementById('icon-' + id);
  content.classList.toggle('open');
  icon.classList.toggle('rotate-180');
}

function toggleCard(id) {
  const content = document.getElementById(id);
  const icon = document.getElementById('chevron-' + id);
  content.classList.toggle('open');
  if (icon) icon.classList.toggle('rotate-180');
}

function toggleSubCard(id) {
  event.stopPropagation();
  const content = document.getElementById(id);
  const icon = document.getElementById('chevron-' + id);
  content.classList.toggle('open');
  if (icon) icon.classList.toggle('rotate-180');
}

function toggleAchievement(id) {
  event.stopPropagation();
  const content = document.getElementById(id);
  const icon = document.getElementById('chev-' + id);
  content.classList.toggle('open');
  icon.classList.toggle('rotate-180');
}