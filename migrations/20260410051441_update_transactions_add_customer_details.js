export async function up(knex) {
  await knex.schema.alterTable('transactions', (table) => {
    table.string('customer_whatsapp');
    table.string('product_size');
  });
}

export async function down(knex) {
  await knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('customer_whatsapp');
    table.dropColumn('product_size');
  });
}
