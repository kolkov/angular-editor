<a name="3.0.4"></a>
## [3.0.4](https://github.com/kolkov/angular-editor/compare/v3.0.3...v3.0.4) (2025-12-18) - Security Hotfix

### Security
* **CRITICAL:** Fixed XSS vulnerability in `toggleEditorMode()` method ([#580](https://github.com/kolkov/angular-editor/issues/580)) ([#587](https://github.com/kolkov/angular-editor/pull/587))
  - XSS could execute when switching from HTML source mode back to WYSIWYG
  - User-entered HTML was set via innerHTML without sanitization
  - Sanitization now properly applied in both code paths
  - Thanks to @MarioTesoro for finding the root cause and submitting the fix

### Note
v3.0.3 fix was incomplete - it only covered `refreshView()` but not `toggleEditorMode()`. This release provides complete XSS protection.

### Upgrade Recommendation
**IMMEDIATE UPGRADE RECOMMENDED** for all users. This release completes the security fix started in v3.0.3.

---

<a name="3.0.3"></a>
## [3.0.3](https://github.com/kolkov/angular-editor/compare/v3.0.2...v3.0.3) (2025-01-22) - Security Hotfix

### Security
* **CRITICAL:** Fixed XSS vulnerability in `refreshView()` method ([#580](https://github.com/kolkov/angular-editor/issues/580)) ([774a97d](https://github.com/kolkov/angular-editor/commit/774a97d))
  - XSS could bypass sanitizer when setting editor value via ngModel/formControl
  - Sanitization now properly applied to all innerHTML assignments
  - Thanks to @MarioTesoro for responsible disclosure with PoC

### Bug Fixes
* **links:** Preserve relative URLs when editing existing links ([#359](https://github.com/kolkov/angular-editor/issues/359)) ([c691d30](https://github.com/kolkov/angular-editor/commit/c691d30))
  - Use `getAttribute('href')` instead of `.href` property
  - Prevents adding hostname to relative paths
* **debug:** Remove debug `console.log` statement from focus() method ([#324](https://github.com/kolkov/angular-editor/issues/324)) ([c691d30](https://github.com/kolkov/angular-editor/commit/c691d30))

### Upgrade Recommendation
**IMMEDIATE UPGRADE RECOMMENDED** for all users. This release fixes a critical security vulnerability.

---

<a name="3.0.2"></a>
## [3.0.2](https://github.com/kolkov/angular-editor/compare/v3.0.1...v3.0.2) (2025-01-22)

### Bug Fixes
* **toolbar:** toolbarHiddenButtons option now works without Bootstrap ([#544](https://github.com/kolkov/angular-editor/issues/544)) ([3563552](https://github.com/kolkov/angular-editor/commit/3563552))
* **image:** allow re-uploading same image after deletion ([#543](https://github.com/kolkov/angular-editor/issues/543), [#568](https://github.com/kolkov/angular-editor/issues/568), [#503](https://github.com/kolkov/angular-editor/issues/503)) ([7d21718](https://github.com/kolkov/angular-editor/commit/7d21718))
* **video:** support YouTube short URLs (youtu.be format) ([#557](https://github.com/kolkov/angular-editor/issues/557), [#554](https://github.com/kolkov/angular-editor/issues/554)) ([4aa8397](https://github.com/kolkov/angular-editor/commit/4aa8397))

### Maintenance
* **issues:** Systematic triage completed - 61 issues closed, 249 remain open
* **documentation:** Added issue triage session record

---

<a name="3.0.1"></a>
## [3.0.1](https://github.com/kolkov/angular-editor/compare/v3.0.0...v3.0.1) (2025-11-22)

### Bug Fixes
* **Icons:** Fixed list icons (unordered/ordered) display consistency in toolbar

### CI/CD
* **GitHub Actions:** Added automated npm publishing workflow
* **npm Publishing:** Configured Granular Access Token authentication
* **GitHub Releases:** Automated release creation with changelog

---

<a name="3.0.0"></a>
## [3.0.0](https://github.com/kolkov/angular-editor/compare/v2.0.0...v3.0.0) (2025-11-22) Major Angular 20 Upgrade

🎉 **Stable Release** - Production Ready!

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
* **Font Awesome Removed:** No external icon dependencies - using pure SVG icons (27 icons)
* **Zero External Icon Dependencies:** Fully self-contained icon system

### Migration Path
* Migrated through: Angular 13 → 18 → 19 → 20
* All Angular CLI migrations applied successfully
* Updated DOCUMENT import from @angular/core (Angular 20 requirement)
* Modernized test infrastructure (waitForAsync)

### Developer Experience
* **ESLint:** Updated to @angular-eslint 20.x
* **Linting:** All files pass linting (0 errors)
* **Build:** Both development and production builds verified
* **Tests:** 13/13 tests passing (100% success rate)

### Bug Fixes
* **Tests:** Fixed AeSelectComponent tests for mousedown event handling
* **Demo:** Updated demo app for Angular 20 compatibility

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

