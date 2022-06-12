use {
    crate::{state::*, errors::ErrorCode},
    anchor_lang::{prelude::*, solana_program::{*, program::*}}
};

#[derive(Accounts)]
pub struct EndSessionCtx<'info> {
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

pub fn handler(ctx: Context<EndSessionCtx>) -> Result<()> {
    let session = &mut ctx.accounts.session;
    if !session.is_active {
        return Err(error!(ErrorCode::SessionNotActive));
    }

    let resource = &mut ctx.accounts.resource;

    let current_ts = Clock::get().unwrap().unix_timestamp;
    let amount_to_charge = (current_ts
        .checked_sub(session.last_update_at)
        .unwrap() as u64)
        .checked_mul(resource.charge_amount)
        .unwrap()
        .checked_div(resource.charge_divisor)
        .unwrap();
    let escrow_amount: u64 = 1_000_000_000;
    let amount_to_withdraw = escrow_amount.checked_sub(amount_to_charge).expect("Sub error");
    
    let escrow_seed = [ESCROW_PREFIX.as_bytes(), resource.uuid.as_bytes(), &[resource.escrow_bump]];
    let escrow_signers = &[&escrow_seed[..]];

    msg!("resource balance before {}", &ctx.accounts.escrow.to_account_info().lamports());

    msg!("current update {}", current_ts);
    msg!("last update {}", session.last_update_at);
    msg!("amount to charge {}", amount_to_charge);
    msg!("amount to withdraw {}", amount_to_withdraw);

    invoke_signed(
        &system_instruction::transfer(&ctx.accounts.escrow.key(), &ctx.accounts.user.key(), amount_to_charge),
        &[
            ctx.accounts.escrow.to_account_info(),
            ctx.accounts.user.to_account_info(),
            // ctx.accounts.system_program.to_account_info(),
        ],
        escrow_signers
    )?;

    let rent_exempt = rent::Rent::get()?.minimum_balance(0);

    invoke_signed(
        &system_instruction::transfer(&ctx.accounts.escrow.key(), &ctx.accounts.user.key(), amount_to_withdraw.checked_sub(rent_exempt).expect("Sub Error")),
        &[
            ctx.accounts.escrow.to_account_info(),
            ctx.accounts.user.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        escrow_signers
    )?;

    // let pay = &ctx.accounts.escrow.to_account_info();
    // let snapshot: u64 = pay.try_lamports()?;

    // **pay.try_borrow_mut_lamports()? = 0;

    // let destination = ctx.accounts.user.to_account_info();
    // **destination.try_borrow_mut_lamports()? = destination
    //     .lamports()
    //     .checked_add(snapshot)
    //     .expect("Add error");

    msg!("resource balance after {}", &ctx.accounts.escrow.to_account_info().lamports());

    session.is_active = false;
    session.last_update_at = Clock::get().unwrap().unix_timestamp;
    
    resource.active_sessions = resource.active_sessions.checked_sub(1).expect("Sub error");

    Ok(())
}
