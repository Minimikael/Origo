# Development Guidelines for Origo

## Project Structure

```
kappish/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── context/            # React context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page components
│   │   ├── services/           # API and external services
│   │   ├── utils/              # Utility functions
│   │   ├── styles/             # Global styles
│   │   └── App.js              # Main application component
│   └── public/                 # Static assets
├── backend/
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   ├── controllers/        # Business logic
│   │   ├── services/           # External service integrations
│   │   ├── middleware/         # Express middleware
│   │   ├── config/             # Configuration files
│   │   └── utils/              # Utility functions
│   └── server.js               # Main server file
└── shared/                     # Shared types and utilities
```

## Code Quality Standards

### 1. Naming Conventions

#### Files and Directories
- Use **kebab-case** for file and directory names
- Use **PascalCase** for React components
- Use **camelCase** for JavaScript functions and variables

```javascript
// ✅ Good
components/UserProfile.jsx
utils/apiService.js
pages/Dashboard.jsx

// ❌ Bad
components/user-profile.jsx
utils/ApiService.js
pages/dashboard.jsx
```

#### Variables and Functions
```javascript
// ✅ Good
const userProfile = getUserProfile();
const isAuthenticated = checkAuthStatus();
const handleSubmit = () => {};

// ❌ Bad
const user_profile = getUserProfile();
const is_authenticated = checkAuthStatus();
const handle_submit = () => {};
```

### 2. Component Structure

#### Functional Components
```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';

const UserProfile = ({ userId, onUpdate }) => {
  // 1. Hooks
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. Effects
  useEffect(() => {
    loadProfile();
  }, [userId]);

  // 3. Event handlers
  const handleSave = async () => {
    // Implementation
  };

  // 4. Render
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="user-profile">
      {/* JSX */}
    </div>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func
};

export default UserProfile;
```

### 3. State Management

#### Context Usage
```javascript
// ✅ Good - Centralized state
const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);

  const createDocument = useCallback(async (title) => {
    // Implementation
  }, []);

  const value = {
    documents,
    currentDocument,
    createDocument,
    setCurrentDocument
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};
```

#### Local State
```javascript
// ✅ Good - Minimal local state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState(initialData);

// ❌ Bad - Too much local state
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
// Use formData object instead
```

### 4. Error Handling

#### Try-Catch Blocks
```javascript
// ✅ Good
const saveDocument = async (document) => {
  try {
    setLoading(true);
    const result = await apiService.updateDocument(document.id, document);
    setSuccessMessage('Document saved successfully');
    return result;
  } catch (error) {
    const errorInfo = handleApiError(error);
    setErrorMessage(errorInfo.message);
    throw error;
  } finally {
    setLoading(false);
  }
};
```

#### Error Boundaries
```javascript
// ✅ Good
<ErrorBoundary>
  <ComponentThatMightError />
</ErrorBoundary>
```

### 5. Performance Optimization

#### Memoization
```javascript
// ✅ Good - Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return documents.filter(doc => doc.status === 'active').length;
}, [documents]);

// ✅ Good - Memoize callbacks
const handleDocumentUpdate = useCallback((documentId, updates) => {
  updateDocument(documentId, updates);
}, [updateDocument]);
```

#### Lazy Loading
```javascript
// ✅ Good - Lazy load components
const Editor = lazy(() => import('./pages/Editor'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// ✅ Good - Lazy load routes
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/editor/:id" element={<Editor />} />
</Suspense>
```

### 6. Security Best Practices

#### Input Validation
```javascript
// ✅ Good - Always validate inputs
const handleSubmit = (formData) => {
  const validation = validateForm({
    email: { value: formData.email, validators: [validateEmail] },
    password: { value: formData.password, validators: [validatePassword] }
  });

  if (!validation.isValid) {
    setErrors(validation.errors);
    return;
  }

  // Proceed with submission
};
```

#### Sanitization
```javascript
// ✅ Good - Sanitize all inputs
const sanitizedContent = sanitizeHtml(content);
const sanitizedTitle = sanitizeInput(title);
```

### 7. Testing Guidelines

#### Unit Tests
```javascript
// ✅ Good - Test component behavior
describe('UserProfile', () => {
  it('should display user information', () => {
    render(<UserProfile userId="123" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    render(<UserProfile userId="123" />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

#### Integration Tests
```javascript
// ✅ Good - Test API integration
describe('Document API', () => {
  it('should create a new document', async () => {
    const document = { title: 'Test Document', content: 'Test content' };
    const result = await apiService.createDocument(document);
    expect(result.id).toBeDefined();
  });
});
```

### 8. Code Organization

#### File Structure
```javascript
// ✅ Good - Logical file organization
src/
├── components/
│   ├── common/           # Shared components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── hooks/
│   ├── useAuth.js        # Authentication hook
│   ├── useDocument.js    # Document management hook
│   └── useDebounce.js    # Utility hook
└── utils/
    ├── constants.js       # Application constants
    ├── validation.js      # Validation utilities
    ├── api.js            # API service
    └── security.js       # Security utilities
```

#### Import Organization
```javascript
// ✅ Good - Organized imports
// 1. React and third-party libraries
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 2. Internal utilities and hooks
import { useAuth } from '../hooks/useAuth';
import { validateEmail } from '../utils/validation';

// 3. Components
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';

// 4. Styles
import './UserProfile.css';
```

### 9. Documentation

#### JSDoc Comments
```javascript
/**
 * Creates a new document with the specified title and content
 * @param {string} title - The document title
 * @param {string} content - The document content
 * @param {Object} options - Additional options
 * @param {boolean} options.public - Whether the document is public
 * @returns {Promise<Object>} The created document
 * @throws {Error} If the document creation fails
 */
const createDocument = async (title, content, options = {}) => {
  // Implementation
};
```

#### README Files
```markdown
# Component Name

Brief description of what this component does.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | string | Yes | The document title |
| content | string | No | The document content |

## Usage

```jsx
<DocumentEditor 
  title="My Document"
  content="Document content"
  onSave={handleSave}
/>
```

## Examples

See the examples directory for usage examples.
```

### 10. Git Workflow

#### Commit Messages
```bash
# ✅ Good - Conventional commits
feat: add document collaboration feature
fix: resolve authentication token issue
docs: update API documentation
style: format code according to style guide
refactor: extract validation logic to utility
test: add unit tests for user profile component
chore: update dependencies

# ❌ Bad
added stuff
fixed bug
updated docs
```

#### Branch Naming
```bash
# ✅ Good
feature/user-authentication
bugfix/login-error
hotfix/security-patch
refactor/document-editor

# ❌ Bad
new-feature
fix-bug
update
```

## Code Review Checklist

### Functionality
- [ ] Code works as expected
- [ ] No breaking changes
- [ ] Error handling implemented
- [ ] Edge cases considered

### Security
- [ ] Input validation implemented
- [ ] XSS protection in place
- [ ] Authentication/authorization checked
- [ ] Sensitive data properly handled

### Performance
- [ ] No unnecessary re-renders
- [ ] Efficient algorithms used
- [ ] Lazy loading implemented where appropriate
- [ ] Bundle size considered

### Code Quality
- [ ] Follows naming conventions
- [ ] Proper error handling
- [ ] Clean and readable code
- [ ] No code duplication
- [ ] Proper documentation

### Testing
- [ ] Unit tests written
- [ ] Integration tests updated
- [ ] Manual testing completed
- [ ] Edge cases tested 