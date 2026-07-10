// コードブロックにコピーボタン（アイコン）と言語ラベルを付与する。
// ボタンを横スクロールに追従させないため、pre をラッパーで包む。
(function () {
  var COPY_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
  var CHECK_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';

  document.querySelectorAll('pre.shiki').forEach(function (pre) {
    var wrap = document.createElement('div');
    wrap.className = 'code-block';
    if (pre.dataset.lang) wrap.dataset.lang = pre.dataset.lang;
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    var btn = document.createElement('button');
    btn.className = 'code-copy';
    btn.type = 'button';
    btn.innerHTML = COPY_ICON;
    btn.setAttribute('aria-label', 'コードをコピー');
    btn.addEventListener('click', function () {
      var code = pre.querySelector('code');
      navigator.clipboard.writeText(code ? code.innerText : pre.innerText).then(function () {
        btn.innerHTML = CHECK_ICON;
        btn.classList.add('copied');
        setTimeout(function () {
          btn.innerHTML = COPY_ICON;
          btn.classList.remove('copied');
        }, 1500);
      });
    });
    wrap.appendChild(btn);
  });
})();
