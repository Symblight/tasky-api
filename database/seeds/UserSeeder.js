'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class UserSeeder {
  async run () {
    await Factory
      .model('App/Models/User')
      .createMany(8, [
        {
          username: 'admin',
          password: 'password',
          email: 'admin@task.loc',
          firstname: 'Vasya',
          lastname: 'Pupkin'
        },
        {
          username: 'lolkov',
          password: 'password',
          email: 'user2@task.loc',
          firstname: 'Igor',
          lastname: 'Volkov'
        },
        {
          username: 'mexicano',
          password: 'password',
          email: 'user3@task.loc',
          firstname: 'Oleg',
          lastname: 'Kuncevich'
        },
        {
          username: 'martinov',
          password: 'password',
          email: 'user4@task.loc',
          firstname: 'Sergey',
          lastname: 'Martinov'
        },
        {
          username: 'mouse',
          password: 'password',
          email: 'user5@task.loc',
          firstname: 'Tatiana',
          lastname: 'Mouse'
        },
        {
          username: 'pewpew',
          password: 'password',
          email: 'user6@task.loc',
          firstname: 'Sasha',
          lastname: 'Pushkin'
        },
        {
          username: 'maxim',
          password: 'password',
          email: 'user7@task.loc',
          firstname: 'Maxim',
          lastname: 'Samchuk'
        },
        {
          username: 'kek',
          password: 'password',
          email: 'user8@task.loc',
          firstname: 'Ilya',
          lastname: 'Zaycev'
        }
      ])
  }
}

module.exports = UserSeeder
