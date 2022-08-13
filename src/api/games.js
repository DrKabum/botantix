const axios = require('axios')
const cheerio = require('cheerio')

async function getWebsite(url) {
  if(url !== 'https://cemantix.herokuapp.com/' && url !== 'https://synoptix.thunderkerrigan.fr/')
    throw "The provided URL doesn't match any game."

  let output = null

  try {
    const { data } = await axios.get(url)
    output = cheerio.load(data)
  } catch (error) {
    console.error(error)
  }
  
  return output
}

async function getYesterdaysWord() {
  const $ = await getWebsite('https://cemantix.herokuapp.com/')

  const word = $('#cemantix-yesterday > b > u').text()

  return `C'est l'heure du nouveau mot du jour!\nLe mot d'hier était **${word}** !`
}

async function getYesterdaysPage() {
  const $ = await getWebsite('https://cemantix.herokuapp.com/')

  const page = {
    title: $('#pedantix-yesterday > b > u').text(),
    link: $('#pedantix-yesterday').prop('href')
  }

  return `C'est l'heure de la nouvelle page Wikipedia du jour!\nLa page d'hier était **${page.title}** !\n${page.link}`
}

async function getYesterdaysMovie() {
  const { status, statusText, data } = await axios.get('https://synoptix.back.thunderkerrigan.fr/synoptix/stats/', {
    headers: {
      'Version': '1.1.4'
    }
  })

  if (status !== 200) throw `Error ${status}: ${statusText}`

  const lastMovie = /<p>(.+)<\/p>/.exec(data[data.length - 1].title)[1]

  return `C'est l'heure du nouveau film du jour!\nLe film d'hier était **${lastMovie}** !`
}

module.exports = {
  getYesterdaysMovie,
  getYesterdaysPage,
  getYesterdaysWord
}