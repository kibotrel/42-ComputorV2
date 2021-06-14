const { Variables } = global

module.exports = (argumentsList, type) => {
  try {
    const showList = []
    if (argumentsList.length) {
      throw { data: argumentsList.join(' '), code: 'invalidArgument' }
    }

    for (const element of Variables) {
      if (element.value.constructor.name === type) {
        if (type === 'Expression') {
          showList.push(`${element.value.print()}`)
        } else {
          showList.push(`\x1b[32;1m${element.id}\x1b[0;1m = ${element.value.print()}`)
        }
      }
    }

    if (!showList.length) {
      console.log(`\n\x1b[1mNo \x1b[32m${type}\x1b[0;1m recorded yet!\x1b[0m\n`)
    } else {
      console.log(`\n\x1b[1mFound \x1b[33m${showList.length} \x1b[32m${type}\x1b[0;1m element(s):\x1b[0m\n`)
      console.log(`\t${showList.join('\n\t')}\n`)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
