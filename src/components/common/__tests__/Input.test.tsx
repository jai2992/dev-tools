import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

// Mock the animation utilities
jest.mock('../../../utils/animations', () => ({
  combineAnimationClasses: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

describe('Input Component', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('bg-[var(--color-dark-gray)]');
    });

    it('renders with label', () => {
      render(<Input label="Email Address" />);
      
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Email Address')).toHaveClass('text-sm', 'font-medium');
    });

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter your email" />);
      
      const input = screen.getByPlaceholderText('Enter your email');
      expect(input).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Variants', () => {
    it('renders default variant correctly', () => {
      render(<Input variant="default" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-[var(--color-dark-gray)]', 'border-white', 'border-opacity-20');
    });

    it('renders filled variant correctly', () => {
      render(<Input variant="filled" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-[var(--color-medium-gray)]', 'border-transparent');
    });

    it('renders outlined variant correctly', () => {
      render(<Input variant="outlined" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-transparent', 'border-white', 'border-opacity-30');
    });
  });

  describe('Sizes', () => {
    it('renders small size correctly', () => {
      render(<Input size="sm" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-3', 'py-2', 'text-sm', 'min-h-[36px]');
    });

    it('renders medium size correctly (default)', () => {
      render(<Input size="md" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-4', 'py-3', 'text-base', 'min-h-[44px]');
    });

    it('renders large size correctly', () => {
      render(<Input size="lg" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-5', 'py-4', 'text-lg', 'min-h-[52px]');
    });
  });

  describe('Error States', () => {
    it('displays error message', () => {
      render(<Input error="This field is required" />);
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByText('This field is required')).toHaveClass('text-[var(--color-error)]');
    });

    it('applies error styling to input', () => {
      render(<Input error="Error message" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('applies error styling to label', () => {
      render(<Input label="Email" error="Invalid email" />);
      
      const label = screen.getByText('Email');
      expect(label).toHaveClass('text-[var(--color-error)]');
    });

    it('links error message with input via aria-describedby', () => {
      render(<Input error="Error message" />);
      
      const input = screen.getByRole('textbox');
      const errorMessage = screen.getByText('Error message');
      
      expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('error'));
      expect(errorMessage).toHaveAttribute('id', expect.stringContaining('error'));
    });
  });

  describe('Helper Text', () => {
    it('displays helper text when no error', () => {
      render(<Input helperText="Enter a valid email address" />);
      
      expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
      expect(screen.getByText('Enter a valid email address')).toHaveClass('text-xs');
    });

    it('hides helper text when error is present', () => {
      render(<Input helperText="Helper text" error="Error message" />);
      
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('links helper text with input via aria-describedby', () => {
      render(<Input helperText="Helper text" />);
      
      const input = screen.getByRole('textbox');
      const helperText = screen.getByText('Helper text');
      
      expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('helper'));
      expect(helperText).toHaveAttribute('id', expect.stringContaining('helper'));
    });
  });

  describe('Icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;

    it('renders left icon', () => {
      render(<Input leftIcon={<TestIcon />} />);
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('renders right icon', () => {
      render(<Input rightIcon={<TestIcon />} />);
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('adjusts padding when left icon is present', () => {
      render(<Input leftIcon={<TestIcon />} size="md" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-10');
    });

    it('adjusts padding when right icon is present', () => {
      render(<Input rightIcon={<TestIcon />} size="md" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-10');
    });

    it('adjusts icon size based on input size', () => {
      const { rerender } = render(<Input leftIcon={<TestIcon />} size="sm" />);
      let iconContainer = screen.getByTestId('test-icon').parentElement;
      expect(iconContainer).toHaveClass('w-4', 'h-4');

      rerender(<Input leftIcon={<TestIcon />} size="lg" />);
      iconContainer = screen.getByTestId('test-icon').parentElement;
      expect(iconContainer).toHaveClass('w-6', 'h-6');
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading is true', () => {
      render(<Input isLoading />);
      
      const spinner = screen.getByRole('textbox').parentElement?.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('disables input when loading', () => {
      render(<Input isLoading />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('hides right icon when loading', () => {
      const TestIcon = () => <span data-testid="test-icon">Icon</span>;
      render(<Input rightIcon={<TestIcon />} isLoading />);
      
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
      expect(screen.getByRole('textbox').parentElement?.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  describe('Focus States', () => {
    it('applies focus classes on focus', async () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      expect(input).toHaveFocus();
      expect(input).toHaveClass('focus-glow');
    });

    it('updates label color on focus', async () => {
      render(<Input label="Email" />);
      
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Email');
      
      await user.click(input);
      expect(label).toHaveClass('text-[var(--color-text-primary)]');
    });

    it('calls onFocus and onBlur handlers', async () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      
      render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
      
      const input = screen.getByRole('textbox');
      
      await user.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Value Handling', () => {
    it('handles controlled input', async () => {
      const handleChange = jest.fn();
      render(<Input value="test" onChange={handleChange} />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('test');
      
      await user.type(input, 'ing');
      expect(handleChange).toHaveBeenCalled();
    });

    it('handles uncontrolled input', async () => {
      render(<Input defaultValue="default" />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('default');
      
      await user.clear(input);
      await user.type(input, 'new value');
      expect(input.value).toBe('new value');
    });

    it('tracks value state for styling', async () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      
      // Component should track that it has a value
      expect(input).toHaveValue('test');
    });
  });

  describe('Disabled State', () => {
    it('disables input when disabled prop is true', () => {
      render(<Input disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('disabled:opacity-50');
    });

    it('prevents interaction when disabled', async () => {
      const handleChange = jest.fn();
      render(<Input disabled onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Full Width', () => {
    it('applies full width by default', () => {
      render(<Input />);
      
      const container = screen.getByRole('textbox').closest('.relative');
      expect(container).toHaveClass('w-full');
    });

    it('can disable full width', () => {
      render(<Input fullWidth={false} />);
      
      const container = screen.getByRole('textbox').closest('.relative');
      expect(container).not.toHaveClass('w-full');
    });
  });

  describe('Accessibility', () => {
    it('generates unique IDs', () => {
      render(
        <div>
          <Input label="First" />
          <Input label="Second" />
        </div>
      );
      
      const inputs = screen.getAllByRole('textbox');
      expect(inputs[0].id).not.toBe(inputs[1].id);
    });

    it('uses provided ID', () => {
      render(<Input id="custom-id" label="Custom" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'custom-id');
      expect(screen.getByLabelText('Custom')).toBe(input);
    });

    it('has proper ARIA attributes', () => {
      render(<Input label="Email" error="Invalid" helperText="Helper" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('error'));
    });
  });

  describe('Animation Classes', () => {
    it('includes transition classes', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('transition-all', 'duration-200', 'ease-out');
    });

    it('includes focus animation classes', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus-glow');
    });

    it('applies error animation to container', () => {
      render(<Input error="Error message" />);
      
      const container = screen.getByRole('textbox').closest('.relative');
      expect(container).toHaveClass('form-field-error');
    });
  });

  describe('Modern Design System Integration', () => {
    it('applies white border glow on focus for default variant', async () => {
      render(<Input variant="default" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:border-white', 'focus:shadow-glow', 'focus:ring-white');
    });

    it('applies correct background colors', () => {
      const { rerender } = render(<Input variant="default" />);
      let input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-[var(--color-dark-gray)]');

      rerender(<Input variant="filled" />);
      input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-[var(--color-medium-gray)]');

      rerender(<Input variant="outlined" />);
      input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-transparent');
    });

    it('applies error states with red accent', () => {
      render(<Input error="Error" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500', 'focus:ring-red-500');
    });
  });
});