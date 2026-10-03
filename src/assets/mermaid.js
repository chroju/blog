// ```mermaid のブロック（markdown.ts が <pre class="mermaid"> に変換済み）を図に描画する。
// mermaid本体は大きいので、図がある記事でだけCDNから読み込む。
// ライト/ダークの切り替えに合わせて描画し直す。
(function () {
  var blocks = document.querySelectorAll('pre.mermaid');
  if (!blocks.length) return;
  var MERMAID_URL = 'https://cdn.jsdelivr.net/npm/mermaid@12.0.0/dist/mermaid.esm.min.mjs';
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  blocks.forEach(function (pre) {
    pre.dataset.source = pre.textContent;
  });

  function isDark() {
    var forced = document.documentElement.getAttribute('data-theme');
    return forced ? forced === 'dark' : mq.matches;
  }

  import(MERMAID_URL).then(function (mod) {
    var mermaid = mod.default;
    var rendered = null;

    function render() {
      var theme = isDark() ? 'dark' : 'default';
      if (theme === rendered) return;
      rendered = theme;
      blocks.forEach(function (pre) {
        pre.removeAttribute('data-processed');
        pre.textContent = pre.dataset.source;
      });
      mermaid.initialize({ startOnLoad: false, theme: theme });
      mermaid.run({ nodes: blocks });
    }

    render();
    new MutationObserver(render).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    mq.addEventListener('change', render);
  });
})();
