export function getTimeString(time: number) {
  let get = () => {
    let t = time;
    time /= 60;
    return t % 60
  }

  let s = get() | 0
  let m = get() | 0
  let h = get() | 0

  let timeString = `${m}:${s}`
  if (h) timeString = `${h}:${timeString}`

  return timeString.split(':')
    .map((e, i, t) => i != 0 ? `${'0'.repeat(2 - e.length)}${e}`: e)
    .join(':')
}