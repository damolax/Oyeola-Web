# Build Notes

This project was generated as a complete Next.js + Prisma codebase.

A dependency install was performed successfully and `package-lock.json` was created. The full Prisma database push/seed test could not be completed inside this sandbox because Prisma attempted to download its query engine from `binaries.prisma.sh`, and the sandbox could not reach that host at the time of testing.

On your own machine or deployment server, run:

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

If Prisma still cannot download its engine, check your internet connection, proxy, firewall, or deploy environment restrictions.
