# 🎯 TalentFlow - Modern HR Recruitment Management System

**TalentFlow** is a comprehensive, production-ready HR recruitment management system built with modern web technologies. It provides an intuitive interface for managing candidates, assessments, and the entire hiring pipeline with real-time analytics and interactive visualizations.

## 🌟 Live Demo

**[View Live Demo →](https://cheerful-gingersnap-3bea82.netlify.app)**

## 🛠️ Built With

- **React 18.3** + **TypeScript 5.5**
- **Vite 5.4** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first styling
- **TanStack Query** - Powerful data fetching
- **MSW** - API mocking for development
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icons

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Key Features Explained](#-key-features-explained)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎨 **Modern & Intuitive UI**
- Beautiful gradient backgrounds with smooth animations
- Responsive design that works seamlessly on desktop, tablet, and mobile
- Interactive components with hover effects and transitions
- Color-coded status indicators for quick visual scanning

### 👥 **Candidate Management**
- Comprehensive candidate database with detailed profiles
- Interactive stage-based pipeline (Applied → Screening → Technical → Offer → Hired/Rejected)
- Quick stage updates with dropdown selectors directly on candidate cards
- Real-time search and filtering capabilities
- Grid and list view options for flexible data visualization

### 📊 **Dashboard Analytics**
- Real-time metrics displaying total candidates, active pipeline, assessments, and hires
- Visual pipeline distribution chart showing candidate distribution across stages
- Conversion funnel with circular progress indicators
- Recent activity feed with color-coded events
- Growth indicators showing percentage changes

### 📝 **Assessment Management**
- Create and assign custom assessments to candidates
- Job-specific assessment templates (Frontend, Backend, Fullstack, Data, Design)
- Due date tracking and status monitoring
- Search and filter functionality for quick access
- Detailed assignment views with modal popups

### 🔍 **Assessment Review System**
- Interactive review interface for HR teams
- Expandable submission details with JSON preview
- Score tracking (0-100) with visual progress bars
- Status management (Pending, Reviewed, Selected, Rejected)
- Quick action buttons (Recommend, Not Suitable)
- Rich feedback textarea for detailed comments

### 🎯 **Candidate Profiles**
- Detailed candidate information with timeline tracking
- Stage progression history with timestamps
- Activity logs showing all candidate interactions
- One-click assessment assignment from profile page

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern UI library with hooks and concurrent features
- **TypeScript 5.5** - Type-safe development with enhanced IDE support
- **Vite 5.4** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework for rapid styling

### State Management & Data Fetching
- **TanStack Query (React Query)** - Powerful async state management
- **React Router DOM** - Client-side routing with nested routes

### API & Mock Data
- **MSW (Mock Service Worker)** - API mocking for development and demo
- **UUID** - Unique identifier generation for mock data

### UI Components & Icons
- **Lucide React** - Beautiful, consistent icon library (200+ icons)
- **Custom Components** - Purpose-built UI components with Tailwind

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn installed
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/talentflow.git
cd talentflow
```

2. **Install dependencies**
```bash
npm install
```

3. **Initialize Mock Service Worker**
```bash
npx msw init public/ --save
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
talentflow/
├── dist/                       # Production build output
├── node_modules/               # Dependencies
├── public/
│   ├── _redirects             # Netlify routing configuration
│   └── mockServiceWorker.js   # MSW service worker
├── src/
│   ├── api/
│   │   ├── mswServer.ts       # MSW handlers and mock API endpoints
│   │   └── seed.ts            # Mock data generation and seeding
│   ├── components/
│   │   ├── Assessments/
│   │   │   ├── AssessmentsList.tsx
│   │   │   ├── AssignAssessment.tsx
│   │   │   ├── Builder.tsx
│   │   │   ├── CandidateAssessment.tsx
│   │   │   ├── ReviewPage.tsx
│   │   │   └── RuntimeForm.tsx
│   │   ├── Candidates/
│   │   │   ├── CandidateProfile.tsx
│   │   │   └── CandidatesList.tsx
│   │   ├── Jobs/
│   │   │   ├── JobModal.tsx
│   │   │   ├── JobRow.tsx
│   │   │   └── JobsBoard.tsx
│   │   ├── Shared/           # Shared/reusable components
│   │   └── layout/
│   │       └── DashboardLayout.tsx
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   ├── utils/
│   │   └── api.ts           # API utility functions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles and Tailwind imports
├── .gitignore               # Git ignore rules
├── index.html               # HTML entry point
├── netlify.toml             # Netlify deployment configuration
├── package.json             # Dependencies and scripts
├── package-lock.json        # Locked dependency versions
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.node.json       # TypeScript config for Node
└── vite.config.mjs          # Vite build configuration
```

---

## 🎯 Key Features Explained

### Interactive Candidate Cards
Each candidate card includes:
- **Avatar Icon** - Visual identifier with gradient background
- **Stage Dropdown** - Click to change candidate stage instantly
- **Quick Actions** - View details or assign tasks with one click
- **Hover Effects** - Cards lift and transform on hover for better UX
- **Color Coding** - Stages have unique colors (Blue=Applied, Purple=Technical, Green=Hired)

### Real-Time Search & Filtering
- **Instant Search** - Search by name, email, or skills with live results
- **Stage Filtering** - Filter candidates by current stage
- **Sorting Options** - Sort by most recent, name (A-Z), or starred
- **Statistics Dashboard** - See counts for total, active, technical, and hired

### Assessment Assignment Flow
1. Select candidate from list
2. Click "Assign Task" button
3. Choose assessment from dropdown
4. Set due date with calendar picker
5. Add optional notes
6. Submit and track in Assessments page

### Review Workflow
1. Navigate to Assessments page
2. Click "Review" button on any submission
3. View candidate submission details
4. Expand/collapse response JSON
5. Enter feedback and score (0-100)
6. Select status (Pending/Reviewed/Selected/Rejected)
7. Use quick actions or save manually

---

## 🔌 API Integration

TalentFlow uses **MSW (Mock Service Worker)** to simulate a backend API. This provides:

### Available Endpoints
- `GET /api/candidates` - Fetch all candidates
- `GET /api/candidates/:id` - Fetch single candidate
- `PATCH /api/candidates/:id` - Update candidate stage
- `GET /api/candidates/:id/timeline` - Fetch candidate timeline
- `GET /api/assessments` - Fetch all assessments
- `GET /api/assessments/:id` - Fetch single assessment
- `POST /api/candidates/:id/assign` - Assign assessment to candidate
- `GET /api/assigned` - Fetch all assigned assessments
- `GET /api/responses/:id` - Fetch assessment responses
- `PATCH /api/responses/:id` - Update review feedback

### Data Persistence
- Uses **localStorage** for data persistence across sessions
- Seeded with 50 candidates and 5 job-specific assessments
- All mutations (stage changes, assignments) are saved locally

### Replacing with Real API
To connect to a real backend:
1. Update `src/utils/api.ts` with your API base URL
2. Remove MSW initialization from `main.tsx`
3. Implement authentication if needed
4. Update API response structures to match your backend

---

## 🌐 Deployment

### Netlify Deployment (Recommended)

1. **Connect Repository**
   - Sign up at [Netlify](https://netlify.com)
   - Click "Add new site" → "Import existing project"
   - Authorize GitHub and select repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variables if needed

3. **Deploy**
   - Netlify automatically deploys on every push to main
   - Get instant preview URLs for pull requests

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

### Environment Variables
Currently, no environment variables are required. For production with real API:
```bash
VITE_API_BASE_URL=https://your-api.com
VITE_API_KEY=your-secret-key
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Follow existing TypeScript patterns
- Use Tailwind CSS for styling
- Add comments for complex logic
- Test locally before submitting PR

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Amit Chhotaray**

- GitHub: [@amitz2004](https://github.com/amitz2004)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/amit-chhotaray-195a131b6/)
- Email: amitchhotaray19@gmail.com

---

## 🙏 Acknowledgments

- [Lucide Icons](https://lucide.dev) - Beautiful icon library
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [React Query](https://tanstack.com/query) - Powerful data fetching
- [MSW](https://mswjs.io) - Seamless API mocking
- [Netlify](https://netlify.com) - Deployment platform

---

## 📈 Future Enhancements

- [ ] Email notifications for assessment assignments
- [ ] Calendar view for interview scheduling
- [ ] Advanced analytics and reporting
- [ ] Export data to CSV/PDF
- [ ] Team collaboration features
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Real-time collaboration with WebSockets

---

<div align="center">
  <strong>⭐ Star this repository if you find it helpful!</strong>
  <br><br>
  Made with ❤️ by Amit Chhotaray
</div>
