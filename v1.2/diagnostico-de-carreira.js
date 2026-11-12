/* Adaptado de assets/js/diagnostico-de-carreira.js (producao) para o prototipo: sem ActiveCampaign, sem trocar a URL da casca, sem eventos de rastreio.
   Mantem o quiz, a contagem e o resultado exatamente como em producao. */
window.url_script = window.url_script || {theme_directory: 'https://sctec.scti.sc.gov.br/wp-content/themes/sc-tec', site_url: ''};
window.ORDEM_DESEMPATE = window.ORDEM_DESEMPATE || [''];
window.TRILHAS_LINKS_INSCRICAO = {dev: '', dados: '', ia: ''};
window.TRILHAS_LINKS_ASSISTIR = {dev: '', dados: '', ia: ''};
window.TRILHAS_LINKS_WHATSAPP = {dev: '', dados: '', ia: ''};
/* ============================================================
 * diagnostico-de-carreira - assets/js/diagnostico-de-carreira.js
 * ------------------------------------------------------------
 * - Fluxo do quiz (perguntas + desempate + trilha vencedora)
 * - Embed ActiveCampaign (form id 15) + bind após injeção
 * - Envio via proc.php (JSON), mesma origem do formulário O Despertar
 * - Campo oculto da trilha: data-ac-trilha-field no container (name no AC)
 * - Tracking de sucesso:
 *   - event: sucesso_formulario
 *   - formulario: diagnostico-de-carreira
 *   - trilha: trilhaVencedora.nome
 * ============================================================ */
