import React, { useState, useRef, useEffect, useMemo } from 'react';
import './interactive-menu.css';

type IconComponentType = React.ElementType<{ className?: string }>;

export interface InteractiveMenuItem {
  label: string;
  icon: IconComponentType;
  path?: string;
}

export interface InteractiveMenuProps {
  items?: InteractiveMenuItem[];
  accentColor?: 'blue' | 'purple' | 'green';
  onItemClick?: (item: InteractiveMenuItem, index: number) => void;
  initialActiveIndex?: number;
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

const defaultItems: InteractiveMenuItem[] = [
    { label: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { label: 'Community', icon: UsersIcon, path: '/peer-support' },
    { label: 'Resources', icon: AppsIcon, path: '/resources' },
    { label: 'Creative', icon: CreativeIcon, path: '/creative' },
    { label: 'Games', icon: GamepadIcon, path: '/games' },
];

const defaultAccentColor = 'blue';

const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ 
  items, 
  accentColor, 
  onItemClick,
  initialActiveIndex = 0
}) => {
  const finalItems = useMemo(() => {
     const isValid = items && Array.isArray(items) && items.length >= 2 && items.length <= 5;
     if (!isValid) {
        console.warn("InteractiveMenu: 'items' prop is invalid or missing. Using default items.", items);
        return defaultItems;
     }
     return items;
  }, [items]);

  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  useEffect(() => {
      if (activeIndex >= finalItems.length) {
          setActiveIndex(0);
      }
  }, [finalItems, activeIndex]);

  // Update active index when initialActiveIndex changes (for route changes)
  useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const setLineWidth = () => {
      const activeItemElement = itemRefs.current[activeIndex];
      const activeTextElement = textRefs.current[activeIndex];

      if (activeItemElement && activeTextElement) {
        const textWidth = activeTextElement.offsetWidth;
        activeItemElement.style.setProperty('--lineWidth', `${textWidth}px`);
      }
    };

    setLineWidth();

    window.addEventListener('resize', setLineWidth);
    return () => {
      window.removeEventListener('resize', setLineWidth);
    };
  }, [activeIndex, finalItems]);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    if (onItemClick) {
      onItemClick(finalItems[index], index);
    }
  };

  const accentColorClass = accentColor || defaultAccentColor;

  return (
    <nav
      className="menu"
      role="navigation"
      data-accent-color={accentColorClass}
    >
      {finalItems.map((item, index) => {
        const isActive = index === activeIndex;
        const isTextActive = isActive;

        const IconComponent = item.icon;

        return (
          <button
            key={item.label}
            className={`menu__item ${isActive ? 'active' : ''}`}
            onClick={() => handleItemClick(index)}
            ref={(el) => (itemRefs.current[index] = el)}
          >
            <div className="menu__icon">
              <IconComponent className="icon" />
            </div>
            <strong
              className={`menu__text ${isTextActive ? 'active' : ''}`}
              ref={(el) => (textRefs.current[index] = el)}
            >
              {item.label}
            </strong>
          </button>
        );
      })}
    </nav>
  );
};

export { InteractiveMenu };