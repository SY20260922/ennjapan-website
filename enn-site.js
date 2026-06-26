(function () {
  var LANG = (document.currentScript && document.currentScript.getAttribute('data-lang')) || 'ja';

  var MAP = [
    ['私たちについて', 'about'], ['About', 'about'], ['Sobre', 'about'],
    ['パートナーシップ', 'partnership'], ['Partnership', 'partnership'], ['Parceria', 'partnership'],
    ['サービス', 'services'], ['Service', 'services'], ['Servico', 'services'], ['Serviço', 'services'],
    ['プロジェクト', 'projects'], ['Project', 'projects'], ['Projeto', 'projects'],
    ['ジャーナル', 'journal'], ['Journal', 'journal'], ['Jornal', 'journal'], ['すべての記事', 'journal'], ['記事', 'journal'], ['article', 'journal'], ['artigo', 'journal'],
    ['お問い合わせ', 'contact'], ['Contact', 'contact'], ['Contacto', 'contact'], ['Contato', 'contact']
  ];

  function targetId(t) {
    var lt = t.toLowerCase();
    for (var i = 0; i < MAP.length; i++) {
      if (lt.indexOf(MAP[i][0].toLowerCase()) > -1) return MAP[i][1];
    }
    return null;
  }

  function scroller() {
    var de = document.scrollingElement || document.documentElement;
    if (de && de.scrollHeight > de.clientHeight + 5) return de;
    if (document.body.scrollHeight > document.body.clientHeight + 5) return document.body;
    return de;
  }

  function scrollToY(target) {
    var sc = scroller();
    var start = sc.scrollTop, diff = target - start, t0 = Date.now(), dur = 560;
    (function step() {
      var p = Math.min((Date.now() - t0) / dur, 1);
      var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      sc.scrollTop = start + diff * e;
      if (p < 1) setTimeout(step, 16);
    })();
  }

  function go(id) {
    var dst = document.getElementById(id);
    if (!dst) return false;
    var sc = scroller();
    var y = dst.getBoundingClientRect().top + sc.scrollTop - 16;
    scrollToY(y);
    return true;
  }

  // in-page navigation by visible label
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-enn-form]')) return;
    var el = e.target;
    for (var d = 0; d < 5 && el && el !== document.body; d++, el = el.parentElement) {
      if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href').indexOf('.html') > -1) return;
      var txt = (el.textContent || '').trim();
      if (txt.length > 0 && txt.length < 28) {
        if (/ENN\s*Japan/i.test(txt) && el.closest('header')) { e.preventDefault(); scrollToY(0); return; }
        var id = targetId(txt);
        if (id && go(id)) { e.preventDefault(); return; }
      }
    }
  }, false);

  // contact form: chip selection + mailto submit
  var L = {
    ja: { subj: '[ENN Japan] お問い合わせ', name: 'お名前', email: 'メールアドレス', company: '会社名・ご所属', region: '地域', type: '種類' },
    en: { subj: '[ENN Japan] Inquiry', name: 'Name', email: 'Email', company: 'Company / Affiliation', region: 'Region', type: 'Type' },
    pt: { subj: '[ENN Japan] Contacto', name: 'Nome', email: 'Email', company: 'Empresa / Organizacao', region: 'Regiao', type: 'Tipo' }
  }[LANG] || null;

  document.addEventListener('click', function (e) {
    var chip = e.target.closest && e.target.closest('[data-enn-cat]');
    if (chip) {
      var f = chip.closest('[data-enn-form]');
      if (f) {
        var all = f.querySelectorAll('[data-enn-cat]');
        for (var i = 0; i < all.length; i++) {
          all[i].setAttribute('data-sel', '0');
          all[i].style.background = 'transparent';
          all[i].style.color = '#5A5446';
          all[i].style.border = '1px solid #C9C0B0';
        }
        chip.setAttribute('data-sel', '1');
        chip.style.background = '#1F2839';
        chip.style.color = '#FFFFFF';
        chip.style.border = '1px solid #1F2839';
      }
      return;
    }
    var btn = e.target.closest && e.target.closest('[data-enn-submit]');
    if (!btn || !L) return;
    e.preventDefault();
    var f2 = btn.closest('[data-enn-form]') || document;
    var ins = f2.querySelectorAll('input');
    var ta = f2.querySelector('textarea');
    function val(n) { return ins[n] ? ins[n].value.trim() : ''; }
    var nm = val(0), company = val(1), email = val(2), region = val(3);
    var msg = ta ? ta.value.trim() : '';
    var catEl = f2.querySelector('[data-enn-cat][data-sel="1"]');
    var cat = catEl ? catEl.textContent.trim() : '';
    var subject = L.subj + (cat ? ' - ' + cat : '') + (nm ? ': ' + nm : '');
    var lines = [
      L.name + ': ' + nm,
      L.email + ': ' + email,
      L.company + ': ' + company,
      L.region + ': ' + region,
      L.type + ': ' + cat,
      '',
      msg
    ];
    var body = lines.join('\n');
    window.location.href = 'mailto:shota@ennjapan.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }, false);

  // honor #hash arrival (e.g. from the 3D intro's "Contact" link)
  function jumpHash() {
    if (location.hash && location.hash.length > 1) {
      var id = location.hash.slice(1);
      setTimeout(function () { go(id); }, 550);
    }
  }
  if (document.readyState === 'complete') jumpHash();
  else window.addEventListener('load', jumpHash);
})();
