'use client';

import React, { useState } from 'react';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import Button from '../common/Button';
import Card from '../common/Card';

// Demo icons
const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  bio: string;
  country: string;
  newsletter: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export const FormDemo: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    bio: '',
    country: '',
    newsletter: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    alert('Form submitted successfully!');
  };

  return (
    <div className="p-8 space-y-12 bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Modern Form Components</h1>
        <p className="text-gray-400 mb-8">
          Redesigned with dark backgrounds, white borders, focus glow effects, and smooth animations
        </p>

        {/* Form Variants Showcase */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Form Component Variants</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Default Variant */}
            <Card variant="elevated" title="Default Variant" padding="lg">
              <div className="space-y-4">
                <Input
                  variant="default"
                  label="Email Address"
                  placeholder="Enter your email"
                  leftIcon={<EmailIcon />}
                />
                <Input
                  variant="default"
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  leftIcon={<LockIcon />}
                />
                <Select
                  variant="default"
                  label="Country"
                  placeholder="Select country"
                >
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                </Select>
                <Textarea
                  variant="default"
                  label="Bio"
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>
            </Card>

            {/* Filled Variant */}
            <Card variant="elevated" title="Filled Variant" padding="lg">
              <div className="space-y-4">
                <Input
                  variant="filled"
                  label="Email Address"
                  placeholder="Enter your email"
                  leftIcon={<EmailIcon />}
                />
                <Input
                  variant="filled"
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  leftIcon={<LockIcon />}
                />
                <Select
                  variant="filled"
                  label="Country"
                  placeholder="Select country"
                >
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                </Select>
                <Textarea
                  variant="filled"
                  label="Bio"
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>
            </Card>

            {/* Outlined Variant */}
            <Card variant="elevated" title="Outlined Variant" padding="lg">
              <div className="space-y-4">
                <Input
                  variant="outlined"
                  label="Email Address"
                  placeholder="Enter your email"
                  leftIcon={<EmailIcon />}
                />
                <Input
                  variant="outlined"
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  leftIcon={<LockIcon />}
                />
                <Select
                  variant="outlined"
                  label="Country"
                  placeholder="Select country"
                >
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                </Select>
                <Textarea
                  variant="outlined"
                  label="Bio"
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>
            </Card>
          </div>
        </section>

        {/* Size Variations */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Size Variations</h2>
          
          <Card variant="outlined" padding="lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Small</h3>
                <Input size="sm" placeholder="Small input" leftIcon={<SearchIcon />} />
                <Select size="sm" placeholder="Small select">
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
                <Textarea size="sm" placeholder="Small textarea" rows={2} />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Medium (Default)</h3>
                <Input size="md" placeholder="Medium input" leftIcon={<SearchIcon />} />
                <Select size="md" placeholder="Medium select">
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
                <Textarea size="md" placeholder="Medium textarea" rows={3} />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Large</h3>
                <Input size="lg" placeholder="Large input" leftIcon={<SearchIcon />} />
                <Select size="lg" placeholder="Large select">
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
                <Textarea size="lg" placeholder="Large textarea" rows={4} />
              </div>
            </div>
          </Card>
        </section>

        {/* Interactive Form Example */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Interactive Registration Form</h2>
          
          <Card variant="elevated" padding="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  error={errors.firstName}
                  leftIcon={<UserIcon />}
                />
                
                <Input
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  error={errors.lastName}
                  leftIcon={<UserIcon />}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                helperText="We'll never share your email with anyone else"
                leftIcon={<EmailIcon />}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={errors.password}
                  helperText="Must be at least 8 characters long"
                  leftIcon={<LockIcon />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />
                
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={errors.confirmPassword}
                  leftIcon={<LockIcon />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />
              </div>

              <Select
                label="Country"
                placeholder="Select your country"
                value={formData.country}
                onChange={handleInputChange('country')}
                error={errors.country}
              >
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="ca">Canada</option>
                <option value="au">Australia</option>
                <option value="de">Germany</option>
                <option value="fr">France</option>
                <option value="jp">Japan</option>
              </Select>

              <Textarea
                label="Bio (Optional)"
                placeholder="Tell us a bit about yourself..."
                value={formData.bio}
                onChange={handleInputChange('bio')}
                helperText="This will be displayed on your public profile"
                characterCount
                maxLength={500}
                rows={4}
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange('newsletter')}
                  className="w-4 h-4 text-white bg-gray-800 border-gray-600 rounded focus:ring-white focus:ring-2"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-300">
                  Subscribe to our newsletter for updates and tips
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Creating Account..."
                  fullWidth
                >
                  Create Account
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    setFormData({
                      email: '',
                      password: '',
                      confirmPassword: '',
                      firstName: '',
                      lastName: '',
                      bio: '',
                      country: '',
                      newsletter: false
                    });
                    setErrors({});
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Card>
        </section>

        {/* Error States Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Error States & Validation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="outlined" title="Form Validation" padding="lg">
              <div className="space-y-4">
                <Input
                  label="Email"
                  value="invalid-email"
                  error="Please enter a valid email address"
                  leftIcon={<EmailIcon />}
                />
                <Input
                  label="Password"
                  type="password"
                  value="123"
                  error="Password must be at least 8 characters long"
                  leftIcon={<LockIcon />}
                />
                <Select
                  label="Country"
                  value=""
                  error="Please select a country"
                >
                  <option value="">Select country</option>
                  <option value="us">United States</option>
                </Select>
                <Textarea
                  label="Message"
                  value=""
                  error="This field is required"
                  rows={3}
                />
              </div>
            </Card>

            <Card variant="outlined" title="Loading States" padding="lg">
              <div className="space-y-4">
                <Input
                  label="Search"
                  placeholder="Searching..."
                  isLoading
                  leftIcon={<SearchIcon />}
                />
                <Input
                  label="Email Verification"
                  placeholder="Verifying email..."
                  isLoading
                  leftIcon={<EmailIcon />}
                />
                <Select
                  label="Loading Options"
                  disabled
                >
                  <option>Loading...</option>
                </Select>
                <div className="pt-2">
                  <Button variant="primary" isLoading loadingText="Processing...">
                    Submit
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Accessibility Features</h2>
          
          <Card variant="outlined" padding="lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Keyboard Navigation</h3>
                <p className="text-gray-300 text-sm mb-4">
                  All form components support full keyboard navigation. Try using Tab, Shift+Tab, Enter, and arrow keys.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Tab to me first" />
                  <Input placeholder="Then to me" />
                  <Select placeholder="Finally here">
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                  </Select>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Screen Reader Support</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Accessible Input"
                    helperText="This input has proper ARIA labels"
                    placeholder="Screen reader friendly"
                  />
                  <Input
                    label="Error Example"
                    error="This error is announced to screen readers"
                    placeholder="Error state example"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Focus Management</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Focus states are clearly visible with white glow effects and proper contrast ratios.
                </p>
                <div className="space-y-4">
                  <Input
                    label="Focus Indicator Test"
                    placeholder="Click or tab to see focus state"
                  />
                  <Textarea
                    label="Textarea Focus Test"
                    placeholder="Focus states work on all form elements"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </Card>
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
                      General forms, standard inputs, most common use case
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Filled</h4>
                    <p className="text-gray-300">
                      Dense layouts, modern interfaces, elevated surfaces
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Outlined</h4>
                    <p className="text-gray-300">
                      Minimal designs, transparent backgrounds, subtle forms
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Best Practices</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Always provide clear labels for form inputs</li>
                  <li>• Use helper text to guide users and provide context</li>
                  <li>• Show validation errors immediately and clearly</li>
                  <li>• Maintain consistent sizing across related form elements</li>
                  <li>• Use loading states for async operations</li>
                  <li>• Ensure proper keyboard navigation and focus management</li>
                  <li>• Test with screen readers for accessibility compliance</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default FormDemo;