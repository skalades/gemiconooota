import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data.json');

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('portfolios').del();
  await knex('products').del();
  await knex('services').del();
  await knex('hero_settings').del();

  // Load data.json
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  const data = JSON.parse(raw);

  // Insert Hero
  await knex('hero_settings').insert({
    id: 1,
    subtitle: data.hero.subtitle,
    title: data.hero.title,
    description: data.hero.description,
    buttonPrimary: data.hero.buttonPrimary,
    buttonSecondary: data.hero.buttonSecondary
  });

  // Insert Services
  for (const svc of data.services) {
    await knex('services').insert({
      id: svc.id,
      title: svc.title,
      description: svc.description,
      image: svc.image,
      features: JSON.stringify(svc.features), // Stringify for JSON column
      color: svc.color
    });
  }

  // Insert Products
  for (const prod of data.products) {
    await knex('products').insert({
      id: prod.id,
      name: prod.name,
      description: prod.description,
      status: prod.status,
      price: prod.price,
      priceDisplay: prod.priceDisplay,
      image: prod.image
    });
  }

  // Insert Portfolios
  for (const pf of data.portfolio) {
    await knex('portfolios').insert({
      id: pf.id,
      title: pf.title,
      category: pf.category,
      description: pf.description,
      year: pf.year,
      image: pf.image,
      link: pf.link
    });
  }
}
