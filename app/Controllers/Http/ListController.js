'use strict'

const List = use('App/Models/List')
const Database = use('Database')

const uniqid = require('uniqid')
const { broadcast } = require('../../utils/socket.utils')

class ListController {
  async createList ({ request, response, auth }) {
    try {
      const fields = request.only(['idBoard', 'title', 'pos'])

      const list = await List.create({
        id_board: fields.idBoard,
        title: fields.title,
        pos: fields.pos,
        uuid: uniqid()
      })
      const created = await List.find(list.id)
      created.pos = Number(created.pos)
      return response.status(201).send(created)
    } catch (e) {
      return response.status(500)
    }
  }

  async editList ({ params, request, response, auth }) {
    try {
      const { id } = params
      const data = request.only(['title', 'pos'])

      const list = await List.findBy('uuid', id)
      list.title = data.title
      if (data.pos) {
        list.pos = data.pos
      }

      await list.save()
      const newList = await List.findBy('uuid', id)
      newList.pos = Number(newList.pos)
      return response.status(200).send(newList)
    } catch (e) {
      return response.status(500)
    }
  }

  async removeList ({ params, response }) {
    try {
      const { id } = params
      const list = await List.findBy('uuid', id)

      await list.delete()
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

      const lists = await Database
        .table('lists')
        .where('id_board', board.id)
      return response.status(200).json({})
    } catch (e) {
      return response.status(500)
    }
  }
}

module.exports = ListController
