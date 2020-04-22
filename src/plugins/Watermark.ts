import { CanvasPlugin } from "../library/pluginBase";
import { IWatermark } from "../library/loadWatermark";
import { rand } from "../library/rand";
import { hex2rgba } from "../library/parseColor";
import { getTextSize } from "../library/getTextSize";
import { macroCollision } from "../library/macroCollision";
import { delay } from "../library/delay";
import isMobile from "ismobilejs";

let globalI = 0

interface IWarkWatermark {
  text: string
  font: string
  fill: string

  width: number
  height: number
  x: number
  y: number

  delay: number[]
  delta: number
  correte: number
  preview: number
}

export class WaterMarkPlugin extends CanvasPlugin {
  public lastTime = -1
  public first = true
  public waters: IWarkWatermark[] = []
  // public image = new Image()

  public render() {
    // this.updateSize()

    const { src, waters, first, width, height, ctx } = this
    const currentTime = src.currentTime | 0

    let haveUpdate = false

    for(let water of waters) {
      const {delta, correte, preview, text, delay} = water
      const correteTime = (currentTime - correte) % delta
      
      if(delta == -1 && !first)
        continue

      if(delta != -1 && correteTime != 0)
        continue

      if(correte == currentTime)
        continue

      water.correte = currentTime

      if(!delay)
        water.delta = -1
      else {
        let [a, b] = [...delay].sort()

        if(!b)
          water.delta = a
        else
          water.delta = rand(a, b)
      }

      let attempts = 500

      while(attempts-->0) {
        water.x = rand(0, width - water.width)
        water.y = rand(0, height - water.height)

        let collision = false 

        for(let seeWater of waters) {
          if(water == seeWater)
            continue

          if(seeWater.x < 0 || seeWater.y < 0)
            continue

          if(macroCollision(water, seeWater))
            collision = true
        }

        if(!collision)
          break
      }
        
      haveUpdate = true
    }

    if(!haveUpdate)
      return null

    this.first = false

    ctx.clearRect(0,0, width, height)

    for(let {fill, text, x, y, font, height, width} of waters) {
      ctx.fillStyle = fill
      ctx.font = font
      ctx.textBaseline = 'top'
      ctx.textAlign = 'left'
      ctx.fillText(text, x, y)
      // ctx.strokeStyle = '#ffffff'
      // ctx.strokeRect(x, y, width, height)
    }
  }

  public init(waretmark: IWatermark[]) {
    this.render = this.render.bind(this)
    this.src.addEventListener('timeupdate', this.render)

    for (let wat of waretmark) {
      const { text, fontSize = 14, fontFamily = 'Arial' } = wat
      const { color = '#fff', alpha = 0.8, delay = null } = wat
      const font = `${fontSize}px ${fontFamily}`
      const fill = hex2rgba(color, alpha)
      const { width, height } = getTextSize(text, font)

      const water: IWarkWatermark = {
        text, font, fill, delay,
        width, height, x: -1, y: -1,
        delta: -1, correte: 0, preview: -1
      }

      this.waters.push(water)
    }

    if(this.src.parentElement)
      this.src.parentElement.appendChild(this.can)

    this.render()
  }

  public destroy() {
    this.src.removeEventListener('timeupdate', this.render)
  }
}