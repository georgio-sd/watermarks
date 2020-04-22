import React from "react";

import "./PlayerLoading.scss";
import { checkBuffered } from "../library/checkBuffered";
import { useVideoEvents } from "../library/videoEvents";
import { useForceUpdate } from "../library/forceUpdate";

interface IPlayerLoadingProps {
  src: HTMLVideoElement
}

export const PlayerLoading = ({ src }: IPlayerLoadingProps) => {
  const update = useForceUpdate()
  const loading = checkBuffered(src)
  
  useVideoEvents(src, [
    'loadeddata', 
    'loadedmetadata', 
    'progress', 
    'loadstart', 
    'timeupdate',
    'playing',
    'play'
  ])

  return (
    <div onClick={update} className={'wsv-player-loading'+(loading ? '' : ' hidden')}>
      <div className="cssload-dots">
        <div className="cssload-dot"></div>
        <div className="cssload-dot"></div>
        <div className="cssload-dot"></div>
        <div className="cssload-dot"></div>
        <div className="cssload-dot"></div>
      </div>

      <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="12" ></feGaussianBlur>
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0	0 1 0 0 0	0 0 1 0 0	0 0 0 18 -7" result="goo" ></feColorMatrix>
          </filter>
        </defs>
      </svg>
    </div>
  )
}