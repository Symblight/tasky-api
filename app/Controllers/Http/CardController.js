'use strict'

const Card = use('App/Models/Card')
const Database = use('Database')

const uniqid = require('uniqid')

const { broadcast } = require('../../utils/socket.utils')

const INITIAL_POSITION = 65535

class CardController {
  async createCard ({ request, response, auth }) {
    try {
      const fields = request.only(['idBoard', 'idList', 'data', 'pos'])

      const card = await Card.create({
        id_list: fields.idList,
        data: fields.data,
        pos: fields.pos,
        uuid: uniqid()
      })
      const created = await Card.find(card.id)
      created.pos = Number(created.pos)
      broadcast(fields.idBoard, 'board:newCard', created)
      return response.status(201).send(created)
    } catch (e) {
      return response.status(500)
    }
  }

  async editCard ({ params, request, response, auth }) {
    try {
      const { id } = params
      const fields = request.only(['idBoard', 'id_list', 'data', 'pos'])

      const card = await Card.findBy('uuid', id)

      card.data = fields.data
      await card.save()
      card.pos = Number(card.pos)
      broadcast(fields.idBoard, 'board:editCard', card)
      return response.status(200).send(card)
    } catch (e) {
      return response.status(500)
    }
  }

  async editCardPos ({ params, request, response, auth }) {
    try {
      const { id } = params
      const fields = request.only(['idBoard', 'id_list', 'data', 'pos', 'update'])

      if (fields.update) {
        const cards = await Database
          .table('cards')
          .where('id_list', fields.id_list)

        const update = cards.map((value, index) => (
          { id: value.id, pos: INITIAL_POSITION * (index + 1) }
        ))
        const where = update.reduce((accumulator, item, index) => {
          const text = `(${item.id}, '${item.pos}')${index !== update.length - 1 ? ',\n' : ''}`
          return accumulator + text
        }, '')
        const QUERY = `update cards set
          pos = c.pos
          from (values
              ${where}
          ) as c(id, pos) 
          where c.id = cards.id`

        await Database.raw(QUERY)

        const target = await Card.findBy('uuid', id)
        target.pos = Number(target.pos)
        broadcast(fields.idBoard, 'board:posCard', target)
        return response.status(200).send(target)
      }
      const card = await Card.findBy('uuid', id)

      card.id_list = fields.id_list
      card.pos = fields.pos
      await card.save()
      card.pos = Number(card.pos)
      broadcast(fields.idBoard, 'board:posCard', card)
      return response.status(200).send(card)
    } catch (error) {
      return response.status(500)
    }
  }

  async removeCard ({ request, params, response }) {
    try {
      const { id } = params
      const fields = request.only(['idBoard'])
      const card = await Card.findBy('uuid', id)

      await card.delete()
      broadcast(fields.idBoard, 'board:removeCard', id)
      return response.status(200).send('removed')
    } catch (e) {
      return response.status(500)
    }
  }

  async addLabelToCard ({ request, params, response }) {
    try {
      const { id } = params
      const { idBoard, color } = request.only(['color', 'idBoard'])

      const card = await Card.findBy('uuid', id)
      const label = await Database.table('labels_cards').where({ id_card: card.id, id_label: color }).first()

      if (!label) {
        await Database
          .insert({ id_card: card.id, id_label: color })
          .into('labels_cards')
        const targetLabel = await Database.table('labels_cards').where({ id_card: card.id, id_label: color }).first()
        broadcast(idBoard, 'board:addLabelToCard', id)
        return response.status(200).send(targetLabel)
      }
      return response.status(200).send(label)
    } catch (e) {
      return response.status(500)
    }
  }
}

module.exports = CardController
