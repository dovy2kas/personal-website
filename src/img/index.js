import preview from './transacto/landing.jpg';
import dashboard from './transacto/dashboard.jpg';
import deposit from './transacto/deposit.jpg';
import profile from './transacto/profile.jpg';
import log_in from './transacto/login.jpg';
import roulette from './gambtopia/roulette.jpg';
import crash from './gambtopia/crash.jpg';
import login from './gambtopia/login.jpg';
import register from './gambtopia/register.jpg'

export const transacto = [
    {
        original: preview,
        originalAlt: "transacto landing",
        thumbnail: preview,
        thumbnailAlt: "transacto landing thumbnail"
    },
    {
        original: dashboard,
        originalAlt: "transacto dashboard",
        thumbnail: dashboard,
        thumbnailAlt: "transacto dashboard thumbnail"
    },
    {
        original: profile,
        originalAlt: "transacto profile",
        thumbnail: profile,
        thumbnailAlt: "transacto profile thumbnail"
    },
    {
        original: deposit,
        originalAlt: "transacto deposit",
        thumbnail: deposit,
        thumbnailAlt: "transacto deposit thumbnail"
    },
    {
        original: log_in,
        originalAlt: "transacto login",
        thumbnail: log_in,
        thumbnailAlt: "transacto login thumbnail"
    }
];

export const gambtopia = [
    {
        original: roulette,
        originalAlt: "gambtopia roulette",
        thumbnail: roulette,
        thumbnailAlt: "gambtopia roulette thumbnail"
    },
    {
        original: crash,
        originalAlt: "gambtopia crash",
        thumbnail: crash,
        thumbnailAlt: "gambtopia crash thumbnail"
    },
    {
        original: login,
        originalAlt: "gambtopia login",
        thumbnail: login,
        thumbnailAlt: "gambtopia login thumbnail"
    },
    {
        original: register,
        originalAlt: "gambtopia register",
        thumbnail: register,
        thumbnailAlt: "gambtopia register thumbnail"
    }
];

export default { transacto, gambtopia };