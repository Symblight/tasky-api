const Ws = use('Ws')

function broadcast (id, type, data) {
  const channel = Ws.getChannel('board:*')
  if (!channel) return

  const topic = channel.topic(`board:${id}`)
  if (!topic) {
    console.error('Has no topic')
    return
  }

  // emit, broadcast, broadcastToAll
  topic.broadcastToAll('message', {
    type,
    data
  })
}

module.exports = { broadcast }
