'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/User', async () => ({
  username: 'admin',
  password: 'password',
  email: 'admin@task.loc',
  firstname: 'Vasya',
  lastname: 'Pupkin'
}))

Factory.blueprint('App/Models/Label', async (faker, i, data) => ({
  name: data[i].name,
  color: data[i].color
}))
