var e=`/**\r
 * Scroll suave para o formulário sem alterar a URL.\r
 *\r
 * Preserva os parâmetros UTM na barra de endereço ao navegar\r
 * para a seção #garanta-acesso via JavaScript em vez de âncora HTML.\r
 */\r
(function () {\r
  'use strict';\r
\r
  function handleClick(e) {\r
    var link = e.currentTarget;\r
    var targetId = (link.getAttribute('href') || '').replace('#', '');\r
    var target = targetId ? document.getElementById(targetId) : null;\r
\r
    if (!target) return;\r
\r
    e.preventDefault();\r
\r
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });\r
  }\r
\r
  function init() {\r
    var links = document.querySelectorAll('.js-scroll-to-form');\r
\r
    for (var i = 0; i < links.length; i++) {\r
      links[i].addEventListener('click', handleClick);\r
    }\r
  }\r
\r
  if (document.readyState === 'loading') {\r
    document.addEventListener('DOMContentLoaded', init);\r
  } else {\r
    init();\r
  }\r
})();\r
`;export{e as default};