# Dementia Assistant 🧠💙

A comprehensive digital dementia care platform designed to support patients, caregivers, and families. Dementia Assistant provides AI-powered cognitive support, memory aids, daily routine management, caregiver resources, and emergency assistance tools.

## 🌟 Features

### 🤖 AI Cognitive Support
- Conversational AI designed for dementia patients and caregivers
- Memory prompts and cognitive stimulation activities
- 24/7 availability for immediate guidance and support

### 📊 Cognitive & Daily Tracking
- Daily cognitive assessment and memory exercises
- Routine tracking to maintain familiar patterns
- Progress monitoring for caregivers and healthcare providers

### 🎯 Daily Routine Management
- Structured daily schedules and reminders
- Medication tracking and appointment management
- Familiar activity suggestions and prompts

### 👥 Caregiver Support Community
- Support network for dementia caregivers and families
- Resource sharing and experience exchange
- Connect with others on similar caregiving journeys

### 🧩 Memory Stimulation Activities
- Cognitive games and memory exercises
- Photo albums and reminiscence therapy tools
- Music therapy and familiar content engagement

### 🚨 Emergency Assistance
- Wandering alerts and GPS tracking features
- Emergency contact system for caregivers
- Crisis intervention and immediate help resources

## 🛠️ Tech Stack

For a **complete and detailed technical documentation** of our entire stack, see **[TECH-STACK.md](./TECH-STACK.md)**.

### Quick Overview

**Frontend:**
- React 18 + TypeScript + Vite
- Tailwind CSS + Shadcn/UI + Radix UI
- TanStack Query + Framer Motion + Wouter

**Backend:**
- Node.js + Express + TypeScript
- Drizzle ORM + PostgreSQL/SQLite
- WebSocket + Express Sessions + Passport.js

**Build & Dev:**
- Vite + ESBuild + PostCSS
- Cross-platform setup scripts
- Hot reload + TypeScript strict mode

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdityaxDeore/Dementia-Assistant.git
   cd Dementia-Assistant
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

## 🌐 GitHub Pages Deployment

If you're experiencing issues with GitHub Pages showing the README file instead of your application, please refer to our [Deployment Guide](DEPLOYMENT.md) for detailed instructions on how to properly configure GitHub Pages.

## 🏗️ Project Structure

```bash
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
=======
# Dementia-Assistant
>>>>>>> 7790b945916c9a3c78086ee2065447e4be14268e
