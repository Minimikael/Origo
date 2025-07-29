# 🚀 Origo - AI-Powered Document Editor

A modern, collaborative document editor with AI-powered features, built with React, Supabase, and real-time collaboration.

## ✨ Features

- **📝 Rich Text Editing**: Advanced document editing with React Quill
- **🤖 AI Integration**: OpenAI-powered analysis and suggestions
- **👥 Real-time Collaboration**: Live document collaboration with Supabase
- **🎨 Design System**: Consistent UI components and styling
- **🔐 Authentication**: Secure user authentication with Supabase Auth
- **📁 Project Organization**: Workspaces, projects, and document management
- **🔄 Version Control**: Document versioning and history
- **📱 Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Quill** - Rich text editor
- **Lucide React** - Beautiful icons

### Backend
- **Supabase** - PostgreSQL database with real-time
- **Supabase Auth** - Authentication and user management
- **Row Level Security** - Database security policies
- **Real-time Subscriptions** - Live collaboration

### AI & Services
- **OpenAI API** - AI-powered document analysis
- **Socket.io** - Real-time communication
- **Firebase** - Legacy authentication (migrating to Supabase)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/origo.git
   cd origo/kappish/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your credentials
   ```

4. **Set up Supabase**
   - Create a Supabase project
   - Run the schema from `supabase/schema.sql`
   - Update environment variables

5. **Start development server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
origo/
├── kappish/
│   ├── frontend/                 # React application
│   │   ├── src/
│   │   │   ├── components/       # React components
│   │   │   │   ├── ui/          # Design system components
│   │   │   │   ├── layout/      # Layout components
│   │   │   │   ├── common/      # Shared components
│   │   │   │   └── forms/       # Form components
│   │   │   ├── pages/           # Page components
│   │   │   ├── context/         # React context providers
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── services/        # API services
│   │   │   ├── utils/           # Utility functions
│   │   │   ├── config/          # Configuration files
│   │   │   └── styles/          # CSS and styling
│   │   ├── public/              # Static assets
│   │   └── package.json         # Frontend dependencies
│   ├── backend/                 # Express.js server
│   ├── supabase/                # Database schema
│   └── docs/                    # Documentation
├── README.md
└── .gitignore
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Firebase Configuration (legacy)
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id

# API Configuration
REACT_APP_API_URL=http://localhost:5000

# AI Configuration
REACT_APP_OPENAI_API_KEY=your-openai-api-key
```

### Supabase Setup

1. Create a new Supabase project
2. Run the schema from `supabase/schema.sql`
3. Configure authentication providers
4. Set up Row Level Security policies

## 🎨 Design System

The project includes a comprehensive design system with:

- **Color Palette**: Semantic colors with brand themes
- **Typography**: Consistent font hierarchy
- **Components**: Reusable UI components
- **Spacing**: Consistent spacing system
- **Responsive**: Mobile-first design

Visit `/design-system` to see the component showcase.

## 🔐 Security

- **Row Level Security**: Database-level access control
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API rate limiting
- **Environment Variables**: Secure credential management

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 📦 Scripts

```bash
# Development
npm start          # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # Run ESLint

# Supabase
npm run supabase:start    # Start Supabase locally
npm run supabase:stop     # Stop Supabase
npm run supabase:reset    # Reset local database
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Use conventional commits

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the build folder
```

### Backend (Railway/Render)
```bash
# Set environment variables
npm install
npm start
```

## 📚 Documentation

- [Design System Guide](./DESIGN_SYSTEM.md)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Development Guidelines](./DEVELOPMENT.md)
- [API Documentation](./docs/API.md)

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   PORT=3001 npm start
   ```

2. **Supabase connection errors**
   - Check environment variables
   - Verify Supabase project settings
   - Test connection at `/supabase-test`

3. **Build errors**
   ```bash
   npm run build
   # Check for missing dependencies
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [TailwindCSS](https://tailwindcss.com) for the utility-first CSS
- [React Quill](https://github.com/zenoamaro/react-quill) for the rich text editor
- [Lucide](https://lucide.dev) for the beautiful icons

---

**🎯 Built with ❤️ for modern document collaboration** 