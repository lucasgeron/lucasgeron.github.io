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
  const chevrons = chevronId ? document.querySelectorAll('#' + chevronId) : [];

  if (!content) return;
  
  if (chevrons.length > 0) {
    chevrons.forEach(chevron => chevron.classList.toggle('rotate-180'));
  }
  const isOpen = content.classList.toggle('open');
  updateStorage(id, isOpen);
}

document.addEventListener('DOMContentLoaded', () => {
  const expanded = JSON.parse(localStorage.getItem('expandedItems') || '[]');
  expanded.forEach(id => {
    const content = document.getElementById(id);
    if (content) {
      content.classList.add('open');
      const chevronSelectors = [
        '#chevron-' + id,
        '#chevron-company-' + id,
        '#chevron-project-' + id,
        '#chevron-contribution-' + id
      ].join(',');
      
      const chevrons = document.querySelectorAll(chevronSelectors);
      if (chevrons.length > 0) {
        chevrons.forEach(chevron => chevron.classList.add('rotate-180'));
      }
    }
  });
});