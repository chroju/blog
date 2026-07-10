// ライト/ダークの手動切り替え。
// 選択がOSの設定と同じになった場合は保存を消して自動追従（auto）に戻す。
// 初期適用はlayoutのインラインスクリプト（FOUC回避）が行う。
(function () {
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function effectiveTheme() {
    var forced = document.documentElement.getAttribute('data-theme');
    return forced || (mq.matches ? 'dark' : 'light');
  }

  btn.addEventListener('click', function () {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    var system = mq.matches ? 'dark' : 'light';
    try {
      if (next === system) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.removeItem('theme');
      } else {
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      }
    } catch (e) {
      document.documentElement.setAttribute('data-theme', next);
    }
  });
})();
