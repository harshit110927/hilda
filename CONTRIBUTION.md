# CONTRIBUTION GUIDE

Thanks for contributing to HILDA 💙

This guide explains the basic workflow for issues, pull requests, and reviews.

## 1) Before You Start

- Check existing Issues and PRs to avoid duplicate work.
- For larger changes, open an Issue first and discuss approach before implementation.
- Keep changes focused (one feature/fix per PR).

## 2) Raising an Issue

When opening an issue, include:

- **Type**: bug / feature request / docs / question
- **Summary**: one-line description
- **Context**: what you were trying to do
- **Expected behavior** and **actual behavior**
- **Reproduction steps** (for bugs)
- **Environment**: OS, Node version, package manager, branch/commit if relevant
- Screenshots/logs where useful

Use a clear title, e.g.:

- `bug: chat panel does not render markdown lists`
- `feature: add repo selector for multi-project mode`

## 3) Development Workflow

1. Fork the repository (or create a branch if you have write access)
2. Create a branch:
   - `feat/<short-name>` for features
   - `fix/<short-name>` for bug fixes
   - `docs/<short-name>` for documentation
3. Install dependencies: `npm install`
4. Run local dev server: `npm run dev`
5. Run checks before pushing:
   - `npm run lint`
   - `npm run build` (when possible)

## 4) Pull Request Rules

Each PR should include:

- Clear title and concise description
- Link to related Issue (`Closes #<id>` when applicable)
- Scope of changes and non-goals
- Testing notes (what was run and results)
- UI screenshots/GIFs for visual changes

Keep PRs reviewable:

- Prefer small to medium PRs
- Avoid unrelated refactors in the same PR
- Add comments in code only when logic is non-obvious

## 5) Code Style & Quality

- Follow existing TypeScript, React, and Next.js conventions in this repository.
- Prefer explicit types instead of `any`.
- Keep components and functions cohesive and readable.
- Do not commit secrets, tokens, or private keys.

## 6) Security & Sensitive Changes

For security-related findings:

- Do **not** post exploitable details publicly in Issues.
- Share high-level impact in the issue and contact maintainers privately if needed.

## 7) Review & Merge Expectations

- Address review comments in follow-up commits.
- Re-request review once feedback is resolved.
- PRs are merged after maintainers approve and required checks pass.

---

Thanks again for helping improve HILDA 🚀
