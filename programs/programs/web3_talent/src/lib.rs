use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod web3_talent {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Talent Marketplace Initialized!");
        Ok(())
    }

    pub fn mint_profile_nft(ctx: Context<MintProfileNft>, ipfs_hash: String) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        profile.owner = ctx.accounts.user.key();
        profile.ipfs_hash = ipfs_hash;
        Ok(())
    }

    pub fn update_skill_nft(ctx: Context<UpdateSkillNft>, new_ipfs_hash: String) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        profile.ipfs_hash = new_ipfs_hash;
        Ok(())
    }

    pub fn post_job(ctx: Context<PostJob>, id: String) -> Result<()> {
        let job = &mut ctx.accounts.job;
        job.employer = ctx.accounts.employer.key();
        job.custom_id = id;
        job.is_active = true;
        Ok(())
    }

    pub fn apply_job(ctx: Context<ApplyJob>, metadata_hash: String) -> Result<()> {
        let application = &mut ctx.accounts.application;
        application.candidate = ctx.accounts.candidate.key();
        application.job = ctx.accounts.job.key();
        application.metadata_hash = metadata_hash;
        Ok(())
    }

    pub fn create_bounty(ctx: Context<CreateBounty>, amount: u64, bounty_id: String) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        bounty.employer = ctx.accounts.employer.key();
        bounty.amount = amount;
        bounty.bounty_id = bounty_id;
        bounty.status = 0; // 0 = open, 1 = completed
        
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.employer.to_account_info(),
                to: bounty.to_account_info(), // The PDA acts as the locked vault!
            },
        );
        anchor_lang::system_program::transfer(cpi_context, amount)?;
        
        Ok(())
    }

    pub fn complete_bounty(ctx: Context<CompleteBounty>) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        require!(bounty.status == 0, CustomError::BountyAlreadyCompleted);
        
        let amount = bounty.amount;
        bounty.status = 1; // Mark as closed
        
        // Native PDA lamport transfer (Releases the escrowed SOL directly to candidate)
        **bounty.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.candidate.to_account_info().try_borrow_mut_lamports()? += amount;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
#[instruction(ipfs_hash: String)]
pub struct MintProfileNft<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + (4 + 64), // Discriminator + Pubkey + String
        seeds = [b"profile", user.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, ProfileState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(new_ipfs_hash: String)]
pub struct UpdateSkillNft<'info> {
    #[account(
        mut,
        seeds = [b"profile", user.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, ProfileState>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(id: String)]
pub struct PostJob<'info> {
    #[account(
        init,
        payer = employer,
        space = 8 + 32 + (4 + 64) + 1, // Discriminator + Pubkey + String + bool
        seeds = [b"job", employer.key().as_ref(), id.as_bytes()],
        bump
    )]
    pub job: Account<'info, JobState>,
    #[account(mut)]
    pub employer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(metadata_hash: String)]
pub struct ApplyJob<'info> {
    #[account(
        init,
        payer = candidate,
        space = 8 + 32 + 32 + (4 + 64), // Discriminator + Candidate + Job + String
        seeds = [b"application", candidate.key().as_ref(), job.key().as_ref()],
        bump
    )]
    pub application: Account<'info, ApplicationState>,
    pub job: Account<'info, JobState>,
    #[account(mut)]
    pub candidate: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct ProfileState {
    pub owner: Pubkey,
    pub ipfs_hash: String,
}

#[account]
pub struct JobState {
    pub employer: Pubkey,
    pub custom_id: String, // Maps to Supabase UUID
    pub is_active: bool,
}

#[account]
pub struct ApplicationState {
    pub candidate: Pubkey,
    pub job: Pubkey,
    pub metadata_hash: String, // e.g. IPFS hash of cover letter / resume
}

#[derive(Accounts)]
#[instruction(amount: u64, bounty_id: String)]
pub struct CreateBounty<'info> {
    #[account(
        init,
        payer = employer,
        space = 8 + 32 + 8 + (4 + 64) + 1, 
        seeds = [b"bounty", employer.key().as_ref(), bounty_id.as_bytes()],
        bump
    )]
    pub bounty: Account<'info, BountyState>,
    #[account(mut)]
    pub employer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteBounty<'info> {
    #[account(
        mut,
        has_one = employer
    )]
    pub bounty: Account<'info, BountyState>,
    #[account(mut)]
    pub employer: Signer<'info>,
    /// CHECK: Candidate receives the payout securely
    #[account(mut)]
    pub candidate: AccountInfo<'info>, 
}

#[account]
pub struct BountyState {
    pub employer: Pubkey,
    pub amount: u64,
    pub bounty_id: String,
    pub status: u8,
}

#[error_code]
pub enum CustomError {
    #[msg("This bounty has already been completed and funds released.")]
    BountyAlreadyCompleted,
}
