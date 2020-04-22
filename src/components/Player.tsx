import React, { useState, useEffect, createContext, createRef } from "react";
import isMobile from "ismobilejs";

import "./Player.sass";

import { PlayerCanvas } from "./PlayerCanvas";
import { PlayerLoading } from "./PlayerLoading";
import { loadVideo } from "../library/loadVideo";
import { PlayerControls } from "./PlayerControls";
import { GlobalEvents } from "../library/globalEvents";
import { VolumeControl } from "../library/volumeControl";
import { getCurrentTime, setCurrentTime } from "../library/getCurrenTime";
import { loadWatermark } from "../library/loadWatermark";
import { WaterMarkPlugin } from "../plugins/Watermark";
import { setPosition } from "../library/timeControl";
import { checkSafari } from "../library/checkSafari";

interface IPlayerProps {
  src: string
  autoplay?: boolean
  width?: number | string
  remember?: string
  watermark?: string
}

export const createVideo = () => {
  let video = document.createElement('video')
  video.className = 'wsv-player-canvas'
  video.setAttribute('width', '100%')
  return video
}

export const toggleFull = createContext<() => void>(() => { })
export const getNowToggle = createContext<() => boolean>(() => false)
export const globalEventer = document.createElement('div')

export const Player = (props: IPlayerProps) => {
  const [video] = useState(createVideo())
  const { src, autoplay, remember = null, watermark = null } = props
  const { Provider: FullProvider } = toggleFull
  const { Provider: NotToggleProvider } = getNowToggle
  const player = createRef<HTMLDivElement>()
  const { phone } = isMobile()

  const getFull = () => {
    let fullscreenElement = document.fullscreenElement
      || document['webkitFullscreenElement']
      || document['mozFullScreenElement']

    return fullscreenElement
  }

  const getCurrentFull = () => {
    if (!player.current)
      return false

    let fullscreenElement = getFull()

    return fullscreenElement == player.current
  }

  
  if(checkSafari()) {
    setInterval(() => {
      document.dispatchEvent(new Event('fullscreenchange'))
    }, 500)
  }


  const fullPlayer = async () => {
    if (!player.current)
      return

    let fullscreenElement = getFull()

    if (fullscreenElement) {
      await document.exitFullscreen()

      if (fullscreenElement == player.current)
        return
    }

    let { requestFullscreen } = player.current
    await requestFullscreen.call(player.current, { navigationUI: 'hide' })
  }

  GlobalEvents.use('play', (e) => {
    if (video == e.player)
      return

    video.pause()
  })

  GlobalEvents.use('volume', (e) => {
    video.volume = e.volume
  })

  useEffect(() => {
    const videoPlay = () => {
      GlobalEvents.emit('play', video)
    }

    video.setAttribute('playsinline', '')

    video.addEventListener('play', videoPlay)

    return () => {
      video.removeEventListener('play', videoPlay)
    }
  }, [])

  useEffect(() => {
    if (!video)
      return

    if (phone) {
      player.current.appendChild(video)

      let callback = () => {
        let { offsetWidth, offsetHeight } = player.current
        let { videoWidth, videoHeight } = video

        if(videoHeight && videoWidth) {
          video.height = (videoHeight / videoWidth) * offsetWidth
        }

        video.width = offsetWidth
      }

      // window.addEventListener('fullscreenchange', callback)
      // window.addEventListener('resize', callback)
      // window.addEventListener('load', callback)
      // video.addEventListener('timeupdate', callback)
      // video.addEventListener('play', callback)
      // video.addEventListener('pause', callback)
    }

    const update = () => {
      if (remember)
        setCurrentTime(remember, video.currentTime)
    }

    let run = async () => {
      if (watermark) {
        let water = await loadWatermark(watermark)
        let plugin = new WaterMarkPlugin(video)
        plugin.onInit = () => plugin.init(water)
      }

      loadVideo(video, src)
      video.preload = 'metadata'
      video.autoplay = autoplay
      video.controls = false
      video.volume = VolumeControl.volume

      const loaded = () => {
        video.removeEventListener('loadeddata', loaded)
        video.removeEventListener('loadedmetadata', loaded)

        if (!remember)
          return null

        let lastTime = getCurrentTime(remember)
        setPosition(video, lastTime)
      }

      video.addEventListener('loadeddata', loaded)
      video.addEventListener('loadedmetadata', loaded)
    }

    run().catch(console.error)

    video.addEventListener('timeupdate', update)

    return () => {
      video.removeEventListener('timeupdate', update)
    }
  }, [src, autoplay])

  return (
    <div ref={player} className="wsv-player">
      <FullProvider value={fullPlayer}>
        <NotToggleProvider value={getCurrentFull}>
          <PlayerCanvas src={video} />
          <PlayerLoading src={video} />
          <PlayerControls src={video} />
        </NotToggleProvider>
      </FullProvider>
    </div>
  )
}
