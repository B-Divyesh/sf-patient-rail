# Patient Rail visual thesis

## Direction

Patient Rail uses a **cut-paper railway dispatch board**. The game is a calm tactical object, not an arcade screen: cream route cards sit over a navy desk, teal rail lines physically connect the 7 by 7 board, mustard marks the player's available work, and copper flags the single danger that will act next. Slightly uneven corners and offset paper shadows make each car and enemy feel hand-placed while keeping every rule legible without motion.

This direction belongs to a turn-based train-defense game because a dispatcher reads routes, checks one warning, and makes one deliberate mark. It avoids ASCII nostalgia and avoids the visual noise of real-time combat.

## Tokens and contrast

| Token | Value | Use |
| --- | --- | --- |
| Navy desk | `#102a43` | Page background, deep ink |
| Deep navy | `#071d2e` | Strong text and focus contrast |
| Cream paper | `#fff7df` | Main route cards |
| Warm paper | `#f3e6c3` | Board cells and secondary surfaces |
| Teal rail | `#147d78` | Tracks and safe progress |
| Dark teal | `#075f5b` | Teal text and outlines on cream |
| Mustard action | `#e3ac28` | Primary actions and current stop |
| Copper danger | `#b4532a` | Enemy intent and damage |
| Red-brown | `#842c20` | Loss and destructive warnings |

Body text uses deep navy on cream (greater than 12:1). Cream on navy is greater than 12:1. Copper is paired with labels and an intent marker, never used alone. The design is intentionally single-mode: cream paper on a navy dispatch desk is the product identity, and painting the background explicitly prevents an accidental system theme.

## Type and spacing

- IBM Plex Sans Variable, self-hosted by the build, is used for controls and reading text.
- IBM Plex Mono Variable, self-hosted by the build, is reserved for seeds, coordinates, health and turn counters.
- Type steps: 14, 16, 20, 28 and fluid 32–52 px.
- Spacing follows an 8 px base with 4 px only inside compact board labels.
- Reading lines stop at 68 characters. Touch targets are at least 44 by 44 px.

## Shape and asset plan

All shipped art is original and hand-authored for this repository. There are no generated or third-party images.

- The board, track sleepers, train cars, enemy markers, ticket notches and paper shadows are CSS geometry.
- `public/social-card.svg`, `public/favicon.svg`, and `public/apple-touch-icon.svg` are hand-authored vector cut-paper compositions made for Patient Rail.
- Enemy silhouettes use circles, clipped wedges and paper tabs. Text labels remain outside decorative shapes.
- No copyrighted train, game-world, logo or character asset is used.

## Interaction grammar

The copper-bordered board piece is the only enemy that will act next. Clicking an enemy fires; clicking a damaged car patches it; Brace and Hold position are explicit buttons. Arrow keys move across the board. Enter or Space uses the focused piece. `B` braces and `W` holds. Invalid actions leave the turn unchanged and explain why in a live status line.

Every action is understandable from a static frame: the intent card names the acting enemy, target and exact result; the turn counter changes only after a valid action; the log records both player and enemy outcomes.

## Motion policy

No gameplay rule depends on animation. Buttons press by 1 px and paper layers settle over 160 ms. Route changes use a short opacity change only. Under `prefers-reduced-motion: reduce`, all transitions and transforms are removed. Nothing loops, flashes or moves on its own.

## Difficulty curve

Each run has three five-turn stops. Stop one teaches firing and bracing with copper beetles. Stop two adds tougher track cutters or storm crows. Stop three applies one visible weather rule. Each turn resolves exactly one announced enemy intent. A conservative Brace action cancels up to two damage, so every generated seed has a safe finish; firing and patching earn a healthier finish. The automated finishability check plays 366 dated seeds through an end state.
