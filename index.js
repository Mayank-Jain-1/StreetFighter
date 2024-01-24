const GameViewport = {
  WIDTH: 384,
  HEIGHT: 224,
  SCALE: 4,
};

window.onload = () => {
  const canvasEL = document.querySelector('canvas');
  const ctx = canvasEL.getContext('2d');

  canvasEL.width = GameViewport.WIDTH ;
  canvasEL.height = GameViewport.HEIGHT;

  

}