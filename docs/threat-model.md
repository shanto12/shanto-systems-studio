# Threat Model

## Data

The demo uses synthetic/static content only. It does not collect user data.

## Secrets

No API keys are embedded in client code. There are no provider keys required for this version.

## Browser Risk

The app is public-facing static content. CSP restricts scripts, media, images, fonts, and connections to self.

## Remaining Platform Controls

Netlify account-level controls such as SSO, MFA, WAF, and visitor password protection are not claimed by the app unless verified separately in the Netlify account.
