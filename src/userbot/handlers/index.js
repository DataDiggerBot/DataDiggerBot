const userbot = require('../index')

const processNewUpdate = require('./newMessage')
const processEditUpdate = require('./editedMessage')

const collection = new Map()

const processUpdate = async data => {
  let {
    type,
    text,
    file,
    targetBot,
  } = data

  if ( file && !text ) {
    await userbot.sendFile(targetBot, { file })
  } else {
    await userbot.sendMessage(targetBot, { message: text })
  }

  if ( type === 'new' ) {
    return processNewUpdate(data, userbot, collection)
  }

  if ( type === 'edit' ) {
    return processEditUpdate(data, userbot, collection)
  }
}

module.exports = processUpdate
