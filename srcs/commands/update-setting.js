const { Config } = global

const isValidNumber = (string) => {
  return string.match(/^\d+$/)
} 

const isValidBoolean = (string) => {
  return string.match(/^(true|false)$/)
} 

module.exports = (argumentsList) => {
  try {
    if (argumentsList.length !== 2) {
      throw { data: argumentsList.join(' '), code: 'invalidArgument' }
    }

    const [ setting, value ] = argumentsList

    if (Config.env.protectedSettings.indexOf(setting) >= 0) {
      throw { data: setting, code: 'protectedSetting' }
    }

    const [ section, property ] = setting.split('.')

    if (section === undefined || property === undefined) {
      throw { data: setting, code: 'unknownSetting' }
    }

    for (const configSection of Object.keys(Config)) {
      if (section === configSection.toLocaleLowerCase()) {
        for (const configProperty of Object.keys(Config[configSection])) {
          if (property === configProperty.toLocaleLowerCase()) {
            const dataType = typeof Config[configSection][configProperty]

            if (dataType === 'number') {
              if (isValidNumber(value)) {
                Config[configSection][configProperty] = parseInt(value)
                
                console.log(`\x1b[1mUpdated \x1b[32mSettings\x1b[0;1m property!\n\n\t\x1b[32m${configSection}\x1b[0;1m.\x1b[32m${configProperty}\x1b[0;1m = \x1b[33m${Config[configSection][configProperty]}\x1b[0m\n`)
                
                return
              } else {
                throw { data: { setting, value }, code: 'inccorectSettingType' }
              }
            } else if (dataType === 'boolean') {
              if (isValidBoolean(value)) {
                Config[configSection][configProperty] = JSON.parse(value)
                
                console.log(`\x1b[1mUpdated \x1b[32mSettings\x1b[0;1m property!\n\n\t\x1b[32m${configSection}\x1b[0;1m.\x1b[32m${configProperty}\x1b[0;1m = \x1b[36m${Config[configSection][configProperty]}\x1b[0m\n`)
                
                return
              } else {
                throw { data: { setting, value }, code: 'inccorectSettingType' }
              }
            }
          }
        }
      }
    }

    throw { data: value, code: 'unknownSetting' }
  } catch (error) {
    return Promise.reject(error)
  }
}
