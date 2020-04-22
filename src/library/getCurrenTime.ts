import { md5 } from "./md5";

export function getCurrentTime(key: string) {
  key = `time-${md5(key)}`
  let time = parseFloat(localStorage.getItem(key))
  return isNaN(time) ? 0 : time
}

export function setCurrentTime(key: string, value: number) {
  key = `time-${md5(key)}`
  localStorage.setItem(key, `${value}`)
  return value
}