function updateStorage(id, isOpen) {
  let expanded = JSON.parse(localStorage.getItem('expandedItems') || '[]');
  if (isOpen) {
    if (!expanded.includes(id)) expanded.push(id);
  } else {
    expanded = expanded.filter(item => item !== id);
  }
  localStorage.setItem('expandedItems', JSON.stringify(expanded));
}

function toggleSection(id) {
  const content = document.getElementById(id);
  const icon = document.getElementById('icon-' + id);
  const isOpen = content.classList.toggle('open');
  icon.classList.toggle('rotate-180');
  updateStorage(id, isOpen);
}

function toggleCard(id) {
  const content = document.getElementById(id);
  const icon = document.getElementById('chevron-' + id);
  const isOpen = content.classList.toggle('open');
  if (icon) icon.classList.toggle('rotate-180');
  updateStorage(id, isOpen);
}

function toggleSubCard(id) {
  event.stopPropagation();
  const content = document.getElementById(id);
  const icon = document.getElementById('chevron-' + id);
  const isOpen = content.classList.toggle('open');
  if (icon) icon.classList.toggle('rotate-180');
  updateStorage(id, isOpen);
}

function toggleAchievement(id) {
  event.stopPropagation();
  const content = document.getElementById(id);
  const icon = document.getElementById('chev-' + id);
  const isOpen = content.classList.toggle('open');
  icon.classList.toggle('rotate-180');
  updateStorage(id, isOpen);
}

document.addEventListener('DOMContentLoaded', () => {
  const expanded = JSON.parse(localStorage.getItem('expandedItems') || '[]');
  expanded.forEach(id => {
    const content = document.getElementById(id);
    if (content) {
      content.classList.add('open');
      const icon = document.getElementById('icon-' + id) || 
                   document.getElementById('chevron-' + id) || 
                   document.getElementById('chev-' + id);
      if (icon) icon.classList.add('rotate-180');
    }
  });
});