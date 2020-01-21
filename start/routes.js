'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.get('login', 'UserController.get')
  Route.delete('logout', 'UserController.logout')
}).prefix('api/v1/user').middleware('auth')

Route.group(() => {
  Route.post('', 'UserController.initToken')
  Route.get(':token/b/:board', 'UserController.invite')
}).prefix('api/v1/user/token').middleware('auth')


Route.group(() => {
  Route.post('login', 'UserController.login')
  Route.post('signup', 'UserController.register')
}).prefix('api/v1/user')


Route.group(() => {
  Route.get('', 'BoardsController.storeByPrivate')
}).prefix('api/v1/boards').middleware('auth')

Route.group(() => {
  Route.post('', 'BoardController.createPrivate')
  Route.get(':id', 'BoardController.select')
  Route.put('background/:id', 'BoardController.editBackground')
  Route.delete(':id', 'BoardController.closeBoard')
}).prefix('api/v1/board').middleware('auth')

Route.group(() => {
  Route.post('', 'ListController.createList')
  Route.put(':id', 'ListController.editList')
  Route.put('p/:id', 'ListController.editListPos')
  Route.delete(':id', 'ListController.removeList')
  Route.get('/all/:idBoard', 'ListController.store')
}).prefix('api/v1/lists').middleware('auth')

Route.group(() => {
  Route.post('', 'CardController.createCard')
  Route.put(':id', 'CardController.editCard')
  Route.put('p/:id', 'CardController.editCardPos')
  Route.put('l/:id', 'CardController.addLabelToCard')
  Route.delete(':id', 'CardController.removeCard')
  Route.get(':id', 'CardController.index')
}).prefix('api/v1/cards').middleware('auth')
