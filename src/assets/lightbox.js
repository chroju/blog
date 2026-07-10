// 記事内画像のクリックで拡大表示するライトボックス。
// リンクカードのサムネイル（.rlc-image / .rlc-favicon）は対象外。
(function () {
  var article = document.querySelector('article');
  if (!article) return;

  article.addEventListener('click', function (e) {
    var t = e.target;
    if (!(t instanceof HTMLImageElement)) return;
    if (t.classList.contains('rlc-image') || t.classList.contains('rlc-favicon')) return;
    openLightbox(t.src, t.alt);
  });

  function openLightbox(src, alt) {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', '画像の拡大表示');

    var close = document.createElement('button');
    close.className = 'lightbox-close';
    close.setAttribute('aria-label', '閉じる');
    close.textContent = '×';

    var img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    function destroy() {
      overlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) {
      if (e.key === 'Escape') destroy();
    }

    overlay.addEventListener('click', destroy);
    close.addEventListener('click', function (e) {
      e.stopPropagation();
      destroy();
    });
    document.addEventListener('keydown', onKey);

    overlay.appendChild(close);
    overlay.appendChild(img);
    document.body.style.overflow = 'hidden';
    document.body.appendChild(overlay);
    close.focus();
  }
})();
