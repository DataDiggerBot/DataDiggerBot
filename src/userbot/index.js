const os = require('os')
const fs = require('fs')
const path = require('path')

const { TelegramClient } = require("telegram");
const { StringSession } = require('telegram/sessions');

const settings = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../settings/config.json"), "utf8")
);

const {
  api_hash: API_HASH,
  api_id: API_ID,
  session_string: SESSION_STRING,
} = settings

const opts = {
  useWSS: true,
  connectionRetries: 5,
  testServers: false,
  deviceModel: 'Chrome 114',
  appVersion: '1.0.0',
  systemVersion: os.version(),
}

const sesion = new StringSession(SESSION_STRING)
const client = new TelegramClient(sesion, parseInt(API_ID), API_HASH, opts)

client.setLogLevel('none')

module.exports = client
