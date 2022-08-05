require('dotenv').config()
const { Client } = require('@notionhq/client')

const { NOTION_API_KEY, NOTION_PLAYER_DB_ID, NOTION_SCORE_DB_ID } = process.env

const notion = new Client({ auth: NOTION_API_KEY })

async function getDatabase(dbId) {
  const response = await notion.databases.retrieve({database_id: NOTION_PLAYER_DB_ID})
  return response
}

async function getPlayer(discordTag) {
  const response = await notion.databases.query({
    database_id: NOTION_PLAYER_DB_ID,
    filter: {
      property: 'DiscordTag',
      rich_text: {
        equals: discordTag
      }
    }
  })

  return response
}

async function createPlayer(name, discordTag) {
  const response = await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: NOTION_PLAYER_DB_ID
    },
    "properties": {
      "Nom": {
        "title": [
          {
            text: {
              content: name
            }
          }
        ]
      },
      "DiscordTag": {
        rich_text: [
          {
            text: {
              content: discordTag
            }
          }
        ]
      }
    }
  })

  return response
}

async function addScore(player, { game, tries, position }) {
  const response = await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: NOTION_SCORE_DB_ID
    },
    properties: {
      "0": {
        title: [{
          type: 'text',
          text: {
            content: ''
          }
        }]
      },
      "Joueur": {
        relation: [
          {
            id: player.id
          }
        ]
      },
      "Tags": {
        select: {
          name: game
        }
      },
      "Nombre de coups": {
        number: tries
      },
      "Position": {
        number: position || ''
      },
      "Date": {
        date: {
          start: new Date()
        }
      }
    }
  })

  return response
}

module.exports = {
  getDatabase,
  getPlayer,
  createPlayer,
  addScore
}