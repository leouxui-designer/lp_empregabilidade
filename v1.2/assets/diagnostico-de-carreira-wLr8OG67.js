var e=`/* Adaptado de assets/js/diagnostico-de-carreira.js (producao) para o prototipo: sem ActiveCampaign, sem trocar a URL da casca, sem eventos de rastreio.\r
   Mantem o quiz, a contagem e o resultado exatamente como em producao. */\r
window.url_script = window.url_script || {theme_directory: 'https://sctec.scti.sc.gov.br/wp-content/themes/sc-tec', site_url: ''};\r
window.ORDEM_DESEMPATE = window.ORDEM_DESEMPATE || [''];\r
window.TRILHAS_LINKS_INSCRICAO = {dev: '', dados: '', ia: ''};\r
window.TRILHAS_LINKS_ASSISTIR = {dev: '', dados: '', ia: ''};\r
window.TRILHAS_LINKS_WHATSAPP = {dev: '', dados: '', ia: ''};\r
/* ============================================================\r
 * diagnostico-de-carreira - assets/js/diagnostico-de-carreira.js\r
 * ------------------------------------------------------------\r
 * - Fluxo do quiz (perguntas + desempate + trilha vencedora)\r
 * - Embed ActiveCampaign (form id 15) + bind após injeção\r
 * - Envio via proc.php (JSON), mesma origem do formulário O Despertar\r
 * - Campo oculto da trilha: data-ac-trilha-field no container (name no AC)\r
 * - Tracking de sucesso:\r
 *   - event: sucesso_formulario\r
 *   - formulario: diagnostico-de-carreira\r
 *   - trilha: trilhaVencedora.nome\r
 * ============================================================ */\r
(function ($) {\r
  'use strict';\r
\r
  $(function () {\r
    const STORAGE_KEY = 'quiz_diagnostico_respostas';\r
\r
    const AC_CONTAINER_ID = 'sctec-diagnostico-ac-form';\r
    const AC_EMBED_SRC = 'https://fiesc89992.activehosted.com/f/embed.php?id=31';\r
    const AC_PROC_URL = 'https://fiesc89992.activehosted.com/proc.php?jsonp=true';\r
    const AC_FORM_MOUNT_CLASS = '_form_31';\r
    const CPF_FIELD_SELECTOR = 'input[name="field[7]"]';\r
\r
    const FORMULARIO_SLUG = 'diagnostico-de-carreira';\r
    const EVENT_SUCCESS_NAME = 'sucesso_formulario';\r
\r
    const linksInscricao = (typeof TRILHAS_LINKS_INSCRICAO !== 'undefined') ? TRILHAS_LINKS_INSCRICAO : {};\r
    const linksAssistir = (typeof TRILHAS_LINKS_ASSISTIR !== 'undefined') ? TRILHAS_LINKS_ASSISTIR : {};\r
    const linksWhatsapp = (typeof TRILHAS_LINKS_WHATSAPP !== 'undefined') ? TRILHAS_LINKS_WHATSAPP : {};\r
\r
    const TRILHAS = [\r
      {\r
        slug: 'dev',\r
        nome: 'Desenvolvimento de Software',\r
        banner: '/assets/img/trilha-dev-banner.webp',\r
        badgeIcon: '/assets/img/icons/badge-dev.svg',\r
        descricao: 'Seu perfil indica o universo da programação! Essa é uma área para quem quer aprender a desenvolver soluções web e mobile.',\r
        link_de_inscricao: linksInscricao.dev || '',\r
        link_assistir_palestras: linksAssistir.dev || '',\r
        link_grupo_whatsapp: linksWhatsapp.dev || '',\r
      },\r
      {\r
        slug: 'dados',\r
        nome: 'Análise de Dados',\r
        banner: '/assets/img/trilha-dados-banner.webp',\r
        badgeIcon: '/assets/img/icons/badge-dados.svg',\r
        descricao: 'Seu resultado combina com a exploração de dados! Uma área para quem deseja transformar informações em insights estratégicos.',\r
        link_de_inscricao: linksInscricao.dados || '',\r
        link_assistir_palestras: linksAssistir.dados || '',\r
        link_grupo_whatsapp: linksWhatsapp.dados || '',\r
      },\r
      {\r
        slug: 'ia',\r
        nome: 'Inteligência Artificial',\r
        banner: '/assets/img/trilha-ia-banner.webp',\r
        badgeIcon: '/assets/img/icons/badge-ia.svg',\r
        descricao: 'Seu diagnóstico aponta para o mundo da IA! Uma área para quem quer aprender a criar sistemas que analisam dados, fazem previsões e tomam decisões automatizadas.',\r
        link_de_inscricao: linksInscricao.ia || '',\r
        link_assistir_palestras: linksAssistir.ia || '',\r
        link_grupo_whatsapp: linksWhatsapp.ia || '',\r
      },\r
    ];\r
\r
    const $modal = $('#modal-diagnostico');\r
    const $quizCapa = $('.quiz-capa');\r
    const $quizWrapper = $('.quiz-wrapper');\r
    const $perguntas = $('.quiz-pergunta');\r
    const $contador = $('#quiz-atual');\r
    const $quizEmailEnvio = $('.quiz-envio-email');\r
    const $mensagemEnviado = $('.mensagem-diagnostico-enviado');\r
    const $btnComecar = $('#btn-comecar-diagnostico');\r
\r
    if (!$modal.length) return;\r
\r
    const totalPerguntas = $perguntas.length;\r
\r
    let indexAtual = 0;\r
    let trilhaVencedora = null;\r
\r
    let quizRespostas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};\r
\r
    let $submitBtn = null;\r
    let safetyTimer = null;\r
    let acSubmitting = false;\r
\r
    function buildSuccessUrl(formulario, trilhaNome) {\r
      const url = new URL(window.location.href);\r
      url.searchParams.set('status', 'concluido');\r
      url.searchParams.set('formulario', formulario);\r
      if (trilhaNome) url.searchParams.set('trilha', trilhaNome);\r
      return url;\r
    }\r
\r
    function alreadySentThisSession(key) {\r
      try {\r
        return sessionStorage.getItem(key) === '1';\r
      } catch (e) {\r
        return false;\r
      }\r
    }\r
\r
    function markSentThisSession(key) {\r
      try {\r
        sessionStorage.setItem(key, '1');\r
      } catch (e) {}\r
    }\r
\r
    function replaceUrlNoReload(urlObj) {\r
      try {\r
        /* prototipo: nao altera a URL */\r
      } catch (e) {}\r
    }\r
\r
    function pushToDataLayerDiagnostico(trilhaNome) {\r
      window.dataLayer = window.dataLayer || [];\r
      void ({\r
        event: EVENT_SUCCESS_NAME,\r
        status: 'concluido',\r
        formulario: FORMULARIO_SLUG,\r
        trilha: trilhaNome || ''\r
      });\r
    }\r
\r
    function fireInvisibleGet(urlObj) {\r
      try {\r
        const url = new URL(urlObj.toString());\r
        url.searchParams.set('_ts', String(Date.now()));\r
        /* prototipo: sem requisicao de rastreio */\r
      } catch (e) {}\r
    }\r
\r
    function lockButton($btn, text) {\r
      $submitBtn = ($btn && $btn.length) ? $btn : null;\r
\r
      if ($submitBtn) {\r
        if (!$submitBtn.data('original-text')) {\r
          $submitBtn.data('original-text', $submitBtn.text());\r
        }\r
        $submitBtn.prop('disabled', true).text(text || 'Enviando e-mail...');\r
      }\r
\r
      clearTimeout(safetyTimer);\r
      safetyTimer = setTimeout(() => {\r
        unlockButton();\r
      }, 20000);\r
    }\r
\r
    function unlockButton() {\r
      clearTimeout(safetyTimer);\r
      safetyTimer = null;\r
\r
      if ($submitBtn && $submitBtn.length) {\r
        const original = $submitBtn.data('original-text');\r
        $submitBtn.prop('disabled', false);\r
        if (original) $submitBtn.text(original);\r
      }\r
      $submitBtn = null;\r
    }\r
\r
    function scrollTopoModal() {\r
      const $scrollContainer = $modal.find('.modal-body');\r
      if ($scrollContainer.length) {\r
        $scrollContainer.animate({ scrollTop: 0 }, 300);\r
      } else {\r
        $('html, body').animate({ scrollTop: 0 }, 300);\r
      }\r
    }\r
\r
    function resetarEstadoModal() {\r
      $mensagemEnviado.hide();\r
      $quizEmailEnvio.hide();\r
      $quizWrapper.hide();\r
      $quizCapa.css('display', 'flex');\r
\r
      indexAtual = 0;\r
      trilhaVencedora = null;\r
\r
      quizRespostas = {};\r
      localStorage.removeItem(STORAGE_KEY);\r
\r
      $perguntas.find('input[type="radio"]').prop('checked', false);\r
\r
      unlockButton();\r
    }\r
\r
    function mostrarCapaNoModal() {\r
      $mensagemEnviado.hide();\r
      $quizEmailEnvio.hide();\r
      $quizWrapper.hide();\r
      $quizCapa.css('display', 'flex');\r
      scrollTopoModal();\r
    }\r
\r
    function iniciarQuizNoModal() {\r
      quizRespostas = {};\r
      localStorage.removeItem(STORAGE_KEY);\r
\r
      $quizCapa.hide();\r
      $mensagemEnviado.hide();\r
      $quizEmailEnvio.hide();\r
      $quizWrapper.css('display', 'flex');\r
\r
      mostrarPergunta(0);\r
    }\r
\r
    function salvarRespostas() {\r
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quizRespostas));\r
    }\r
\r
    function mostrarPergunta(index) {\r
      if (index < 0 || index >= totalPerguntas) return;\r
\r
      $perguntas.hide();\r
      $perguntas.eq(index).fadeIn(200, function () {\r
        scrollTopoModal();\r
      });\r
\r
      $contador.text(index + 1);\r
      indexAtual = index;\r
\r
      restaurarResposta(index + 1);\r
    }\r
\r
    function restaurarResposta(numeroPergunta) {\r
      if (!quizRespostas[numeroPergunta]) return;\r
\r
      const valor = quizRespostas[numeroPergunta];\r
\r
      $perguntas.eq(indexAtual)\r
        .find('input[type="radio"]')\r
        .filter(\`[value="\${valor}"]\`)\r
        .prop('checked', true);\r
    }\r
\r
    function diagnosticarTrilha(contagem) {\r
      const valores = Object.values(contagem);\r
      if (!valores.length) return null;\r
\r
      const maior = Math.max(...valores);\r
      const empatadas = Object.keys(contagem).filter(t => contagem[t] === maior);\r
\r
      if (empatadas.length === 1) return empatadas[0];\r
\r
      const ordem = Array.isArray(window.ORDEM_DESEMPATE) ? window.ORDEM_DESEMPATE : [];\r
      for (const t of ordem) {\r
        if (empatadas.includes(t)) return t;\r
      }\r
\r
      return empatadas[0] || null;\r
    }\r
\r
    function obterDadosTrilha(slug) {\r
      return TRILHAS.find(t => t.slug === slug) || null;\r
    }\r
\r
    function getAcRoot() {\r
      return document.getElementById(AC_CONTAINER_ID);\r
    }\r
\r
    function getAcContainerStringAttr(name) {\r
      const root = getAcRoot();\r
      return root ? (root.getAttribute(name) || '').trim() : '';\r
    }\r
\r
    function getTrilhaFieldName() {\r
      return getAcContainerStringAttr('data-ac-trilha-field');\r
    }\r
\r
    function getOndaFieldName() {\r
      return getAcContainerStringAttr('data-ac-onda-field');\r
    }\r
\r
    function getOndaFieldValue() {\r
      return getAcContainerStringAttr('data-ac-onda-value');\r
    }\r
\r
    function getCicloValue() {\r
      return getAcContainerStringAttr('data-ac-ciclo');\r
    }\r
\r
    // slug da trilha -> segmento usado no nome da tag no ActiveCampaign\r
    const TAG_TRILHA_SEGMENTO = {\r
      dev: 'Dev',\r
      dados: 'Dados',\r
      ia: 'IA',\r
    };\r
\r
    function buildTagDiagnostico(slug) {\r
      const segmento = TAG_TRILHA_SEGMENTO[slug];\r
      const ciclo = getCicloValue();\r
      if (!segmento || !ciclo) return '';\r
      return 'Diagnostico_de_Carreira_' + segmento + '_' + ciclo + '_Ciclo';\r
    }\r
\r
    function findInputByFieldName(root, name) {\r
      if (!root || !name) return null;\r
      const fields = root.querySelectorAll('input, textarea, select');\r
      for (let i = 0; i < fields.length; i++) {\r
        if (fields[i].name === name) return fields[i];\r
      }\r
      return null;\r
    }\r
\r
    function setTrilhaNoForm(slug) {\r
      const root = getAcRoot();\r
      const fieldName = getTrilhaFieldName();\r
      if (!root || !fieldName) return;\r
\r
      const input = findInputByFieldName(root, fieldName);\r
      if (input) input.value = slug;\r
    }\r
\r
    function hideTrilhaFieldInForm(form) {\r
      const fieldName = getTrilhaFieldName();\r
      if (!fieldName) return;\r
\r
      const input = findInputByFieldName(form, fieldName);\r
      if (!input) return;\r
\r
      const wrapper =\r
        input.closest('._form_element') ||\r
        input.closest('label') ||\r
        input.parentElement;\r
\r
      if (wrapper) wrapper.style.display = 'none';\r
    }\r
\r
    function hideAndFillOndaField(form) {\r
      const fieldName = getOndaFieldName();\r
      const value = getOndaFieldValue();\r
      if (!fieldName || !value) {\r
        return;\r
      }\r
      const input = findInputByFieldName(form, fieldName);\r
      if (!input) {\r
        return;\r
      }\r
      input.value = value;\r
      input.readOnly = true;\r
      const wrapper =\r
        input.closest('._form_element') ||\r
        input.closest('label') ||\r
        input.parentElement;\r
      if (wrapper) {\r
        wrapper.style.display = 'none';\r
      }\r
    }\r
\r
    function finalizarQuiz() {\r
      const contagem = {};\r
\r
      Object.values(quizRespostas).forEach(trilha => {\r
        contagem[trilha] = (contagem[trilha] || 0) + 1;\r
      });\r
\r
      const slugVencedor = diagnosticarTrilha(contagem);\r
      trilhaVencedora = slugVencedor ? obterDadosTrilha(slugVencedor) : null;\r
\r
      $quizWrapper.hide();\r
      $quizEmailEnvio.css('display', 'flex');\r
\r
      if (trilhaVencedora && trilhaVencedora.slug) {\r
        setTrilhaNoForm(trilhaVencedora.slug);\r
      }\r
\r
      localStorage.removeItem(STORAGE_KEY);\r
    }\r
\r
    function showSuccess() {\r
      clearTimeout(safetyTimer);\r
      safetyTimer = null;\r
\r
      const trilhaNome = (trilhaVencedora && trilhaVencedora.nome) ? trilhaVencedora.nome : '';\r
      const sessionKey = 'ac_success_sent_' + FORMULARIO_SLUG;\r
\r
      const successUrl = buildSuccessUrl(FORMULARIO_SLUG, trilhaNome);\r
\r
      replaceUrlNoReload(successUrl);\r
\r
      if (!alreadySentThisSession(sessionKey)) {\r
        markSentThisSession(sessionKey);\r
        pushToDataLayerDiagnostico(trilhaNome);\r
        fireInvisibleGet(successUrl);\r
      }\r
\r
      $quizEmailEnvio.hide();\r
\r
      if (trilhaVencedora) {\r
        const $resultadoCard = $mensagemEnviado.find('.resultado-card');\r
        $resultadoCard.attr('data-trilha-slug', trilhaVencedora.slug);\r
\r
        $resultadoCard.find('.resultado-card__banner-img')\r
          .attr('src', url_script.theme_directory + trilhaVencedora.banner)\r
          .attr('alt', 'Banner da trilha ' + trilhaVencedora.nome);\r
\r
        $resultadoCard.find('.resultado-card__title').text(trilhaVencedora.nome);\r
        $resultadoCard.find('.resultado-card__description').text(trilhaVencedora.descricao);\r
\r
        const badgeIconUrl = url_script.theme_directory + trilhaVencedora.badgeIcon;\r
        fetch(badgeIconUrl)\r
          .then(function(response) {\r
            if (!response.ok) throw new Error('Network error');\r
            return response.text();\r
          })\r
          .then(function(svgText) {\r
            $resultadoCard.find('.resultado-card__badge-icon').html(svgText);\r
          })\r
          .catch(function() {\r
            $resultadoCard.find('.resultado-card__badge-icon').html('<img src="' + badgeIconUrl + '" alt="">');\r
          });\r
\r
        $mensagemEnviado.find('.resultado-info-card__btn')\r
          .attr('data-acervo-filter', trilhaVencedora.slug);\r
      }\r
\r
      $mensagemEnviado.css('display', 'flex');\r
      unlockButton();\r
    }\r
\r
    function applyCpfMask(value) {\r
      const digits = value.replace(/\\D/g, '').slice(0, 11);\r
      if (digits.length > 9) return digits.replace(/(\\d{3})(\\d{3})(\\d{3})(\\d{1,2})/, '$1.$2.$3-$4');\r
      if (digits.length > 6) return digits.replace(/(\\d{3})(\\d{3})(\\d{1,3})/, '$1.$2.$3');\r
      if (digits.length > 3) return digits.replace(/(\\d{3})(\\d{1,3})/, '$1.$2');\r
      return digits;\r
    }\r
\r
    function computeCpfDigit(digits, length) {\r
      let sum = 0;\r
      for (let i = 0; i < length; i++) {\r
        sum += Number.parseInt(digits[i], 10) * (length + 1 - i);\r
      }\r
      const remainder = (sum * 10) % 11;\r
      return remainder === 10 ? 0 : remainder;\r
    }\r
\r
    function isValidCpf(cpf) {\r
      const digits = cpf.replace(/\\D/g, '');\r
      if (digits.length !== 11) return false;\r
      if (/^(\\d)\\1{10}$/.test(digits)) return false;\r
\r
      const first = computeCpfDigit(digits, 9);\r
      if (first !== Number.parseInt(digits[9], 10)) return false;\r
\r
      const second = computeCpfDigit(digits, 10);\r
      return second === Number.parseInt(digits[10], 10);\r
    }\r
\r
    function getOrCreateCpfError(input) {\r
      let errorEl = input.parentElement.querySelector('.ac-cpf-error');\r
      if (!errorEl) {\r
        errorEl = document.createElement('span');\r
        errorEl.className = 'ac-cpf-error';\r
        input.parentElement.appendChild(errorEl);\r
      }\r
      return errorEl;\r
    }\r
\r
    function showCpfError(input, msg) {\r
      const errorEl = getOrCreateCpfError(input);\r
      errorEl.textContent = msg;\r
    }\r
\r
    function clearCpfError(input) {\r
      const errorEl = input.parentElement.querySelector('.ac-cpf-error');\r
      if (errorEl) errorEl.textContent = '';\r
    }\r
\r
    function bindCpfField(form) {\r
      const cpfInput = form.querySelector(CPF_FIELD_SELECTOR);\r
      if (!cpfInput) return;\r
\r
      cpfInput.setAttribute('inputmode', 'numeric');\r
      cpfInput.setAttribute('maxlength', '14');\r
\r
      cpfInput.addEventListener('input', () => {\r
        const pos = cpfInput.selectionStart || 0;\r
        const rawBefore = cpfInput.value.slice(0, pos).replace(/\\D/g, '').length;\r
        cpfInput.value = applyCpfMask(cpfInput.value);\r
\r
        let newPos = 0;\r
        let count = 0;\r
        for (let i = 0; i < cpfInput.value.length && count < rawBefore; i++) {\r
          newPos = i + 1;\r
          if (/\\d/.test(cpfInput.value[i])) count++;\r
        }\r
        cpfInput.setSelectionRange(newPos, newPos);\r
        clearCpfError(cpfInput);\r
        cpfInput.setCustomValidity('');\r
      });\r
\r
      cpfInput.addEventListener('blur', () => {\r
        const rawDigits = cpfInput.value.replace(/\\D/g, '');\r
        if (rawDigits.length === 0 || rawDigits.length !== 11) {\r
          cpfInput.setCustomValidity('');\r
          clearCpfError(cpfInput);\r
          return;\r
        }\r
\r
        if (isValidCpf(rawDigits)) {\r
          cpfInput.setCustomValidity('');\r
          clearCpfError(cpfInput);\r
          return;\r
        }\r
\r
        cpfInput.setCustomValidity('CPF inválido');\r
        showCpfError(cpfInput, 'CPF inválido');\r
      });\r
\r
      cpfInput.addEventListener('keydown', e => {\r
        const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];\r
        if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;\r
        if (!/^\\d$/.test(e.key)) e.preventDefault();\r
      });\r
    }\r
\r
    function applyPhoneMask(value) {\r
      const digits = value.replace(/\\D/g, '').slice(0, 11);\r
      if (digits.length > 6) return digits.replace(/(\\d{2})(\\d{5})(\\d{0,4})/, '$1 $2-$3');\r
      if (digits.length > 2) return digits.replace(/(\\d{2})(\\d{0,5})/, '$1 $2');\r
      return digits;\r
    }\r
\r
    function bindPhoneField(form) {\r
      const phoneInput = getVisiblePhoneInput(form);\r
      if (!phoneInput) return;\r
\r
      phoneInput.setAttribute('inputmode', 'numeric');\r
      phoneInput.setAttribute('maxlength', '15');\r
\r
      phoneInput.addEventListener('input', () => {\r
        const pos = phoneInput.selectionStart || 0;\r
        const rawBefore = phoneInput.value.slice(0, pos).replace(/\\D/g, '').length;\r
        phoneInput.value = applyPhoneMask(phoneInput.value);\r
\r
        let newPos = 0;\r
        let count = 0;\r
        for (let i = 0; i < phoneInput.value.length && count < rawBefore; i++) {\r
          newPos = i + 1;\r
          if (/\\d/.test(phoneInput.value[i])) count++;\r
        }\r
        phoneInput.setSelectionRange(newPos, newPos);\r
      });\r
\r
      phoneInput.addEventListener('keydown', e => {\r
        const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];\r
        if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;\r
        if (!/^\\d$/.test(e.key)) e.preventDefault();\r
\r
        const digits = phoneInput.value.replace(/\\D/g, '');\r
        if (digits.length >= 11 && /^\\d$/.test(e.key)) {\r
          e.preventDefault();\r
        }\r
      });\r
    }\r
\r
    function getVisiblePhoneInput(form) {\r
      return form.querySelector('input[type="tel"], input[name="phone-iti"]');\r
    }\r
\r
    function getHiddenPhoneInput(form) {\r
      return form.querySelector('input[name="phone"]');\r
    }\r
\r
    function getSelectedDialCode(form) {\r
      const el = form.querySelector('.iti__selected-dial-code');\r
      return el ? el.textContent.trim() : '';\r
    }\r
\r
    function buildInternationalPhone(form) {\r
      const visible = getVisiblePhoneInput(form);\r
      if (!visible) return '';\r
\r
      let phone = visible.value.trim();\r
\r
      if (window.iti && typeof window.iti.getNumber === 'function') {\r
        const intl = window.iti.getNumber();\r
        if (intl) return intl;\r
      }\r
\r
      if (!phone.startsWith('+')) {\r
        const ddi = getSelectedDialCode(form);\r
        if (ddi) phone = ddi + ' ' + phone;\r
      }\r
\r
      return phone;\r
    }\r
\r
    function syncPhoneFieldsIfAny(form) {\r
      const hidden = getHiddenPhoneInput(form);\r
      const finalPhone = buildInternationalPhone(form);\r
      if (hidden && finalPhone) hidden.value = finalPhone;\r
    }\r
\r
    function isValidPhone(form) {\r
      const visible = getVisiblePhoneInput(form);\r
      if (!visible) return true;\r
\r
      const finalPhone = buildInternationalPhone(form);\r
      const digits = finalPhone.replace(/\\D/g, '');\r
      return digits.length >= 10;\r
    }\r
\r
    function serializeAcForm(form) {\r
      syncPhoneFieldsIfAny(form);\r
\r
      const fd = new FormData(form);\r
      const params = new URLSearchParams();\r
\r
      fd.forEach((v, k) => {\r
        if (k !== 'hideButton') params.append(k, v);\r
      });\r
\r
      // relaciona a tag do perfil vencedor do diagnóstico (ex.: Diagnostico_de_Carreira_Dev_3_Ciclo)\r
      if (trilhaVencedora && trilhaVencedora.slug) {\r
        const tagDiagnostico = buildTagDiagnostico(trilhaVencedora.slug);\r
        if (tagDiagnostico) {\r
          params.append('tags[]', tagDiagnostico);\r
        }\r
      }\r
\r
      return params.toString();\r
    }\r
\r
    function showAcFormError(form, msg) {\r
      let errorBox = form.querySelector('.ac-diagnostico-error');\r
\r
      if (!errorBox) {\r
        errorBox = document.createElement('div');\r
        errorBox.className = 'ac-diagnostico-error';\r
        errorBox.style.marginTop = '12px';\r
        errorBox.style.color = '#e53935';\r
        errorBox.style.fontSize = '14px';\r
        const btnWrapper = form.querySelector('._button-wrapper') || form;\r
        btnWrapper.parentNode.insertBefore(errorBox, btnWrapper.nextSibling);\r
      }\r
\r
      errorBox.textContent = msg;\r
    }\r
\r
    function clearAcFormError(form) {\r
      const errorBox = form.querySelector('.ac-diagnostico-error');\r
      if (errorBox) errorBox.textContent = '';\r
    }\r
\r
    async function postActiveCampaign(form) {\r
      const body = serializeAcForm(form);\r
\r
      if (true) return {};\r
      const res = await fetch(AC_PROC_URL, {\r
        method: 'POST',\r
        headers: {\r
          Accept: 'application/json',\r
          'Content-Type': 'application/x-www-form-urlencoded'\r
        },\r
        body\r
      });\r
\r
      const data = await res.json();\r
\r
      if (data.action === 'show_error') {\r
        throw new Error(data.message);\r
      }\r
\r
      return data;\r
    }\r
\r
    function customizeAcFields(form) {\r
      const firstNameInput = form.querySelector('input[name="firstname"]');\r
      const emailInput = form.querySelector('input[name="email"]');\r
      const phoneInput = getVisiblePhoneInput(form);\r
      const cpfInput = form.querySelector(CPF_FIELD_SELECTOR);\r
\r
      if (firstNameInput) firstNameInput.placeholder = 'Nome Completo';\r
      if (emailInput) emailInput.placeholder = 'E-mail';\r
      if (cpfInput) cpfInput.placeholder = 'CPF';\r
      if (phoneInput) phoneInput.placeholder = 'Celular (WhatsApp)';\r
    }\r
\r
    function bindAcForm(form) {\r
      if (!form || form.dataset.diagnosticoAcBound === '1') return;\r
\r
      form.dataset.diagnosticoAcBound = '1';\r
\r
      customizeAcFields(form);\r
      hideTrilhaFieldInForm(form);\r
      hideAndFillOndaField(form);\r
      bindCpfField(form);\r
      bindPhoneField(form);\r
\r
      if (trilhaVencedora && trilhaVencedora.slug) {\r
        setTrilhaNoForm(trilhaVencedora.slug);\r
      }\r
\r
      const submitBtn = form.querySelector('button._submit');\r
      const interceptTarget = form.parentElement || form;\r
\r
      interceptTarget.addEventListener('submit', async function (e) {\r
        if (e.target !== form && !form.contains(e.target)) return;\r
\r
        e.preventDefault();\r
        e.stopImmediatePropagation();\r
\r
        if (acSubmitting) return;\r
\r
        clearAcFormError(form);\r
\r
        const phoneOk = isValidPhone(form);\r
        const cpfInput = form.querySelector(CPF_FIELD_SELECTOR);\r
\r
        if (cpfInput && cpfInput.value.replace(/\\D/g, '').length > 0 && !isValidCpf(cpfInput.value)) {\r
          cpfInput.setCustomValidity('CPF inválido');\r
          showCpfError(cpfInput, 'CPF inválido');\r
        }\r
\r
        if (!phoneOk) {\r
          showAcFormError(form, 'Informe um celular válido com DDD.');\r
        }\r
\r
        if (!phoneOk || !form.checkValidity()) {\r
          form.reportValidity();\r
          return;\r
        }\r
\r
        if (trilhaVencedora && trilhaVencedora.slug) {\r
          setTrilhaNoForm(trilhaVencedora.slug);\r
        }\r
\r
        acSubmitting = true;\r
\r
        const $btn = submitBtn ? $(submitBtn) : null;\r
        if ($btn && $btn.length) lockButton($btn, 'Enviando...');\r
\r
        try {\r
          await postActiveCampaign(form);\r
          showSuccess();\r
        } catch (err) {\r
          if ($btn && $btn.length) unlockButton();\r
\r
          showAcFormError(form, err.message || 'Erro ao enviar.');\r
        } finally {\r
          acSubmitting = false;\r
        }\r
      }, true);\r
    }\r
\r
    function injectAcEmbed() {\r
      return;\r
      const root = getAcRoot();\r
      if (!root) return;\r
\r
      root.replaceChildren();\r
\r
      const mount = document.createElement('div');\r
      mount.className = AC_FORM_MOUNT_CLASS;\r
      mount.id = 'diagnostico_ac_embed_31';\r
      root.appendChild(mount);\r
\r
      const script = document.createElement('script');\r
      script.src = AC_EMBED_SRC + '&_=' + Date.now();\r
      script.charset = 'utf-8';\r
      root.appendChild(script);\r
    }\r
\r
    function watchAcFormMount() {\r
      const container = getAcRoot();\r
      if (!container) return;\r
\r
      const tryBind = function () {\r
        const form = container.querySelector('form._form');\r
        if (form) bindAcForm(form);\r
      };\r
\r
      tryBind();\r
      new MutationObserver(tryBind).observe(container, { childList: true, subtree: true });\r
    }\r
\r
    $modal.on('hide.bs.modal', function () {\r
      const active = document.activeElement;\r
      if (active && this.contains(active)) active.blur();\r
    });\r
\r
    $modal.on('shown.bs.modal', function () {\r
      mostrarCapaNoModal();\r
      const existingEmbed = document.getElementById('diagnostico_ac_embed_31');\r
      if (existingEmbed) {\r
        watchAcFormMount();\r
      } else {\r
        injectAcEmbed();\r
        watchAcFormMount();\r
      }\r
    });\r
\r
    $modal.on('hidden.bs.modal', function () {\r
      resetarEstadoModal();\r
    });\r
\r
    $btnComecar.on('click', function () {\r
      iniciarQuizNoModal();\r
    });\r
\r
    $(document).off('click.ctdiag').on('click.ctdiag', '.quiz-btn.anterior', function () {\r
      mostrarPergunta(indexAtual - 1);\r
    });\r
\r
    $(document).off('change.ctdiag').on('change.ctdiag', '.alternativa input', function () {\r
      quizRespostas[indexAtual + 1] = $(this).val();\r
      salvarRespostas();\r
\r
      setTimeout(() => {\r
        indexAtual < totalPerguntas - 1\r
          ? mostrarPergunta(indexAtual + 1)\r
          : finalizarQuiz();\r
      }, 200);\r
    });\r
\r
    $mensagemEnviado.on('click', '.resultado-info-card__btn', function (e) {\r
      e.preventDefault();\r
      e.stopPropagation();\r
\r
      var $btn = $(this);\r
      var trilhaSlug = $btn.attr('data-acervo-filter');\r
\r
      if (!trilhaSlug) {\r
        trilhaSlug = trilhaVencedora ? trilhaVencedora.slug : null;\r
      }\r
\r
      if (!trilhaSlug) return;\r
\r
      $modal.modal('hide');\r
\r
      $modal.one('hidden.bs.modal', function () {\r
        if (window.acervoModal && typeof window.acervoModal.open === 'function') {\r
          window.acervoModal.open(trilhaSlug);\r
        }\r
      });\r
    });\r
\r
  });\r
})(jQuery);\r
`;export{e as default};