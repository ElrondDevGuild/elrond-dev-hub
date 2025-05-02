# UI Enhancement Task List

A list of tasks to improve the MultiversX Dev Hub platform UI.

## Completed Tasks

- [x] Remove sidebars from all main listing pages (Toolindex, Bounties, Team Finder, Monthly Leaderboard)
- [x] Update Team Finder to display developers in a 3-column grid layout
- [x] Add grid/list view toggle to Team Finder
- [x] Enhance Toolindex page with grid/list view options
- [x] Make UI elements, spacing, and styling consistent across pages
- [x] Fix BountyCard status/difficulty badge overlap issue
  - [x] Move difficulty badge under skills section
  - [x] Keep status badges absolutely positioned in top right corner
  - [x] Add z-index to ensure proper layering
- [x] Fix React JSX unescaped entities errors
  - [x] Fix apostrophes in Monthly Leaderboard page 
    - [x] "Couldn't" → "Couldn&apos;t"
    - [x] "month's" → "month&apos;s"
  - [x] Fix apostrophe in Team Finder page profile image alt text
  - [x] Fix apostrophes in Bounty Detail page
    - [x] "you're" → "you&apos;re"
    - [x] "doesn't" → "doesn&apos;t"
  - [x] Fix apostrophes in SubmitLeaderboardProject component
    - [x] "you're" → "you&apos;re" (multiple instances)
    - [x] "team's" → "team&apos;s"
    - [x] "project's" → "project&apos;s"
  - [x] Fix apostrophe in NewsletterPopup component
    - [x] "You'll" → "You&apos;ll"

## In Progress Tasks

- [ ] Identify and fix remaining JSX unescaped entities
  - [ ] Run comprehensive linter check across all React components
  - [ ] Create automated script to find and fix apostrophes
  - [ ] Verify fixes for all linter errors related to unescaped entities

## Future Tasks

- [ ] Add pagination controls for mobile view
- [ ] Implement advanced filtering options on all listing pages
- [ ] Create consistent loading states across the application
- [ ] Enhance dark mode color palette for better contrast
- [ ] Optimize image loading with next/image throughout the site
- [ ] Add animated transitions between views for smoother UX

## Implementation Plan

### Fix React JSX Unescaped Entities

1. Run linter to identify all files with unescaped entity errors
2. Apply systematic fixes across the codebase
3. For apostrophes (') in JSX text, replace with `&apos;`
4. Test UI to ensure all text displays correctly after changes
5. Commit changes with descriptive message about the fix

### Relevant Files

- ✅ pages/monthly-leaderboard/index.tsx - Fixed apostrophes in error message and project submission text
- ✅ pages/team-finder/index.tsx - Fixed apostrophe in profile image alt text
- ✅ pages/bounties/[id].tsx - Fixed apostrophes in "not found" message
- ✅ components/forms/SubmitLeaderboardProject.tsx - Fixed apostrophes in helper text and descriptions
- ✅ components/shared/NewsletterPopup.tsx - Fixed apostrophe in redirect message 