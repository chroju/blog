// ```mermaid のブロック（markdown.ts が .mermaid-block に変換済み）を図に描画し、
// 図とコードを切り替えるボタンを付ける。コード表示は code.js が付けた言語ラベルとコピーボタンをそのまま使う。
// mermaid本体は大きいので、図がある記事でだけCDNから読み込む。読み込めなければコード表示のまま。
// ライト/ダークの切り替えに合わせて描画し直す。
(function () {
  var containers = document.querySelectorAll('.mermaid-block');
  if (!containers.length) return;
  var MERMAID_URL = 'https://cdn.jsdelivr.net/npm/mermaid@12.0.0/dist/mermaid.esm.min.mjs';
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var CODE_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>';
  var DIAGRAM_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3h7zM7 9H4V5h3v4zm10 6h3v4h-3v-4zm0-10h3v4h-3V5z"/></svg>';

  function currentTheme() {
    var forced = document.documentElement.getAttribute('data-theme');
    var dark = forced ? forced === 'dark' : mq.matches;
    return dark ? 'dark' : 'default';
  }

  import(MERMAID_URL).then(function (mod) {
    var mermaid = mod.default;
    var blocks = [];

    // 非表示の要素では文字幅を測れず図が崩れるため、表示中の図だけを描画する
    function render(block) {
      var theme = currentTheme();
      if (block.view !== 'diagram' || block.theme === theme) return;
      block.theme = theme;
      block.diagram.removeAttribute('data-processed');
      block.diagram.textContent = block.source;
      // v12既定の look: 'neo' は図形に影が付いて読みにくいため、平坦な classic にする
      mermaid.initialize({ startOnLoad: false, theme: theme, look: 'classic' });
      mermaid.run({ nodes: [block.diagram] });
    }

    function setView(block, view) {
      block.view = view;
      block.wrap.dataset.view = view;
      var toCode = view === 'diagram';
      block.toggle.innerHTML = toCode ? CODE_ICON : DIAGRAM_ICON;
      block.toggle.setAttribute('aria-label', toCode ? 'コードを表示' : '図を表示');
      render(block);
    }

    containers.forEach(function (container) {
      var diagram = container.querySelector('pre.mermaid');
      var wrap = container.querySelector('.code-block');
      if (!diagram || !wrap) return;
      var toggle = document.createElement('button');
      toggle.className = 'code-copy mermaid-toggle';
      toggle.type = 'button';
      wrap.insertBefore(diagram, wrap.firstChild);
      wrap.appendChild(toggle);
      var block = { diagram: diagram, wrap: wrap, toggle: toggle, source: diagram.textContent, view: null, theme: null };
      toggle.addEventListener('click', function () {
        setView(block, block.view === 'diagram' ? 'code' : 'diagram');
      });
      blocks.push(block);
      setView(block, 'diagram');
    });

    function renderAll() {
      blocks.forEach(render);
    }
    new MutationObserver(renderAll).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    mq.addEventListener('change', renderAll);
  });
})();
