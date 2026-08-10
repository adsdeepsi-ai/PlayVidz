# MVStyle Video — Mobile Cloudflare Master

This version is designed for **phone-only setup** using:

**Phone → GitHub → Cloudflare Pages → D1**

No CMD and no Wrangler are required for the initial deployment.

## 1. Upload this folder to GitHub

Create a new GitHub repository, then upload all files/folders from this project.

Important folders/files:

- `index.html`
- `watch.html`
- `admin/index.html`
- `assets/`
- `functions/`
- `schema.sql`

## 2. Create Cloudflare Pages from GitHub

Cloudflare Dashboard:

**Workers & Pages → Create application → Pages → Connect to Git**

Select the GitHub repository.

Framework preset: **None**

Build command: leave empty.

Build output directory: `.`

Deploy.

Because this project contains `/functions`, Git-based Pages deployment is used instead of Direct Upload.

## 3. Create D1

Cloudflare Dashboard:

**Workers & Pages → D1 → Create database**

Database name:

`mvstyle_videos`

## 4. Create the tables

Open the new D1 database and use the SQL/query area.

Copy everything from:

`schema.sql`

Paste it into the D1 SQL editor and execute it.

This creates the `videos` table and one harmless demo video.

## 5. Bind D1 to Pages

Open:

**Workers & Pages → your Pages project → Settings → Functions → Bindings**

Add:

- Binding type: D1 database
- Variable name: `DB`
- D1 database: `mvstyle_videos`

Save.

Then trigger a new deployment from the Deployments tab so the binding is available to the Functions.

## 6. Add ADMIN_TOKEN

Open:

**Workers & Pages → your Pages project → Settings → Variables and Secrets**

Add an encrypted/secret variable:

Name:
`ADMIN_TOKEN`

Value:
make your own strong secret, for example a long random password.

Save it and redeploy.

## 7. Open the Admin

Open:

`https://YOUR-SITE.pages.dev/admin/`

Enter your `ADMIN_TOKEN`.

Then you can add:

- Video title
- Direct video URL
- Thumbnail URL
- Duration
- Description

## 8. Homepage

The homepage automatically shows:

- 10 videos per page
- 2-column mobile grid
- duration badges
- numbered pagination

## 9. Watch page

Each video opens:

`/watch.html?slug=VIDEO-SLUG`

The watch page contains:

- video player
- title
- description
- similar videos

## Important

Use only video, thumbnail, and other media that you have permission to host and distribute.

If GitHub's mobile interface makes folder upload difficult, use GitHub's browser upload and upload the project files/folders while preserving the exact paths.
