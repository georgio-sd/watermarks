export function parseHex(hex: string): number[] {
  if(hex[0] == '#')
    hex = hex.substr(1)

  let double = hex.length % 2 != 0
  let segmets = hex.split('')
  let finalSegments: string[] = []


  if(double)
    for(let seg of segmets) {
      finalSegments.push(seg.repeat(2))
    }
  else
    for(let i = 0; i < segmets.length; i++) {
      let id = i/2|0

      if(typeof finalSegments[id] !== 'string')
        finalSegments.push('')

      finalSegments[id] += segmets[i]
    }

  finalSegments = finalSegments.map(e => `0x${e}`)
  return eval(`[${finalSegments.join(', ')}]`)
}

export function hex2rgb(hex: string) {
  try {
    let [r = 0, g = 0, b = 0] = parseHex(hex)
    return `rgb(${r}, ${g}, ${b})`
  }catch(e){
    throw new Error('Error color format!')
  }
}

export function hex2rgba(hex: string, a: number = 1) {
  try {
    let [r = 0, g = 0, b = 0] = parseHex(hex)

    if(a > 1 || a < 0)
      throw ''

    return `rgba(${r}, ${g}, ${b}, ${a})`
  }catch(e){
    throw new Error('Error color format!')
  }
}