(function ($) {
  'use strict';

  $(function () {
    const STORAGE_KEY = 'quiz_diagnostico_respostas';

    const AC_CONTAINER_ID = 'sctec-diagnostico-ac-form';
    const AC_EMBED_SRC = 'https://fiesc89992.activehosted.com/f/embed.php?id=31';
    const AC_PROC_URL = 'https://fiesc89992.activehosted.com/proc.php?jsonp=true';
    const AC_FORM_MOUNT_CLASS = '_form_31';
    const CPF_FIELD_SELECTOR = 'input[name="field[7]"]';

    const FORMULARIO_SLUG = 'diagnostico-de-carreira';
    const EVENT_SUCCESS_NAME = 'sucesso_formulario';

    const linksInscricao = (typeof TRILHAS_LINKS_INSCRICAO !== 'undefined') ? TRILHAS_LINKS_INSCRICAO : {};
    const linksAssistir = (typeof TRILHAS_LINKS_ASSISTIR !== 'undefined') ? TRILHAS_LINKS_ASSISTIR : {};
    const linksWhatsapp = (typeof TRILHAS_LINKS_WHATSAPP !== 'undefined') ? TRILHAS_LINKS_WHATSAPP : {};

    const TRILHAS = [
      {
        slug: 'dev',
        nome: 'Desenvolvimento de Software',
        banner: '/assets/img/trilha-dev-banner.webp',
        badgeIcon: '/assets/img/icons/badge-dev.svg',
        descricao: 'Seu perfil indica o universo da programação! Essa é uma área para quem quer aprender a desenvolver soluções web e mobile.',
        link_de_inscricao: linksInscricao.dev || '',
        link_assistir_palestras: linksAssistir.dev || '',
        link_grupo_whatsapp: linksWhatsapp.dev || '',
      },
      {
        slug: 'dados',
        nome: 'Análise de Dados',
        banner: '/assets/img/trilha-dados-banner.webp',
        badgeIcon: '/assets/img/icons/badge-dados.svg',
        descricao: 'Seu resultado combina com a exploração de dados! Uma área para quem deseja transformar informações em insights estratégicos.',
        link_de_inscricao: linksInscricao.dados || '',
        link_assistir_palestras: linksAssistir.dados || '',
        link_grupo_whatsapp: linksWhatsapp.dados || '',
      },
      {
        slug: 'ia',
        nome: 'Inteligência Artificial',
        banner: '/assets/img/trilha-ia-banner.webp',
        badgeIcon: '/assets/img/icons/badge-ia.svg',
        descricao: 'Seu diagnóstico aponta para o mundo da IA! Uma área para quem quer aprender a criar sistemas que analisam dados, fazem previsões e tomam decisões automatizadas.',
        link_de_inscricao: linksInscricao.ia || '',
        link_assistir_palestras: linksAssistir.ia || '',
        link_grupo_whatsapp: linksWhatsapp.ia || '',
      },
    ];

    const $modal = $('#modal-diagnostico');
    const $quizCapa = $('.quiz-capa');
    const $quizWrapper = $('.quiz-wrapper');
    const $perguntas = $('.quiz-pergunta');
    const $contador = $('#quiz-atual');
    const $quizEmailEnvio = $('.quiz-envio-email');
    const $mensagemEnviado = $('.mensagem-diagnostico-enviado');
    const $btnComecar = $('#btn-comecar-diagnostico');

    if (!$modal.length) return;

    const totalPerguntas = $perguntas.length;

    let indexAtual = 0;
    let trilhaVencedora = null;

    let quizRespostas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    let $submitBtn = null;
    let safetyTimer = null;
    let acSubmitting = false;

    function buildSuccessUrl(formulario, trilhaNome) {
      const url = new URL(window.location.href);
      url.searchParams.set('status', 'concluido');
      url.searchParams.set('formulario', formulario);
      if (trilhaNome) url.searchParams.set('trilha', trilhaNome);
      return url;
    }

    function alreadySentThisSession(key) {
      try {
        return sessionStorage.getItem(key) === '1';
      } catch (e) {
        return false;
      }
    }

    function markSentThisSession(key) {
      try {
        sessionStorage.setItem(key, '1');
      } catch (e) {}
    }

    function replaceUrlNoReload(urlObj) {
      try {
        /* prototipo: nao altera a URL */
      } catch (e) {}
    }

    function pushToDataLayerDiagnostico(trilhaNome) {
      window.dataLayer = window.dataLayer || [];
      void ({
        event: EVENT_SUCCESS_NAME,
        status: 'concluido',
        formulario: FORMULARIO_SLUG,
        trilha: trilhaNome || ''
      });
    }

    function fireInvisibleGet(urlObj) {
      try {
        const url = new URL(urlObj.toString());
        url.searchParams.set('_ts', String(Date.now()));
        /* prototipo: sem requisicao de rastreio */
      } catch (e) {}
    }

    function lockButton($btn, text) {
      $submitBtn = ($btn && $btn.length) ? $btn : null;

      if ($submitBtn) {
        if (!$submitBtn.data('original-text')) {
          $submitBtn.data('original-text', $submitBtn.text());
        }
        $submitBtn.prop('disabled', true).text(text || 'Enviando e-mail...');
      }

      clearTimeout(safetyTimer);
      safetyTimer = setTimeout(() => {
        unlockButton();
      }, 20000);
    }

    function unlockButton() {
      clearTimeout(safetyTimer);
      safetyTimer = null;

      if ($submitBtn && $submitBtn.length) {
        const original = $submitBtn.data('original-text');
        $submitBtn.prop('disabled', false);
        if (original) $submitBtn.text(original);
      }
      $submitBtn = null;
    }

    function scrollTopoModal() {
      const $scrollContainer = $modal.find('.modal-body');
      if ($scrollContainer.length) {
        $scrollContainer.animate({ scrollTop: 0 }, 300);
      } else {
        $('html, body').animate({ scrollTop: 0 }, 300);
      }
    }

    function resetarEstadoModal() {
      $mensagemEnviado.hide();
      $quizEmailEnvio.hide();
      $quizWrapper.hide();
      $quizCapa.css('display', 'flex');

      indexAtual = 0;
      trilhaVencedora = null;

      quizRespostas = {};
      localStorage.removeItem(STORAGE_KEY);

      $perguntas.find('input[type="radio"]').prop('checked', false);

      unlockButton();
    }

    function mostrarCapaNoModal() {
      $mensagemEnviado.hide();
      $quizEmailEnvio.hide();
      $quizWrapper.hide();
      $quizCapa.css('display', 'flex');
      scrollTopoModal();
    }

    function iniciarQuizNoModal() {
      quizRespostas = {};
      localStorage.removeItem(STORAGE_KEY);

      $quizCapa.hide();
      $mensagemEnviado.hide();
      $quizEmailEnvio.hide();
      $quizWrapper.css('display', 'flex');

      mostrarPergunta(0);
    }

    function salvarRespostas() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quizRespostas));
    }

    function mostrarPergunta(index) {
      if (index < 0 || index >= totalPerguntas) return;

      $perguntas.hide();
      $perguntas.eq(index).fadeIn(200, function () {
        scrollTopoModal();
      });

      $contador.text(index + 1);
      indexAtual = index;

      restaurarResposta(index + 1);
    }

    function restaurarResposta(numeroPergunta) {
      if (!quizRespostas[numeroPergunta]) return;

      const valor = quizRespostas[numeroPergunta];

      $perguntas.eq(indexAtual)
        .find('input[type="radio"]')
        .filter(`[value="${valor}"]`)
        .prop('checked', true);
    }

    function diagnosticarTrilha(contagem) {
      const valores = Object.values(contagem);
      if (!valores.length) return null;

      const maior = Math.max(...valores);
      const empatadas = Object.keys(contagem).filter(t => contagem[t] === maior);

      if (empatadas.length === 1) return empatadas[0];

      const ordem = Array.isArray(window.ORDEM_DESEMPATE) ? window.ORDEM_DESEMPATE : [];
      for (const t of ordem) {
        if (empatadas.includes(t)) return t;
      }

      return empatadas[0] || null;
    }

    function obterDadosTrilha(slug) {
      return TRILHAS.find(t => t.slug === slug) || null;
    }

    function getAcRoot() {
      return document.getElementById(AC_CONTAINER_ID);
    }

    function getAcContainerStringAttr(name) {
      const root = getAcRoot();
      return root ? (root.getAttribute(name) || '').trim() : '';
    }

    function getTrilhaFieldName() {
      return getAcContainerStringAttr('data-ac-trilha-field');
    }

    function getOndaFieldName() {
      return getAcContainerStringAttr('data-ac-onda-field');
    }

    function getOndaFieldValue() {
      return getAcContainerStringAttr('data-ac-onda-value');
    }

    function getCicloValue() {
      return getAcContainerStringAttr('data-ac-ciclo');
    }

    // slug da trilha -> segmento usado no nome da tag no ActiveCampaign
    const TAG_TRILHA_SEGMENTO = {
      dev: 'Dev',
      dados: 'Dados',
      ia: 'IA',
    };

    function buildTagDiagnostico(slug) {
      const segmento = TAG_TRILHA_SEGMENTO[slug];
      const ciclo = getCicloValue();
      if (!segmento || !ciclo) return '';
      return 'Diagnostico_de_Carreira_' + segmento + '_' + ciclo + '_Ciclo';
    }

    function findInputByFieldName(root, name) {
      if (!root || !name) return null;
      const fields = root.querySelectorAll('input, textarea, select');
      for (let i = 0; i < fields.length; i++) {
        if (fields[i].name === name) return fields[i];
      }
      return null;
    }

    function setTrilhaNoForm(slug) {
      const root = getAcRoot();
      const fieldName = getTrilhaFieldName();
      if (!root || !fieldName) return;

      const input = findInputByFieldName(root, fieldName);
      if (input) input.value = slug;
    }

    function hideTrilhaFieldInForm(form) {
      const fieldName = getTrilhaFieldName();
      if (!fieldName) return;

      const input = findInputByFieldName(form, fieldName);
      if (!input) return;

      const wrapper =
        input.closest('._form_element') ||
        input.closest('label') ||
        input.parentElement;

      if (wrapper) wrapper.style.display = 'none';
    }

    function hideAndFillOndaField(form) {
      const fieldName = getOndaFieldName();
      const value = getOndaFieldValue();
      if (!fieldName || !value) {
        return;
      }
      const input = findInputByFieldName(form, fieldName);
      if (!input) {
        return;
      }
      input.value = value;
      input.readOnly = true;
      const wrapper =
        input.closest('._form_element') ||
        input.closest('label') ||
        input.parentElement;
      if (wrapper) {
        wrapper.style.display = 'none';
      }
    }

    function finalizarQuiz() {
      const contagem = {};

      Object.values(quizRespostas).forEach(trilha => {
        contagem[trilha] = (contagem[trilha] || 0) + 1;
      });

      const slugVencedor = diagnosticarTrilha(contagem);
      trilhaVencedora = slugVencedor ? obterDadosTrilha(slugVencedor) : null;

      $quizWrapper.hide();
      $quizEmailEnvio.css('display', 'flex');

      if (trilhaVencedora && trilhaVencedora.slug) {
        setTrilhaNoForm(trilhaVencedora.slug);
      }

      localStorage.removeItem(STORAGE_KEY);
    }

    function showSuccess() {
      clearTimeout(safetyTimer);
      safetyTimer = null;

      const trilhaNome = (trilhaVencedora && trilhaVencedora.nome) ? trilhaVencedora.nome : '';
      const sessionKey = 'ac_success_sent_' + FORMULARIO_SLUG;

      const successUrl = buildSuccessUrl(FORMULARIO_SLUG, trilhaNome);

      replaceUrlNoReload(successUrl);

      if (!alreadySentThisSession(sessionKey)) {
        markSentThisSession(sessionKey);
        pushToDataLayerDiagnostico(trilhaNome);
        fireInvisibleGet(successUrl);
      }

      $quizEmailEnvio.hide();

      if (trilhaVencedora) {
        const $resultadoCard = $mensagemEnviado.find('.resultado-card');
        $resultadoCard.attr('data-trilha-slug', trilhaVencedora.slug);

        $resultadoCard.find('.resultado-card__banner-img')
          .attr('src', url_script.theme_directory + trilhaVencedora.banner)
          .attr('alt', 'Banner da trilha ' + trilhaVencedora.nome);

        $resultadoCard.find('.resultado-card__title').text(trilhaVencedora.nome);
        $resultadoCard.find('.resultado-card__description').text(trilhaVencedora.descricao);

        const badgeIconUrl = url_script.theme_directory + trilhaVencedora.badgeIcon;
        fetch(badgeIconUrl)
          .then(function(response) {
            if (!response.ok) throw new Error('Network error');
            return response.text();
          })
          .then(function(svgText) {
            $resultadoCard.find('.resultado-card__badge-icon').html(svgText);
          })
          .catch(function() {
            $resultadoCard.find('.resultado-card__badge-icon').html('<img src="' + badgeIconUrl + '" alt="">');
          });

        $mensagemEnviado.find('.resultado-info-card__btn')
          .attr('data-acervo-filter', trilhaVencedora.slug);
      }

      $mensagemEnviado.css('display', 'flex');
      unlockButton();
    }

    function applyCpfMask(value) {
      const digits = value.replace(/\D/g, '').slice(0, 11);
      if (digits.length > 9) return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
      if (digits.length > 6) return digits.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      if (digits.length > 3) return digits.replace(/(\d{3})(\d{1,3})/, '$1.$2');
      return digits;
    }

    function computeCpfDigit(digits, length) {
      let sum = 0;
      for (let i = 0; i < length; i++) {
        sum += Number.parseInt(digits[i], 10) * (length + 1 - i);
      }
      const remainder = (sum * 10) % 11;
      return remainder === 10 ? 0 : remainder;
    }

    function isValidCpf(cpf) {
      const digits = cpf.replace(/\D/g, '');
      if (digits.length !== 11) return false;
      if (/^(\d)\1{10}$/.test(digits)) return false;

      const first = computeCpfDigit(digits, 9);
      if (first !== Number.parseInt(digits[9], 10)) return false;

      const second = computeCpfDigit(digits, 10);
      return second === Number.parseInt(digits[10], 10);
    }

    function getOrCreateCpfError(input) {
      let errorEl = input.parentElement.querySelector('.ac-cpf-error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'ac-cpf-error';
        input.parentElement.appendChild(errorEl);
      }
      return errorEl;
    }

    function showCpfError(input, msg) {
      const errorEl = getOrCreateCpfError(input);
      errorEl.textContent = msg;
    }

    function clearCpfError(input) {
      const errorEl = input.parentElement.querySelector('.ac-cpf-error');
      if (errorEl) errorEl.textContent = '';
    }

    function bindCpfField(form) {
      const cpfInput = form.querySelector(CPF_FIELD_SELECTOR);
      if (!cpfInput) return;

      cpfInput.setAttribute('inputmode', 'numeric');
      cpfInput.setAttribute('maxlength', '14');

      cpfInput.addEventListener('input', () => {
        const pos = cpfInput.selectionStart || 0;
        const rawBefore = cpfInput.value.slice(0, pos).replace(/\D/g, '').length;
        cpfInput.value = applyCpfMask(cpfInput.value);

        let newPos = 0;
        let count = 0;
        for (let i = 0; i < cpfInput.value.length && count < rawBefore; i++) {
          newPos = i + 1;
          if (/\d/.test(cpfInput.value[i])) count++;
        }
        cpfInput.setSelectionRange(newPos, newPos);
        clearCpfError(cpfInput);
        cpfInput.setCustomValidity('');
      });

      cpfInput.addEventListener('blur', () => {
        const rawDigits = cpfInput.value.replace(/\D/g, '');
        if (rawDigits.length === 0 || rawDigits.length !== 11) {
          cpfInput.setCustomValidity('');
          clearCpfError(cpfInput);
          return;
        }

        if (isValidCpf(rawDigits)) {
          cpfInput.setCustomValidity('');
          clearCpfError(cpfInput);
          return;
        }

        cpfInput.setCustomValidity('CPF inválido');
        showCpfError(cpfInput, 'CPF inválido');
      });

      cpfInput.addEventListener('keydown', e => {
        const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
        if (!/^\d$/.test(e.key)) e.preventDefault();
      });
    }

    function applyPhoneMask(value) {
      const digits = value.replace(/\D/g, '').slice(0, 11);
      if (digits.length > 6) return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '$1 $2-$3');
      if (digits.length > 2) return digits.replace(/(\d{2})(\d{0,5})/, '$1 $2');
      return digits;
    }

    function bindPhoneField(form) {
      const phoneInput = getVisiblePhoneInput(form);
      if (!phoneInput) return;

      phoneInput.setAttribute('inputmode', 'numeric');
      phoneInput.setAttribute('maxlength', '15');

      phoneInput.addEventListener('input', () => {
        const pos = phoneInput.selectionStart || 0;
        const rawBefore = phoneInput.value.slice(0, pos).replace(/\D/g, '').length;
        phoneInput.value = applyPhoneMask(phoneInput.value);

        let newPos = 0;
        let count = 0;
        for (let i = 0; i < phoneInput.value.length && count < rawBefore; i++) {
          newPos = i + 1;
          if (/\d/.test(phoneInput.value[i])) count++;
        }
        phoneInput.setSelectionRange(newPos, newPos);
      });

      phoneInput.addEventListener('keydown', e => {
        const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
        if (!/^\d$/.test(e.key)) e.preventDefault();

        const digits = phoneInput.value.replace(/\D/g, '');
        if (digits.length >= 11 && /^\d$/.test(e.key)) {
          e.preventDefault();
        }
      });
    }

    function getVisiblePhoneInput(form) {
      return form.querySelector('input[type="tel"], input[name="phone-iti"]');
    }

    function getHiddenPhoneInput(form) {
      return form.querySelector('input[name="phone"]');
    }

    function getSelectedDialCode(form) {
      const el = form.querySelector('.iti__selected-dial-code');
      return el ? el.textContent.trim() : '';
    }

    function buildInternationalPhone(form) {
      const visible = getVisiblePhoneInput(form);
      if (!visible) return '';

      let phone = visible.value.trim();

      if (window.iti && typeof window.iti.getNumber === 'function') {
        const intl = window.iti.getNumber();
        if (intl) return intl;
      }

      if (!phone.startsWith('+')) {
        const ddi = getSelectedDialCode(form);
        if (ddi) phone = ddi + ' ' + phone;
      }

      return phone;
    }

    function syncPhoneFieldsIfAny(form) {
      const hidden = getHiddenPhoneInput(form);
      const finalPhone = buildInternationalPhone(form);
      if (hidden && finalPhone) hidden.value = finalPhone;
    }

    function isValidPhone(form) {
      const visible = getVisiblePhoneInput(form);
      if (!visible) return true;

      const finalPhone = buildInternationalPhone(form);
      const digits = finalPhone.replace(/\D/g, '');
      return digits.length >= 10;
    }

    function serializeAcForm(form) {
      syncPhoneFieldsIfAny(form);

      const fd = new FormData(form);
      const params = new URLSearchParams();

      fd.forEach((v, k) => {
        if (k !== 'hideButton') params.append(k, v);
      });

      // relaciona a tag do perfil vencedor do diagnóstico (ex.: Diagnostico_de_Carreira_Dev_3_Ciclo)
      if (trilhaVencedora && trilhaVencedora.slug) {
        const tagDiagnostico = buildTagDiagnostico(trilhaVencedora.slug);
        if (tagDiagnostico) {
          params.append('tags[]', tagDiagnostico);
        }
      }

      return params.toString();
    }

    function showAcFormError(form, msg) {
      let errorBox = form.querySelector('.ac-diagnostico-error');

      if (!errorBox) {
        errorBox = document.createElement('div');
        errorBox.className = 'ac-diagnostico-error';
        errorBox.style.marginTop = '12px';
        errorBox.style.color = '#e53935';
        errorBox.style.fontSize = '14px';
        const btnWrapper = form.querySelector('._button-wrapper') || form;
        btnWrapper.parentNode.insertBefore(errorBox, btnWrapper.nextSibling);
      }

      errorBox.textContent = msg;
    }

    function clearAcFormError(form) {
      const errorBox = form.querySelector('.ac-diagnostico-error');
      if (errorBox) errorBox.textContent = '';
    }

    async function postActiveCampaign(form) {
      const body = serializeAcForm(form);

      if (true) return {};
      const res = await fetch(AC_PROC_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      });

      const data = await res.json();

      if (data.action === 'show_error') {
        throw new Error(data.message);
      }

      return data;
    }

    function customizeAcFields(form) {
      const firstNameInput = form.querySelector('input[name="firstname"]');
      const emailInput = form.querySelector('input[name="email"]');
      const phoneInput = getVisiblePhoneInput(form);
      const cpfInput = form.querySelector(CPF_FIELD_SELECTOR);

      if (firstNameInput) firstNameInput.placeholder = 'Nome Completo';
      if (emailInput) emailInput.placeholder = 'E-mail';
      if (cpfInput) cpfInput.placeholder = 'CPF';
      if (phoneInput) phoneInput.placeholder = 'Celular (WhatsApp)';
    }

    function bindAcForm(form) {
      if (!form || form.dataset.diagnosticoAcBound === '1') return;

      form.dataset.diagnosticoAcBound = '1';

      customizeAcFields(form);
      hideTrilhaFieldInForm(form);
      hideAndFillOndaField(form);
      bindCpfField(form);
      bindPhoneField(form);

      if (trilhaVencedora && trilhaVencedora.slug) {
        setTrilhaNoForm(trilhaVencedora.slug);
      }

      const submitBtn = form.querySelector('button._submit');
      const interceptTarget = form.parentElement || form;

      interceptTarget.addEventListener('submit', async function (e) {
        if (e.target !== form && !form.contains(e.target)) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        if (acSubmitting) return;

        clearAcFormError(form);

        const phoneOk = isValidPhone(form);
        const cpfInput = form.querySelector(CPF_FIELD_SELECTOR);

        if (cpfInput && cpfInput.value.replace(/\D/g, '').length > 0 && !isValidCpf(cpfInput.value)) {
          cpfInput.setCustomValidity('CPF inválido');
          showCpfError(cpfInput, 'CPF inválido');
        }

        if (!phoneOk) {
          showAcFormError(form, 'Informe um celular válido com DDD.');
        }

        if (!phoneOk || !form.checkValidity()) {
          form.reportValidity();
          return;
        }

        if (trilhaVencedora && trilhaVencedora.slug) {
          setTrilhaNoForm(trilhaVencedora.slug);
        }

        acSubmitting = true;

        const $btn = submitBtn ? $(submitBtn) : null;
        if ($btn && $btn.length) lockButton($btn, 'Enviando...');

        try {
          await postActiveCampaign(form);
          showSuccess();
        } catch (err) {
          if ($btn && $btn.length) unlockButton();

          showAcFormError(form, err.message || 'Erro ao enviar.');
        } finally {
          acSubmitting = false;
        }
      }, true);
    }

    function injectAcEmbed() {
      return;
      const root = getAcRoot();
      if (!root) return;

      root.replaceChildren();

      const mount = document.createElement('div');
      mount.className = AC_FORM_MOUNT_CLASS;
      mount.id = 'diagnostico_ac_embed_31';
      root.appendChild(mount);

      const script = document.createElement('script');
      script.src = AC_EMBED_SRC + '&_=' + Date.now();
      script.charset = 'utf-8';
      root.appendChild(script);
    }

    function watchAcFormMount() {
      const container = getAcRoot();
      if (!container) return;

      const tryBind = function () {
        const form = container.querySelector('form._form');
        if (form) bindAcForm(form);
      };

      tryBind();
      new MutationObserver(tryBind).observe(container, { childList: true, subtree: true });
    }

    $modal.on('hide.bs.modal', function () {
      const active = document.activeElement;
      if (active && this.contains(active)) active.blur();
    });

    $modal.on('shown.bs.modal', function () {
      mostrarCapaNoModal();
      const existingEmbed = document.getElementById('diagnostico_ac_embed_31');
      if (existingEmbed) {
        watchAcFormMount();
      } else {
        injectAcEmbed();
        watchAcFormMount();
      }
    });

    $modal.on('hidden.bs.modal', function () {
      resetarEstadoModal();
    });

    $btnComecar.on('click', function () {
      iniciarQuizNoModal();
    });

    $(document).off('click.ctdiag').on('click.ctdiag', '.quiz-btn.anterior', function () {
      mostrarPergunta(indexAtual - 1);
    });

    $(document).off('change.ctdiag').on('change.ctdiag', '.alternativa input', function () {
      quizRespostas[indexAtual + 1] = $(this).val();
      salvarRespostas();

      setTimeout(() => {
        indexAtual < totalPerguntas - 1
          ? mostrarPergunta(indexAtual + 1)
          : finalizarQuiz();
      }, 200);
    });

    $mensagemEnviado.on('click', '.resultado-info-card__btn', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var $btn = $(this);
      var trilhaSlug = $btn.attr('data-acervo-filter');

      if (!trilhaSlug) {
        trilhaSlug = trilhaVencedora ? trilhaVencedora.slug : null;
      }

      if (!trilhaSlug) return;

      $modal.modal('hide');

      $modal.one('hidden.bs.modal', function () {
        if (window.acervoModal && typeof window.acervoModal.open === 'function') {
          window.acervoModal.open(trilhaSlug);
        }
      });
    });

  });
})(jQuery);
