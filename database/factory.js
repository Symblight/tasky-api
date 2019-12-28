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

Factory.blueprint('App/Models/User', async (faker, i, data) => ({
  username: data[i].username,
  password: data[i].password,
  email: data[i].email,
  firstname: data[i].firstname,
  lastname: data[i].lastname
}))

Factory.blueprint('App/Models/Label', async (faker, i, data) => ({
  name: data[i].name,
  color: data[i].color
}))
