'use strict'

const User = use('App/Models/User')
const Board = use('App/Models/Board')
const Database = use('Database')
const Mail = use('Mail')

const uuid = require('uuid')

class UserController {
  async login ({ request, response, auth }) {
    const { email, password } = request.all()

    if (auth.user) {
      return auth.user
    }

    try {
      await auth
        .remember(true)
        .attempt(email.toLowerCase(), password)

      return auth.user
    } catch (e) {
      return response.status(401).send('You are not registered!')
    }
  }

  async logout ({ response, auth }) {
    try {
      await auth.logout()
      return response.status(200).send()
    } catch (error) {
      return response.status(500).send(error)
    }
  }

  async register ({ response, request }) {
    try {
      const payload = request.only(['email', 'password', 'username', 'lastname', 'firstname'])
      const user = await User.create(payload)
      const currentUser = await User.find(user.id)
      return response.status(201).json(currentUser)
    } catch (error) {
      return response.status(500).send(error)
    }
  }

  async get ({ auth, response }) {
    if (auth.user) {
      const user = await auth.getUser()
      return user
    }

    return response.error(401, 'unauthorized')
  }

  async initToken ({ response, request }) {
    try {
      const payload = request.only(['idBoard', 'email'])

      const token = uuid(4).toString()

      await Database
        .insert({ token, removed: false })
        .into('tokens_invite')

      await Mail.send('emails.welcome', { token, board: payload.idBoard }, message => {
        message
          .from('"Приглашение" <noreply@tasky.loc>')
          .to(payload.email)
          .subject(`Приглашение в проект ${token}`)
      })

      return response.status(200).send('success')
    } catch (error) {
      return response.status(500).send(error)
    }
  }

  async invite ({ auth, params, response }) {
    try {
      const { token, board } = params

      const user = await auth.getUser()
      const targetBoard = await Board.findBy('uuid', board)
      const target = await Database
        .table('tokens_invite')
        .where('token', token)

      if (!target.removed && user) {
        await Database
          .insert({ id_user: user.id, id_board: targetBoard.id, root: false })
          .into('users_boards')
      }

      return response.status(200).send('success')
    } catch (error) {
      return response.status(500).send(error)
    }
  }

  async edit ({ params, response, request }) {
    try {
      const { id } = params
      const payload = request.only(['username', 'firstname', 'lastname'])
      const user = await User.find(id)
      user.firstname = payload.firstname
      user.lastname = payload.lastname
      user.username = payload.username
      await user.save()
      return response.status(200).send(user)
    } catch (error) {
      return response.status(500).send(error)
    }
  }
}

module.exports = UserController
