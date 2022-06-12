use {
    crate::{state::*, errors::ErrorCode},
    anchor_lang::{prelude::*, solana_program::{*, program::*}}
};

#[derive(Accounts)]
pub struct StartSessionCtx<'info> {
    #[account(mut, seeds = [SESSION_PREFIX.as_bytes(), resource.key().as_ref(), user.key().as_ref()], bump=session.bump)]
    session: Box<Account<'info, Session>>,

    #[account(mut, constraint = session.resource == resource.key() @ ErrorCode::InvalidResource)]
    resource: Box<Account<'info, Resource>>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut, constraint = resource.escrow == escrow.key() @ ErrorCode::InvalidEscrow)]
    escrow: UncheckedAccount<'info>,

    #[account(mut)]
    user: Signer<'info>,

    system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<StartSessionCtx>) -> Result<()> {
    let session = &mut ctx.accounts.session;
    if session.is_active {
        return Err(error!(ErrorCode::SessionAlreadyActive));
    }

    let resource = &mut ctx.accounts.resource;
    msg!("resource balance before {}", ctx.accounts.escrow.to_account_info().lamports());

    invoke(
        &system_instruction::transfer(&ctx.accounts.user.key(), &ctx.accounts.escrow.key(), 1_000_000_000),
        &[
            ctx.accounts.user.to_account_info(),
            ctx.accounts.escrow.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    session.is_active = true;
    session.last_update_at = Clock::get().unwrap().unix_timestamp;
    msg!("last update {}", session.last_update_at);
    msg!("resource balance {}", ctx.accounts.escrow.to_account_info().lamports());

    resource.active_sessions = resource.active_sessions.checked_add(1).expect("Add error");

    Ok(())
}
