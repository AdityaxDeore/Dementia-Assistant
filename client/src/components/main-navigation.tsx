import React, { useMemo } from 'react';
import { InteractiveMenu, InteractiveMenuItem } from '@/components/ui/interactive-menu';

interface MainNavigationProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

// Custom icon components using Flaticon classes
const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fi fi-rr-home ${className}`} />
);

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fi fi-rr-users-alt ${className}`} />
);

const AppsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fi fi-rr-apps ${className}`} />
);

const CreativeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fi fi-brands-illustrator ${className}`} />
);

const GamepadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fi fi-rr-gamepad ${className}`} />
);

const navigationItems: InteractiveMenuItem[] = [
  { label: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { label: 'Community', icon: UsersIcon, path: '/peer-support' },
  { label: 'Resources', icon: AppsIcon, path: '/resources' },
  { label: 'Creative', icon: CreativeIcon, path: '/creative' },
  { label: 'Games', icon: GamepadIcon, path: '/petcare-game' },
];

export const MainNavigation: React.FC<MainNavigationProps> = ({ 
  currentPath = '/dashboard', 
  onNavigate 
}) => {
  // Calculate active index based on current path
  const activeIndex = useMemo(() => {
    const index = navigationItems.findIndex(item => item.path === currentPath);
    return index >= 0 ? index : 0;
  }, [currentPath]);

  const handleItemClick = (item: InteractiveMenuItem, index: number) => {
    if (item.path && onNavigate) {
      onNavigate(item.path);
    } else if (item.path) {
      // Fallback to window.location if no onNavigate handler
      window.location.href = item.path;
    }
  };

  return (
    <InteractiveMenu
      items={navigationItems}
      accentColor="blue"
      onItemClick={handleItemClick}
      initialActiveIndex={activeIndex}
    />
  );
};