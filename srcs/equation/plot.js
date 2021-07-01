const { plot } = require('@plot/plotter.js')

const { pow } = require('@srcs/maths/basic-functions.js')

 const timeStamp = () => {
  const now = new Date()
  const date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ]
  const time = [ now.getHours(), now.getMinutes(), now.getSeconds() ]

  for (let i = 0; i < 3; i++) {
    if (time[i] < 10) {
      time[i] = "0" + time[i]
    }

    if (date[i] < 10) {
      date[i] = "0" + date[i]
    }
  }
  return `${date.join("-")}_${time.join(":")}`
}



module.exports = async (polynomList) => {
  const data = []

  for (let x = -50; x < 50; x += 1) {
    let y = 0

    for (const polynom of polynomList) {
      y += (polynom.sign * polynom.factor * pow(x, polynom.power))
    }

    data.push(y)
  }
  
  plot({
    data,
    filename: `${timeStamp()}.png`,
    style: 'line',
    nokey: true,
    xlabel: 'x',
    ylabel: 'y',
    x_begin: -50,
    finish: () => {}
  })
}
