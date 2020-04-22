import React, { useEffect, useContext, useState } from "react";

import "./PlayerControls.sass";
import { IconComponent } from "../icons";
import { useVideoEvents } from "../library/videoEvents";
import { PlayerControlsTimebar } from "./PlayerControlsTimebar";
import { getTimeString } from "../library/timeString";
import { toggleFull, getNowToggle } from "./Player";
import { PlayerControlsVolume } from "./PlayerControlsVolume";
import isMobile from "ismobilejs";

interface IPlayerControlsProps {
  src: HTMLVideoElement
}

export const PlayerControls = ({ src }: IPlayerControlsProps) => {
  const {phone} = isMobile().apple

  return (
    <div className="wsv-controls">

      <div className="wsv-controls-bar">
        <PlayerControlsPlayBtn src={src} />
        <PlayerControlsStopBtn src={src} />
        <PlayerControllsTimeInfo src={src} />
        <PlayerControlsTimeLine src={src} />
        <PlayerControlsVolume src={src} />
        {!phone && <PlayerControlsFullBtn src={src} />}
      </div>
    </div>
  )
}

export const PlayerControlsPlayBtn = ({ src }: IPlayerControlsProps) => {
  const { paused } = src
  const click = () => {
    if (paused)
      src.play().catch(() => {})
    else
      src.pause()
  }

  useVideoEvents(src, ['play', 'pause'])

  return (
    <div className="button" onClick={click}>
      <IconComponent icon={paused ? 'play' : 'pause'} />
    </div>
  )
}

export const PlayerControlsStopBtn = ({ src }: IPlayerControlsProps) => {
  const click = () => {
    if (src.paused)
      src.currentTime = 0
    else
      src.pause()
  }

  useVideoEvents(src, ['play', 'pause'])

  return (
    <div className="button" onClick={click}>
      <IconComponent icon="stop" />
    </div>
  )
}

export const PlayerControlsFullBtn = ({ src }: IPlayerControlsProps) => {
  const [fullNow, setFullNow] = useState(false)
  const full = useContext(toggleFull)
  const getFull = useContext(getNowToggle)

  useEffect(() => {
    const change = () => {
      setFullNow(getFull())
    }
    
    document.addEventListener('fullscreenchange', change)

    return () => {
      document.removeEventListener('fullscreenchange', change)
    }
  }, [])

  return (
    <div onClick={full} className="button" >
      <IconComponent icon={fullNow ? 'shrink' : 'enlarge'} />
    </div>
  )
}

export const PlayerControllsTimeInfo = ({ src }: IPlayerControlsProps) => {
  const left = getTimeString(src.currentTime)
  const right = getTimeString(src.duration)

  useVideoEvents(src, ['timeupdate', 'loadedmetadata'])

  return (
    <p className="wsv-controls-timeinfo">
      {left} / {right}
    </p>
  )
}

export const PlayerControlsTimeLine = ({ src }: IPlayerControlsProps) => {

  return (
    <div className="wsv-controls-timeline">
      <PlayerControlsTimebar src={src} />
    </div>
  )
}