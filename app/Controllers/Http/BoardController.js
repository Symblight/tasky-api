'use strict'

const shortid = require('shortid')

const { broadcast } = require('../../utils/socket.utils')

const Database = use('Database')

const Board = use('App/Models/Board')

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
        .where({ id_board: board.id_board, removed: false })

      const result = lists.map(list => ({
        ...list,
        pos: Number(list.pos)
      }))

      const listIds = lists.map(list => list.id)

      const labels = await Database
        .table('labels')
        .innerJoin('labels_boards', 'labels.id', 'labels_boards.id_label')
        .where('id_board', board.id_board)

      const cards = await Database
        .from('cards')
        .whereIn('id_list', [...listIds])
        .where({ removed: false })

      const cardIds = cards.map(card => card.id)

      const labelsByCards = await Database
        .from('labels_cards')
        .whereIn('id_card', [...cardIds])

      const membersByBoard = await Database
        .table('users')
        .innerJoin('users_boards', 'users.id', 'users_boards.id_user')
        .where({ id_board: board.id_board })

      const usersIds = membersByBoard.map(item => item.id)

      const usersByCards = await Database
        .from('cards_users')
        .whereIn('id_user', [...usersIds])


      const normalizeCards = cards.map(card => ({
        ...card,
        labels: labelsByCards.filter(idLabel => idLabel.id_card === card.id),
        pos: Number(card.pos)
      }))

      return response.status(200)
        .json({
          ...board,
          members: membersByBoard,
          labels,
          lists: result,
          cards: normalizeCards,
          usersByCards
        })
    } catch (error) {
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

      await Database
        .insert([
          { id_board: board.id, id_label: 1 },
          { id_board: board.id, id_label: 2 },
          { id_board: board.id, id_label: 3 },
          { id_board: board.id, id_label: 4 },
          { id_board: board.id, id_label: 5 }
        ])
        .into('labels_boards')
      return response.status(201).json(board)
    } catch (e) {
      return response.status(500)
    }
  }

  async closeBoard ({ params, response }) {
    try {
      const { id } = params
      const board = await Board.findBy('uuid', id)
      board.removed = true
      board.save()
      return response.status(200).json(board)
    } catch (e) {
      return response.status(500)
    }
  }

  async editBackground ({ params, request, response }) {
    try {
      const { id } = params
      const { background } = request.only(['background'])
      const board = await Board.findBy('uuid', id)
      board.background = background
      board.save()
      broadcast(id, 'board:background', background)
      return response.status(200).json(board)
    } catch (e) {
      return response.status(500)
    }
  }
}

module.exports = BoardController
