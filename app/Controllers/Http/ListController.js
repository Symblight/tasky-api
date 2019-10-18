'use strict'

const List = use('App/Models/List')
const Database = use('Database')

const uniqid = require('uniqid')
const { broadcast } = require('../../utils/socket.utils')

const INITIAL_POSITION = 65535

class ListController {
  async createList ({ request, response, auth }) {
    try {
      const fields = request.only(['idBoard', 'title', 'pos', 'uuidBoard'])

      const list = await List.create({
        id_board: fields.idBoard,
        title: fields.title,
        pos: fields.pos,
        uuid: uniqid()
      })
      const created = await List.find(list.id)
      created.pos = Number(created.pos)
      broadcast(fields.uuidBoard, 'board:newList', created)
      return response.status(201).send(created)
    } catch (e) {
      return response.status(500)
    }
  }

  async editList ({ params, request, response, auth }) {
    try {
      const { id } = params
      const fields = request.only(['idBoard', 'title', 'pos'])

      const list = await List.findBy('uuid', id)
      list.title = fields.title

      await list.save()
      list.pos = Number(list.pos)
      broadcast(fields.idBoard, 'board:editList', list)
      return response.status(200).send(list)
    } catch (e) {
      return response.status(500)
    }
  }

  async editListPos ({ params, request, response, auth }) {
    try {
      const { id } = params
      const fields = request.only(['idBoard', 'title', 'pos'])

      if (fields.update) {
        const cards = await Database
          .table('lists')
          .where('id_list', fields.id_list)

        const update = cards.map((value, index) => (
          { id: value.id, pos: INITIAL_POSITION * (index + 1) }
        ))
        const where = update.reduce((accumulator, item, index) => {
          const text = `(${item.id}, '${item.pos}')${index !== update.length - 1 ? ',\n' : ''}`
          return accumulator + text
        }, '')
        const QUERY = `update lists set
          pos = c.pos
          from (values
              ${where}
          ) as c(id, pos) 
          where c.id = lists.id`

        await Database.raw(QUERY)

        const target = await List.findBy('uuid', id)
        target.pos = Number(target.pos)
        broadcast(fields.idBoard, 'board:posList', target)
        return response.status(200).send(target)
      }

      const list = await List.findBy('uuid', id)
      list.pos = fields.pos

      await list.save()
      list.pos = Number(list.pos)
      broadcast(fields.idBoard, 'board:posList', list)
      return response.status(200).send(list)
    } catch (e) {
      return response.status(500)
    }
  }

  async removeList ({ request, params, response }) {
    try {
      const { id } = params
      const fields = request.only(['idBoard'])
      const list = await List.findBy('uuid', id)

      await list.delete()
      broadcast(fields.idBoard, 'board:removeList', id)
      return response.status(200).send('removed')
    } catch (e) {
      return response.status(500)
    }
  }

  async store ({ params, request, response, auth }) {
    try {
      const { idBoard } = params
      const { user } = auth

      const board = await Database
        .table('boards')
        .innerJoin('users_boards', 'boards.id', 'users_boards.id_board')
        .where({ id_user: user.id, uuid: idBoard, removed: false })
        .first()

      if (!board) {
        return response.notFound('The room doesn\'t exist')
      }

      return response.status(200).json({})
    } catch (e) {
      return response.status(500)
    }
  }
}

module.exports = ListController
