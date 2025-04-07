This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Sure! Here's the translation to English:

---

## 🐳 Guide to Using Docker in the Project

### Environment Initialization (Docker)

1. Make sure **Docker Desktop** is running.  
   > *(Note: You can search for “Docker Desktop” in the Windows start menu and open the application manually — at least this is how it works on Windows.)*

2. Open two terminals (for example, using **Windows Terminal** or **CMD/Powershell**):
   - One located in the `backend` folder
   - Another in the `frontend` folder

3. In **each terminal**, run the following command:
   ```bash
   docker-compose up --build
   ```
   This command will build and start the corresponding containers for each service.

4. Wait for the build and startup processes to complete.  
   Docker will take care of the rest automatically. ✅

---

### Shutting Down the Containers

**Option 1 – From the same terminal:**  
Press `Ctrl + C` in the terminal where Docker is running. Then wait for the containers to stop properly.

**Option 2 – From another terminal (preferred):**
```bash
docker-compose down
```

> This option is preferred because it stops the containers in a more orderly and safe manner.

---

### Restarting Without Rebuilding

If the source code hasn't been modified and you just want to restart the containers, you can use the following command (without the `--build` option):

```bash
docker-compose up
```

This will reuse the already built images, speeding up the startup process.