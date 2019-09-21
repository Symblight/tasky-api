'use strict'

const User = use('App/Models/User');
const Hash = use('Hash');

class UserController {
  async login({ request, response, auth }) {
    const { email, password } = request.all();

    if (auth.user) {
      return auth.user;
    }
    console.log("password",  password)

    try {
        await auth
            .remember(true)
            .attempt(email.toLowerCase(), password);

        return auth.user;
    } catch (e) {
        return response.json({ message: 'You are not registered!' });
    }
  }

  async logout({auth}) {
    await auth.logout();
  }

  async register({request, response}) {
    const payload = request.only(['email', 'password', 'username']);

    const user = await User.create({
        username: payload.username,
        email: payload.email,
        password: payload.password,
    });

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
