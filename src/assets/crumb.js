// パンくずのrecent postsプルダウン: 外側クリックとEscapeで閉じる
(function () {
  var menu = document.querySelector('.crumb-recent');
  if (!menu) return;

  document.addEventListener('click', function (e) {
    if (menu.open && !menu.contains(e.target)) menu.open = false;
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
})();
