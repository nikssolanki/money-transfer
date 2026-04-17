exports.up = async function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.decimal('balance', 14, 2).defaultTo(0);
    table.boolean('is_admin').defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTableIfExists('users');
};
