// Cola mínima entre as telas copiadas do site SCTEC e a casca do protótipo.
// Na casca o hash do endereço é a rota da tela (#/rota), então:
// - âncoras internas (#id) rolam até o elemento em vez de trocar o hash;
// - links vazios (href="#") ficam parados.
(function () {
  if (window.SCTEC_SITE_GLUE) return
  window.SCTEC_SITE_GLUE = true
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]')
    if (!a) return
    var href = a.getAttribute('href')
    if (href === '#') { e.preventDefault(); return }
    var id = href.slice(1)
    if (!id || id.charAt(0) === '/') return
    var alvo = document.getElementById(id)
    if (!alvo) return
    e.preventDefault()
    alvo.style.scrollMarginTop = '96px'
    alvo.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})()
