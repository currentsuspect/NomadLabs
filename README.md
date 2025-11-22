# Nomad Labs 🧪

> "Create like the silence is watching."

Nomad Labs is a modern, aesthetic research and publishing platform designed for sharing scientific papers, lab notes, and experimental ideas. It features a distraction-free reading experience, a powerful editor, and a community-driven ecosystem for researchers and thinkers.

![Nomad Labs Banner](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop)

## ✨ Features

- **🔬 Research Publishing**: Publish full research papers with abstract, citations, and versioning.
- **📝 Lab Notes**: Share quick thoughts, experiments, and daily logs.
- **🎨 Aesthetic UI**: A dark-mode first design with interactive physics-based backgrounds and glassmorphism effects.
- **🔐 Authentication**: Secure user authentication via Supabase (Email/Password & OAuth).
- **💬 Community Interaction**: Commenting system with nested replies and custom reactions (🔥, 🧠, 🚀).
- **🛡️ Admin Dashboard**: Dedicated panel for managing users and content.
- **⚡ High Performance**: Built on Vite and React 19 for blazing fast performance.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (CDN & Configured), [Lucide React](https://lucide.dev/) (Icons)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Math Rendering**: [KaTeX](https://katex.org/)
- **Routing**: [React Router v7](https://reactrouter.com/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A [Supabase](https://supabase.com/) account

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/nomad-labs.git
    cd nomad-labs
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory based on `.env.example`:
    ```bash
    cp .env.example .env
    ```
    Update the variables with your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```

4.  **Database Setup**
    - Go to your Supabase project dashboard.
    - Open the **SQL Editor**.
    - Copy the contents of `SUPABASE_SETUP.sql` from this repository.
    - Run the SQL script to create the necessary tables, policies, and triggers.

5.  **Run the Application**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📂 Project Structure

```
nomad-labs/
├── src/
│   ├── components/      # Reusable UI components (Layout, Auth, UI elements)
│   ├── services/        # API and Supabase service layers
│   ├── views/           # Page components (Home, Explore, Editor, etc.)
│   ├── utils/           # Helper functions
│   ├── types.ts         # TypeScript interfaces and types
│   ├── constants.ts     # Global constants
│   ├── App.tsx          # Main application component & Routing
│   └── index.tsx        # Entry point
├── public/              # Static assets
├── supabase/            # Supabase configuration (if applicable)
├── SUPABASE_SETUP.sql   # SQL script for database initialization
└── README.md            # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
