# Whiteboard Project

This repository currently uses the root folder as the active React + Vite frontend.

## Active structure

- `src/` contains the main frontend source code.
- `public/` contains public frontend assets.
- `Backend/` contains the current backend API code.
- `package.json` at the repo root is for the active frontend app.

## Legacy and prototype areas

- `Frontend/` is an older nested frontend copy and is not the app you should run.
- `archive/admin-prototype/` contains an older admin prototype workspace.
- `archive/frontend-legacy/` contains partially moved legacy frontend material.
- `backend_tmp/` is a temporary leftover from a blocked folder cleanup and should be treated as inactive.

## Run the project

Frontend from the repo root:

```bash
npm install
npm run dev
```

Backend from `Backend/`:

```bash
cd Backend
npm install
npm run dev
```

## Notes

- The frontend source has been reorganized into `src/components`, `src/pages`, and `src/assets`.
- Some older folders could not be fully moved because of Windows/OneDrive permission restrictions on nested dependencies.
- If you want, the next cleanup step can be a manual safe removal of the inactive folders after closing any processes that may be locking them.
