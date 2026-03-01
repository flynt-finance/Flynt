# Release Notes Template

<!-- 
  ============================================================================
  QUICK START GUIDE
  ============================================================================
  
  1. Copy this file to RELEASE_NOTES.md in your project
  2. Search for [PLACEHOLDER] or <!-- --> comments to find sections to fill
  3. Remove sections that don't apply to your release
  4. Delete all HTML comments (<!-- -->) before publishing
  5. Use clear, concise language - focus on what changed and why it matters
  
  TIPS:
  - Start with user-facing features, then technical details
  - Include code examples for developer-facing changes
  - Be specific about bug fixes (what was broken, how it's fixed)
  - Mention breaking changes prominently
  - Include migration guides for major changes
  
  ============================================================================
-->

# Release Notes

<!-- 
  INSTRUCTIONS:
  1. Replace all placeholder text (marked with <!-- --> comments or [PLACEHOLDER])
  2. Remove sections that don't apply to your release
  3. Add custom sections if needed for your project
  4. Use clear, concise language
  5. Focus on user-facing changes first, then technical details
  6. Include breaking changes prominently if any exist
  7. Delete all HTML comments before publishing the final version
-->

## Version: [VERSION_NUMBER or COMMIT_HASH]

<!-- 
  Examples:
  - Version: v1.2.3
  - Version: Post-Merge e2f6760b
  - Version: 2.0.0-beta.1
-->

**Release Date:** [DATE in format: Month Day, Year]
<!-- Example: January 28, 2026 -->

---

## 🎉 New Features

<!-- 
  List all new features added in this release.
  Group related features under subheadings.
  Use bullet points with bold feature names followed by descriptions.
  Focus on user-visible changes and benefits.
-->

### [Feature Category Name]
- **[Feature Name]**: Brief description of what the feature does and why it's valuable
- **[Another Feature]**: Description with key benefits
  - **Sub-feature or detail**: Additional information about the feature
  - **Another detail**: More specific information

### [Another Feature Category]
- **[Feature Name]**: Description
- **[Feature Name]**: Description

<!-- 
  Example structure:
  ### Authentication Improvements
  - **OAuth 2.0 Support**: Added support for OAuth 2.0 authentication with Google, GitHub, and Microsoft
  - **Two-Factor Authentication**: Implemented 2FA with TOTP support
    - **Backup Codes**: Generate and use backup codes for account recovery
    - **SMS Option**: Optional SMS-based 2FA as alternative to authenticator apps
-->

---

## 🔧 Technical Improvements

<!-- 
  List technical improvements, refactoring, architecture changes.
  Focus on developer-facing improvements, performance optimizations,
  code quality improvements, etc.
-->

### [Component/Module Name]
- **[Improvement]**: Description of the technical improvement
- **[Improvement]**: Description with technical details
  - **Detail**: Specific technical detail
  - **Detail**: Another technical detail

### Code Quality
- **[Improvement]**: Description
- **[Improvement]**: Description

<!-- 
  Example:
  ### API Layer Refactoring
  - **Type Safety**: Migrated all API calls to TypeScript with full type definitions
  - **Error Handling**: Centralized error handling with custom error classes
    - **Retry Logic**: Automatic retry for transient failures
    - **Error Boundaries**: React error boundaries for graceful failure handling
-->

---

## 📁 Files Modified

<!-- 
  List files that were added, modified, or removed.
  Group by category (e.g., Components, Utils, API, etc.)
  Use relative paths from project root.
  Mark new files clearly.
-->

### [Category Name]
- `path/to/file.ext` - Brief description of changes
- `path/to/another-file.ext` - Description of changes

### New Files
- `path/to/new-file.ext` - Description of new file's purpose

### Modified Files
- `path/to/modified-file.ext` - Description of what was changed

### Removed Files
- `path/to/removed-file.ext` - Reason for removal (if applicable)

<!-- 
  Example:
  ### Core Components
  - `components/Button.vue` - Added loading states and disabled variants
  - `components/Modal.vue` - Improved accessibility with ARIA attributes
  
  ### New Files
  - `composables/useAuth.ts` - Authentication composable with OAuth support
  - `utils/validators.ts` - Form validation utilities
-->

---

## 🐛 Bug Fixes

<!-- 
  List all bug fixes in this release.
  Be specific about what was fixed.
  If applicable, mention the issue number or ticket reference.
-->

- Fixed [brief description of bug] - [what was wrong and how it's fixed]
- Resolved [issue description] - [solution details]
- Corrected [bug description] that was causing [problem]

<!-- 
  Example:
  - Fixed memory leak in WebSocket connection that was causing browser crashes after extended use
  - Resolved file upload timeout issue when uploading large files over slow connections
  - Corrected date formatting that was displaying incorrect timezone information
-->

---

## 📝 Developer Notes

<!-- 
  Include code examples, migration guides, API changes, etc.
  This section helps other developers understand how to use new features
  or migrate existing code.
-->

### [Feature/API Name] Usage

<!-- Include code examples showing how to use new features -->

\`\`\`[language]
// Example code showing how to use the new feature
const example = new Feature();
example.doSomething();
\`\`\`

### Migration Guide

<!-- If there are breaking changes, include migration steps -->

1. Step 1: Description of what needs to be changed
2. Step 2: Description of the change
3. Step 3: Verification steps

<!-- 
  Example:
  ### Authentication Migration
  
  \`\`\`typescript
  // Old way
  import { login } from './auth';
  
  // New way
  import { useAuth } from '@/composables/useAuth';
  const { login } = useAuth();
  \`\`\`
  
  ### Breaking Changes
  
  The `login()` function now returns a Promise instead of using callbacks.
  Update your code as follows:
  
  \`\`\`typescript
  // Before
  login(email, password, (error, user) => {
    if (error) handleError(error);
    else handleSuccess(user);
  });
  
  // After
  try {
    const user = await login(email, password);
    handleSuccess(user);
  } catch (error) {
    handleError(error);
  }
  \`\`\`
-->

---

## 🚀 Performance Improvements

<!-- 
  List performance-related improvements.
  Include metrics if available (e.g., "Reduced load time by 40%").
  Focus on measurable improvements.
-->

- [Improvement description] - [impact/benefit]
- [Improvement description] - [metrics if available]
- [Improvement description] - [user-facing benefit]

<!-- 
  Example:
  - Optimized database queries reducing API response time by 60%
  - Implemented code splitting reducing initial bundle size by 30%
  - Added caching layer reducing server load by 40%
-->

---

## 🔒 Security & Reliability

<!-- 
  List security improvements, vulnerability fixes, reliability enhancements.
  Be specific but don't reveal sensitive security details.
-->

- [Security improvement] - [what it protects against]
- [Reliability enhancement] - [how it improves stability]
- [Vulnerability fix] - [what was fixed]

<!-- 
  Example:
  - Added input sanitization to prevent XSS attacks in user-generated content
  - Implemented rate limiting to prevent API abuse
  - Fixed authentication token expiration handling
  - Enhanced error logging for better debugging in production
-->

---

## 📋 Testing Recommendations

<!-- 
  List areas that should be tested after this release.
  Include edge cases, integration points, and critical paths.
  Help QA teams and developers know what to focus on.
-->

- Test [specific functionality or scenario]
- Verify [feature or integration]
- Check [edge case or boundary condition]
- Validate [user flow or process]

<!-- 
  Example:
  - Test authentication flow with all supported OAuth providers
  - Verify file upload with various file types and sizes
  - Check error handling when API is unavailable
  - Validate responsive design on mobile devices
  - Test accessibility with screen readers
-->

---

## 🎯 Next Steps

<!-- 
  List planned improvements, features, or tasks for future releases.
  This helps set expectations and shows the roadmap.
-->

- [Planned feature or improvement]
- [Future enhancement]
- [Technical debt to address]
- [Optimization opportunity]

<!-- 
  Example:
  - Monitor authentication success rates and user feedback
  - Add support for additional OAuth providers (Apple, LinkedIn)
  - Implement refresh token rotation for enhanced security
  - Optimize bundle size further with tree-shaking improvements
-->

---

## ⚠️ Breaking Changes

<!-- 
  If there are breaking changes, list them prominently here.
  Include migration steps and clear explanations.
  This section should be at the top if there are breaking changes.
-->

- **[Change Name]**: Description of breaking change
  - **Migration**: Steps to migrate existing code
  - **Impact**: Who/what is affected

<!-- 
  Example:
  - **API Endpoint Changes**: The `/api/v1/users` endpoint now requires authentication
    - **Migration**: Add `Authorization` header to all requests
    - **Impact**: All API clients need to update their authentication
-->

---

## 📊 Statistics

<!-- 
  Optional: Include release statistics if relevant
  Examples: lines of code changed, files modified, issues closed, etc.
-->

- [Statistic]: [Value]
- [Statistic]: [Value]

<!-- 
  Example:
  - Files Changed: 45
  - Lines Added: 1,234
  - Lines Removed: 567
  - Issues Closed: 23
  - Pull Requests Merged: 12
-->

---

**Note:** [Any additional important information, warnings, or context about this release]

<!-- 
  Example:
  **Note:** This release includes significant architectural changes. 
  Please review the migration guide before upgrading. 
  We recommend testing in a staging environment first.
-->
