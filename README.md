# Clarity 🧠✨

A comprehensive digital mental health platform designed specifically for students. Clarity provides AI-powered wellness support, mood tracking, peer community features, creative expression tools, and crisis intervention resources.

## 🌟 Features

### 🤖 AI Wellness Buddy
- Conversational AI support for mental health guidance
- Safe space for expressing thoughts and feelings
- 24/7 availability for immediate support

### 📊 Mood & Wellness Tracking
- Daily mood logging with visual progress tracking
- Streak tracking to build healthy habits
- Comprehensive wellness dashboard

### 🎯 Goal Management
- Personal goal setting with progress tracking
- Subtask management and achievement celebrations
- Motivational milestone tracking

### 👥 Peer Support Community
- Anonymous peer support forum
- Safe sharing environment with moderation
- Connect with others facing similar challenges

### 🎨 Creative Expression Zone
- Digital art canvas for therapeutic expression
- Creative writing tools and prompts
- Art therapy and mindfulness activities

### 🚨 Crisis Support
- Emergency resources and immediate help contacts
- Quick access to crisis hotlines
- Safety planning tools

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** + **Shadcn/UI** components
- **Framer Motion** for smooth animations
- **TanStack Query** for data management
- **Vite** for fast development

### Backend
- **Node.js** + **Express** server
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **Express Sessions** for authentication
- **WebSocket** for real-time features

### Database
- **PostgreSQL** (production)
- **SQLite** (local development)
- **Neon Database** (cloud hosting)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Clarity.git
   cd Clarity
   ```

2. **Quick Setup (Recommended)**
   ```bash
   # Linux/Mac
   chmod +x setup.sh && ./setup.sh
   
   # Windows
   setup.bat
   
   # Or manually:
   npm run setup
   ```

3. **Manual Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Create environment file
   cp .env.example .env    # Linux/Mac
   copy .env.example .env  # Windows
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5000`

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

### Troubleshooting

**Error: "DATABASE_URL must be set"**
- Make sure you've copied `.env.example` to `.env`
- Check that the `.env` file contains `DATABASE_URL=sqlite:./local.db`

**Error: "Cannot find module dist/index.js"**
- Run `npm run build` before `npm start`
- Use `npm run dev` for development instead

**App not loading on other devices:**
- Ensure all dependencies are installed: `npm install`
- Make sure the `.env` file exists and is configured properly

## 🏗️ Project Structure

```
Clarity/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and configs
├── server/               # Express backend
│   ├── routes.ts         # API routes
│   ├── db.ts            # Database configuration
│   └── index.ts         # Server entry point
├── shared/               # Shared types and schemas
└── README.md
```

## 🎨 Design Philosophy

### Trauma-Informed Design
- Calming color palettes (sage greens, soft blues)
- Gentle animations and transitions
- Clear, non-overwhelming interfaces
- Consistent visual hierarchy

### Accessibility First
- WCAG 2.1 AA compliance
- Full keyboard navigation
- Screen reader optimization
- High contrast mode support
- Minimum 16px font sizes

### Mobile-First Responsive
- Progressive Web App capabilities
- Touch-friendly interfaces
- Offline functionality (coming soon)
- Cross-platform compatibility

## 🔒 Privacy & Security

- **Data Privacy**: All user data is encrypted and stored securely
- **Anonymous Options**: Many features support anonymous usage
- **Crisis Safety**: Built-in safety nets for crisis situations
- **HIPAA Awareness**: Designed with healthcare privacy principles

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Crisis Resources

If you're in immediate danger or having thoughts of self-harm:

- **Emergency**: Call 911 (US) or your local emergency number
- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention Lifeline**: 988
- **International**: Visit [findahelpline.com](https://findahelpline.com)

## 💬 Support

- 📧 Email: support@clarity-mentalhealth.com
- 💬 Discord: [Join our community](https://discord.gg/clarity)
- 📚 Documentation: [docs.clarity-mentalhealth.com](https://docs.clarity-mentalhealth.com)

---

**Built with ❤️ for student mental health and wellbeing**