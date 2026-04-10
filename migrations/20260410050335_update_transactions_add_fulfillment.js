export async function up(knex) {
  await knex.schema.alterTable('transactions', (table) => {
    table.enu('fulfillment_status', ['processing', 'shipped', 'delivered']).defaultTo('processing');
  });
}

export async function down(knex) {
  await knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('fulfillment_status');
  });
}
