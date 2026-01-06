// Mock data matching the Google Sheets schema

export interface SampleOverview {
  sample_id: string;
  analysis_date: string;
  group: 'A' | 'B' | 'C';
  total_weight_pre_wash_g: number;
  total_weight_post_wash_g: number;
  photo_url: string;
}

export interface Fraction {
  sample_id: string;
  fraction_label: '10-20mm' | '5-10mm' | '1-5mm' | '<1mm';
  weight_g: number;
  reuse_potential_score: number; // 0-1
  reuse_category: 'Високий' | 'Середній' | 'Низький';
}

export interface Material {
  sample_id: string;
  material_type: string;
  weight_g: number;
  photo_url_small: string;
  color_class: 'світлий' | 'середній' | 'темний' | 'сірий' | 'червоний' | 'змішаний';
  risk_level: 'низький' | 'невідомий' | 'потенційно ризиковий';
  decision: 'придатний' | 'непридатний' | 'відкладено';
  notes_optional?: string;
}

export interface SolutionReflection {
  sample_id: string;
  solution_type: 'gabion' | 'filler' | 'mosaic' | 'not_suitable' | 'other';
  photo_url: string;
  reflection_emotions: string;
  reflection_strategies: string;
  is_anonymous: boolean;
}

// Mock data
export const sampleOverviews: SampleOverview[] = [
  {
    sample_id: 'S001',
    analysis_date: '2025-12-15',
    group: 'A',
    total_weight_pre_wash_g: 2450,
    total_weight_post_wash_g: 2180,
    photo_url: 'https://images.unsplash.com/photo-1601583170734-f8e31d7d6250?w=800'
  },
];

export const fractions: Fraction[] = [
  // S001
  { sample_id: 'S001', fraction_label: '10-20mm', weight_g: 720, reuse_potential_score: 0.85, reuse_category: 'Високий' },
  { sample_id: 'S001', fraction_label: '5-10mm', weight_g: 890, reuse_potential_score: 0.75, reuse_category: 'Високий' },
  { sample_id: 'S001', fraction_label: '1-5mm', weight_g: 420, reuse_potential_score: 0.45, reuse_category: 'Середній' },
  { sample_id: 'S001', fraction_label: '<1mm', weight_g: 150, reuse_potential_score: 0.2, reuse_category: 'Низький' },
];

export const materials: Material[] = [
  // S001
  { sample_id: 'S001', material_type: 'бетон', weight_g: 980, photo_url_small: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=200', color_class: 'сірий', risk_level: 'низький', decision: 'придатний' },
  { sample_id: 'S001', material_type: 'цегла', weight_g: 720, photo_url_small: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=200', color_class: 'червоний', risk_level: 'низький', decision: 'придатний' },
  { sample_id: 'S001', material_type: 'природний камінь', weight_g: 320, photo_url_small: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=200', color_class: 'змішаний', risk_level: 'низький', decision: 'придатний' },
  { sample_id: 'S001', material_type: 'метал', weight_g: 85, photo_url_small: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=200', color_class: 'темний', risk_level: 'невідомий', decision: 'відкладено' },
  { sample_id: 'S001', material_type: 'кераміка', weight_g: 45, photo_url_small: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=200', color_class: 'світлий', risk_level: 'низький', decision: 'придатний' },
  { sample_id: 'S001', material_type: 'некласифікована', weight_g: 30, photo_url_small: 'https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?w=200', color_class: 'змішаний', risk_level: 'потенційно ризиковий', decision: 'непридатний' },
];

export const solutionsReflections: SolutionReflection[] = [
  {
    sample_id: 'S001',
    solution_type: 'gabion',
    photo_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    reflection_emotions: 'Відчуття зв\'язку з історією будівлі, усвідомлення руйнування',
    reflection_strategies: 'Потрібен час на осмислення, робота з матеріалом як медитація',
    is_anonymous: true
  },
  {
    sample_id: 'S001',
    solution_type: 'mosaic',
    photo_url: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400',
    reflection_emotions: 'Надія через творчість, перетворення руїн на щось нове',
    reflection_strategies: 'Групова робота допомагає впоратися з важкими емоціями',
    is_anonymous: true
  },
  {
    sample_id: 'S001',
    solution_type: 'filler',
    photo_url: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400',
    reflection_emotions: 'Сум за втраченим, але й бажання зберегти хоч щось',
    reflection_strategies: 'Важливо документувати процес, створювати архів пам\'яті',
    is_anonymous: true
  }
];
