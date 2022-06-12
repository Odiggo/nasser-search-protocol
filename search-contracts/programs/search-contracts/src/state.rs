use anchor_lang::prelude::*;

pub const RESOURCE_PREFIX: &str = "resource";
pub const RESOURCE_SIZE: usize = 8 + std::mem::size_of::<Resource>() + 8;

pub const ESCROW_PREFIX: &str = "escrow";

pub const SESSION_PREFIX: &str = "session";
pub const SESSION_SIZE: usize = 8 + std::mem::size_of::<Session>() + 8;

#[account]
pub struct Resource {
    pub bump: u8,
    pub uuid: String,
    pub charge_amount: u64,
    pub charge_divisor: u64,
    pub authority: Pubkey,
    pub escrow: Pubkey,
    pub escrow_bump: u8,
    pub active_sessions: u64,
}

#[account]
pub struct Session {
    pub bump: u8,
    pub resource: Pubkey,
    pub user: Pubkey,
    pub is_active: bool,
    pub last_update_at: i64,
}
