'use strict';

const User = use('App/Models/User');
const { validateAll } = use('Validator');
const Logger = use('Logger');

module.exports = class UserController {
  create({ view }) {
    return view.render('user/register');
  }

  async store({ auth, session, request, response }) {
    /**
     * Getting needed parameters.
     *
     * ref: http://adonisjs.com/docs/4.1/request#_only
     */
    const data = request.only(['username', 'email', 'password', 'password_confirmation']);

    /**
     * Validating our data.
     *
     * ref: http://adonisjs.com/docs/4.1/validator
     */
    const validation = await validateAll(data, {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required',
      password_confirmation: 'required_if:password|same:password',
    });

    /**
     * If validation fails, early returns with validation message.
     */
    if (validation.fails()) {
      Logger.error(validation.messages());
      session
        .withErrors(validation.messages())
        .flashExcept(['password']);

      return response.redirect('back');
    }

    // Deleting the confirmation field since we don't
    // want to save it
    delete data.password_confirmation;

    /**
     * Creating a new user into the database.
     *
     * ref: http://adonisjs.com/docs/4.1/lucid#_create
     */
    const user = await User.create(data);

    // Authenticate the user
    await auth.login(user);

    return response.redirect('/');
  }
};