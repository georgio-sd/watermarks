{
  let { prototype } = HTMLElement
  let fullscreen = prototype.requestFullscreen ||
    prototype.webkitRequestFullscreen ||
    prototype.mozRequestFullScreen ||
    prototype.msRequestFullscreen

  prototype.requestFullscreen = fullscreen
}

{
  let { prototype } = Document
  let cancel = prototype.exitFullscreen ||
    prototype.mozCancelFullScreen ||
    prototype.webkitExitFullscreen ||
    prototype.msExitFullscreen

  prototype.exitFullscreen = cancel
}
