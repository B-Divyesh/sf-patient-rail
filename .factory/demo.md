# Demo sandbox

- URL: `https://patient-rail.sociobot.in/demo`
- One-click entry: **Try it with sample data** on the first screen.
- Sample: seed `SAMPLE-EMBER-7`, three named route stops, a fixed train layout, three enemy families, and a final weather rule.
- Persistent label: **Demo — sample run, nothing is saved to your daily game**.
- Storage namespace: only `demo:patient-rail:run:v1`. Daily progress uses `patient-rail:daily:*` and is never read or written in demo mode.
- **Reset demo** deletes and recreates only the demo key.
- **Start today's run** deletes the demo key, leaves daily keys unchanged, and opens `/`.

Tests open `/demo` in a fresh browser context. No account, key or external network call is needed.
