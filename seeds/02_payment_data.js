import dotenv from 'dotenv';
dotenv.config();

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('payment_settings').del();

  // Insert Default Setting from current .env fallback so checkout doesn't break
  await knex('payment_settings').insert({
    id: 1,
    is_production: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    server_key: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-placeholder',
    client_key: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-placeholder'
  });
}
