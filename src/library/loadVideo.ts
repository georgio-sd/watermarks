import HLS from "hls.js";
import isMobile from "ismobilejs";

const {apple: {phone, tablet, device}, any} = isMobile()
export function loadVideo(video: HTMLVideoElement, src?: string) {
  if(!src)
    return video.src = ''

  if(/\.m3u8$/.test(src))
    return loadHls(video, src)

  return video.src = src
}

export function loadHls(video: HTMLVideoElement, src: string) {
  if (video.canPlayType('application/vnd.apple.mpegurl') && (!any || phone || tablet)) {
    video.src = src
  }else if (HLS.isSupported()) {
    const hls = new HLS()
    hls.loadSource(src)
    hls.attachMedia(video)
  } else 
    throw new Error('Not supported!')
  return src
}