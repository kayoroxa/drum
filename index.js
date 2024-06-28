const soundsFilesNames = {
  // bell: 'BELL-V05-ROBMOR-SABIAN-22.wav',
  hiHat: 'HHats-CL-V07-SABIAN-AAX.wav',
  kick: 'Kick-V07-Yamaha-16x16.wav',
  snare: 'SNARE-V09-CustomWorks-6x13.wav',
  tom1: 'V08-TTom 10.wav',
  tom2: 'V08-TTom-12.wav',
  tom3: 'V08-TTom13.wav',
}

const probability = {
  hiHat: 0.3,
  kick: 0.4,
  snare: 0.5,
  tom1: 0.3,
  tom2: 0.3,
  tom3: 0.3,
}

const ritmos = [
  {
    allSec: 1.213,
    times: [
      {
        time: 0.001,
        volume: 0.9,
      },
      {
        time: 0.172,
        volume: 0.8,
      },
      {
        time: 0.302,
        volume: 0.1,
      },
      {
        time: 0.463,
        volume: 0.2,
      },
      {
        time: 0.624,
        volume: 0.99,
      },
      {
        time: 0.778,
        volume: 0.8,
      },
      {
        time: 0.93,
        volume: 0.15,
      },
      {
        time: 1.064,
        volume: 0.24,
      },
    ],
  },
]

function getByProbability(probability) {
  const max = Object.values(probability).reduce((a, b) => a + b)
  const random = Math.random()

  let current = 0

  for (const key in probability) {
    current += probability[key]

    if (random < current / max) {
      return key
    }
  }

  return null
}

let tempoScale = 0.5 // Escala inicial de tempo

function playAudio(volume, soundName) {
  const sounds = Object.keys(soundsFilesNames)
  const random = Math.random()
  let randomName = getByProbability(probability)

  const randomSound = soundsFilesNames[soundName || randomName]

  const audio = new Audio()
  audio.src = `./sounds/${randomSound}`

  audio.volume = volume
  audio.play()

  const element = document.querySelector(`.${soundName || randomName}`)
  element.classList.add('highlight')

  setTimeout(() => {
    element.classList.remove('highlight')
  }, 200)
}

const allTimeOuts = []

function playRitmo() {
  allTimeOuts.forEach(timeout => {
    clearTimeout(timeout)
  })

  ritmos.forEach(ritmo => {
    ritmo.times.forEach(({ time, volume }) => {
      const timeout = setTimeout(() => {
        playAudio(volume)
      }, time * 1000 * tempoScale) // Aplica a escala de tempo aqui

      allTimeOuts.push(timeout)
    })
  })

  // Chama recursivamente a função playRitmo após o término de todos os tempos
  const nextTimeout = setTimeout(
    playRitmo,
    ritmos[0].allSec * 1000 * tempoScale
  )

  allTimeOuts.push(nextTimeout)
}

//onkeydown

document.addEventListener('keydown', e => {
  if (e.key === ' ') {
    playRitmo()
  }
})

const sounds = Object.keys(soundsFilesNames)

sounds.forEach(sound => {
  const element = document.querySelector(`.${sound}`)
  element.addEventListener('click', () => {
    playAudio(1, sound)
  })
})
