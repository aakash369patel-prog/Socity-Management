# Society Management — React Frontend (scaffold)

Create the app with Vite, then copy `src/` contents:

```bash
npm create vite@latest . -- --template react-ts
npm install axios react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

Set `.env`:

```
VITE_API_URL=http://localhost:8000/api/v1
```

## Folder structure

```
src/
  components/     # UI building blocks (guard/, admin/, shared/)
  context/        # AuthContext, SocietyContext (future)
  hooks/          # useVisitors, useInvoices, ...
  pages/          # Route-level views (guard/, resident/, admin/)
  services/       # Axios API modules (apiClient, visitorService, ...)
  types/          # Shared TypeScript interfaces
```

Wrap the app root:

```tsx
<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>
```

Routes (see `src/routes/router.tsx`):

- `/login` — public
- `/` — protected home
- `/guard` — protected + role guard | society_admin | super_admin
- `/invoices` — protected + role society_admin | super_admin | resident (admin: create & mark paid)
- `/complaints` — helpdesk (resident: submit; admin: assign & status workflow)
- `/units` — society_admin | super_admin only

Run:

```bash
cp .env.example .env
npm install
npm run dev
```
