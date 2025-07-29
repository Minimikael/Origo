import React, { useState } from 'react';
import { 
  Home, 
  User, 
  Settings, 
  Plus, 
  Search, 
  Heart, 
  Star, 
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info
} from 'lucide-react';
import Button from '../ui/Button';
import Typography, { 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  Heading5, 
  Heading6, 
  BodyLarge, 
  BodyMedium, 
  BodySmall 
} from '../ui/Typography';
import Link from '../ui/Link';

const DesignSystemShowcase = () => {
  const [loading, setLoading] = useState(false);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <Heading1>Origo Design System</Heading1>
          <BodyLarge className="mt-4">
            A comprehensive design system with LinkedIn-inspired colors, typography, and components.
          </BodyLarge>
        </div>

        {/* Color System */}
        <section className="mb-12">
          <Heading2 className="mb-6">Color System</Heading2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary Colors */}
            <div className="card p-6">
              <Heading4 className="mb-4">Primary Colors</Heading4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded"></div>
                  <span className="text-sm">Primary</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded"></div>
                  <span className="text-sm">Secondary</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-tertiary rounded"></div>
                  <span className="text-sm">Tertiary</span>
                </div>
              </div>
            </div>

            {/* Semantic Colors */}
            <div className="card p-6">
              <Heading4 className="mb-4">Semantic Colors</Heading4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success rounded"></div>
                  <span className="text-sm">Success</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warning rounded"></div>
                  <span className="text-sm">Warning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-error rounded"></div>
                  <span className="text-sm">Error</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-info rounded"></div>
                  <span className="text-sm">Info</span>
                </div>
              </div>
            </div>

            {/* Gray Scale */}
            <div className="card p-6">
              <Heading4 className="mb-4">Gray Scale</Heading4>
              <div className="space-y-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 bg-gray-${shade} rounded`}></div>
                    <span className="text-sm">Gray {shade}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Colors */}
            <div className="card p-6">
              <Heading4 className="mb-4">Text Colors</Heading4>
              <div className="space-y-2">
                <div className="text-primary">Primary Text</div>
                <div className="text-secondary">Secondary Text</div>
                <div className="text-tertiary">Tertiary Text</div>
                <div className="text-success">Success Text</div>
                <div className="text-warning">Warning Text</div>
                <div className="text-error">Error Text</div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-12">
          <Heading2 className="mb-6">Typography</Heading2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Headings */}
            <div className="card p-6">
              <Heading3 className="mb-4">Headings</Heading3>
              <div className="space-y-4">
                <Heading1>Heading 1</Heading1>
                <Heading2>Heading 2</Heading2>
                <Heading3>Heading 3</Heading3>
                <Heading4>Heading 4</Heading4>
                <Heading5>Heading 5</Heading5>
                <Heading6>Heading 6</Heading6>
              </div>
            </div>

            {/* Body Text */}
            <div className="card p-6">
              <Heading3 className="mb-4">Body Text</Heading3>
              <div className="space-y-4">
                <BodyLarge>
                  Body Large - This is a larger body text with more spacing and emphasis.
                </BodyLarge>
                <BodyMedium>
                  Body Medium - This is the standard body text used throughout the application.
                </BodyMedium>
                <BodySmall>
                  Body Small - This is smaller text used for captions and secondary information.
                </BodySmall>
                <Typography variant="body-xs">
                  Body XS - This is the smallest text size for fine print and metadata.
                </Typography>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-12">
          <Heading2 className="mb-6">Buttons</Heading2>
          
          {/* Button Variants */}
          <div className="card p-6 mb-8">
            <Heading3 className="mb-4">Button Variants</Heading3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="error">Error</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          {/* Button Sizes */}
          <div className="card p-6 mb-8">
            <Heading3 className="mb-4">Button Sizes</Heading3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </div>

          {/* Button States */}
          <div className="card p-6 mb-8">
            <Heading3 className="mb-4">Button States</Heading3>
            <div className="flex flex-wrap gap-4">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
              <Button loading={loading} onClick={handleLoadingClick}>
                Loading
              </Button>
            </div>
          </div>

          {/* Icon Buttons */}
          <div className="card p-6">
            <Heading3 className="mb-4">Icon Buttons</Heading3>
            <div className="flex flex-wrap gap-4">
              <Button icon={<Home />} />
              <Button icon={<User />} size="sm" />
              <Button icon={<Settings />} size="lg" />
              <Button icon={<Plus />} variant="secondary" />
              <Button icon={<Search />} variant="tertiary" />
              <Button icon={<Heart />} variant="success" />
              <Button icon={<Star />} variant="warning" />
              <Button icon={<XCircle />} variant="error" />
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="mb-12">
          <Heading2 className="mb-6">Links</Heading2>
          
          <div className="card p-6">
            <div className="space-y-4">
              <div>
                <Heading4 className="mb-2">Link Variants</Heading4>
                <div className="space-y-2">
                  <Link href="#" variant="primary">Primary Link</Link>
                  <Link href="#" variant="secondary">Secondary Link</Link>
                  <Link href="#" variant="tertiary">Tertiary Link</Link>
                </div>
              </div>
              
              <div>
                <Heading4 className="mb-2">Router Links</Heading4>
                <div className="space-y-2">
                  <Link to="/" variant="primary">Home Page</Link>
                  <Link to="/dashboard" variant="secondary">Dashboard</Link>
                </div>
              </div>
              
              <div>
                <Heading4 className="mb-2">External Links</Heading4>
                <div className="space-y-2">
                  <Link href="https://github.com" external variant="primary">
                    GitHub (External)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section className="mb-12">
          <Heading2 className="mb-6">Icons</Heading2>
          
          <div className="card p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="flex flex-col items-center space-y-2 p-4 bg-gray-100 rounded-lg">
                <Home className="w-6 h-6 text-primary" />
                <span className="text-xs">Home</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-gray-100 rounded-lg">
                <User className="w-6 h-6 text-secondary" />
                <span className="text-xs">User</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-gray-100 rounded-lg">
                <Settings className="w-6 h-6 text-tertiary" />
                <span className="text-xs">Settings</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-gray-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-success" />
                <span className="text-xs">Success</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-gray-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-warning" />
                <span className="text-xs">Warning</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-gray-100 rounded-lg">
                <XCircle className="w-6 h-6 text-error" />
                <span className="text-xs">Error</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-gray-100 rounded-lg">
                <Info className="w-6 h-6 text-info" />
                <span className="text-xs">Info</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-gray-100 rounded-lg">
                <Search className="w-6 h-6 text-gray-600" />
                <span className="text-xs">Search</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-gray-100 rounded-lg">
                <Plus className="w-6 h-6 text-gray-600" />
                <span className="text-xs">Add</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-gray-100 rounded-lg">
                <Heart className="w-6 h-6 text-gray-600" />
                <span className="text-xs">Like</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-gray-100 rounded-lg">
                <Star className="w-6 h-6 text-gray-600" />
                <span className="text-xs">Star</span>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-12">
          <Heading2 className="mb-6">Usage Examples</Heading2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card Example */}
            <div className="card p-6">
              <Heading3 className="mb-4">Card Component</Heading3>
              <BodyMedium className="mb-4">
                This is an example of how cards look with the new design system.
              </BodyMedium>
              <div className="flex gap-2">
                <Button size="sm" variant="primary">Action</Button>
                <Button size="sm" variant="secondary">Cancel</Button>
              </div>
            </div>

            {/* Form Example */}
            <div className="card p-6">
              <Heading3 className="mb-4">Form Example</Heading3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    className="input" 
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="primary">Submit</Button>
                  <Button variant="tertiary">Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8">
          <BodySmall className="text-gray-500">
            Origo Design System - Built with React and CSS Custom Properties
          </BodySmall>
        </footer>
      </div>
    </div>
  );
};

export default DesignSystemShowcase; 