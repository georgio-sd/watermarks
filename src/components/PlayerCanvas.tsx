import React, { createRef, useEffect } from "react";

import "./PlayerCanvas.sass";

import { videoEvents, TEvents } from "../library/videoEvents";

interface IPlayerCanvasProps {
  src: HTMLVideoElement & {layers?: HTMLCanvasElement[]}
}

export const PlayerCanvas = ({ src }: IPlayerCanvasProps) => {
  const canvasRef = createRef<HTMLCanvasElement>()
  const events: TEvents = ['play', 'timeupdate', 'loadeddata', 'pause']

  useEffect(() => {
    let rendering = false
    let odd = false

    const renderCanvas = () => {
      if (!canvasRef.current || src.parentElement)
        return null

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const { videoWidth, videoHeight } = src
      const { width, height } = canvas
      const loop = () => {
        odd = !odd
  
        if(odd) {
          const {layers = []} = src

          rendering = true

          let { videoWidth, videoHeight } = src
          try {
            ctx.drawImage(src, 0, 0, videoWidth, videoHeight)
          }catch(e) {}

          for(let layer of layers) {
            let {width, height} = layer

            if(layer instanceof HTMLVideoElement) {
              width = layer.videoWidth
              height = layer.videoHeight
            }

            try {
              if(!height)
                continue
              ctx.drawImage(layer, 
                0, 0, width, height, 
                0, 0, videoWidth, videoHeight)
            }catch(e) {}
          }
        }

        if (!src.paused) 
          requestAnimationFrame(loop)
        else 
          rendering = false
      }

      if (videoWidth && videoWidth !== width)
        canvas.width = videoWidth

      if (videoHeight && videoHeight !== height)
        canvas.height = videoHeight

      if (rendering) 
        return null

      loop()
    }

    videoEvents.add(src, events, renderCanvas)

    return () => videoEvents.remove(src, events, renderCanvas)
  }, [])


  return (
    <canvas className="wsv-player-canvas" ref={canvasRef} />
  )
}