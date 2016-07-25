(function () {
  document.addEventListener("DOMContentLoaded", function(event) {
    var editor = CodeMirror.fromTextArea(document.getElementById('id_content'),
    {
      lineWrapping: true,
      lineNumbers: true,
    });
  });
})();
