# NASA Simple Template (Backend + Frontend)

This folder contains a minimal template:

- backend: Express API (port 4000)
- frontend: Vite + React (port 5173 by default)

Run the backend (PowerShell):

```powershell
cd App/backend; npm install
npm start
```

Run the frontend (in a new terminal) (PowerShell):

```powershell
cd App/frontend; npm install
npm run dev
```

Open the browser at http://localhost:5173. The frontend will call the backend at http://localhost:4000/api/hello.
