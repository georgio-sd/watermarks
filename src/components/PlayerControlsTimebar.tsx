import React, { createRef, useEffect } from "react";

import "./PlayerControlsTimebar.sass";
import { useVideoEvents } from "../library/videoEvents";
import { setPosition } from "../library/timeControl";

interface IPlayerControlsTimebarProps {
  src: HTMLVideoElement
}

export const PlayerControlsTimebar = ({ src }: IPlayerControlsTimebarProps) => {
  const clickedRef = createRef<HTMLDivElement>()

  useEffect(() => {
    const { current: elem } = clickedRef

    const click = (e: MouseEvent & { target: HTMLDivElement }) => {
      const { offsetX, target } = e
      const { offsetWidth } = target
      const percent = offsetX / offsetWidth

      setPosition(src, percent * src.duration)
    }

    const whell = (e: WheelEvent) => {
      e.preventDefault()

      let { currentTime, duration } = src
      let percent = currentTime / duration

      percent += e.deltaY * -1 * 0.0001
      currentTime = percent * duration

      setPosition(src,currentTime)
    }

    elem.addEventListener('click', click)
    elem.addEventListener('wheel', whell)

    return () => {
      elem.removeEventListener('click', click)
      elem.removeEventListener('wheel', whell)
    }
  }, [])

  return (
    <div className="wsv-controls-timebar">
      <PlayerControlsTimebarBuff src={src} />
      <div ref={clickedRef} className="wsv-controls-time-clicked"></div>
    </div>
  )
}

export const PlayerControlsTimebarBuff = ({ src }: IPlayerControlsTimebarProps) => {
  const buffArray: Array<[number, number]> = []
  const { buffered, duration, currentTime } = src
  const current = currentTime / duration * 100

  useVideoEvents(src, ['progress', 'timeupdate'])

  for (let i = 0; i < buffered.length; i++) {
    let start = buffered.start(i)
    let end = buffered.end(i)
    // let size = end - start

    if (start > src.currentTime || end < src.currentTime)
      continue

    let left = start / duration * 100
    let width = end / duration * 100

    buffArray.push([left, width])
  }

  return (
    <>
      <div
        style={{ left: '0%', width: `${current}%`, background: 'rgba(255,255,255,0.8)' }}
        className="wsv-controls-timebar-buff" />
      {buffArray.map(([left, width], i) => {
        return (
          <div
            key={`${i}_buff`}
            style={{ left: `0%`, width: `${width}%` }}
            className="wsv-controls-timebar-buff" />
        )
      })}
    </>
  )
}