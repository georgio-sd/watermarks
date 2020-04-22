import { useEffect } from "react";
import { useForceUpdate } from "./forceUpdate";

export type TEvent = keyof HTMLVideoElementEventMap
export type TEvents = TEvent[]

export const videoEvents = {
  add(video: HTMLVideoElement, events: TEvent[], update = null) {
    events.map(e => video.addEventListener(e, update))
  },

  remove(video: HTMLVideoElement, events: TEvent[], update = null) {
    events.map(e => video.removeEventListener(e, update))
  }
}

export const useVideoEvents = (video: HTMLVideoElement, events: TEvents = [], listener: () => any = null) => {
  const update = useForceUpdate()

  useEffect(() => {
    let listen = listener || update
    videoEvents.add(video, events, listen)

    return () => videoEvents.remove(video, events, listen)
  }, [])
}