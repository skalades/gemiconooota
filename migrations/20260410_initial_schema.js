export async function up(knex) {
  // Hero settings
  await knex.schema.createTable('hero_settings', (table) => {
    table.increments('id').primary();
    table.string('subtitle');
    table.string('title');
    table.text('description');
    table.string('buttonPrimary');
    table.string('buttonSecondary');
  });

  // Services
  await knex.schema.createTable('services', (table) => {
    table.string('id').primary(); // '01', '02'
    table.string('title');
    table.text('description');
    table.string('image');
    table.json('features'); // stores an array of strings natively in MySQL
    table.string('color');
  });

  // Products
  await knex.schema.createTable('products', (table) => {
    table.string('id').primary(); // 'p1', 'p2'
    table.string('name');
    table.text('description');
    table.string('status');
    table.integer('price');
    table.string('priceDisplay');
    table.string('image');
  });

  // Portfolios
  await knex.schema.createTable('portfolios', (table) => {
    table.string('id').primary();
    table.string('title');
    table.string('category');
    table.text('description');
    table.string('year');
    table.string('image');
    table.string('link');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('portfolios');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('services');
  await knex.schema.dropTableIfExists('hero_settings');
}
