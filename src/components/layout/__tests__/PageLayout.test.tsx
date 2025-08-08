import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageLayout from '../PageLayout';

// Mock the animation hooks
jest.mock('../../../hooks/useAnimation', () => ({
  usePageTransition: () => ({
    isEntering: false,
    className: ''
  })
}));

// Mock the animation utilities
jest.mock('../../../utils/animations', () => ({
  combineAnimationClasses: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

describe('PageLayout Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(
        <PageLayout title="Test Page">
          <div>Page content</div>
        </PageLayout>
      );
      
      expect(screen.getByText('Test Page')).toBeInTheDocument();
      expect(screen.getByText('Page content')).toBeInTheDocument();
    });

    it('renders with description', () => {
      render(
        <PageLayout title="Test Page" description="This is a test page">
          <div>Content</div>
        </PageLayout>
      );
      
      expect(screen.getByText('This is a test page')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <PageLayout title="Test" className="custom-class">
          <div>Content</div>
        </PageLayout>
      );
      
      const layout = screen.getByText('Test').closest('.min-h-screen');
      expect(layout).toHaveClass('custom-class');
    });
  });

  describe('Breadcrumbs', () => {
    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'Current Page', isActive: true }
    ];

    it('renders breadcrumbs when provided', () => {
      render(
        <PageLayout title="Test" breadcrumbs={breadcrumbs}>
          <div>Content</div>
        </PageLayout>
      );
      
      expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Tools')).toBeInTheDocument();
      expect(screen.getByText('Current Page')).toBeInTheDocument();
    });

    it('renders breadcrumb links correctly', () => {
      render(
        <PageLayout title="Test" breadcrumbs={breadcrumbs}>
          <div>Content</div>
        </PageLayout>
      );
      
      const homeLink = screen.getByText('Home');
      const toolsLink = screen.getByText('Tools');
      const currentPage = screen.getByText('Current Page');
      
      expect(homeLink.closest('a')).toHaveAttribute('href', '/');
      expect(toolsLink.closest('a')).toHaveAttribute('href', '/tools');
      expect(currentPage.closest('a')).toBeNull(); // Active item should not be a link
    });

    it('marks active breadcrumb with aria-current', () => {
      render(
        <PageLayout title="Test" breadcrumbs={breadcrumbs}>
          <div>Content</div>
        </PageLayout>
      );
      
      const currentPage = screen.getByText('Current Page');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
    });

    it('does not render breadcrumbs when not provided', () => {
      render(
        <PageLayout title="Test">
          <div>Content</div>
        </PageLayout>
      );
      
      expect(screen.queryByLabelText('Breadcrumb')).not.toBeInTheDocument();
    });
  });

  describe('Page Actions', () => {
    it('renders page actions when provided', () => {
      const actions = (
        <div>
          <button>Action 1</button>
          <button>Action 2</button>
        </div>
      );

      render(
        <PageLayout title="Test" actions={actions}>
          <div>Content</div>
        </PageLayout>
      );
      
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });

    it('does not render actions section when not provided', () => {
      render(
        <PageLayout title="Test">
          <div>Content</div>
        </PageLayout>
      );
      
      // Actions should not be present
      const header = screen.getByText('Test').closest('header');
      const actionsDiv = header?.querySelector('.flex-shrink-0');
      expect(actionsDiv).not.toBeInTheDocument();
    });
  });

  describe('Max Width', () => {
    it('applies correct max width classes', () => {
      const { rerender } = render(
        <PageLayout title="Test" maxWidth="sm">
          <div>Content</div>
        </PageLayout>
      );
      
      let container = screen.getByText('Test').closest('.mx-auto');
      expect(container).toHaveClass('max-w-sm');

      rerender(
        <PageLayout title="Test" maxWidth="2xl">
          <div>Content</div>
        </PageLayout>
      );
      
      container = screen.getByText('Test').closest('.mx-auto');
      expect(container).toHaveClass('max-w-7xl');

      rerender(
        <PageLayout title="Test" maxWidth="full">
          <div>Content</div>
        </PageLayout>
      );
      
      container = screen.getByText('Test').closest('.mx-auto');
      expect(container).toHaveClass('max-w-full');
    });
  });

  describe('Scroll to Top', () => {
    beforeEach(() => {
      // Mock scrollTo
      window.scrollTo = jest.fn();
    });

    it('shows scroll to top button when scrolled down', async () => {
      render(
        <PageLayout title="Test">
          <div>Content</div>
        </PageLayout>
      );
      
      // Initially button should not be visible
      const scrollButton = screen.getByLabelText('Scroll to top');
      expect(scrollButton).toHaveClass('opacity-0');

      // Simulate scroll
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
      fireEvent.scroll(window);

      await waitFor(() => {
        expect(scrollButton).toHaveClass('opacity-100');
      });
    });

    it('scrolls to top when button is clicked', async () => {
      render(
        <PageLayout title="Test">
          <div>Content</div>
        </PageLayout>
      );
      
      // Simulate being scrolled down
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
      fireEvent.scroll(window);

      await waitFor(() => {
        const scrollButton = screen.getByLabelText('Scroll to top');
        expect(scrollButton).toHaveClass('opacity-100');
      });

      const scrollButton = screen.getByLabelText('Scroll to top');
      await user.click(scrollButton);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth'
      });
    });

    it('can disable scroll to top functionality', () => {
      render(
        <PageLayout title="Test" showScrollToTop={false}>
          <div>Content</div>
        </PageLayout>
      );
      
      expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive padding classes', () => {
      render(
        <PageLayout title="Test">
          <div>Content</div>
        </PageLayout>
      );
      
      const container = screen.getByText('Test').closest('.mx-auto');
      expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
      expect(container).toHaveClass('py-6', 'sm:py-8', 'lg:py-12');
    });

    it('applies responsive typography classes', () => {
      render(
        <PageLayout title="Test Title">
          <div>Content</div>
        </PageLayout>
      );
      
      const title = screen.getByText('Test Title');
      expect(title).toHaveClass('text-3xl', 'sm:text-4xl', 'lg:text-5xl');
    });

    it('applies responsive layout classes for header', () => {
      const actions = <button>Action</button>;
      
      render(
        <PageLayout title="Test" actions={actions}>
          <div>Content</div>
        </PageLayout>
      );
      
      const headerContent = screen.getByText('Test').closest('.flex');
      expect(headerContent).toHaveClass('flex-col', 'sm:flex-row', 'sm:items-start', 'sm:justify-between');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      render(
        <PageLayout title="Test">
          <div>Content</div>
        </PageLayout>
      );
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument(); // header element
    });

    it('has proper heading hierarchy', () => {
      render(
        <PageLayout title="Test Page">
          <div>Content</div>
        </PageLayout>
      );
      
      const title = screen.getByText('Test Page');
      expect(title.tagName).toBe('H1');
    });

    it('provides proper aria-label for scroll button', () => {
      render(
        <PageLayout title="Test">
          <div>Content</div>
        </PageLayout>
      );
      
      const scrollButton = screen.getByLabelText('Scroll to top');
      expect(scrollButton).toHaveAttribute('aria-label', 'Scroll to top');
    });

    it('supports keyboard navigation for scroll button', async () => {
      render(
        <PageLayout title="Test">
          <div>Content</div>
        </PageLayout>
      );
      
      // Simulate being scrolled down
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
      fireEvent.scroll(window);

      await waitFor(() => {
        const scrollButton = screen.getByLabelText('Scroll to top');
        expect(scrollButton).toHaveClass('opacity-100');
      });

      const scrollButton = screen.getByLabelText('Scroll to top');
      scrollButton.focus();
      
      expect(scrollButton).toHaveFocus();
      expect(scrollButton).toHaveClass('focus-glow');
    });
  });

  describe('Animation Classes', () => {
    it('applies animation classes to different sections', () => {
      const breadcrumbs = [{ label: 'Home', href: '/' }];
      
      render(
        <PageLayout title="Test" breadcrumbs={breadcrumbs}>
          <div>Content</div>
        </PageLayout>
      );
      
      const breadcrumbNav = screen.getByLabelText('Breadcrumb');
      expect(breadcrumbNav).toHaveClass('animate-fade-in', 'animate-delay-100');
      
      const header = screen.getByText('Test').closest('header');
      expect(header).toHaveClass('animate-slide-up', 'animate-delay-200');
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('animate-fade-in', 'animate-delay-300');
    });

    it('applies design system classes', () => {
      render(
        <PageLayout title="Test">
          <div>Content</div>
        </PageLayout>
      );
      
      const layout = screen.getByText('Test').closest('.min-h-screen');
      expect(layout).toHaveClass('bg-[var(--color-background)]', 'text-[var(--color-text-primary)]');
      expect(layout).toHaveClass('font-family-primary');
    });
  });

  describe('Content Rendering', () => {
    it('renders complex content correctly', () => {
      const complexContent = (
        <div>
          <section>
            <h2>Section Title</h2>
            <p>Section content</p>
          </section>
          <aside>
            <h3>Sidebar</h3>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </aside>
        </div>
      );

      render(
        <PageLayout title="Test">
          {complexContent}
        </PageLayout>
      );
      
      expect(screen.getByText('Section Title')).toBeInTheDocument();
      expect(screen.getByText('Section content')).toBeInTheDocument();
      expect(screen.getByText('Sidebar')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });
});