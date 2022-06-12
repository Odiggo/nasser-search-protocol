use {
    crate::{state::*},
    anchor_lang::prelude::*,
};

#[derive(Accounts)]
pub struct InitSessionCtx<'info> {
    #[account(
        init,
        payer = user,
        space = SESSION_SIZE,
        seeds = [SESSION_PREFIX.as_bytes(), resource.key().as_ref(), user.key().as_ref()],
        bump, 
    )]
    session: Account<'info, Session>,
    #[account(mut)]
    resource: Box<Account<'info, Resource>>,

    #[account(mut)]
    user: Signer<'info>,
    system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitSessionCtx>) -> Result<()> {
    let session = &mut ctx.accounts.session;
    session.bump = *ctx.bumps.get("session").unwrap();

    let resource = &ctx.accounts.resource;

    session.resource = resource.key();
    session.is_active = false;
    session.last_update_at = Clock::get().unwrap().unix_timestamp;

    Ok(())
}
