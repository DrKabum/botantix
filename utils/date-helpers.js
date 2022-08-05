function today() {
  const date = new Date()

  return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate}`
}

module.exports = {
  today
}