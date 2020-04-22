import { useForceUpdate } from "./forceUpdate"
import { useEffect } from "react"

export class PlayerStart extends Event {
  player: HTMLVideoElement

  constructor(player: HTMLVideoElement) {
    super('play')
    this.player = player
  }
}

export class PlayerVolume extends Event {
  volume: number

  constructor(volume: number) {
    super('volume')
    this.volume = volume
  }
}

export class PlayerMute extends Event {
  constructor() {
    super('mute')
  }
}

const Events = {
  play: PlayerStart,
  volume: PlayerVolume
}

type TEvents = typeof Events
type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any ? U : any;

export class GlobalEvents {
  static _e = document.createElement('div')

  static add<K extends keyof TEvents>(type: K, listener: (event: InstanceType<typeof Events[K]>) => void){
    this._e.addEventListener(<any>type, listener)
  }

  static remove<K extends keyof TEvents>(type: K, listener: (event: InstanceType<typeof Events[K]>) => void) {
    this._e.removeEventListener(<any>type, listener)
  }

  static use<K extends keyof TEvents>(type: K, listener: (event: InstanceType<typeof Events[K]>) => void) {
    const update = useForceUpdate()

    useEffect(() => {
      const listen = listener
      const exec = (e) => {
        if(!listen)
          return update()

        listen(e)
      }

      this.add(type, exec)

      return () => this.remove(type, exec)
    }, [])
  }

  static emit<K extends keyof TEvents, S = FirstArgument<TEvents[K]>>(type: K, arg: S) {
    this._e.dispatchEvent(eval(`new Events[type](arg)`))
  }
}

GlobalEvents.emit('play', 2)