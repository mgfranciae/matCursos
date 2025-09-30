// Script del lado del cliente para gestionar la navegación a las páginas y la frase mediante parámetros de consulta

function goToPlain() {
  var phrase = document.getElementById('phrase').value;
  console.log('TextArea convencional => "' + phrase + '".');
  window.location.href = '/plain?phrase=' + encodeURIComponent(phrase);
}

function goToQuill() {
  var phrase = document.getElementById('phrase').value;
  console.log('Iniciando el plugin QUILL: "' + phrase + '".');
  window.location.href = '/quill?phrase=' + encodeURIComponent(phrase);
}