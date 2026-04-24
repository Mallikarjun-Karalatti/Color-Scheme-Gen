const colorEl = document.getElementById("color-el")
const colorScheme = document.getElementById("color-scheme")
const getColorBtn = document.querySelector('button')
const url = "https://www.thecolorapi.com"
const count  = 5

getColorBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const colorVal = colorEl.value
    const colorSchemeVal = colorScheme.value
    
    let colorBlockHtml = ''
    
    fetch(`${url}/scheme?hex=${colorVal.slice(1)}&mode=analogic&count=${count}`, {
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
        const colors = data.colors
        
        colors.forEach(color => {
            let bgColor

            switch(colorSchemeVal){
                case 'hex':
                    bgColor = color.hex.value
                    break
                case 'rgb':
                    bgColor = color.rgb.value
                    break
                case 'hsl':
                    bgColor = color.hsl.value
                    break
                case 'cmyk':
                    // Convert CMYK to RGB
                    const c = color.cmyk.c / 100
                    const m = color.cmyk.m / 100
                    const y = color.cmyk.y / 100
                    const k = color.cmyk.k / 100

                    const r = 255 * (1 - c) * (1 - k)
                    const g = 255 * (1 - m) * (1 - k)
                    const b = 255 * (1 - y) * (1 - k)

                    bgColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
                    break
                default:
                    bgColor = color.hex.value
            }

            colorBlockHtml += `
                <div class="color-block">
                    <div style="background-color:${bgColor}"></div>
                    <p style="color: ${bgColor}">${color[colorSchemeVal].value}</p>
                </div>
            `
        })
        
        document.getElementById('color-palette').innerHTML = colorBlockHtml
    })
})


// Attach click-to-copy after rendering
document.querySelectorAll('#color-palette p').forEach(p => {
  p.addEventListener('click', () => {
    const text = p.textContent.trim()
    navigator.clipboard.writeText(text)
      .then(() => {
        // Optional: give user feedback
        p.style.fontWeight = 'bold'
        setTimeout(() => p.style.fontWeight = 'normal', 500)
      })
      .catch(err => console.error('Clipboard error:', err))
  })
})
