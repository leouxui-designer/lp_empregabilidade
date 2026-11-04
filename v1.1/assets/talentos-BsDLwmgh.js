var e=`<!doctype html>\r
<html lang="pt-BR">\r
<head>\r
<meta charset="utf-8">\r
<meta name="viewport" content="width=device-width, initial-scale=1">\r
<title>Talentos | Empregabilidade SCTEC</title>\r
<meta name="description" content="Veja como alunos e ex-alunos do Carreira Tech do SCTEC entram no banco de talentos e são vistos por empresas.">\r
<link rel="preconnect" href="https://fonts.googleapis.com">\r
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\r
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">\r
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">\r
<link rel="stylesheet" href="styles.css">\r
</head>\r
<body>\r
<a class="skip" href="#conteudo">Ir para o conteúdo</a>\r
\r
\r
<section id="header-governo">\r
    <div class="container">\r
        <a href="#" class="logo-governo" target="_blank" rel="noopener noreferrer">\r
            <h1 class="titulo-governo">sc.gov.br</h1>\r
        </a>\r
        <div class="secretaria-governo">\r
            <img src="https://sctec.scti.sc.gov.br/wp-content/themes/sc-tec/assets/img/header/bandeira-sc.svg" width="32" height="24" class="d-none d-md-block" alt="Bandeira SC">\r
            <a href="#" class="logo-governo" target="_blank" rel="noopener noreferrer" aria-label="Secretaria de Estado da Ciência, Tecnologia e Inovação">\r
                <p class="secretaria-nome d-none d-md-block">Secretaria de Estado da Ciência, Tecnologia e Inovação</p>\r
            </a>\r
            <button type="button" class="links-governo-btn" data-bs-toggle="modal" data-bs-target="#linksGovernoModal">\r
                <img src="https://sctec.scti.sc.gov.br/wp-content/themes/sc-tec/assets/img/icons/more_vert.svg" alt="Mais">\r
            </button>\r
        </div>\r
    </div>\r
</section>\r
<header class="topo">\r
    <nav class="navbar d-lg-none" aria-labelledby="navbarToggleExternalContent">\r
        <div class="container-fluid">\r
            <a href="#" class="logo-text-link">\r
                <img class="logo-img" src="assets/logo-header.png" alt="SCTEC" width="179" height="48">\r
            </a>\r
\r
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">\r
                <i class="fa fa-bars"></i>\r
            </button>\r
        </div>\r
    </nav>\r
\r
    <div class="collapse navbar-collapse" id="navbarNavDropdown">\r
        <ul id="menu-menu-1" class="nav-links"><li id="menu-item-303" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-home menu-item-303"><a href="#">Sobre</a></li>\r
<li id="menu-item-313" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-313"><a href="#">Carreira Tech</a></li>\r
<li id="menu-item-311" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-311"><a href="#">IA para DEVs</a></li>\r
<li id="menu-item-310" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-310"><a href="#">IA na Prática</a></li>\r
<li id="menu-item-91320" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-91320"><a href="#">Editais e Resultados</a></li>\r
<li id="menu-item-305" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-305"><a href="#">Dúvidas</a></li>\r
<li class="menu-item-empregabilidade active"><a href="#/empresas" aria-current="page">Empregabilidade</a></li>\r
</ul>        <a class="portal-entry portal-entry--menu" data-portal>Portal de Talentos <span class="badge">Em breve</span></a>\r
        <a href="#" class="matricula-btn menu-mobile">\r
            Conhecer as trilhas\r
        </a>\r
    </div>\r
\r
    <div class="container container-header d-none d-lg-flex px-lg-3">\r
        <div class="logo">\r
            <a href="#" class="logo-text-link">\r
                <img class="logo-img" src="assets/logo-header.png" alt="SCTEC" width="179" height="48">\r
            </a>\r
        </div>\r
\r
        <div class="options d-flex">\r
            <nav class="menu-principal d-flex" aria-label="menu">\r
                <ul id="menu-menu-2" class="nav-links"><li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-home menu-item-303"><a href="#">Sobre</a></li>\r
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-313"><a href="#">Carreira Tech</a></li>\r
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-311"><a href="#">IA para DEVs</a></li>\r
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-310"><a href="#">IA na Prática</a></li>\r
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-91320"><a href="#">Editais e Resultados</a></li>\r
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-305"><a href="#">Dúvidas</a></li>\r
<li class="menu-item-empregabilidade active"><a href="#" aria-current="page">Empregabilidade</a></li>\r
</ul>            </nav>\r
\r
            <a class="portal-entry" data-portal>Portal de Talentos <span class="badge">Em breve</span></a>\r
            <a href="#" class="matricula-btn">\r
                Conhecer as trilhas\r
            </a>\r
        </div>\r
    </div>\r
\r
    \r
</header>\r
\r
<main id="conteudo">\r
<div class="switchbar"><div class="wrap"><nav class="seg2" aria-label="Escolha o seu perfil"><a href="#/empresas">Sou empresa</a><a href="#/talentos" aria-current="page">Sou talento</a></nav></div></div>\r
\r
<section id="talentos" aria-labelledby="h-tal">\r
  <div class="wrap">\r
    <div class="sec-head">\r
      <span class="eyebrow">Para talentos</span>\r
      <h2 id="h-tal">Quer ser visto pelas empresas?</h2>\r
      <p class="lead">O caminho depende de onde você está na sua jornada. Selecione abaixo sua situação atual e veja exatamente o que fazer.</p>\r
    </div>\r
    <div class="seg" role="tablist" aria-label="Sua situação" id="seg">\r
      <div class="seg-item" role="presentation">\r
        <button role="tab" id="t1" aria-controls="p1" aria-selected="false" tabindex="-1"><span class="dot" aria-hidden="true"></span><span><b>Ainda não sou aluno do SCTEC</b><span class="s">Quero entender como ingressar no Carreira Tech</span></span></button>\r
        <div class="panel t-panel" id="p1" role="tabpanel" aria-labelledby="t1" tabindex="0" hidden>\r
          <div class="t-photo"><img src="assets/foto-ainda-nao-fiz.png" alt="Jovem concentrado programando diante de monitores com código" loading="lazy"></div>\r
          <div class="t-body">\r
            <h3>Comece pelo Carreira Tech</h3>\r
            <p class="t-lead">O banco de talentos é só para quem estuda ou estudou na etapa Profissionalizar do Carreira Tech do Programa SCTEC.</p>\r
            <ol class="t-steps"><li><b>Escolha sua trilha</b><span>Conheça os cursos.</span></li><li><b>Matricule-se</b><span>Entre no próximo ciclo.</span></li><li><b>Volte aqui</b><span>Manifeste interesse ao cursar ou concluir.</span></li></ol>\r
            <div class="t-cta"><a class="btn" href="https://sctec.scti.sc.gov.br/" target="_blank" rel="noopener">Conhecer o Carreira Tech <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a></div>\r
          </div>\r
        </div>\r
      </div>\r
      <div class="seg-item" role="presentation">\r
        <button role="tab" id="t2" aria-controls="p2" aria-selected="false" tabindex="-1"><span class="dot" aria-hidden="true"></span><span><b>Sou aluno do SCTEC no Carreira Tech</b><span class="s">Ainda não concluí a etapa Profissionalizar do Carreira Tech</span></span></button>\r
        <div class="panel t-panel" id="p2" role="tabpanel" aria-labelledby="t2" tabindex="0" hidden>\r
          <div class="t-photo"><img src="assets/foto-perfil.png" alt="Aluna estudando no notebook" loading="lazy"></div>\r
          <div class="t-body">\r
            <h3>Registre seu interesse</h3>\r
            <p class="t-lead">Ao concluir a etapa Profissionalizar, a equipe SCTEC poderá incluir o seu perfil no banco de talentos.</p>\r
            <ol class="t-steps"><li><b>Manifeste interesse</b><span>Preencha o formulário.</span></li><li><b>Conclua o curso</b><span>Siga até o final da turma.</span></li><li><b>Acompanhe seu e-mail</b><span>A equipe avisa os próximos passos.</span></li></ol>\r
            <div class="t-cta"><a class="btn" href="https://docs.google.com/forms/" target="_blank" rel="noopener">Manifestar interesse <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a></div>\r
          </div>\r
        </div>\r
      </div>\r
      <div class="seg-item" role="presentation">\r
        <button role="tab" id="t3" aria-controls="p3" aria-selected="false" tabindex="-1"><span class="dot" aria-hidden="true"></span><span><b>Já concluí o SCTEC</b><span class="s">Sou egresso da etapa Profissionalizar do Carreira Tech</span></span></button>\r
        <div class="panel t-panel" id="p3" role="tabpanel" aria-labelledby="t3" tabindex="0" hidden>\r
          <div class="t-photo"><img src="assets/hero-thumb.png" alt="Profissionais cumprimentando-se em um escritório" loading="lazy"></div>\r
          <div class="t-body">\r
            <h3>O SCTEC adiciona você</h3>\r
            <p class="t-lead">Você não precisa se cadastrar sozinho: basta manifestar interesse.</p>\r
            <ol class="t-steps"><li><b>Manifeste interesse</b><span>Preencha o formulário.</span></li><li><b>Entrada no banco</b><span>A equipe inclui seu perfil.</span></li><li><b>Acesso por e-mail</b><span>Receba os dados de acesso.</span></li></ol>\r
            <div class="t-cta"><a class="btn btn--outline" href="https://docs.google.com/forms/" target="_blank" rel="noopener">Manifestar interesse <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a><a class="btn" id="portalBtn" data-portal>Acessar Portal de Talentos <span class="badge">Em breve</span></a></div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>\r
\r
<section class="soft" id="faq" aria-labelledby="h-faq">\r
  <div class="wrap">\r
    <div class="sec-head"><span class="eyebrow">Dúvidas</span><h2 id="h-faq">Perguntas frequentes para talentos</h2></div>\r
<div id="fp2" class="acc faq-one" data-acc>\r
      <h3><button aria-expanded="false" aria-controls="b1" id="r1">Quem não fez o Carreira Tech pode entrar no banco de talentos?<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></h3>\r
      <div class="ans" id="b1" role="region" aria-labelledby="r1" hidden><p>Não. O banco de talentos é exclusivo para alunos e ex-alunos do Carreira Tech do SCTEC. Novas turmas são divulgadas no <a href="https://sctec.scti.sc.gov.br/" target="_blank" rel="noopener">site do Carreira Tech</a>.</p></div>\r
      <h3><button aria-expanded="false" aria-controls="b2" id="r2">Eu mesmo faço meu cadastro no banco de talentos?<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></h3>\r
      <div class="ans" id="b2" role="region" aria-labelledby="r2" hidden><p>Não. Você manifesta interesse pelo formulário e a equipe SCTEC inclui o seu perfil no banco de talentos.</p></div>\r
      <h3><button aria-expanded="false" aria-controls="b3" id="r3">Estou cursando. Já posso manifestar interesse?<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></h3>\r
      <div class="ans" id="b3" role="region" aria-labelledby="r3" hidden><p>Sim. Quando você concluir, a equipe poderá incluir o seu perfil.</p></div>\r
      <h3><button aria-expanded="false" aria-controls="b4" id="r4">Como vou receber informações e o acesso ao portal?<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></h3>\r
      <div class="ans" id="b4" role="region" aria-labelledby="r4" hidden><p>Por e-mail. Quando o Portal de Talentos abrir, os dados de acesso serão enviados ao e-mail da sua matrícula.</p></div>\r
    </div>\r
\r
  </div>\r
</section>\r
</main>\r
\r
<div class="rodape">\r
    <div class="container px-4">\r
        <img class="logo-img" src="assets/logo-footer.png" alt="SCTEC" width="119" height="32" style="display:block;margin-bottom:24px">\r
        <div class="newsletter" id="sctec-inbox">\r
            <div class="newsletter__header">\r
                <h2 class="newsletter__title">SCTEC<span class="newsletter__title-accent"> inbox_</span></h2>\r
                <p class="newsletter__subtitle">Receba as novidades de tecnologia, notícias, projetos e oportunidades diretamente no seu e-mail.</p>\r
            </div>\r
            <div class="newsletter__form" id="sctec-inbox-form">\r
                <div class="_form_30">\r
<form method="POST" action="#" id="_form_6AE1BDD309B06_" class="_form _form_30 _inline-form  _dark" novalidate="" data-styles-version="5">\r
    <input type="hidden" name="u" value="6AE1BDD309B06" data-name="u">\r
    <input type="hidden" name="f" value="30" data-name="f">\r
    <input type="hidden" name="s" data-name="s">\r
    <input type="hidden" name="c" value="0" data-name="c">\r
    <input type="hidden" name="m" value="0" data-name="m">\r
    <input type="hidden" name="act" value="sub" data-name="act">\r
    <input type="hidden" name="v" value="2" data-name="v">\r
    <input type="hidden" name="or" value="1e0e2389-2bd4-4fad-87e9-908ae4fe6ae9" data-name="or">\r
    <div class="_form-content">\r
                            <div class="_form_element _field_name _full_width ">\r
                            <label for="fullname" class="_form-label">\r
                                            Nome completo<span class="field-required">*</span>                                    </label>\r
                <div class="_field-wrapper">\r
                    <input type="text" id="fullname" name="fullname" placeholder="Digite seu nome" required="" data-name="fullname">\r
                </div>\r
                    </div>\r
                            <div class="_form_element _field_email _full_width ">\r
                            <label for="email" class="_form-label">\r
                                            Email<span class="field-required">*</span>                                    </label>\r
                <div class="_field-wrapper">\r
                    <input type="text" id="email" name="email" placeholder="Digite seu email" required="" data-name="email">\r
                </div>\r
                    </div>\r
                                    <div class="_button-wrapper _full_width">\r
                <button id="_form_30_submit" class="_submit" type="submit">Receber newsletter</button>\r
            </div>\r
                <div class="_clear-element"></div>\r
    </div>\r
    <div class="_form-thank-you" style="display:none;"></div>\r
    </form>\r
</div>\r
            </div>\r
            <div class="newsletter__sucesso" id="sctec-inbox-sucesso" hidden="" aria-hidden="true" role="status" aria-live="polite">\r
                <div class="newsletter__sucesso-conteudo">\r
                    <div class="newsletter__sucesso-icon" aria-hidden="true">\r
                        <img src="https://sctec.scti.sc.gov.br/wp-content/themes/sc-tec/assets/img/icons/check.svg" width="24" height="24" alt="">\r
                    </div>\r
                    <div class="newsletter__sucesso-texto">\r
                        <h3 class="newsletter__sucesso-title">Inscrição realizada com sucesso!</h3>\r
                        <p class="newsletter__sucesso-desc">Obrigado por se cadastrar. A partir de agora você receberá novidades, eventos e oportunidades diretamente na sua caixa de entrada.</p>\r
                    </div>\r
                </div>\r
                <button type="button" class="newsletter__sucesso-reset" id="sctec-inbox-reset">Cadastrar outro email</button>\r
            </div>\r
            <p class="newsletter__disclaimer newsletter__disclaimer--default">\r
                Ao preencher o formulário, você concorda que podemos usar seus dados para enviar informações que possam ser do seu interesse. Para mais detalhes, consulte nossa\r
                <a href="#">política de privacidade</a>.\r
            </p>\r
            <p class="newsletter__disclaimer newsletter__disclaimer--sucesso">\r
                Você pode cancelar sua inscrição a qualquer momento através dos links ao final de nossos e-mails.\r
            </p>\r
        </div>\r
        <div class="info">\r
            <div class="menu pb-3">\r
                <h3 class="text-uppercase">Menu</h3>\r
                <ul id="menu-menu-3" class="nav-links"><li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-home menu-item-303"><a href="#">Sobre</a></li>\r
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-313"><a href="#">Carreira Tech</a></li>\r
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-311"><a href="#">IA para DEVs</a></li>\r
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-310"><a href="#">IA na Prática</a></li>\r
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-91320"><a href="#">Editais e Resultados</a></li>\r
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-305"><a href="#">Dúvidas</a></li>\r
<li class="menu-item-empregabilidade"><a href="#">Empregabilidade</a></li>\r
<li class="menu-item-portal"><a class="portal-entry portal-entry--footer" data-portal>Acesso ao portal <span class="badge">Em breve</span></a></li>\r
</ul>            </div>\r
            <div class="contact pb-3">\r
                <h3 class="text-uppercase pb-2">Fale conosco</h3>\r
                <p class="label">WhatsApp:</p>\r
                <p class="value">\r
                    <a href="#">\r
                        (48) 98870 – 6277\r
                    </a>\r
                </p>\r
                <p class="label">Telefone:</p>\r
                <p class="value">\r
                    <a href="#">(48) 3380 – 8300</a>\r
                </p>\r
                <p class="label">E-mail:</p>\r
                <p class="value">\r
                    <a href="#">sctec@scti.sc.gov.br</a>\r
                </p>\r
            </div>\r
            <div class="external-links pb-3">\r
                <h3 class="text-uppercase">Links externos</h3>\r
                <ul class="px-0">\r
                                                                        <li>\r
                                <a href="#">\r
                                    Agência de notícias                                </a>\r
                            </li>\r
                                                    <li>\r
                                <a href="#">\r
                                    Portal de Serviços                                </a>\r
                            </li>\r
                                                    <li>\r
                                <a href="#">\r
                                    Diário Oficial                                </a>\r
                            </li>\r
                                                    <li>\r
                                <a href="#">\r
                                    Acesso à Informação                                </a>\r
                            </li>\r
                                                    <li>\r
                                <a href="#">\r
                                    Órgãos do Governo                                </a>\r
                            </li>\r
                                                    <li>\r
                                <a href="#">\r
                                    Conheça SC                                </a>\r
                            </li>\r
                                                                                </ul>\r
            </div>\r
        </div>\r
        <div class="redes-sociais w-full">\r
            <div>\r
                <h3 class="text-uppercase">SCTEC</h3>\r
                <p>Portal oficial do SCTEC do Estado de Santa Catarina</p>\r
            </div>\r
        </div>\r
        <div class="copyright">\r
            <p class="mb-0">\r
                Copyright © 2026 Todos os Direitos Reservados Portal |\r
                <b>Desenvolvedor - SCTI</b>\r
            </p>\r
            <div class="gov-logos">\r
                <img src="https://sctec.scti.sc.gov.br/wp-content/themes/sc-tec/assets/img/footer/logo-bandeira-gov.svg" alt="Bandeira SC" width="44" height="33">\r
                <img src="https://sctec.scti.sc.gov.br/wp-content/themes/sc-tec/assets/img/footer/logo-selo-gov.svg" alt="Selo SC" width="113" height="33">\r
            </div>\r
        </div>\r
    </div>\r
</div>\r
<a href="#" target="_blank" rel="noopener noreferrer" class="whatsapp-floating-button" aria-label="Fale conosco no WhatsApp">\r
    <span class="whatsapp-tooltip">Chama no Whats</span>\r
    <img src="https://sctec.scti.sc.gov.br/wp-content/themes/sc-tec/assets/img/icons/whatsapp.svg" alt="WhatsApp">\r
</a>\r
<script src="portal.js"><\/script>\r
<script src="app.js"><\/script>\r
</body>\r
</html>\r
`;export{e as default};