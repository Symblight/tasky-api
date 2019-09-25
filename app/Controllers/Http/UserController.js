'use strict'

const User = use('App/Models/User');
const Mail = use('Mail')
const Env = use('Env')

class UserController {
  async login({ request, response, auth }) {
    const { email, password } = request.all();

    if (auth.user) {
      return auth.user;
    }

    try {
        await auth
            .remember(true)
            .attempt(email.toLowerCase(), password);

        return auth.user;
    } catch (e) {
        return response.status(401).send('You are not registered!');
    }
  }

  async logout({auth}) {
    await auth.logout();
  }

  async register({request, response}) {
    const payload = request.only(['email', 'password', 'username']);
    const user = await User.create(payload);

    // await Mail.send('emails.welcome', user.toJSON(), (message) => {
    //   message
    //     .from('"Регистрация" <noreply@tasky.loc>')
    //     .to(user.email)
    //     .subject('Welcome to yardstick')
    // })

    return await User.find(user.id);
  }

  async get({auth, response}) {
      if (auth.user) {
          return await auth.getUser()
      }

      return response.error(401, 'unauthorized');
  }
}

module.exports = UserController
