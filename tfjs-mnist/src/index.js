import Predictor from './predictor'

const MODEL_URL = 'tensorflowjs_model.pb';
const WEIGHTS_URL = 'weights_manifest.json';
const predictor = new Predictor();

window.onload = function(){
  document.getElementsByTagName('body')[0].style.visibility = "visible";

  const note = document.getElementsByClassName('note')[0];
  const container = document.getElementsByClassName('container')[0];
  container.style.visibility = 'hidden';

  var digit_probs = [];
  for (var i = 0; i < 10; i++) {
    digit_probs.push(document.getElementById(`n${i}`));
    digit_probs[i].innerHTML = "";
  }

  // enakai's Handwriting recognizer
  // See https://github.com/enakai00/jupyter_tfbook/blob/master/Chapter05/Handwriting%20recognizer.ipynb
  const HEIGHT = 28;
  const WIDTH = 28;
  var pixels = [];
  for (var i = 0; i < HEIGHT * WIDTH; i++) { pixels[i] = 0; }
  const canvas = document.querySelector("canvas");

  canvas.addEventListener("mousemove", (e) => {
    if (e.buttons == 1) {
      canvas.getContext("2d").fillStyle = "rgb(0,0,0)";
      canvas.getContext("2d").fillRect(e.offsetX, e.offsetY, 8, 8);

      var x = Math.floor(e.offsetY * 0.2)
      var y = Math.floor(e.offsetX * 0.2) + 1
      for (var dy = 0; dy < 2; dy++){
        for (var dx = 0; dx < 2; dx++){
          if ((x + dx < WIDTH) && (y + dy < HEIGHT)) {
            pixels[(y+dy) + (x+dx) * HEIGHT] = 1
          }
        }
      }
    }
  });

  document.getElementById('clear_value').onclick = () => {
    canvas.getContext("2d").fillStyle = "rgb(255,255,255)";
    canvas.getContext("2d").fillRect(0, 0, 140, 140);
    for (var i = 0; i < 28*28; i++) pixels[i] = 0;
  }

  document.getElementById('inference').onclick  = () => {
    predictor.predict(pixels).then(value => {
      const y_pred = Array.prototype.slice.call(value);
      var argmax = 0;
      digit_probs[argmax].innerHTML = y_pred[argmax].toFixed(3);
      digit_probs[argmax].style.color = "black";
      for (var i = 1; i < y_pred.length; i++) {
        digit_probs[i].style.color = "black";
        digit_probs[i].innerHTML = y_pred[i].toFixed(4);
        if (y_pred[i] > y_pred[argmax]) {
          argmax = i;
        }
      }
      console.log(argmax);
      digit_probs[argmax].style.color = "red";
    });
  }

  predictor.load(MODEL_URL, WEIGHTS_URL).then(() => {
    container.style.visibility = 'visible';
    note.style.visibility = 'hidden';
  });
}
