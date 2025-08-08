import React from 'react';
import { render, screen } from '@testing-library/react';
import ToolCard from '../ToolCard';

// Mock the animation utilities
jest.mock('../../../utils/animations', () => ({
  combineAnimationClasses: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('ToolCard Component', () => {
  const defaultProps = {
    title: 'JSON Formatter',
    description: 'Format and validate JSON data with syntax highlighting and error detection.',
    href: '/json-formatter'
  };

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(<ToolCard {...defaultProps} />);
      
      expect(screen.getByText('JSON Formatter')).toBeInTheDocument();
      expect(screen.getByText('Format and validate JSON data with syntax highlighting and error detection.')).toBeInTheDocument();
      expect(screen.getByText('Try it now')).toBeInTheDocument();
    });

    it('renders as a link with correct href', () => {
      render(<ToolCard {...defaultProps} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/json-formatter');
    });

    it('renders with icon when provided', () => {
      const icon = <span data-testid="tool-icon">🔧</span>;
      
      render(<ToolCard {...defaultProps} icon={icon} />);
      
      expect(screen.getByTestId('tool-icon')).toBeInTheDocument();
    });

    it('renders with category when provided', () => {
      render(<ToolCard {...defaultProps} category="Development" />);
      
      expect(screen.getByText('Development')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ToolCard {...defaultProps} className="custom-class" />);
      
      const article = screen.getByRole('article');
      expect(article).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    it('renders default variant correctly', () => {
      render(<ToolCard {...defaultProps} variant="default" />);
      
      const title = screen.getByText('JSON Formatter');
      expect(title).toHaveClass('text-lg');
    });

    it('renders compact variant correctly', () => {
      render(<ToolCard {...defaultProps} variant="compact" />);
      
      const title = screen.getByText('JSON Formatter');
      expect(title).toHaveClass('text-base');
    });

    it('renders featured variant correctly', () => {
      render(<ToolCard {...defaultProps} variant="featured" />);
      
      const title = screen.getByText('JSON Formatter');
      expect(title).toHaveClass('text-xl');
      
      const article = screen.getByRole('article');
      expect(article).toHaveClass('ring-1', 'ring-[var(--color-text-primary)]/20');
    });

    it('applies correct icon sizes for variants', () => {
      const icon = <span data-testid="tool-icon">🔧</span>;
      
      const { rerender } = render(
        <ToolCard {...defaultProps} icon={icon} variant="default" />
      );
      
      let iconContainer = screen.getByTestId('tool-icon').parentElement;
      expect(iconContainer).toHaveClass('w-12', 'h-12');

      rerender(<ToolCard {...defaultProps} icon={icon} variant="compact" />);
      iconContainer = screen.getByTestId('tool-icon').parentElement;
      expect(iconContainer).toHaveClass('w-10', 'h-10');

      rerender(<ToolCard {...defaultProps} icon={icon} variant="featured" />);
      iconContainer = screen.getByTestId('tool-icon').parentElement;
      expect(iconContainer).toHaveClass('w-16', 'h-16');
    });
  });

  describe('Badges', () => {
    it('renders new badge when isNew is true', () => {
      render(<ToolCard {...defaultProps} isNew />);
      
      const badge = screen.getByText('New');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-green-500/20', 'text-green-400');
    });

    it('renders popular badge when isPopular is true', () => {
      render(<ToolCard {...defaultProps} isPopular />);
      
      const badge = screen.getByText('Popular');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-blue-500/20', 'text-blue-400');
    });

    it('renders featured badge when isFeatured is true', () => {
      render(<ToolCard {...defaultProps} isFeatured />);
      
      const badge = screen.getByText('Featured');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-yellow-500/20', 'text-yellow-400');
    });

    it('renders multiple badges when multiple flags are true', () => {
      render(<ToolCard {...defaultProps} isNew isPopular isFeatured />);
      
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Popular')).toBeInTheDocument();
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('does not render badges when flags are false', () => {
      render(<ToolCard {...defaultProps} />);
      
      expect(screen.queryByText('New')).not.toBeInTheDocument();
      expect(screen.queryByText('Popular')).not.toBeInTheDocument();
      expect(screen.queryByText('Featured')).not.toBeInTheDocument();
    });

    it('positions badges correctly', () => {
      render(<ToolCard {...defaultProps} isNew />);
      
      const badgeContainer = screen.getByText('New').parentElement;
      expect(badgeContainer).toHaveClass('absolute', 'top-3', 'right-3');
    });
  });

  describe('Design System Integration', () => {
    it('applies design system color classes', () => {
      render(<ToolCard {...defaultProps} />);
      
      const article = screen.getByRole('article');
      expect(article).toHaveClass('bg-[var(--color-surface)]', 'border-[var(--color-border)]');
      
      const title = screen.getByText('JSON Formatter');
      expect(title).toHaveClass('text-[var(--color-text-primary)]');
      
      const description = screen.getByText(defaultProps.description);
      expect(description).toHaveClass('text-[var(--color-text-secondary)]');
    });

    it('applies hover state classes', () => {
      render(<ToolCard {...defaultProps} />);
      
      const article = screen.getByRole('article');
      expect(article).toHaveClass('hover:border-[var(--color-text-primary)]', 'hover:shadow-lg');
      
      const title = screen.getByText('JSON Formatter');
      expect(title).toHaveClass('group-hover:text-white');
      
      const description = screen.getByText(defaultProps.description);
      expect(description).toHaveClass('group-hover:text-gray-300');
    });

    it('applies animation classes', () => {
      render(<ToolCard {...defaultProps} />);
      
      const article = screen.getByRole('article');
      expect(article).toHaveClass('animate-fade-in', 'transition-all', 'duration-300');
    });
  });

  describe('Icon Rendering', () => {
    it('renders icon with proper styling', () => {
      const icon = <span data-testid="tool-icon">🔧</span>;
      
      render(<ToolCard {...defaultProps} icon={icon} />);
      
      const iconContainer = screen.getByTestId('tool-icon').parentElement;
      expect(iconContainer).toHaveClass(
        'flex', 'items-center', 'justify-center',
        'bg-[var(--color-background)]', 'rounded-lg',
        'text-[var(--color-text-primary)]',
        'group-hover:scale-110'
      );
    });

    it('does not render icon container when icon is not provided', () => {
      render(<ToolCard {...defaultProps} />);
      
      const article = screen.getByRole('article');
      const iconContainer = article.querySelector('.w-12.h-12');
      expect(iconContainer).not.toBeInTheDocument();
    });
  });

  describe('Category Rendering', () => {
    it('renders category with proper styling', () => {
      render(<ToolCard {...defaultProps} category="Development" />);
      
      const category = screen.getByText('Development');
      expect(category).toHaveClass(
        'inline-flex', 'items-center', 'px-2', 'py-1',
        'rounded-md', 'text-xs', 'font-medium',
        'bg-[var(--color-text-secondary)]/10',
        'text-[var(--color-text-secondary)]'
      );
    });

    it('does not render category when not provided', () => {
      render(<ToolCard {...defaultProps} />);
      
      const article = screen.getByRole('article');
      const categoryContainer = article.querySelector('.mb-3');
      expect(categoryContainer).not.toBeInTheDocument();
    });
  });

  describe('Content Layout', () => {
    it('applies correct text truncation classes', () => {
      const { rerender } = render(
        <ToolCard {...defaultProps} variant="default" />
      );
      
      let description = screen.getByText(defaultProps.description);
      expect(description).toHaveClass('line-clamp-3');

      rerender(<ToolCard {...defaultProps} variant="compact" />);
      description = screen.getByText(defaultProps.description);
      expect(description).toHaveClass('line-clamp-2');

      rerender(<ToolCard {...defaultProps} variant="featured" />);
      description = screen.getByText(defaultProps.description);
      expect(description).toHaveClass('line-clamp-4');
    });

    it('renders footer with proper styling', () => {
      render(<ToolCard {...defaultProps} />);
      
      const tryItNow = screen.getByText('Try it now');
      expect(tryItNow).toHaveClass(
        'text-xs', 'font-medium',
        'text-[var(--color-text-secondary)]',
        'group-hover:text-[var(--color-text-primary)]'
      );
      
      const footer = tryItNow.parentElement;
      expect(footer).toHaveClass(
        'flex', 'items-center', 'justify-between',
        'mt-4', 'pt-4',
        'border-t', 'border-[var(--color-border)]'
      );
    });

    it('renders arrow icon with proper animation classes', () => {
      render(<ToolCard {...defaultProps} />);
      
      const arrow = screen.getByRole('article').querySelector('svg');
      expect(arrow).toBeInTheDocument();
      
      const arrowContainer = arrow?.parentElement;
      expect(arrowContainer).toHaveClass(
        'opacity-0', 'group-hover:opacity-100',
        'transform', 'translate-x-0', 'group-hover:translate-x-1'
      );
    });
  });

  describe('Accessibility', () => {
    it('uses proper semantic HTML', () => {
      render(<ToolCard {...defaultProps} />);
      
      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('provides proper heading hierarchy', () => {
      render(<ToolCard {...defaultProps} />);
      
      const title = screen.getByText('JSON Formatter');
      expect(title.tagName).toBe('H3');
    });

    it('maintains proper focus behavior', () => {
      render(<ToolCard {...defaultProps} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveClass('cursor-pointer');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive padding classes', () => {
      const { rerender } = render(
        <ToolCard {...defaultProps} variant="default" />
      );
      
      let content = screen.getByText('JSON Formatter').closest('.p-6');
      expect(content).toBeInTheDocument();

      rerender(<ToolCard {...defaultProps} variant="compact" />);
      content = screen.getByText('JSON Formatter').closest('.p-4');
      expect(content).toBeInTheDocument();

      rerender(<ToolCard {...defaultProps} variant="featured" />);
      content = screen.getByText('JSON Formatter').closest('.p-8');
      expect(content).toBeInTheDocument();
    });

    it('applies proper border radius and overflow', () => {
      render(<ToolCard {...defaultProps} />);
      
      const article = screen.getByRole('article');
      expect(article).toHaveClass('rounded-xl', 'overflow-hidden');
    });
  });

  describe('Visual Effects', () => {
    it('renders gradient overlay with proper classes', () => {
      render(<ToolCard {...defaultProps} />);
      
      const article = screen.getByRole('article');
      const overlay = article.querySelector('.absolute.inset-0');
      
      expect(overlay).toHaveClass(
        'opacity-0', 'group-hover:opacity-5',
        'bg-gradient-to-br', 'from-white', 'to-transparent',
        'transition-opacity', 'duration-300', 'pointer-events-none'
      );
    });

    it('applies proper shadow and border hover effects', () => {
      render(<ToolCard {...defaultProps} />);
      
      const article = screen.getByRole('article');
      expect(article).toHaveClass(
        'hover:border-[var(--color-text-primary)]',
        'hover:shadow-lg',
        'hover:shadow-black/20'
      );
    });
  });

  describe('Content Flexibility', () => {
    it('handles long titles gracefully', () => {
      const longTitle = 'This is a very long tool title that should wrap properly and maintain good typography';
      
      render(<ToolCard {...defaultProps} title={longTitle} />);
      
      const title = screen.getByText(longTitle);
      expect(title).toHaveClass('leading-tight');
    });

    it('handles long descriptions with line clamping', () => {
      const longDescription = 'This is a very long description that should be truncated properly using line clamping to maintain consistent card heights across the grid layout while still providing enough information for users to understand what the tool does.';
      
      render(<ToolCard {...defaultProps} description={longDescription} />);
      
      const description = screen.getByText(longDescription);
      expect(description).toHaveClass('line-clamp-3');
    });

    it('maintains proper layout with all optional props', () => {
      const icon = <span data-testid="tool-icon">🔧</span>;
      
      render(
        <ToolCard
          {...defaultProps}
          icon={icon}
          category="Development"
          isNew
          isPopular
          isFeatured
          variant="featured"
        />
      );
      
      expect(screen.getByTestId('tool-icon')).toBeInTheDocument();
      expect(screen.getByText('Development')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Popular')).toBeInTheDocument();
      expect(screen.getByText('Featured')).toBeInTheDocument();
      expect(screen.getByText('JSON Formatter')).toBeInTheDocument();
      expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    });
  });
});