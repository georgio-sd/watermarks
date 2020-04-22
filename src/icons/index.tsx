import React from "react";
import "./style.scss";

const icons = {
  enlarge: null,
  shrink: null,
  play: null,
  pause: null,
  stop: null,
  previous: null,
  next: null,
  backward: null,
  forward: null,
  volumeHigh: null,
  volumeMedium: null,
  volumeLow: null,
  volumeMute: null 
}

export type TIcon = keyof typeof icons

export const IconComponent = ({icon}: {icon: TIcon}) => {
  let className = [];

  for(let s of icon) {
    if(s == s.toLowerCase()) {
      className.push(s)
      continue
    }
    
    className.push('-')
    className.push(s.toLowerCase())
  }

  return (
    <i className={'icon-' + className.join('')}></i>
  )
}
