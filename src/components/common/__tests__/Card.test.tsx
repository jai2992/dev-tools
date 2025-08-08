import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from '../Card';

// Mock the animation utilities
jest.mock('../../../utils/animations', () => ({
  combineAnimationClasses: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

describe('Card Component', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Card>Card content</Card>);
      
      const card = screen.getByText('Card content');
      expect(card.parentElement).toBeInTheDocument();
      expect(card.parentElement).toHaveClass('bg-[var(--color-dark-gray)]');
    });

    it('renders with custom className', () => {
      render(<Card className="custom-class">Test content</Card>);
      
      const card = screen.getByText('Test content').parentElement;
      expect(card).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Test content</Card>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('renders with custom element type', () => {
      render(<Card as="section">Section content</Card>);
      
      const card = screen.getByText('Section content').parentElement;
      expect(card?.tagName).toBe('SECTION');
    });
  });

  describe('Variants', () => {
    it('renders default variant correctly', () => {
      render(<Card variant="default">Default card</Card>);
      
      const card = screen.getByText('Default card').parentElement;
      expect(card).toHaveClass('bg-[var(--color-dark-gray)]', 'border', 'shadow-md');
    });

    it('renders elevated variant correctly', () => {
      render(<Card variant="elevated">Elevated card</Card>);
      
      const card = screen.getByText('Elevated card').parentElement;
      expect(card).toHaveClass('bg-[var(--color-medium-gray)]', 'shadow-lg');
    });

    it('renders outlined variant correctly', () => {
      render(<Card variant="outlined">Outlined card</Card>);
      
      const card = screen.getByText('Outlined card').parentElement;
      expect(card).toHaveClass('bg-transparent', 'border-2', 'shadow-none');
    });

    it('adds gradient overlay for elevated variant', () => {
      render(<Card variant="elevated">Elevated card</Card>);
      
      const gradientOverlay = screen.getByText('Elevated card').parentElement?.querySelector('.bg-gradient-to-br');
      expect(gradientOverlay).toBeInTheDocument();
      expect(gradientOverlay).toHaveClass('from-white/5', 'to-transparent');
    });
  });

  describe('Padding Options', () => {
    it('renders small padding correctly', () => {
      render(<Card padding="sm">Small padding</Card>);
      
      const card = screen.getByText('Small padding').parentElement;
      expect(card).toHaveClass('p-3', 'sm:p-4', 'rounded-lg');
    });

    it('renders medium padding correctly (default)', () => {
      render(<Card padding="md">Medium padding</Card>);
      
      const card = screen.getByText('Medium padding').parentElement;
      expect(card).toHaveClass('p-4', 'sm:p-6', 'rounded-xl');
    });

    it('renders large padding correctly', () => {
      render(<Card padding="lg">Large padding</Card>);
      
      const card = screen.getByText('Large padding').parentElement;
      expect(card).toHaveClass('p-6', 'sm:p-8', 'rounded-2xl');
    });
  });

  describe('Header Content', () => {
    it('renders title correctly', () => {
      render(
        <Card title="Card Title">
          Card content
        </Card>
      );
      
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Title')).toHaveClass('text-lg', 'font-semibold');
    });

    it('renders subtitle correctly', () => {
      render(
        <Card title="Title" subtitle="Subtitle">
          Card content
        </Card>
      );
      
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toHaveClass('text-sm', 'font-medium');
    });

    it('renders description correctly', () => {
      render(
        <Card title="Title" description="This is a description">
          Card content
        </Card>
      );
      
      expect(screen.getByText('This is a description')).toBeInTheDocument();
      expect(screen.getByText('This is a description')).toHaveClass('text-sm', 'leading-relaxed');
    });

    it('renders actions correctly', () => {
      const actions = <button>Action Button</button>;
      render(
        <Card title="Title" actions={actions}>
          Card content
        </Card>
      );
      
      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    it('adjusts title size based on padding', () => {
      const { rerender } = render(
        <Card title="Title" padding="sm">
          Content
        </Card>
      );
      
      expect(screen.getByText('Title')).toHaveClass('text-base');
      
      rerender(
        <Card title="Title" padding="lg">
          Content
        </Card>
      );
      
      expect(screen.getByText('Title')).toHaveClass('text-xl');
    });

    it('does not render header when no header props provided', () => {
      render(<Card>Just content</Card>);
      
      const card = screen.getByText('Just content').parentElement;
      const headerDiv = card?.querySelector('.flex.justify-between');
      expect(headerDiv).not.toBeInTheDocument();
    });
  });

  describe('Interactive Behavior', () => {
    it('applies interactive classes when interactive is true', () => {
      render(<Card interactive>Interactive card</Card>);
      
      const card = screen.getByText('Interactive card').parentElement;
      expect(card).toHaveClass('focus:outline-none', 'focus-glow', 'cursor-pointer', 'select-none');
      expect(card).toHaveAttribute('tabIndex', '0');
      expect(card).toHaveAttribute('role', 'button');
    });

    it('applies hover classes when hover is true', () => {
      render(<Card hover>Hoverable card</Card>);
      
      const card = screen.getByText('Hoverable card').parentElement;
      expect(card).toHaveClass('hover-lift', 'hover-glow');
    });

    it('applies hover classes when interactive is true', () => {
      render(<Card interactive>Interactive card</Card>);
      
      const card = screen.getByText('Interactive card').parentElement;
      expect(card).toHaveClass('hover-lift', 'hover-glow');
    });

    it('renders interactive state indicator when interactive', () => {
      render(<Card interactive>Interactive card</Card>);
      
      const card = screen.getByText('Interactive card').parentElement;
      const indicator = card?.querySelector('.absolute.inset-0.ring-0');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass('transition-all', 'duration-200');
    });

    it('handles keyboard interaction when interactive', async () => {
      const handleClick = jest.fn();
      render(
        <Card interactive onClick={handleClick}>
          Interactive card
        </Card>
      );
      
      const card = screen.getByText('Interactive card').parentElement;
      card?.focus();
      
      expect(card).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Data Attributes', () => {
    it('sets data attributes correctly', () => {
      render(
        <Card variant="elevated" padding="lg" interactive>
          Test card
        </Card>
      );
      
      const card = screen.getByText('Test card').parentElement;
      expect(card).toHaveAttribute('data-variant', 'elevated');
      expect(card).toHaveAttribute('data-padding', 'lg');
      expect(card).toHaveAttribute('data-interactive', 'true');
    });

    it('sets data-interactive to false when not interactive', () => {
      render(<Card>Non-interactive card</Card>);
      
      const card = screen.getByText('Non-interactive card').parentElement;
      expect(card).toHaveAttribute('data-interactive', 'false');
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes when interactive', () => {
      render(<Card interactive>Accessible card</Card>);
      
      const card = screen.getByText('Accessible card').parentElement;
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('does not have button role when not interactive', () => {
      render(<Card>Regular card</Card>);
      
      const card = screen.getByText('Regular card').parentElement;
      expect(card).not.toHaveAttribute('role');
      expect(card).not.toHaveAttribute('tabIndex');
    });

    it('supports focus management', async () => {
      render(<Card interactive>Focusable card</Card>);
      
      const card = screen.getByText('Focusable card').parentElement;
      
      await user.tab();
      expect(card).toHaveFocus();
    });
  });

  describe('Animation Classes', () => {
    it('includes base animation classes', () => {
      render(<Card>Animated card</Card>);
      
      const card = screen.getByText('Animated card').parentElement;
      expect(card).toHaveClass('transition-all', 'duration-300', 'ease-out');
    });

    it('includes typography classes', () => {
      render(<Card>Typography card</Card>);
      
      const card = screen.getByText('Typography card').parentElement;
      expect(card).toHaveClass('font-family-primary');
    });

    it('includes layout classes', () => {
      render(<Card>Layout card</Card>);
      
      const card = screen.getByText('Layout card').parentElement;
      expect(card).toHaveClass('relative', 'overflow-hidden');
    });
  });

  describe('Content Rendering', () => {
    it('renders complex content correctly', () => {
      const complexContent = (
        <div>
          <p>Paragraph 1</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      );

      render(<Card>{complexContent}</Card>);
      
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('applies correct text color to content', () => {
      render(<Card>Content text</Card>);
      
      const contentDiv = screen.getByText('Content text');
      expect(contentDiv).toHaveClass('text-[var(--color-text-primary)]', 'leading-relaxed');
    });
  });

  describe('Responsive Behavior', () => {
    it('includes responsive padding classes', () => {
      render(<Card padding="md">Responsive card</Card>);
      
      const card = screen.getByText('Responsive card').parentElement;
      expect(card).toHaveClass('p-4', 'sm:p-6');
    });

    it('applies different responsive padding for each size', () => {
      const { rerender } = render(<Card padding="sm">Small</Card>);
      let card = screen.getByText('Small').parentElement;
      expect(card).toHaveClass('p-3', 'sm:p-4');

      rerender(<Card padding="md">Medium</Card>);
      card = screen.getByText('Medium').parentElement;
      expect(card).toHaveClass('p-4', 'sm:p-6');

      rerender(<Card padding="lg">Large</Card>);
      card = screen.getByText('Large').parentElement;
      expect(card).toHaveClass('p-6', 'sm:p-8');
    });
  });

  describe('Hover Effects by Variant', () => {
    it('applies correct hover effects for default variant', () => {
      render(<Card variant="default" hover>Default hover</Card>);
      
      const card = screen.getByText('Default hover').parentElement;
      expect(card?.className).toContain('hover:bg-[var(--color-medium-gray)]');
      expect(card?.className).toContain('hover:shadow-lg');
    });

    it('applies correct hover effects for elevated variant', () => {
      render(<Card variant="elevated" hover>Elevated hover</Card>);
      
      const card = screen.getByText('Elevated hover').parentElement;
      expect(card?.className).toContain('hover:shadow-xl');
      expect(card?.className).toContain('hover:-translate-y-1');
      expect(card?.className).toContain('hover:scale-[1.02]');
    });

    it('applies correct hover effects for outlined variant', () => {
      render(<Card variant="outlined" hover>Outlined hover</Card>);
      
      const card = screen.getByText('Outlined hover').parentElement;
      expect(card?.className).toContain('hover:bg-[var(--color-dark-gray)]');
      expect(card?.className).toContain('hover:border-[var(--color-text-primary)]');
    });
  });
});