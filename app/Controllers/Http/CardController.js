'use strict'

const Card = use('App/Models/Card')

const uniqid = require('uniqid')

class CardController {
  async createCard ({ request, response, auth }) {
    try {
      const fields = request.only(['idList', 'data', 'pos'])

      const card = await Card.create({
        id_list: fields.idList,
        data: fields.data,
        pos: fields.pos,
        uuid: uniqid()
      })
      const created = await Card.find(card.id)
      created.pos = Number(created.pos)
      return response.status(201).send(created)
    } catch (e) {
      return response.status(500)
    }
  }

  async editCard ({ params, request, response, auth }) {
    try {
      const { id } = params
      const fields = request.only(['id_list', 'data', 'pos'])

      const card = await Card.findBy('uuid', id)

      if (fields.data) {
        card.data = fields.data
      }

      if (fields.pos) {
        card.pos = fields.pos
      }

      if (fields.id_list) {
        card.id_list = fields.id_list
      }

      await card.save()
      return response.status(200).send(card)
    } catch (e) {
      return response.status(500)
    }
  }

  async removeCard ({ params, response }) {
    try {
      const { id } = params
      const card = await Card.findBy('uuid', id)

      await card.delete()
      return response.status(200).send('removed')
    } catch (e) {
      return response.status(500)
    }
  }
}

module.exports = CardController
