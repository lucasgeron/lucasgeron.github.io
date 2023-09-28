/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
  'use strict'

  const getStoredTheme = () => localStorage.getItem('theme')
  const setStoredTheme = theme => localStorage.setItem('theme', theme)

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme()
    if (storedTheme) {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = theme => {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }
  }


  setTheme(getPreferredTheme())

  const showActiveTheme = (theme, focus = false) => {

    let link = document.getElementById('custom-dark-mode-link');

    if (theme === 'light') {
      document.querySelectorAll('[name="btn-light"]').forEach(function (button) {
        button.classList.add('d-none');
      });
      document.querySelectorAll('[name="btn-dark"]').forEach(function (button) {
        button.classList.remove('d-none');
      });
      link.setAttribute('href', '');
    } else {
      document.querySelectorAll('[name="btn-dark"]').forEach(function (button) {
        button.classList.add('d-none');
      });
      document.querySelectorAll('[name="btn-light"]').forEach(function (button) {
        button.classList.remove('d-none');
      });
      link.setAttribute('href', '/assets/css/dark-mode.css');
    }


    const images = document.querySelectorAll('.theme-light, .theme-dark');
    images.forEach(function (image) {
      if (theme === 'light' && image.classList.contains('theme-dark')) {
        image.classList.add('d-none');
      } else if (theme === 'dark' && image.classList.contains('theme-light')) {
        image.classList.add('d-none');
      } else {
        image.classList.remove('d-none');
      }
    });

    // const themeSwitcher = document.querySelector('#bd-theme')

    // if (!themeSwitcher) {
    //   return
    // }

    // const themeSwitcherText = document.querySelector('#bd-theme-text')
    // const activeThemeIcon = document.querySelector('.theme-icon-active use')
    // const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
    // const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')

    // document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
    //   element.classList.remove('active')
    //   element.setAttribute('aria-pressed', 'false')
    // })

    // btnToActive.classList.add('active')
    // btnToActive.setAttribute('aria-pressed', 'true')
    // activeThemeIcon.setAttribute('href', svgOfActiveBtn)
    // const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    // themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

    // if (focus) {
    //   themeSwitcher.focus()
    // }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme())

    document.querySelectorAll('[data-bs-theme-value]')
      .forEach(toggle => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value')
          setStoredTheme(theme)
          setTheme(theme)
          showActiveTheme(theme, true)
          
          

        })
      })
  })
})()