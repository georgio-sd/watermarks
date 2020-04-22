export interface IWatermark {
  text: string
  fontSize?: number
  fontFamily?: string
  color?: string
  alpha?: number
  delay?: number[]
}

export async function loadWatermark(url: string): Promise<IWatermark[]> {
  if(!url)
    return null

  let watermarkString = await (
    new Promise<string>((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.onreadystatechange = () => {
        if(xhr.readyState !== 4)
          return null

        resolve(xhr.responseText)
      }
      xhr.onerror = reject
      xhr.send()
    })
  )

  if(!watermarkString)
    throw new Error('Error loading watermark!')
    
  try {
    let object = JSON.parse(watermarkString)

    if(!Array.isArray(object))
      throw ''

    for(let row of object) {
      if(!row['text'] || typeof row['text'] !== 'string')
        throw ''

      if(row['delay']) {
        if(typeof row['delay'] == 'number') {
          row['delay'] = [row['delay']]
          continue
        }

        if(typeof row['delay'] !== 'string')
          throw ''

        let arg = row['delay'].split('-')
          .map(e => parseInt(e))
          .filter(e => !isNaN(e))
          .map(e => e)
        
        if(!arg.length)
          throw ''

        row['delay'] = arg
      }
    }

    return object
  }catch(e) {
    throw new Error('Error loading watermark!')
  }
}