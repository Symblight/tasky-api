'use strict'

const User = use('App/Models/User')

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
    // await Mail.send('emails.welcome', user.toJSON(), (message) => {
    //   message
    //     .from('"Регистрация" <noreply@tasky.loc>')
    //     .to(user.email)
    //     .subject('Welcome to yardstick')
    // })
  }

  async get ({ auth, response }) {
    if (auth.user) {
      const user = await auth.getUser()
      return user
    }

    return response.error(401, 'unauthorized')
  }
}

module.exports = UserController
