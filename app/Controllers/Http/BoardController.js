'use strict'

const Board = use('App/Models/Board')
const Database = use('Database')

class BoardController {
  async createPrivate ({ request, response, auth }) {
    const boardInfo = request.only(['title', 'private', 'background'])
    try {
      const { user } = auth
      const board = new Board()

      board.title = boardInfo.title
      board.private = Boolean(boardInfo.private)
      board.removed = false
      board.background = boardInfo.background

      await board.save()
      await Database
        .insert({ id_user: user.id, id_board: board.id, root: true })
        .into('users_boards')
      return response.status(201).json(board)
    } catch (e) {
      return response.status(500)
    }
  }

  async index ({ params, response, auth }) {
    try {
      const { user } = auth
      const board = await Board.find(params.id)
      return response.status(200).json(board)
    } catch (error) {
      return response.status(500).send(error)
    }
  }

  async showByUser ({ request, response, auth }) {
    try {
      const params = request.all()
      const board = await Board.find(params.id)
      const { user } = auth
      if (board) {
        if (board.private) {
          const privateBoard = await Database
            .table('boards')
            .innerJoin('users_boards', 'boards.id', 'users_boards.id_board')
            .where({ id_user: user.id, id_board: params.id, removed: false })

          const boardByUser = {
            title: privateBoard[0].title,
            private: privateBoard[0].private,
            author_id: privateBoard[0].id_user,
            id: privateBoard[0].id_board,
            root: privateBoard[0].root,
            background: privateBoard[0].background
          }
          return response.status(200).json(boardByUser)
        }
        return response.status(200).json(board)
      }
      return response.status(404).send()
    } catch (error) {
      return response.status(500).send(error)
    }
  }

  async storeByPrivate ({ request, response, auth }) {
    try {
      const { user } = auth
      const privateBoards = await Database
        .table('boards')
        .innerJoin('users_boards', 'boards.id', 'users_boards.id_board')
        .where({ id_user: user.id, removed: false })
      return response.status(200).send(privateBoards)
    } catch (error) {
      return response.status(500).send(error)
    }
  }

  async edit ({ request, response, auth }) {
    return response.status(200).send()
  }

  async delete ({ request, response, auth }) {
    try {
      const params = request.all()
      const board = await Board.find(params.id)
      if (!board) {
        return response.status(404).json({ data: 'Resource not found' })
      }
      await board.delete()
      return response.status(200).send()
    } catch (error) {
      return response.status(500).send(error)
    }
  }
}

module.exports = BoardController
