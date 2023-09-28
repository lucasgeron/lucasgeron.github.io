document.addEventListener('DOMContentLoaded', function () {
  // Função para alternar a visibilidade das imagens com base no tema
  function toggleImagesBasedOnTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const images = document.querySelectorAll('.theme-light, .theme-dark');

    images.forEach(function (image) {
      if (currentTheme === 'light' && image.classList.contains('theme-dark')) {
        image.classList.add('d-none');
      } else if (currentTheme === 'dark' && image.classList.contains('theme-light')) {
        image.classList.add('d-none');
      } else {
        image.classList.add = 'd-none';
      }
    });
  }

  // Chamando a função para alternar as imagens com base no tema atual
  toggleImagesBasedOnTheme();

  // Adicionando um ouvinte para alterações de tema
  window.addEventListener('theme-changed', toggleImagesBasedOnTheme);
});

// Dispare o evento 'theme-changed' quando o tema é alterado
document.documentElement.addEventListener('theme-changed', function () {
  const event = new Event('theme-changed');
  window.dispatchEvent(event);
});
