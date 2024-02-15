export const Control = {
  LEFT : 'left',
  RIGHT : 'right',
  UP : 'up',
  DOWN : 'down',
}

export const controls = [
  {
    keyboard: {
      [Control.LEFT]: 'ArrowLeft',
      [Control.RIGHT]: 'ArrowRight',
      [Control.UP]: 'ArrowUp',
      [Control.DOWN]: 'ArrowDown',
    }
  },
  {
    keyboard: {
      [Control.LEFT]: 'KeyA',
      [Control.RIGHT]: 'KeyD',
      [Control.UP]: 'KeyW',
      [Control.DOWN]:'KeyS',
    }
  }
]