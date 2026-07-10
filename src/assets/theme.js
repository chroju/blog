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

  // ブラウザUIの色（meta theme-color）を実際の背景色に合わせる。
  // media属性付きのmetaはOS設定にしか追従しないため、手動切替時はJSで上書きする
  function syncThemeColor() {
    var bg = getComputedStyle(document.body).backgroundColor;
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute('content', bg);
    });
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
    syncThemeColor();
  });

  mq.addEventListener('change', syncThemeColor);
  syncThemeColor();
})();
