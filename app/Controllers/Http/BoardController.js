'use strict'

const shortid = require('shortid')

const { broadcast } = require('../../utils/socket.utils')

const Database = use('Database')

const Board = use('App/Models/Board')
const List = use('App/Models/List')
const Card = use('App/Models/Card')

class BoardController {
  async getCardsByList (idList) {
    const cards = await Database.table('cards').where('id_list', idList)
    return cards
  }

  async select ({ params, response, auth }) {
    try {
      const { user } = auth
      const board = await Database
        .table('boards')
        .innerJoin('users_boards', 'boards.id', 'users_boards.id_board')
        .where({ id_user: user.id, uuid: params.id, removed: false })
        .first()

      if (!board) {
        return response.notFound('The room doesn\'t exist')
      }

      const lists = await Database
        .table('lists')
        .where('id_board', board.id)

      const result = lists.map(list => ({
        ...list,
        pos: Number(list.pos)
      }))

      const listIds = lists.map(list => list.id)
      const cards = await Database.from('cards').whereIn('id_list', [...listIds])

      const normalizeCards = cards.map(card => ({
        ...card,
        pos: Number(card.pos)
      }))

      return response.status(200).json({ ...board, members: [], labels: [], lists: result, cards: normalizeCards })
    } catch (error) {
      console.log(error)
      return response.status(500)
    }
  }

  async createPrivate ({ request, response, auth }) {
    const boardInfo = request.only(['title', 'private', 'background'])
    try {
      const { user } = auth
      const board = new Board()

      board.title = boardInfo.title
      board.private = Boolean(boardInfo.private)
      board.removed = false
      board.background = boardInfo.background
      board.uuid = shortid.generate()

      await board.save()

      await Database
        .insert({ id_user: user.id, id_board: board.id, root: true })
        .into('users_boards')
      return response.status(201).json(board)
    } catch (e) {
      return response.status(500)
    }
  }

  async closeBoard ({ request, response, auth }) {
    try {
      return response.status(200).json({})
    } catch (e) {
      return response.status(500)
    }
  }
}

module.exports = BoardController
