# Design Brief: Kursverwaltungssystem

## 1. App Analysis
- **What it does:** A comprehensive course management system for managing courses, instructors, participants, rooms, and registrations in one unified dashboard.
- **Who uses it:** Administrative staff at educational institutions or training centers
- **The ONE thing users care most about:** Seeing all course data and quickly managing registrations
- **Primary actions:** Create/edit courses, register participants, manage room assignments

## 2. What Makes This Design Distinctive
- **Visual identity:** Warm slate backgrounds with deep indigo accents — academic authority meets modern SaaS
- **Layout strategy:** Fixed sidebar navigation with content hero + KPI overview row, entity tables below
- **Unique element:** Color-coded entity badges (Kurse=indigo, Dozenten=emerald, Teilnehmer=amber, Räume=violet, Anmeldungen=rose) that carry through the entire UI

## 3. Theme & Colors
- **Font:** Plus Jakarta Sans — professional weight, clean terminals, feels institutional but modern
- **Google Fonts URL:** https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap
- **Color palette:**
  - Background: `hsl(225, 25%, 97%)` — warm cool slate
  - Surface: `hsl(0, 0%, 100%)`
  - Border: `hsl(220, 20%, 92%)`
  - Text primary: `hsl(222, 47%, 11%)`
  - Text muted: `hsl(220, 15%, 55%)`
  - Primary (indigo): `hsl(243, 75%, 59%)`
  - Primary glow: `hsl(243, 85%, 72%)`
  - Sidebar bg: `hsl(222, 47%, 11%)`
  - Sidebar text: `hsl(220, 20%, 75%)`
  - Sidebar active: `hsl(243, 75%, 59%)`
  - Emerald: `hsl(158, 64%, 52%)` (Dozenten)
  - Amber: `hsl(38, 92%, 50%)` (Teilnehmer)
  - Violet: `hsl(258, 68%, 61%)` (Räume)
  - Rose: `hsl(350, 80%, 60%)` (Anmeldungen)

## 4. Mobile Layout
- Hamburger menu replaces sidebar
- Single column content
- Hero KPIs in 2x2 grid
- Floating action button for primary action

## 5. Desktop Layout
- 240px fixed dark sidebar + remaining content area
- KPI row: 5 metric cards side by side
- Entity tables with inline search and action buttons
- Modal dialogs for create/edit (centered, backdrop blur)

## 6. Components
- **Hero KPIs:** 5 cards with entity color accents and count metrics
- **Sidebar:** Dark with entity color indicators, active state highlight
- **Data Tables:** Sortable columns, search, row actions (edit/delete)
- **Dialogs:** Create/Edit forms with validation
- **Badges:** Color-coded status (paid/unpaid, entity types)
- **Primary Action Button:** "Neu erstellen" per entity, indigo gradient

## 7. Visual Details
- Border radius: `0.75rem` cards, `0.5rem` inputs, `0.375rem` badges
- Shadows: `0 1px 3px hsl(222 47% 11% / 0.08), 0 4px 12px hsl(222 47% 11% / 0.05)`
- Sidebar shadow: `2px 0 20px hsl(222 47% 11% / 0.3)`
- Table row hover: subtle indigo tint `hsl(243 75% 59% / 0.04)`
- Animations: 200ms ease transitions on hover, dialog fade+scale in

## 8. CSS Variables
```css
--background: 225 25% 97%;
--surface: 0 0% 100%;
--foreground: 222 47% 11%;
--muted-foreground: 220 15% 55%;
--primary: 243 75% 59%;
--primary-glow: 243 85% 72%;
--sidebar-bg: 222 47% 11%;
--entity-courses: 243 75% 59%;
--entity-instructors: 158 64% 52%;
--entity-participants: 38 92% 50%;
--entity-rooms: 258 68% 61%;
--entity-registrations: 350 80% 60%;
```
