# Casino backend

Virtual-credit Express/MySQL backend for authentication, Limbo, Crash, and Baccarat.

## Setup

1. Configure `.env.local` with the database and JWT settings.
2. Create the required database tables separately.
3. Run `npm run dev`.

The server does not create, alter, migrate, or seed database tables.

## Authenticated endpoints

- `GET /api/games/wallet`
- `POST /api/games/limbo/bets`
- `GET /api/games/crash/current`
- `POST /api/games/crash/bets`
- `POST /api/games/crash/bets/:betId/cashout`
- `GET /api/games/baccarat/config`
- `GET /api/games/baccarat/fairness/current`
- `POST /api/games/baccarat/bets`
- `GET /api/games/baccarat/history`
- `GET /api/games/baccarat/hands/:handId/verify`

Send `Authorization: Bearer <token>`.

Limbo request example:

```json
{
  "amount": "1.00",
  "targetMultiplier": "2.00",
  "clientSeed": "player-selected-seed",
  "idempotencyKey": "unique-request-id"
}
```

Crash bet request example:

```json
{
  "amount": "1.00",
  "autoCashoutMultiplier": "2.00",
  "idempotencyKey": "unique-request-id"
}
```

Baccarat bet request example:

```json
{
  "amount": "10.00",
  "selection": "banker",
  "clientSeed": "player-selected-seed",
  "serverSeedHash": "hash-returned-by-the-fairness-endpoint",
  "idempotencyKey": "unique-request-id"
}
```

Baccarat clients must request and retain the fairness commitment before placing a bet. Baccarat
supports `player`, `banker`, and `tie`. It uses a deterministic eight-deck shuffle,
standard third-card rules, 5% Banker commission, and an 8:1 Tie payout.

This is an MVP using virtual credits. It is not a production cryptocurrency custody system.
