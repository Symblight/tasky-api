'use strict'

const User = use('App/Models/Board')

class BoardController {
  async create ({ request, response, auth }) {
    const { board } = request.all()

    const { user } = auth
    try {
      return response.status(201)
    } catch (e) {
      return response.status(401).send('You are not registered!')
    }
  }

  async edit ({ request, response, auth }) {
    return response.status(200)
  }

  async delete ({ request, response, auth }) {
    return response.status(200)
  }
}

module.exports = BoardController
