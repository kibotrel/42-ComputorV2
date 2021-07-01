const { plot } = require('@plot/plotter.js')

const { power } = require('@srcs/maths/basic-functions.js')

module.exports = async () => {
  const data = []

  for (let x = -50; x < 50; x += 1) {
    let y = 0

    for (const polynom of polynomList) {
      y += (polynom.sign * polynom.factor * power(x, polynom.power))
    }

    data.push(y)
  }

  plot({
    data,
    filename: `${new Date().toString()}.png`,
    style: 'line',
    nokey: true,
    xlabel: 'x',
    ylabel: 'y',
    x_begin: -50,
    finish: () => {}
  })
}