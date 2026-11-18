# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## 2.0.0

### BREAKING
- Requires PWA 7.35.0 or newer (`@shopgate/engage >=7.35.0-alpha.5` until 7.35.0 is released; then
  the range moves to `>=7.35.0`).
- The rewards tab no longer adds itself to the tab bar. It is a tab bar item that merchants add in
  the Theme Config of the admin ("Rewards" / "Prämien"). After the update, the tab is missing until
  the merchant adds it there and publishes. The admin offers the item once the shop's app runs this
  version, so deploy first, then add it
  ([CURB-6408](https://jira.shopgate.guru/browse/CURB-6408)).
- Removed the configuration key `hideTabBarIcon`. Merchants show or hide the tab in the admin.
- Removed the configuration key `tabBarIconSvg`. Its default tag icon is now the extension icon
  `@shopgate-project/yotpo-rewards/rewards`, which merchants replace in the icon library of the
  admin. A value stored for `tabBarIconSvg` is no longer read. If the old value isn't a complete
  `<svg>` element, wrap it in `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">…</svg>`
  before you upload it.

### Changed
- The tab shows the merchant text `tabBarIconLabel` as before, which still defaults to "Rewards" in
  every language. When the merchant clears the field, the tab shows the name of the item in the
  admin ("Prämien" in German shops (de-DE), "Rewards" in all others) instead of no text, so the tab
  always has an accessible name. The tab opens the rewards page and is highlighted there.

### Development
- Updated the frontend setup: `@shopgate/engage`, `@shopgate/eslint-config` and
  `@shopgate/pwa-unit-test` as dev dependencies, ESLint 8, Jest, React 17, `react-helmet` 6 as in
  the PWA, a `lint` script, specs and a `jsconfig.json` for the editor. Removed `prop-types`,
  `redux` and `reselect`, which nothing imports.
- `package-lock.json` is tracked.

## 1.0.0

- Initial Release: "Yotpo Rewards"
