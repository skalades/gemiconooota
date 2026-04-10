export async function up(knex) {
  await knex.schema.createTable('alumni', (table) => {
    table.increments('id').primary();
    table.string('full_name').notNullable();
    table.string('whatsapp').notNullable();
    table.integer('batch_year').notNullable();
    table.string('location');
    table.string('job');
    table.decimal('lat', 10, 8);
    table.decimal('lng', 11, 8);
    table.enu('status', ['pending', 'approved']).defaultTo('pending');
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('alumni');
}
