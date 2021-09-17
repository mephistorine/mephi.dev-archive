window.addEventListener('DOMContentLoaded', () => {
  const themeSwitcherButtonRef = document.querySelector('.theme-switcher-button')
  const codeThemeLinkRef = document.querySelector('#code-theme-link')
  const codeThemeOptions = {
    light: '/static/styles/light-code-theme.css',
    dark: '/static/styles/dark-code-theme.css'
  }

  if (JSON.parse(localStorage.getItem('prefer-dark-theme'))
    && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('is-dark-theme')
    codeThemeLinkRef.setAttribute('href', codeThemeOptions.dark)
    localStorage.setItem('prefer-dark-theme', "true")
  }

  themeSwitcherButtonRef.addEventListener('click', () => {
    if (document.body.classList.contains('is-dark-theme')) {
      document.body.classList.remove('is-dark-theme')
      localStorage.setItem('prefer-dark-theme', "false")
      codeThemeLinkRef.setAttribute('href', codeThemeOptions.light)
    } else {
      document.body.classList.add('is-dark-theme')
      localStorage.setItem('prefer-dark-theme', "true")
      codeThemeLinkRef.setAttribute('href', codeThemeOptions.dark)
    }
  })
})
