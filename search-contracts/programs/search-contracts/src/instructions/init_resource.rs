use {
    crate::state::*, 
    anchor_lang::prelude::*
};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitResourceIx {
    pub uuid: String,
    pub charge_amount: u64,
    pub charge_divisor: u64,
}

#[derive(Accounts)]
#[instruction(ix: InitResourceIx)]
pub struct InitResourceCtx<'info> {
    #[account(
        init,
        payer = payer,
        space = RESOURCE_SIZE,
        seeds = [RESOURCE_PREFIX.as_bytes(), ix.uuid.as_bytes()],
        bump
    )]
    resource: Account<'info, Resource>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(
        mut,
        seeds = [ESCROW_PREFIX.as_bytes(), ix.uuid.as_bytes()],
        bump
    )]
    escrow: UncheckedAccount<'info>,

    #[account(mut)]
    authority: Signer<'info>,
    #[account(mut)]
    payer: Signer<'info>,

    system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitResourceCtx>, ix: InitResourceIx) -> Result<()> {
    let resource = &mut ctx.accounts.resource;
    resource.bump = *ctx.bumps.get("resource").unwrap();
    resource.authority = ctx.accounts.authority.key();
    resource.escrow = ctx.accounts.escrow.key();
    resource.escrow_bump = *ctx.bumps.get("escrow").unwrap();

    resource.uuid = ix.uuid;
    resource.charge_amount = ix.charge_amount;
    resource.charge_divisor = ix.charge_divisor;

    resource.active_sessions = 0;

    Ok(())
}
