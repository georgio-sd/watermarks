import React, { createRef, useEffect } from "react";

import "./PlayerControlsVolume.sass";
import { IconComponent, TIcon } from "../icons";
import { useVideoEvents } from "../library/videoEvents";
import { VolumeControl } from "../library/volumeControl";

interface IPlayerControlsVolumeProps {
  src: HTMLVideoElement
}

export const PlayerControlsVolume = ({ src }: IPlayerControlsVolumeProps) => {
  const { volume } = src
  const volumeRef = createRef<HTMLDivElement>()

  useEffect(() => {
    const { current: elem } = volumeRef
    const whell = (e: WheelEvent) => {
      e.preventDefault()
      let { volume } = VolumeControl
      volume += e.deltaY * -1 * 0.001
      VolumeControl.volume = volume
    }

    elem.addEventListener('wheel', whell)

    return () => {
      elem.removeEventListener('wheel', whell)
    }
  }, [])

  let icon: TIcon = 'volumeHigh'

  if (volume < 0.7)
    icon = 'volumeMedium'

  if (volume < 0.4)
    icon = 'volumeLow'

  if (volume == 0)
    icon = 'volumeMute'

  useVideoEvents(src, ['volumechange'])

  return (
    <div ref={volumeRef} className="button wsv-player-controls-volume">
      <PlayerControlsVolumeBar src={src} />

      <p onClick={() => VolumeControl.mute()}>
        <IconComponent icon={icon} />
      </p>
    </div>
  )
}

export const PlayerControlsVolumeBar = ({ src }: IPlayerControlsVolumeProps) => {
  const { volume } = src
  const height = volume * 100
  const clickRef = createRef<HTMLDivElement>()

  useEffect(() => {
    const { current: elem } = clickRef
    const click = (e: MouseEvent & { target: HTMLDivElement }) => {
      let { offsetY, target } = e
      let { offsetHeight } = target
      let volume = 1 - offsetY / offsetHeight 
      VolumeControl.volume = volume
    }

    elem.addEventListener('click', click)
    return () => elem.removeEventListener('click', click)
  })

  useVideoEvents(src, ['volumechange'])

  return (
    <div className="button wsv-player-controls-volumebar">
      <div className="wsv-player-controls-volume-border">
        <div style={{ height: `${height}%` }} className="wsv-player-controls-volume-fill"></div>
        <div ref={clickRef} className="wsv-player-controls-volume-clicked"></div>
      </div>
    </div>
  )
}