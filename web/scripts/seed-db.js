const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SAMPLE_JOBS = [
  {
    title: 'Senior Solana Engineer',
    description: 'Lead the development of our next-gen DeFi protocol. Experience with Rust and Anchor required.',
    required_skills: ['Rust', 'Solana', 'Anchor', 'TypeScript'],
    is_active: true,
  },
  {
    title: 'AI Fullstack Developer',
    description: 'Build LLM-powered interfaces for the Web3 talent ecosystem. Strong Next.js and Python skills needed.',
    required_skills: ['Next.js', 'Python', 'LangChain', 'OpenAI'],
    is_active: true,
  },
  {
    title: 'Smart Contract Auditor',
    description: 'Perform security audits on high-value Solana programs. Deep understanding of Sealevel requested.',
    required_skills: ['Solana', 'Security', 'Rust', 'Testing'],
    is_active: true,
  },
  {
    title: 'Web3 Product Designer',
    description: 'Design beautiful, intuitive interfaces for decentralized applications. Focus on user experience and brand.',
    required_skills: ['Figma', 'UI/UX', 'Web3', 'Branding'],
    is_active: true,
  }
];

async function seed() {
  console.log('🚀 Seeding Initial Jobs into Supabase (JS Mode)...');

  const { data, error } = await supabase
    .from('jobs')
    .insert(SAMPLE_JOBS)
    .select();

  if (error) {
    console.error('❌ Error seeding jobs:', error.message);
    return;
  }

  console.log(`✅ Successfully seeded ${data.length} jobs!`);
}

seed();
