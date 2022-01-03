const isValidNumber = (string) => {
  return string.match(/^\d+$/)
} 

const isValidBoolean = (string) => {
  return string.match(/^(true|false)$/)
} 

module.exports = (argumentsList) => {
  try {
    if (argumentsList.length !== 2) {
      throw new ComputorError({ data: { name: '!set', found: argumentsList.length, expected: 2 }, code: 'incorrectParameterAmount' })
    }

    const [ setting, value ] = argumentsList

    if (Config.env.protectedSettings.indexOf(setting) >= 0) {
      throw new ComputorError({ data: { setting }, code: 'protectedSetting' })
    }

    const [ section, property ] = setting.split('.')

    if (section === undefined || property === undefined) {
      throw new ComputorError({ data: { setting }, code: 'unknownSetting' })
    }

    for (const configSection of Object.keys(Config)) {
      if (section === configSection.toLocaleLowerCase()) {
        for (const configProperty of Object.keys(Config[configSection])) {
          if (property === configProperty.toLocaleLowerCase()) {
            const dataType = typeof Config[configSection][configProperty]

            if (dataType === 'number') {
              if (isValidNumber(value)) {
                Config[configSection][configProperty] = parseInt(value)
                
                if (!Config.env.silentMode) {
                  console.log(`\x1b[1mUpdated \x1b[32mSettings\x1b[0;1m property!\n\n\t\x1b[32m${configSection}\x1b[0;1m.\x1b[32m${configProperty}\x1b[0;1m = \x1b[33m${Config[configSection][configProperty]}\x1b[0m\n`)
                }

                return { section: configSection, property: configProperty, value }
              } else {
                throw new ComputorError({ data: { setting }, code: 'incorrectSettingType' })
              }
            } else if (dataType === 'boolean') {
              if (isValidBoolean(value)) {
                Config[configSection][configProperty] = JSON.parse(value)
                
                if (!Config.env.silentMode) {
                  console.log(`\x1b[1mUpdated \x1b[32mSettings\x1b[0;1m property!\n\n\t\x1b[32m${configSection}\x1b[0;1m.\x1b[32m${configProperty}\x1b[0;1m = \x1b[36m${Config[configSection][configProperty]}\x1b[0m\n`)
                }

                return { section: configSection, property: configProperty, value: JSON.parse(value) }
              } else {
                throw new ComputorError({ data: { setting }, code: 'incorrectSettingType' })
              }
            }
          }
        }
      }
    }

    throw new ComputorError({ data: { setting: value }, code: 'unknownSetting' })
  } catch (error) {
    return Promise.reject(error)
  }
}
