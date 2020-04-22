import { GlobalEvents } from "./globalEvents"


export const VolumeControl = {
  get lastVolume() {
    let v = parseFloat(localStorage.getItem('global-volume-last'))

    if(v > 1)
      v = 1
      
    if(v < 0)
      v = 0

    return isNaN(v) ? 1 : v
  },
  set lastVolume(v: number) {
    if(v > 1)
      v = 1
      
    if(v < 0)
      v = 0

    localStorage.setItem('global-volume-last', `${v}`)
  },
  set volume(v: number) {
    if(v > 1)
      v = 1
      
    if(v < 0)
      v = 0

    if(v) this.lastVolume = v
    localStorage.setItem('global-volume', `${v}`)
    GlobalEvents.emit('volume', v)
  },
  get volume() {
    let v = parseFloat(localStorage.getItem('global-volume'))

    if(v > 1)
      v = 1
      
    if(v < 0)
      v = 0

    return isNaN(v) ? 1 : v
  },
  mute() {
    let {volume, lastVolume} = this

    if(volume == 0)
      this.volume = lastVolume
    else
      this.volume = 0
  }
}