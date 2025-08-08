import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

// Mock the LoadingSpinner component
jest.mock('../../ui/LoadingSpinner', () => {
  return function MockLoadingSpinner({ size, variant, className }: any) {
    return (
      <div 
        data-testid="loading-spinner" 
        data-size={size}
        data-variant={variant}
        className={className}
      >
        Loading...
      </div>
    );
  };
});

// Mock the animation utilities
jest.mock('../../../utils/animations', () => ({
  combineAnimationClasses: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

describe('Button Component', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-white', 'text-black');
    });

    it('renders with custom className', () => {
      render(<Button className="custom-class">Test</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Test</Button>);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Variants', () => {
    it('renders primary variant correctly', () => {
      render(<Button variant="primary">Primary</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-white', 'text-black', 'border-white');
    });

    it('renders secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent', 'text-white', 'border-white');
    });

    it('renders ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent', 'text-white', 'border-transparent');
    });

    it('renders danger variant correctly', () => {
      render(<Button variant="danger">Danger</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600', 'text-white', 'border-red-600');
    });
  });

  describe('Sizes', () => {
    it('renders small size correctly', () => {
      render(<Button size="sm">Small</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm', 'min-h-[32px]');
    });

    it('renders medium size correctly (default)', () => {
      render(<Button size="md">Medium</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base', 'min-h-[40px]');
    });

    it('renders large size correctly', () => {
      render(<Button size="lg">Large</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg', 'min-h-[48px]');
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading is true', () => {
      render(<Button isLoading>Loading Button</Button>);
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading Button')).toHaveClass('opacity-70');
    });

    it('shows custom loading text when provided', () => {
      render(
        <Button isLoading loadingText="Please wait...">
          Submit
        </Button>
      );
      
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
      expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    });

    it('disables button when loading', () => {
      render(<Button isLoading>Loading</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('hides icons when loading', () => {
      render(
        <Button isLoading icon={<span data-testid="icon">Icon</span>}>
          Loading
        </Button>
      );
      
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('shows screen reader loading text', () => {
      render(<Button isLoading>Loading</Button>);
      
      expect(screen.getByText('Loading...', { selector: '.sr-only' })).toBeInTheDocument();
    });

    it('shows custom screen reader loading text', () => {
      render(<Button isLoading loadingText="Submitting form">Submit</Button>);
      
      expect(screen.getByText('Submitting form', { selector: '.sr-only' })).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;

    it('renders left icon by default', () => {
      render(<Button icon={<TestIcon />}>With Icon</Button>);
      
      const button = screen.getByRole('button');
      const icon = screen.getByTestId('test-icon');
      const text = screen.getByText('With Icon');
      
      expect(icon).toBeInTheDocument();
      expect(button.firstChild).toContain(icon);
    });

    it('renders right icon when specified', () => {
      render(
        <Button icon={<TestIcon />} iconPosition="right">
          With Icon
        </Button>
      );
      
      const button = screen.getByRole('button');
      const icon = screen.getByTestId('test-icon');
      
      expect(icon).toBeInTheDocument();
      expect(button.lastChild).toContain(icon);
    });

    it('does not render icon when loading', () => {
      render(
        <Button icon={<TestIcon />} isLoading>
          Loading
        </Button>
      );
      
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });
  });

  describe('Full Width', () => {
    it('applies full width class when fullWidth is true', () => {
      render(<Button fullWidth>Full Width</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('does not apply full width class by default', () => {
      render(<Button>Normal Width</Button>);
      
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50');
    });

    it('disables button when loading', () => {
      render(<Button isLoading>Loading</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} isLoading>Loading</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles mouse events for pressed state', () => {
      render(<Button>Press me</Button>);
      
      const button = screen.getByRole('button');
      
      fireEvent.mouseDown(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      
      fireEvent.mouseUp(button);
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('resets pressed state on mouse leave', () => {
      render(<Button>Press me</Button>);
      
      const button = screen.getByRole('button');
      
      fireEvent.mouseDown(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      
      fireEvent.mouseLeave(button);
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Button>Accessible Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('has proper ARIA attributes when loading', () => {
      render(<Button isLoading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('supports keyboard navigation', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Keyboard Button</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('has focus-glow class for focus styling', () => {
      render(<Button>Focus me</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-glow');
    });
  });

  describe('Data Attributes', () => {
    it('sets data attributes correctly', () => {
      render(
        <Button variant="secondary" size="lg" isLoading>
          Test
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-loading', 'true');
      expect(button).toHaveAttribute('data-variant', 'secondary');
      expect(button).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Animation Classes', () => {
    it('includes animation classes', () => {
      render(<Button>Animated Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover-lift', 'active-scale', 'click-ripple');
    });

    it('includes transition classes', () => {
      render(<Button>Transition Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-all');
    });
  });

  describe('Loading Spinner Props', () => {
    it('passes correct size to loading spinner for small button', () => {
      render(<Button size="sm" isLoading>Small Loading</Button>);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveAttribute('data-size', 'sm');
    });

    it('passes correct size to loading spinner for medium button', () => {
      render(<Button size="md" isLoading>Medium Loading</Button>);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveAttribute('data-size', 'sm');
    });

    it('passes correct size to loading spinner for large button', () => {
      render(<Button size="lg" isLoading>Large Loading</Button>);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveAttribute('data-size', 'md');
    });
  });
});