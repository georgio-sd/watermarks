export class CanvasPlugin {
  public ready = false
  public can = document.createElement('canvas')
  public ctx = this.can.getContext('2d')
  public width = 1280
  public height = 0

  constructor(public src: HTMLVideoElement & {layers?: HTMLCanvasElement[]}) {
    const loaded = () => {
      src.removeEventListener('loadedmetadata', loaded)
      src.removeEventListener('loadeddata', loaded)

      setTimeout(() => {
        this._init().catch(console.error)
      }, 100)
    }

    src.addEventListener('loadedmetadata', loaded)
    src.addEventListener('loadeddata', loaded)
    src.layers = []
    this.can.classList.add('canvas-watemark')
  }

  public onInit() {

  }

  public updateSize() {
    const { src, can, width } = this
    let percent = 720 / 1280
    let {videoWidth, videoHeight} = src

    if(videoWidth != 0 && videoHeight != 0)
      percent = videoHeight / videoWidth

    can.width = width
    this.height = can.height = (width * percent) | 0
  }

  private async _init() {
    const { src, can } = this
    this.updateSize()
    this.onInit()
    src.layers.push(can)
  }
}