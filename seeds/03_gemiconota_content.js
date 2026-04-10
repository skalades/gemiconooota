export async function seed(knex) {
  // Wipe old data
  await knex('hero_settings').del();
  await knex('services').del();
  await knex('products').del();

  // 1. Hero Content
  await knex('hero_settings').insert({
    id: 1,
    subtitle: 'SMKN 2 GARUT ALUMNI NETWORK',
    title: 'Geology & Mining<br/>Community of<br/>North Tarogong.',
    description: 'Wadah resmi ikatan alumni Departemen Geologi Pertambangan SMKN 2 Garut untuk memperkuat silaturahmi, ekspansi karier profesional, dan kontribusi balik bagi almamater tercinta.',
    buttonPrimary: 'Join Network',
    buttonSecondary: 'Explore Program'
  });

  // 2. Services (Community Pillars)
  await knex('services').insert([
    {
      id: 1,
      title: 'Jejaring Profesional Tambang',
      description: 'Menjembatani peluang kerja, pertukaran informasi, dan kolaborasi strategis antar alumni di sektor geologi dan pertambangan nasional.',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351cb31b?q=80&w=1200&auto=format&fit=crop', // Mining truck/industry image
      features: JSON.stringify(['Career Exchange', 'Professional Mentoring', 'Industry Forums'])
    },
    {
      id: 2,
      title: 'Kontribusi Almamater',
      description: 'Membangun generasi penerus dengan memberikan pendampingan industri, seminar, dan pengembangan kompetensi kepada siswa aktif SMKN 2 Garut.',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop', // Education/campus vibe
      features: JSON.stringify(['Guest Lecturing', 'Skill Workshops'])
    },
    {
      id: 3,
      title: 'Digital Sebaran Map',
      description: 'Pemetaan digital lokasi alumni secara presisi di seluruh pelosok negeri maupun mancanegara untuk memudahkan koordinasi dan silaturahmi.',
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop', // Map/navigation aesthetic
      features: JSON.stringify(['Geospatial Tracking', 'Alumni Locator'])
    }
  ]);

  // 3. Products (Official Merchandise)
  await knex('products').insert([
    {
      id: 'GMC-01',
      name: 'Korsa GEMICONOTA 2026',
      price: 250000,
      priceDisplay: 'Rp 250.000',
      description: 'Kemeja Korsa resmi alumni Geologi Pertambangan SMKN 2 Garut. Material drill premium dengan bordir logo resmi.',
      status: 'PRE-ORDER',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop' // Placeholder shirt
    },
    {
      id: 'GMC-02',
      name: 'Safety Helmet Khusus Alumni',
      price: 185000,
      priceDisplay: 'Rp 185.000',
      description: 'Helm proyek standar keamanan pertambangan, dicat khusus dengan decal GEMICONOTA.',
      status: 'IN STOCK',
      image: 'https://images.unsplash.com/photo-1542617757-cd2ce4ca48ea?q=80&w=800&auto=format&fit=crop' // Placeholder helmet
    }
  ]);
}
