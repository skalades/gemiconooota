export async function up(knex) {
  await knex.schema.table('products', (table) => {
    table.boolean('has_sizes').defaultTo(false).after('status');
  });
}

export async function down(knex) {
  await knex.schema.table('products', (table) => {
    table.dropColumn('has_sizes');
  });
}
