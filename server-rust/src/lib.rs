pub mod api;
pub mod auth;
pub mod capture;
pub mod config;
pub mod error;
pub mod ffi;
pub mod front_panel;
pub mod fsutil;
pub mod hdmi_idle;
pub mod http;
pub mod security;
pub mod state;
pub mod system;
pub mod update;
pub mod ws;

pub use error::{AppError, Result};
