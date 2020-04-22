export const setPosition = (src: HTMLVideoElement, time: number) => {
  const { paused, duration } = src

  if (isNaN(time))
    return null

  if (time < 0)
    time = 0

  if (time > duration)
    time = duration

  time = time | 0

  if (!paused) {
    try { src.pause() } catch (e) { }
  } else {
    src.play().catch(() => { })
  }

  src.currentTime = time

  if (!paused) {
    src.play().catch(() => { })
  } else {
    try { src.pause() } catch (e) { }
  }
}