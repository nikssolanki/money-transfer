const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  await knex('users').del();

  await knex('users').insert([
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: bcrypt.hashSync('Admin123!', 10),
      balance: 1000.00,
      is_admin: true,
    },
    {
      name: 'Test User',
      email: 'user@example.com',
      password: bcrypt.hashSync('User123!', 10),
      balance: 250.00,
      is_admin: false,
    },
  ]);
};
