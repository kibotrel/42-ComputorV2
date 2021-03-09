const { Variables } = global

module.exports = (command, argument, type) => {
  try {
    const showList = []
    if (argument) {
      throw { data: `${command}${argument}`, code: 'invalidCommand' }
    }

    for (const element of Variables) {
      if (element.value.constructor.name === type) {
        showList.push(`${element.id}: ${element.value.print()}`)
      }
    }

    if (!showList.length) {
      console.log(`No ${type} recorded yet!`)
    } else {
      console.log(`Found ${showList.length} ${type} element(s):`)
      console.log(`  ${showList.join('\n  ')}`)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}