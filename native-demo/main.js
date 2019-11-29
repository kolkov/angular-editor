const editorElement = document.getElementById('angularEditor');
const outputElement = document.getElementById('output');

initInputListener();

function initInputListener() {
  editorElement.addEventListener('valueChange', ({detail}) => {
    outputElement.value = detail;
  });
}
