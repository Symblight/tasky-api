'use strict'

/*
|--------------------------------------------------------------------------
| LabelSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class LabelSeeder {
  async run () {
    await Factory
      .model('App/Models/Label')
      .createMany(5, [
        {
          name: '',
          color: 'red'
        },
        {
          name: '',
          color: 'green'
        },
        {
          name: '',
          color: 'blue'
        },
        {
          name: '',
          color: 'yellow'
        },
        {
          name: '',
          color: 'gray'
        }
      ])
  }
}

module.exports = LabelSeeder
