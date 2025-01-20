## Frontend Setup

Follow the steps below to set up and run the frontend application for the Taskforce Expense Tracker App:

### Step 1: Clone the Repository
Clone the repository from GitHub to your local machine:
```bash
git clone https://github.com/Codinglone/taskforce-expense-tracker-frontend.git
```

### Step 2: Navigate to the Frontend Directory
Change to the frontend directory:
```bash
cd taskforce-expense-tracker-frontend
```

### Step 3: Install Dependencies
Install all required dependencies using npm:
```bash
npm install
```

### Step 4: Configure Environment Variables
Create a `.env` file in the root of the frontend directory and add the following environment variable:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
- Ensure the URL matches the backend API base URL.

### Step 5: Start the Development Server
Run the following command to start the frontend server in development mode:
```bash
npm run dev
```

### Frontend Application
- The frontend application will be available at: `http://localhost:5173`
