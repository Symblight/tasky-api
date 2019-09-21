'use strict'

const User = use('App/Models/User');

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
        return response.error(401, 'invalid email or password');
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
