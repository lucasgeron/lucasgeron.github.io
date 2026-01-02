function updateStorage(id, isOpen) {
  let expanded = JSON.parse(localStorage.getItem('expandedItems') || '[]');
  if (isOpen) {
    if (!expanded.includes(id)) expanded.push(id);
  } else {
    expanded = expanded.filter(item => item !== id);
  }
  localStorage.setItem('expandedItems', JSON.stringify(expanded));
}

function toggleContent(id, chevronId = null) {
  const content = document.getElementById(id);
  const chevron = chevronId ? document.getElementById(chevronId) : null;

  console.log(chevron)
  if (!content) return;
  
  if (chevron) chevron.classList.toggle('rotate-180');
  const isOpen = content.classList.toggle('open');
  updateStorage(id, isOpen);
}

document.addEventListener('DOMContentLoaded', () => {
  const expanded = JSON.parse(localStorage.getItem('expandedItems') || '[]');
  expanded.forEach(id => {
    const content = document.getElementById(id);
    if (content) {
      content.classList.add('open');
      const chevron = document.getElementById('chevron-' + id) ||
          document.getElementById('chevron-company-' + id) ||
          document.getElementById('chevron-project-' + id) ||
          document.getElementById('chevron-contribution-' + id);

      if (chevron) chevron.classList.add('rotate-180');
    }
  });
});