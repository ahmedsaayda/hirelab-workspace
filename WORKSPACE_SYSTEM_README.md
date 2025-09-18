# HireLab Multi-Brand Workspace System

## Overview

The Multi-Brand Workspace System allows a single HireLab user account to create and manage multiple isolated brand workspaces. Each workspace operates as a completely separate entity with its own:

- ✅ Branding (logo, fonts, colors)
- ✅ Job funnels and vacancies
- ✅ ATS inbox and applicants
- ✅ Team members and permissions
- ✅ Analytics and data
- ✅ Custom domain settings

## Key Features

### 🏢 Complete Isolation
Each workspace acts as a virtual user with complete data isolation. When working in a workspace, you only see data belonging to that workspace.

### 🎨 Independent Branding
Each workspace can have its own:
- Primary, secondary, and tertiary colors
- Custom fonts (title, subheader, body)
- Hero background and title colors
- Brand color palette

### 🔐 Permission-Based Access
- Only users with `allowWorkspaces: true` can create and manage workspaces
- Admin users can enable/disable workspace access for individual users
- Master user maintains full control over all their workspaces

### 🔄 Seamless Switching
- Switch between master account and workspaces instantly
- Clear visual indicators when in workspace mode
- Easy return to master account functionality

## Architecture

### Database Models

#### User Model (Updated)
```javascript
{
  // ... existing fields
  allowWorkspaces: { type: Boolean, default: false }, // New field
}
```

#### Workspace Model (New)
```javascript
{
  name: String,                    // Workspace display name
  description: String,             // Optional description
  owner: ObjectId,                 // Master user who owns this workspace
  email: String,                   // Unique email for the workspace
  companyName: String,             // Company information
  companyWebsite: String,
  companyAddress: String,
  
  // Branding settings
  primaryColor: String,
  secondaryColor: String,
  // ... other branding fields
  
  isActive: Boolean,               // Soft delete flag
  virtualUserId: ObjectId,         // Reference to the virtual user
}
```

### Virtual Users
Each workspace creates a virtual user account that:
- Has a unique email address
- Acts as a completely separate user in the system
- Inherits initial branding from the master user
- Can be customized independently

### Authentication Flow
1. **Master Account**: Normal login flow
2. **Workspace Switch**: Generate new JWT tokens for virtual user
3. **Workspace Session**: All operations performed as virtual user
4. **Return**: Generate new JWT tokens for master user

## API Endpoints

### Workspace Management
- `GET /api/workspaces` - List user's workspaces
- `POST /api/workspaces` - Create new workspace
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace (soft delete)

### Session Management
- `POST /api/workspaces/:id/switch` - Switch to workspace
- `POST /api/workspaces/return` - Return to master account

## Frontend Components

### User Management (Admin)
- Added workspace permission toggle
- Visual indicator for users with workspace access

### Workspace Management
- Full CRUD interface for workspaces
- Company information management
- Workspace switching interface

### Navigation
- Conditional workspace menu item (only for enabled users)
- Workspace return button (when in workspace session)

## Usage Instructions

### For Administrators

1. **Enable Workspace Access**:
   - Go to Admin → User Management
   - Edit user and toggle "Allow Workspaces"
   - Save changes

### For Users with Workspace Access

1. **Create Workspace**:
   - Navigate to Dashboard → Workspaces
   - Click "Create Workspace"
   - Fill in workspace details and company information
   - Save to create the workspace

2. **Switch to Workspace**:
   - From workspace list, click "Switch" on desired workspace
   - System will redirect to dashboard in workspace mode
   - Notice the workspace indicator in bottom-right corner

3. **Work in Workspace**:
   - All operations (vacancies, ATS, media library) are isolated to this workspace
   - Branding and settings are specific to this workspace
   - Team management is independent

4. **Return to Master Account**:
   - Click "Return to Main Account" button in bottom-right corner
   - Or navigate to Dashboard → Workspaces and click return button

## Data Isolation

### How It Works
- Each workspace has a virtual user account
- When in workspace mode, JWT token contains virtual user ID
- All CRUD operations use virtual user ID as owner
- No data cross-contamination between workspaces or master account

### Verification
Run the isolation test:
```bash
cd hirelab-backend
node test-workspace-isolation.js
```

## Security Considerations

### Access Control
- Only users with `allowWorkspaces: true` can access workspace features
- Workspace owners can only access their own workspaces
- Virtual users cannot be directly logged into

### Data Protection
- Complete isolation prevents data leakage
- Soft delete preserves data integrity
- Audit logging tracks workspace operations

## Technical Implementation

### Backend Changes
1. **Models**: Added Workspace model and allowWorkspaces field
2. **Controllers**: New workspace controller with CRUD operations
3. **Routes**: Protected workspace routes with permission checks
4. **Middleware**: Enhanced authentication to handle workspace sessions
5. **CRUD Utils**: Added workspace session logging and handling

### Frontend Changes
1. **User Management**: Added workspace permission toggle
2. **Navigation**: Conditional workspace menu item
3. **Workspace UI**: Complete workspace management interface
4. **Session Handling**: Workspace return button and session indicators

## Future Enhancements

### Potential Features
- Workspace templates for quick setup
- Workspace-specific integrations (Calendly, SMTP)
- Workspace usage analytics
- Workspace member invitations
- Workspace billing separation

### Scalability
- Current implementation supports unlimited workspaces per user
- Database indexes ensure performance at scale
- Virtual user approach allows for future feature expansion

## Troubleshooting

### Common Issues

1. **"Workspace feature not enabled"**
   - Solution: Admin needs to enable allowWorkspaces for the user

2. **Cannot switch to workspace**
   - Check workspace is active (`isActive: true`)
   - Verify user owns the workspace
   - Check JWT environment variables are set

3. **Data not isolated**
   - Verify virtual user was created correctly
   - Check CRUD operations are using correct user_id
   - Run isolation test to verify

### Debug Logging
The system includes comprehensive logging:
- 🏢 Workspace session operations
- 🔄 Workspace switching events
- ✅ Permission checks
- 📊 Data isolation verification

## Testing

### Manual Testing Checklist
- [ ] Admin can enable workspace permission for users
- [ ] Enabled users see workspace menu item
- [ ] Users can create workspaces with unique emails
- [ ] Workspace switching works correctly
- [ ] Data is completely isolated between workspaces
- [ ] Return to master account works
- [ ] Workspace branding is independent
- [ ] Permission checks prevent unauthorized access

### Automated Testing
```bash
# Run isolation test
node hirelab-backend/test-workspace-isolation.js

# Expected output: All tests pass with data isolation confirmed
```

## Conclusion

The Multi-Brand Workspace System provides a robust, scalable solution for agencies and users who need to manage multiple brands from a single account. With complete data isolation, independent branding, and seamless switching, it enables efficient multi-brand management while maintaining security and data integrity.

The system is production-ready and follows HireLab's existing patterns for authentication, permissions, and data management.
