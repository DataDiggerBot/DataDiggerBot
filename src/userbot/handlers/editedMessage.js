const processNewUpdate = require('./newMessage')
const { EditedMessage } = require('telegram/events/EditedMessage');

const processEditUpdate = ( data, userbot, collection ) => {
  let success = res => {
    let eventOptions = {
      incoming: true,
      fromUsers: [ data.targetBot ]
    }

    let updated = false
    let updatedMsgId = res.id

    let evEdit = new EditedMessage(eventOptions)
    let cbEdit = ev => {
      if ( ev.message.id !== updatedMsgId ) return
      else updated = true

      data.onSuccess(ev.message)
      ev.client.removeEventHandler(cbEdit, evEdit)
    }

    res.client.addEventHandler(cbEdit, evEdit)
    setTimeout(() => {
      if ( updated ) return
      else {
        res.client.removeEventHandler(cbEdit, evEdit)
        data.onTimeout({ targetBot: data.targetBot })
      }
    }, data.timeout)
  }

  processNewUpdate(
    { ...data, onSuccess: success },
    userbot,
    collection
  )
}

module.exports = processEditUpdate
