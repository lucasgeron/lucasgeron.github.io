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