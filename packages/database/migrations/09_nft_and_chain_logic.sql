-- 09_nft_and_chain_logic.sql
-- NFT Templates & On-Chain Configuration

CREATE TABLE IF NOT EXISTS nft_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name TEXT NOT NULL, 
    collection_mint TEXT, 
    metadata_base_uri TEXT,
    attributes_schema JSONB, 
    image_template_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS metaplex_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network TEXT DEFAULT 'mainnet-beta',
    candy_machine_id TEXT,
    collection_address TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    platform_name TEXT NOT NULL, 
    link_url TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
