use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid resource")]
    InvalidEscrow,
    #[msg("Invalid escrow")]
    InvalidResource,
    #[msg("Invalid authority")]
    InvalidAuthority,
    #[msg("Session is already active")]
    SessionAlreadyActive,
    #[msg("Session is not active")]
    SessionNotActive,
}