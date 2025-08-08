'use client';

import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

// Demo icons
const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
  </svg>
);

export const CardDemo: React.FC = () => {
  const [likedCards, setLikedCards] = useState<Set<string>>(new Set());
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const toggleLike = (cardId: string) => {
    setLikedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const setRating = (cardId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [cardId]: rating }));
  };

  return (
    <div className="p-8 space-y-12 bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Modern Card Component</h1>
        <p className="text-gray-400 mb-8">
          Redesigned with elevated styling, responsive padding, and smooth hover transitions
        </p>

        {/* Basic Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Card Variants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" hover>
              <h3 className="text-lg font-semibold mb-2">Default Card</h3>
              <p className="text-gray-300">
                This is the default card variant with a dark gray background and subtle border.
                It includes hover effects for better interactivity.
              </p>
            </Card>

            <Card variant="elevated" hover>
              <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
              <p className="text-gray-300">
                The elevated variant has enhanced shadows and a gradient overlay for a more 
                prominent appearance with stronger hover effects.
              </p>
            </Card>

            <Card variant="outlined" hover>
              <h3 className="text-lg font-semibold mb-2">Outlined Card</h3>
              <p className="text-gray-300">
                The outlined variant features a transparent background with a prominent border,
                perfect for secondary content or call-to-action areas.
              </p>
            </Card>
          </div>
        </section>

        {/* Padding Options */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Responsive Padding Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" padding="sm" hover>
              <h3 className="text-base font-semibold mb-2">Small Padding</h3>
              <p className="text-gray-300 text-sm">
                Compact card with small padding, perfect for dense layouts or mobile interfaces.
              </p>
            </Card>

            <Card variant="default" padding="md" hover>
              <h3 className="text-lg font-semibold mb-2">Medium Padding</h3>
              <p className="text-gray-300">
                Default padding size that works well for most use cases and provides good balance.
              </p>
            </Card>

            <Card variant="default" padding="lg" hover>
              <h3 className="text-xl font-semibold mb-2">Large Padding</h3>
              <p className="text-gray-300">
                Spacious card with large padding, ideal for hero sections or important content.
              </p>
            </Card>
          </div>
        </section>

        {/* Cards with Headers */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Cards with Headers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              variant="elevated"
              title="Product Analytics"
              subtitle="Dashboard Overview"
              description="Track your product performance with real-time analytics and insights."
              actions={
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <ShareIcon />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreIcon />
                  </Button>
                </div>
              }
              hover
            >
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">1.2k</div>
                    <div className="text-sm text-gray-400">Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">89%</div>
                    <div className="text-sm text-gray-400">Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">$12k</div>
                    <div className="text-sm text-gray-400">Revenue</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card
              variant="outlined"
              title="Team Collaboration"
              subtitle="Project Management"
              description="Streamline your team's workflow with integrated project management tools."
              actions={
                <Button variant="primary" size="sm">
                  Join Team
                </Button>
              }
              hover
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Active Projects</span>
                  <span className="text-sm font-medium">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Team Members</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Completion Rate</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Interactive Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Interactive Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((id) => (
              <Card
                key={id}
                variant="elevated"
                interactive
                onClick={() => alert(`Card ${id} clicked!`)}
                className="cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Interactive Card {id}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(`card-${id}`);
                      }}
                      className={`p-1 rounded transition-colors ${
                        likedCards.has(`card-${id}`) 
                          ? 'text-red-500 hover:text-red-400' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <HeartIcon />
                    </button>
                  </div>
                  
                  <p className="text-gray-300 text-sm">
                    Click anywhere on this card to interact with it. The entire card is clickable
                    and includes proper keyboard navigation support.
                  </p>
                  
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={(e) => {
                          e.stopPropagation();
                          setRating(`card-${id}`, star);
                        }}
                        className={`p-1 transition-colors ${
                          (ratings[`card-${id}`] || 0) >= star
                            ? 'text-yellow-500 hover:text-yellow-400'
                            : 'text-gray-500 hover:text-yellow-500'
                        }`}
                      >
                        <StarIcon filled={(ratings[`card-${id}`] || 0) >= star} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-400">
                      {ratings[`card-${id}`] || 0}/5
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Complex Content Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Complex Content Examples</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              variant="elevated"
              title="Feature Comparison"
              padding="lg"
              hover
            >
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2">Feature</th>
                        <th className="text-center py-2">Basic</th>
                        <th className="text-center py-2">Pro</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      <tr className="border-b border-gray-700">
                        <td className="py-2">Storage</td>
                        <td className="text-center py-2">10GB</td>
                        <td className="text-center py-2">100GB</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-2">Users</td>
                        <td className="text-center py-2">5</td>
                        <td className="text-center py-2">Unlimited</td>
                      </tr>
                      <tr>
                        <td className="py-2">Support</td>
                        <td className="text-center py-2">Email</td>
                        <td className="text-center py-2">24/7</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" size="sm" fullWidth>
                    Basic Plan
                  </Button>
                  <Button variant="primary" size="sm" fullWidth>
                    Pro Plan
                  </Button>
                </div>
              </div>
            </Card>

            <Card
              variant="outlined"
              title="Code Example"
              subtitle="React Component"
              padding="lg"
              hover
            >
              <div className="space-y-4">
                <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                  <code className="text-gray-300">
{`<Card 
  variant="elevated"
  title="My Card"
  hover
>
  <p>Card content here</p>
</Card>`}
                  </code>
                </pre>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">TypeScript • React</span>
                  <Button variant="ghost" size="sm">
                    Copy Code
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Accessibility Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Accessibility Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              variant="default"
              title="Keyboard Navigation"
              description="Interactive cards support full keyboard navigation with Tab, Enter, and Space keys."
              interactive
              onClick={() => alert('Keyboard accessible card activated!')}
            >
              <div className="mt-4 p-3 bg-gray-800 rounded text-sm">
                <p className="text-gray-300">
                  Try using Tab to focus this card, then press Enter or Space to activate it.
                </p>
              </div>
            </Card>

            <Card
              variant="elevated"
              title="Screen Reader Support"
              description="Cards include proper ARIA attributes and semantic HTML structure."
              hover
            >
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Role:</span>
                  <code className="text-gray-400">button (when interactive)</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Focusable:</span>
                  <code className="text-gray-400">tabindex="0"</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Keyboard:</span>
                  <code className="text-gray-400">Enter, Space</code>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Usage Guidelines</h2>
          
          <Card variant="outlined" padding="lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">When to Use Each Variant</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-white mb-2">Default</h4>
                    <p className="text-gray-300">
                      General content, list items, secondary information
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Elevated</h4>
                    <p className="text-gray-300">
                      Important content, featured items, call-to-actions
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Outlined</h4>
                    <p className="text-gray-300">
                      Forms, inputs, secondary actions, placeholders
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Best Practices</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Use consistent padding across similar card types</li>
                  <li>• Enable hover effects for interactive content</li>
                  <li>• Include proper headers for complex cards</li>
                  <li>• Ensure adequate contrast for accessibility</li>
                  <li>• Test keyboard navigation on interactive cards</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default CardDemo;