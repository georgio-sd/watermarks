export function getTextSize(text: string, font?: string) {
  let elem = document.createElement('p')

  if(font)
    elem.style.font = font

  elem.style.opacity = '0'
  elem.style.margin = '0'
  elem.style.padding = '0'
  elem.style.display = 'inline'
  elem.innerText = text

  document.body.appendChild(elem)
  let {offsetWidth, offsetHeight} = elem
  document.body.removeChild(elem)
  return {width: offsetWidth, height: offsetHeight}
}