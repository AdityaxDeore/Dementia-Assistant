# Student Mental Health Platform - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from wellness and healthcare apps like Headspace, Calm, and Betterhelp, combined with accessibility-focused platforms. The design prioritizes emotional safety, trust, and inclusivity over trendy aesthetics.

## Core Design Principles
- **Trauma-Informed Design**: Avoid sudden animations, jarring colors, or overwhelming interfaces
- **Emotional Safety**: Create a calming, non-judgmental visual environment
- **Accessibility First**: Support diverse neurotypes and physical abilities
- **Crisis-Aware UX**: Ensure emergency features are always accessible

## Color Palette

### Primary Colors (Light Mode)
- **Primary**: 210 15% 25% (Calming dark blue-gray)
- **Secondary**: 150 25% 45% (Soft sage green)
- **Background**: 210 20% 98% (Warm off-white)

### Primary Colors (Dark Mode)
- **Primary**: 210 20% 85% (Light blue-gray)
- **Secondary**: 150 30% 70% (Soft mint green)
- **Background**: 210 15% 8% (Deep blue-black)

### Accent Colors
- **Success/Wellness**: 140 40% 55% (Gentle green)
- **Warning/Caution**: 25 60% 60% (Warm orange, not harsh)
- **Crisis/Emergency**: 0 50% 55% (Muted red, not alarming)

### Gradients
- **Hero sections**: Subtle gradients from primary to secondary (210 15% 25% to 150 25% 45%)
- **Card backgrounds**: Very subtle gradients within the same hue family
- **Wellness tracking**: Gentle gradients representing progress (greens to blues)

## Typography
- **Primary Font**: Inter (Google Fonts) - excellent readability and accessibility
- **Secondary Font**: Poppins (Google Fonts) - friendly, approachable headings
- **Font Sizes**: Generous sizing with minimum 16px body text for accessibility

## Layout System
**Tailwind Spacing Units**: Consistent use of 4, 6, 8, 12, 16 for harmonious spacing
- Small elements: p-4, m-6
- Medium elements: p-8, m-12
- Large sections: p-16, m-16

## Component Library

### Navigation
- **Header**: Persistent top navigation with SOS button always visible
- **Bottom Tab Bar**: Mobile-first with wellness dashboard, chat, resources, forum
- **Sidebar**: Desktop navigation with clear categorization

### Forms & Interactions
- **Input Fields**: Rounded corners, soft shadows, clear focus states
- **Buttons**: Gentle rounded corners, no harsh shadows
- **Cards**: Subtle elevation, warm background tints

### Data Displays
- **Mood Tracking**: Soft circular progress indicators
- **Wellness Streaks**: Gentle badge system with nature-inspired icons
- **Charts**: Curved lines, soft colors, no sharp edges

### Crisis & Safety Features
- **SOS Button**: Always visible, distinct but not alarming red
- **Anonymous Reporting**: Secure, private visual indicators
- **Crisis Resources**: Clearly marked with warm, trustworthy styling

## Accessibility Features
- **Font Scaling**: Support 100%-200% scaling
- **High Contrast Mode**: Enhanced contrast ratios for visual impairments
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Independence**: Never rely solely on color for information

## Images
No large hero images recommended. Instead, use:
- **Micro-illustrations**: Small, friendly icons for features
- **Abstract patterns**: Subtle background textures for cards
- **Wellness imagery**: Small, diverse representations of students
- **Nature elements**: Subtle plant/organic shapes for visual breathing room

## Animations
**Minimal and Purposeful Only**:
- Gentle fade-ins for new content
- Smooth transitions between states (mood logging, page changes)
- **No**: Bounce effects, sudden movements, or attention-grabbing animations

## Special Considerations
- **Crisis Mode**: When SOS is activated, UI shifts to high-contrast, simplified layout
- **Anonymous Modes**: Visual indicators that ensure privacy
- **Gamification**: Subtle, supportive rewards that don't feel childish
- **Peer Support**: Warm, community-focused visual language
- **Cultural Sensitivity**: Avoid region-specific imagery, use inclusive representations

This design framework ensures the platform feels safe, accessible, and supportive for students experiencing mental health challenges while maintaining professional credibility.