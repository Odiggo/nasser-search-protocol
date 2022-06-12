pub mod instructions;
pub mod state;
pub mod errors;

use {anchor_lang::prelude::*, instructions::*};

declare_id!("2rYAfiituf3R1DmAXuUw2AAN1HkudAAzcnna2CCNpQ8e");

#[program]
pub mod search_contracts {
    use super::*;

    pub fn init_resource(ctx: Context<InitResourceCtx>, ix: InitResourceIx) -> Result<()> {
        init_resource::handler(ctx, ix)
    }

    pub fn init_session(ctx: Context<InitSessionCtx>) -> Result<()> {
        init_session::handler(ctx)
    }

    pub fn start_session(ctx: Context<StartSessionCtx>) -> Result<()> {
        start_session::handler(ctx)
    }

    pub fn end_session(ctx: Context<EndSessionCtx>) -> Result<()> {
        end_session::handler(ctx)
    }
}
