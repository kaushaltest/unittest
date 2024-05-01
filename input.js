const currentDate = () => {
  const currentTimestamp = new Date()
  // Format timestamp
  return formateDate(currentTimestamp)
}

 const formateDate = (date) => {
  const options = {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    // hour: '2-digit',
    // minute: '2-digit',
    // second: '2-digit',
    // hour12: false,
  }
  const formattedTimestampString = new Date(date)
  .toLocaleString('en-US', options)
  return new Date(formattedTimestampString)
}

module.exports = {
  currentDate,
  formateDate
};