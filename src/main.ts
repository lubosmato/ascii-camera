import './style.css'

import P5 from "p5"

const sketch = (p5: P5) => {
  let charactersWidth = 0
  let charactersHeight = 0

  let capture: P5.Element | null = null
  p5.setup = () => {
    
    p5.createCanvas(charactersWidth, charactersHeight)
    p5.noCanvas()

    p5.pixelDensity(1)

    capture = p5.createCapture({
      video: true,
      audio: false,
    })
	}

  let asciiPixels = " .°*oO#@"
  const asciiPixelsInput = document.querySelector<HTMLInputElement>("h1 > input")
  asciiPixelsInput?.setAttribute("value", asciiPixels)
  asciiPixelsInput?.addEventListener("input", () => {
    const newAsciiPixels = asciiPixelsInput.value ?? ""
    if (newAsciiPixels.length < 2) return

    asciiPixels = newAsciiPixels
  })
  
  const cameraDiv = document.querySelector<HTMLDivElement>(".camera")

  const updateCameraDivSize = () => {
    if (cameraDiv) {
      const fontSize = parseInt(getComputedStyle(cameraDiv).fontSize);

      charactersWidth = Math.ceil(cameraDiv.clientWidth / (fontSize * 0.60416666))
      charactersHeight = Math.ceil(cameraDiv.clientHeight / (fontSize * 0.6016666 * 1.5))
      p5.resizeCanvas(charactersWidth, charactersHeight)
    }
  }

  updateCameraDivSize()

	p5.draw = () => {
    if (!capture || !cameraDiv) return

    p5.image(capture, 0, 0, charactersWidth, charactersHeight)
    p5.loadPixels()

    let cameraTextData = ""

    for (let y = 0; y < charactersHeight; y++) {
      for (let x = 0; x < charactersWidth; x++) {

        const pixelIndex = (y * charactersWidth + x) * 4
        const r = p5.pixels[pixelIndex + 0]
        const g = p5.pixels[pixelIndex + 1]
        const b = p5.pixels[pixelIndex + 2]

        const pixelIntensity = Math.round(r * 0.2126 + g * 0.7152 + b * 0.0722)
        const asciiPixelIndex = p5.map(pixelIntensity, 0, 255, 0, asciiPixels.length - 1)
        const pixelChar = asciiPixels.charAt(asciiPixelIndex)

        cameraTextData += pixelChar
      }
      cameraTextData += "\n"
    }

    cameraDiv.innerHTML = cameraTextData
	}

  p5.windowResized = updateCameraDivSize
}

new P5(sketch)