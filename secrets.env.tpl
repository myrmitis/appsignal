# Secret names and 1Password references for Chartspur. No values. See ~/.agents/docs/secrets.md.
# Owner: run `~/.agents/scripts/push-secrets ~/dev/chartspur --dry-run`, then without --dry-run.
# Local use: `op run --env-file secrets.env.tpl -- <command>`.
# target: github myrmitis/chartspur
# Restricted Stripe key with read access to Checkout Sessions and Payments only. Agents use it to see paid orders.
STRIPE_READONLY_KEY=op://Projects/Chartspur Stripe read-only/credential
