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

# PeerMe Bounties Integration

Integrate PeerMe bounties into the existing application, allowing users to view and interact with bounties sourced from the PeerMe platform.

## Completed Tasks

- [x] Explain PeerMe bounty process in `@bounties` (`BountyProcessExplainer.tsx`)
- [x] Fetch bounties from PeerMe API in `pages/bounties/index.tsx` (using example data, API key needed)
- [x] Update `BountyCard.tsx` to display PeerMe bounty data
- [x] Update `BountyItem.tsx` to display PeerMe bounty data
- [x] Fetch individual bounty details from PeerMe API in `pages/bounties/[id].tsx` (by filtering from all bounties, using example data, API key needed)
- [x] Align filter UI in `pages/bounties/index.tsx` with the one in `pages/toolindex/index.tsx` for consistency
- [x] Fix error message in `pages/bounties/index.tsx` to show a clean "No bounties available" message instead of API error details
- [x] Update `BountyCard.tsx` and `BountyItem.tsx` to match the actual PeerMe API response structure
- [x] Install `marked` and `@types/marked` for markdown rendering in `pages/bounties/[id].tsx`
- [x] Implement better payment amount formatting that handles token decimals properly
- [x] Add markdown rendering for description content in bounty detail page
- [x] Improve BountyCard and BountyItem UI to better display important information
  - [x] Add better deadline formatting with time remaining and urgency indicators
  - [x] Show both local details link and PeerMe external link options
  - [x] Include verification status for entities (with checkmark)
  - [x] Add competition indicator
  - [x] Display "Posted" date information
- [x] Enhance UI components for better user experience
  - [x] Modify badge styles for consistency across components
  - [x] Implement better spacing and alignment in UI elements
  - [x] Streamline action buttons with clearer labeling
  - [x] Fix color schemes for better readability and consistency
  - [x] Make tags more visually distinct with border styling
  - [x] Enhance status indicators with better visual cues
  - [x] Update layout for better information hierarchy

## In Progress Tasks

- [ ] Ensure API key from `.env` is used for API calls (Code in place, user needs to set `PEERME_API_KEY`)
- [ ] Add missing tags functionality (API response doesn't include tags directly, may need to parse from description or use a different field)

## Future Tasks

- [ ] Implement functionality for users to directly create bounties (if supported by PeerMe API without team context)
- [ ] Implement team-based bounty creation and management features
- [ ] Add review and winner selection process based on PeerMe logic
- [ ] Refine API error handling and loading states in UI components
- [ ] If a direct PeerMe API endpoint for single bounties is available, update `pages/bounties/[id].tsx`
- [ ] Add pagination for bounty listings when dealing with large numbers of bounties
- [ ] Create a custom 404 page for bounties not found

## Implementation Plan

The integration involved updating data fetching in page components (`pages/bounties/index.tsx`, `pages/bounties/[id].tsx`) to call the PeerMe API. Based on the actual API response, we've updated the interface definitions in `BountyCard.tsx` and `BountyItem.tsx` to match the structure returned from the PeerMe API, which nests data under a `data` array and includes fields like `chainId`, `entity` (organization details), `payments`, and more.

We've implemented functions to process the payment amounts, which come as string values with token decimals that need to be calculated for display. We also strip HTML tags from the description field and truncate it for preview displays.

We've enhanced the UI/UX of the bounty card and item components to:
1. Show both local detail view and external PeerMe links
2. Format deadlines with human-readable text (e.g., "3 days left", "Ends today!")
3. Indicate urgent deadlines with color highlighting
4. Show verification status of entities with a checkmark
5. Add competition indicators
6. Display posted dates
7. Improve badges with better styling, borders, and consistent spacing
8. Enhance tag styling and content organization
9. Fix layout issues for better information hierarchy

**An API key (`PEERME_API_KEY`) must be set in the environment variables for the API calls to PeerMe to succeed.**
**The `marked` library has been installed for rendering markdown descriptions on the bounty detail page.**

### Relevant Files

- ✅ `pages/bounties/index.tsx` - Main page for listing bounties (Updated for PeerMe, filters aligned with toolindex).
- ✅ `pages/bounties/[id].tsx` - Page for displaying individual bounty details (Updated for PeerMe with markdown rendering).
- ✅ `components/bounties/BountyCard.tsx` - Component for displaying a bounty in a list (Updated with actual PeerMe API structure and UI improvements).
- ✅ `components/bounties/BountyProcessExplainer.tsx` - Component explaining the bounty process (Updated with PeerMe info).
- ✅ `components/bounty/BountyItem.tsx` - Component for displaying bounty item details (Updated with actual PeerMe API structure and UI improvements).
- ✅ `TASKLIST.md` - This task tracking file (Updated). 