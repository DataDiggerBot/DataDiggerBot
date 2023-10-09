const { NewMessage } = require("telegram/events")

const processNewUpdate = ( data, userbot, collection ) => {
  let {
    targetBot,
    timeout,
    onTimeout,
    onSuccess,
    waitFor
  } = data

  let updated = false

  let eventOptions = {
    incoming: true,
    fromUsers: [ targetBot ]
  }

  let event = new NewMessage(eventOptions)
  let callB = ev => {
    let cacheCl = collection.get(targetBot)
    let expired = cacheCl?.filter(itm => itm.id === ev.message.id)

    let newValue = cacheCl
      ? [ { id: ev.message.id }, ...cacheCl ]
      : [ { id: ev.message.id } ]

    if (
      ( waitFor !== 'media' && ev.message.media ) ||
      ( waitFor === 'media' && !ev.message.media )
    ) return

    if ( expired?.length ) return
    collection.set(targetBot, newValue)

    updated = true
    ev.client.removeEventHandler(callB, event)
    onSuccess(ev.message)
  }

  userbot.addEventHandler(callB, event)
  setTimeout(() => {
    if ( updated ) return
    else {
      userbot.removeEventHandler(callB, event)
      onTimeout({ targetBot: data.targetBot })
    }
  }, timeout)
}

module.exports = processNewUpdate
