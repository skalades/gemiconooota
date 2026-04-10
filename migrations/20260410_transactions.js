export async function up(knex) {
  await knex.schema.createTable('transactions', (table) => {
    table.string('order_id').primary();
    table.string('customer_name');
    table.string('customer_email');
    table.string('product_id');
    table.string('product_name');
    table.integer('gross_amount');
    table.enu('status', ['pending', 'success', 'failed', 'canceled', 'expired']).defaultTo('pending');
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('transactions');
}
