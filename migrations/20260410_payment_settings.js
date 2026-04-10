export async function up(knex) {
  // Payment settings
  await knex.schema.createTable('payment_settings', (table) => {
    table.increments('id').primary();
    table.boolean('is_production').defaultTo(false);
    table.string('server_key');
    table.string('client_key');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('payment_settings');
}
