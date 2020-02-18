import Tone from 'tone'

const rows = [
    { start: 3, chars: "zxcvbnm,./" },
    { start: 3, chars: "asdfghjkl;" },
    { start: 3, chars: "qwertyuiop[" },
    { start: 2, chars: "234567890-" },
]

function chKey(ch: string, ref: number) {
    for(const [i, row] of rows.entries()) {
        const j = row.chars.indexOf(ch)

        if(j != -1) {
            return ref + 5*i + 2*(j - row.start)
        }
    }

    return null
}

function keyToHz(key: number): number {
    return 8.1757989156 * Math.pow(2.0, key / 12.0)
}

function keyId(ch: string): string {
    switch(ch) {
        case '.': return "dot"
        case ',': return "comma"
        case '/': return "slash"
        case ';': return "semicolon"
        case '[': return "brace"
        case '-': return "minus"
        default: {
            const num = parseInt(ch)
            if(!isNaN(num)) { return `d${num}` }
            else { return ch }
        }
    }
}


let synth = new Tone.PolySynth(6, undefined).toMaster();

function init() {
    window.addEventListener("keydown", (ev) => {
        const key = chKey(ev.key, 60)
        if(key != null) {
            const freq = keyToHz(key)
            synth.triggerAttack([freq], undefined, 0.2)

            const el = document.getElementById(keyId(ev.key))
            if(el != null) {
                el.style.backgroundColor = "#808080"
            }
        }
    })
    window.addEventListener("keyup", (ev) => {
        const key = chKey(ev.key, 60)
        if(key != null) {
            const freq = keyToHz(key)
            synth.triggerRelease([freq])
        }

        const el = document.getElementById(keyId(ev.key))
        if(el != null) {
            el.style.backgroundColor = ""
        }
    })
}

window.addEventListener("load", init)
