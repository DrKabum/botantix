require('dotenv').config()
const { Client } = require('@notionhq/client')

const { today } = require('../utils/date-helpers')

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

async function createPlayer(name, discordTag, avatarURL) {
  const response = await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: NOTION_PLAYER_DB_ID
    },
    icon: {
      type: 'external',
      external: {
        url: avatarURL
      }
    },
    properties: {
      "Nom": {
        title: [
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
          start: today()
        }
      }
    }
  })

  return response
}

async function getRankings(game = null) {
  const players = await getAllPlayers()

  // get all scores for each player
  const scores = await Promise.all(players.map(player => getScoreFor(player.id, game)))

  scores.forEach((score, i) => players[i].score = score)

  return players.sort((a, b) => b.score - a.score)
}

async function getAllPlayers() {
  // get all players IDs
  const playerQuery = {
    database_id: NOTION_PLAYER_DB_ID
  }
  const playerResponse = await notion.databases.query(playerQuery)
  const playerNames = await Promise.all(playerResponse.results.map(res => notion.pages.properties.retrieve({page_id: res.id, property_id: res.properties["Nom"].id})))
  const playerIds = playerResponse.results.map(res => res.id)
  const output = []

  for (let i = 0; i < playerIds.length; i++) {
    output.push({
      name: playerNames[i].results[0].title.plain_text,
      id: playerIds[i]
    })
  }

  return output
}

async function getScoreFor(playerId, game) {
  const scoreQuery = {
    database_id: NOTION_SCORE_DB_ID,
    filter: {
      and: [
        {
          property: 'Joueur',
          relation: {
            contains: playerId
          }
        }
      ]
    }
  }

  if (game !== null) scoreQuery.filter.and.push({
    property: 'Tags',
    select: {
      equals: game
    }
  })

  const scoreResponse = await notion.databases.query(scoreQuery)
  const points = await Promise.all(scoreResponse.results.map(res => notion.pages.properties.retrieve({page_id: res.id, property_id: res.properties["Points (test)"].id})))

  return points.reduce((acc, current) => acc + current.formula.number, 0)
}

module.exports = {
  getDatabase,
  getPlayer,
  createPlayer,
  addScore,
  getRankings
}