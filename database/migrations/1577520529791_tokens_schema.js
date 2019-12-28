'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokensSchema extends Schema {
  up () {
    this.create('tokens_invite', table => {
      table.increments()
      table.string('token', 255).notNullable().unique()
      table.boolean('removed').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('tokens_invite')
  }
}

module.exports = TokensSchema
