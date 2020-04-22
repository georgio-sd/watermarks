export function checkBuffered(video: HTMLVideoElement) {
  const { buffered, currentTime, duration, readyState } = video
  
  if(buffered.length == 0 && duration)
    return false

  if(readyState == 4)
    return false
  
  for(let i = 0; i < buffered.length; i++) {
    let start = buffered.start(i)
    let end = buffered.end(i)

    if(start <= currentTime && end > currentTime)
      return false
  }

  return true
}