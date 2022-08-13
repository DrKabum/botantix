const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')

function today() {
  const date = zonedTimeToUtc(new Date())
  const formatedDate = format(utcToZonedTime(date, 'Europe/Paris'), 'yyyy-MM-dd')

  return formatedDate
}

today()
module.exports = {
  today
}