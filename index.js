const colorEl = document.getElementById("color-el")
const colorScheme = document.getElementById("color-scheme")
const getColorBtn = document.querySelector('button')
const url = "https://www.thecolorapi.com"
const count = 5

let colors = []
let colorSchemeVal = 'hex'

// Handle form submit
getColorBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const colorVal = colorEl.value
    colorSchemeVal = colorScheme.value

    fetch(`${url}/scheme?hex=${colorVal.slice(1)}&mode=analogic&count=${count}`, {
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
        colors = data.colors
        renderColors()
    })
    .catch(err => console.error('Fetch error:', err))
})

function renderColors() {
    let colorBlockHtml = ''

    colors.forEach(color => {
        let bgColor
        let displayValue

        switch (colorSchemeVal) {
            case 'hex':
                bgColor = color.hex.value
                displayValue = color.hex.value
                break
            case 'rgb':
                bgColor = color.rgb.value
                displayValue = color.rgb.value
                break
            case 'hsl':
                bgColor = color.hsl.value
                displayValue = color.hsl.value
                break
            case 'cmyk':
                // Convert CMYK to RGB for background
                const c = color.cmyk.c / 100
                const m = color.cmyk.m / 100
                const y = color.cmyk.y / 100
                const k = color.cmyk.k / 100

                const r = 255 * (1 - c) * (1 - k)
                const g = 255 * (1 - m) * (1 - k)
                const b = 255 * (1 - y) * (1 - k)

                bgColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
                displayValue = color.cmyk.value // show CMYK string
                break
            default:
                bgColor = color.hex.value
                displayValue = color.hex.value
        }

        colorBlockHtml += `
            <div class="color-block">
                <div style="background-color:${bgColor}"></div>
                <p class="color-value" style="cursor:pointer">${displayValue}</p>
            </div>
        `
    })

    document.getElementById('color-palette').innerHTML = colorBlockHtml

    // Attach click-to-copy after rendering
    document.querySelectorAll('.color-value').forEach(p => {
        p.addEventListener('click', () => {
            const text = p.textContent.trim()
            navigator.clipboard.writeText(text)
                .then(() => {
                    // Feedback: temporarily bold
                    p.style.fontWeight = 'bold'
                    setTimeout(() => p.style.fontWeight = 'normal', 500)
                })
                .catch(err => console.error('Clipboard error:', err))
        })
    })
}
