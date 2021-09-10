window.addEventListener('DOMContentLoaded', () => {
  const themeSwitcherButtonRef = document.querySelector('.theme-switcher-button')

  if (localStorage.getItem('prefer-dark-theme')
    || window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('is-dark-theme')
    localStorage.setItem('prefer-dark-theme', true)
  }

  themeSwitcherButtonRef.addEventListener('click', () => {
    if (document.body.classList.contains('is-dark-theme')) {
      document.body.classList.remove('is-dark-theme')
    } else {
      document.body.classList.add('is-dark-theme')
    }
  })
})
