let musicIsPlaying = false
let musicInterval = null

const AudioContext = window.AudioContext || window.webkitAudioContext
const audio = new AudioContext()
let beeper = audio.createOscillator()

const soundButton = document.querySelector('.sound-button')
console.log('sound button:', soundButton)

const startMusic = () => {
  if (musicIsPlaying) {
    return
  }

  musicIsPlaying = true

  const BPM = 80 // BPM

  let state = { currentStep: -1 }

  const beatsPerSecond = BPM / 60
  const beatsPerMs = beatsPerSecond / 1000
  const stepsPerMs = beatsPerMs * 4
  const stepIntervalMs = 1 / stepsPerMs

  const baseFrequencyByBaseNote = {
    a: 220,
    "a#": 233.08,
    b: 246.94,
    c: 261.63,
    "c#": 277.18,
    d: 293.66,
    "d#": 311.13,
    e: 329.63,
    f: 349.23,
    "f#": 369.99,
    g: 392,
    "g#": 415.3
  }

  const getIsNumber = x => !isNaN(x)

  const getFrequency = note => {
    const lastChar = note[note.length - 1]
    const lastCharIsNumber = getIsNumber(lastChar)

    if (lastCharIsNumber) {
      const baseNote = note.slice(0, note.length - 1)
      const baseFrequency = baseFrequencyByBaseNote[baseNote]
      const octave = parseInt(lastChar, 10)
      return baseFrequency * 2 ** (octave - 3)
    } else {
      return baseFrequencyByBaseNote[note]
    }
  }

  const makeBeep = note => {
    try {
      beeper.stop()
    } catch (error) { }

    if (!note) {
      return
    }

    beeper = audio.createOscillator()
    beeper.type = "square"
    const frequency = getFrequency(note)
    beeper.frequency.setValueAtTime(frequency, audio.currentTime)
    beeper.connect(audio.destination)
    beeper.start()
  }

  const music = [
    "f",
    "",
    "c",
    "c#",
    "d#",
    "",
    "c#",
    "c",
    "a#",
    "",
    "a#",
    "c#",
    "f",
    "",
    "d#",
    "c#",
    "c",
    "",
    "",
    "c#",
    "d#",
    "",
    "f",
    "",
    "c#",
    "",
    "a#",
    "",
    "a#",
    "",
    "",
    "",


    "",
    "d#",
    "",
    "f#",
    "a#4",
    "",
    "g#",
    "f#",
    "f",
    "",
    "",
    "c#",
    "f",
    "",
    "d#",
    "c#",
    "c",
    "",
    "c",
    "c#",
    "d#",
    "",
    "f",
    "",
    "c#",
    "",
    "a#",
    "",
    "a#",
    "",
    "",
    ""
  ]

  musicInterval = setInterval(() => {
    state = { ...state, currentStep: (state.currentStep + 1) % music.length }
    makeBeep(music[state.currentStep])
  }, stepIntervalMs)
}

const stopMusic = () => {
  if (!musicIsPlaying) return
  clearInterval(musicInterval)
  musicIsPlaying = false
}

soundButton.onclick = () => {
  if (musicIsPlaying) {
    stopMusic()

    try {
      beeper.stop()
    } catch (error) { }

    soundButton.innerHTML = '🔇'
  } else {
    startMusic()
    soundButton.innerHTML = '🔈'
  }
}
