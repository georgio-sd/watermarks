import React from "react";
import {render} from "react-dom";

import "./library/polifill.js";
import "./main.sass";
import "./library/polifill";
import { Player } from "./components/Player";

window['debug'] = true


const params = {
  width: ['data-width', 600],
  src: ['data-src', null],
  srcConfig: ['data-src-config', null],
  autoplay: ['data-autoplay', false],
  watermark: ['data-watermark', null],
  remember: ['data-remember', null]
}


async function main() {
  for (let element of document.querySelectorAll('div[data-player]')) {
    const data: {[key: string]: any} = {}

    for(let key in params) {
      let [attributeName, defaultValue] = params[key]
      let value = element.getAttribute(attributeName) || defaultValue

      if(element.hasAttribute(attributeName)) {
        if(value)
          data[key] = value
        else
          data[key] = true

        element.removeAttribute(attributeName)
      }else {
        data[key] = null
      }
    }

    let {width, src, autoplay, srcConfig, watermark, remember} = data
  
    if(srcConfig)
      src = eval(`config.${srcConfig}`)

    if(remember == true)
      remember = src

    render(<Player autoplay={autoplay} src={src} width={width} remember={remember} watermark={watermark} />, element)
  } 
}

window.addEventListener('load', () => {
  main().catch(console.error)
})