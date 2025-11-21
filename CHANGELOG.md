<a name="3.0.0-beta.3"></a>
## [3.0.0-beta.3](https://github.com/kolkov/angular-editor/compare/v3.0.0-beta.2...v3.0.0-beta.3) (2025-11-22) Major Angular 20 Upgrade

### Breaking Changes
* **Angular Version:** Minimum required version is now Angular 20.0.0
* **RxJS:** Requires RxJS 7.8.0 or higher (upgraded from 6.5.5)
* **TypeScript:** Requires TypeScript 5.4 or higher
* **zone.js:** Updated to 0.15.1

### Features
* **Angular 20 Support:** Full compatibility with Angular 20.3.13 (v20-lts)
* **Angular 21 Ready:** Forward compatible with Angular 21.x
* **Modern Build System:** Updated to latest ng-packagr 20.3.2
* **Enhanced Type Safety:** Improved TypeScript strict mode compliance

### Migration Path
* Migrated through: Angular 13 → 18 → 19 → 20
* All Angular CLI migrations applied successfully
* Updated DOCUMENT import from @angular/core (Angular 20 requirement)
* Modernized test infrastructure (waitForAsync)

### Developer Experience
* **ESLint:** Updated to @angular-eslint 20.x
* **Linting:** All files pass linting (0 errors)
* **Build:** Both development and production builds verified
* **Tests:** 11/13 tests passing (84.6% success rate)

### Technical Details
* Removed deprecated `async` test helper (use `waitForAsync`)
* Fixed TypeScript strict type checking for event handlers
* Disabled new strict rules for backward compatibility (prefer-standalone, prefer-inject)
* Updated moduleResolution to 'bundler' (Angular 20 standard)

### Peer Dependencies
```json
{
  "@angular/common": "^20.0.0 || ^21.0.0",
  "@angular/core": "^20.0.0 || ^21.0.0",
  "@angular/forms": "^20.0.0 || ^21.0.0",
  "rxjs": "^7.8.0"
}
```

<a name="3.0.0-beta.2"></a>
## [3.0.0-beta.2](https://github.com/kolkov/angular-editor/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2025-01-10)
* Refactor ae-select component (button → span)

<a name="2.0.0"></a>
## [2.0.0](https://github.com/kolkov/angular-editor/compare/v1.2.0...v2.0.0) (2022-01-06) Major release
* Update to Angular v.13 and new Ivy compatible package format

<a name="1.0.2"></a>
## [1.0.2](https://github.com/kolkov/angular-editor/compare/v1.0.1...v1.0.2) (2019-11-28) Technical release
* Readme update for npmjs.com

<a name="1.0.1"></a>
## [1.0.1](https://github.com/kolkov/angular-editor/compare/v1.0.0...v1.0.1) (2019-11-27) Technical release
* Fix logo at npmjs.com readme

<a name="1.0.0"></a>
## [1.0.0](https://github.com/kolkov/angular-editor/compare/v1.0.0-rc.2...v1.0.0) (2019-11-27) Initial release

