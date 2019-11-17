'use strict'

class BoardUpdateController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onMessage (message) {
    console.log('got message', message)
  }

  onClose () {
    console.log('Closing subscription for room topic', this.socket.topic)
  }
}

module.exports = BoardUpdateController
