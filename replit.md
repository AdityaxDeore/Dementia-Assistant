# Student Mental Health Platform (MindWell)

## Overview

MindWell is a comprehensive digital mental health platform designed specifically for students. The platform provides AI-powered wellness support, mood tracking, peer community features, creative expression tools, and crisis intervention resources. Built with accessibility and trauma-informed design principles at its core, MindWell creates a safe, supportive environment for students to manage their mental health and wellbeing.

The application follows a modern full-stack architecture with React frontend, Node.js/Express backend, and PostgreSQL database, all designed to scale and provide a seamless user experience across devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **UI Framework**: Shadcn/ui components built on Radix UI primitives, providing accessible and customizable interface elements
- **Styling**: Tailwind CSS with custom design system optimized for mental health applications
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Custom trauma-informed design with calming color palettes (sage greens, soft blues) and accessibility-first approach

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **API Design**: RESTful API with /api prefix for clear separation from frontend routes
- **Error Handling**: Centralized error middleware with proper status codes and user-friendly messages

### Database & ORM
- **Database**: PostgreSQL for robust data persistence and ACID compliance
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema Management**: Drizzle Kit for migrations and database schema evolution
- **Connection**: Neon serverless PostgreSQL for cloud-native deployment

### Component Architecture
The application is organized into specialized feature components:
- **AI Chat**: Simulated AI wellness buddy for conversational support
- **Mood Tracking**: Daily mood logging with streak tracking and progress visualization
- **Goal Management**: Personal goal setting with progress tracking and subtask management
- **Peer Support**: Community forum with anonymous posting and moderation features
- **Creative Expression**: Digital art canvas and writing tools for therapeutic expression
- **Crisis Support**: Emergency resources and immediate help contacts
- **Wellness Dashboard**: Comprehensive overview of user progress and achievements

### Accessibility & Design Principles
- **Trauma-Informed Design**: Avoids jarring animations, harsh colors, and overwhelming interfaces
- **WCAG Compliance**: Full keyboard navigation, screen reader support, and high contrast options
- **Responsive Design**: Mobile-first approach with adaptive layouts for all device sizes
- **Theme Support**: Light/dark mode switching with user preference persistence
- **Font Accessibility**: Inter and Poppins fonts chosen for readability, minimum 16px body text

### Development & Build System
- **Build Tool**: Vite for fast development and optimized production builds
- **Development**: Hot module replacement and runtime error overlay for efficient debugging
- **Code Quality**: TypeScript strict mode for compile-time error prevention
- **Asset Management**: Organized asset structure with proper aliasing for imports

## External Dependencies

### UI & Component Libraries
- **Radix UI**: Comprehensive collection of accessible, unstyled UI primitives including dialogs, dropdowns, navigation, and form controls
- **Lucide React**: Modern icon library providing consistent iconography throughout the application
- **Class Variance Authority (CVA)**: Type-safe utility for creating component variants and styling consistency

### Data & State Management
- **TanStack Query**: Powerful data synchronization library for server state management, caching, and background updates
- **React Hook Form**: Performant form library with minimal re-renders and comprehensive validation support
- **Hookform Resolvers**: Integration layer connecting React Hook Form with various validation schemas

### Database & Backend
- **Neon Database**: Serverless PostgreSQL provider offering scalable, cloud-native database hosting
- **Drizzle ORM**: Type-safe ORM with excellent TypeScript integration and migration support
- **Drizzle Zod**: Schema validation integration between Drizzle and Zod for runtime type safety

### Development & Tooling
- **Replit Integration**: Custom Vite plugins for Replit-specific features including error overlays and development banners
- **PostCSS & Autoprefixer**: CSS processing pipeline for vendor prefixing and optimization
- **ESBuild**: Fast bundler for server-side code compilation

### Utility Libraries
- **Date-fns**: Comprehensive date manipulation library for temporal data handling
- **clsx & tailwind-merge**: Utility libraries for conditional CSS class composition and Tailwind class merging
- **Nanoid**: Secure, URL-safe unique identifier generation

The platform is designed to be easily extensible with additional mental health features while maintaining its core focus on accessibility, safety, and user wellbeing. The architecture supports future integrations with real AI services, expanded crisis support networks, and enhanced peer community features.