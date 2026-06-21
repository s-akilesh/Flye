# Flyen Platform Design Rules

These rules must be followed across all current and future screens.

---

## 1. Layout System

* Use a 12-column responsive grid.
* Desktop page padding: 40px left and right.
* Grid gutter: 24px.
* No content should touch screen edges.
* All pages must align to the same content width.

---

## 2. Header Rules

* Header must appear consistently across all pages.
* Header content must align with page content.
* Logo always on left.
* Primary actions on right.
* No page should use a different header structure unless intentionally designed.

---

## 3. Spacing Rules

Use only approved spacing tokens:

4px
8px
12px
16px
24px
32px
40px
48px
64px
80px

Avoid arbitrary spacing values.

---

## 4. Typography Rules

Font Family:
Inter

Heading Hierarchy:

H1
Page Titles

H2
Section Titles

H3
Card Titles

Body
Descriptions

Caption
Supporting Information

Do not introduce additional fonts.

---

## 5. Card Rules

* All cards should use consistent border radius.
* Maintain consistent padding.
* Hover effects should follow the same pattern.
* Card shadows and glow effects must come from design tokens.

---

## 6. Form Rules

Applies to:

* Search Bars
* Inputs
* Dropdowns
* Filters
* Contact Forms

Requirements:

* Consistent height
* Consistent border treatment
* Consistent focus state
* Consistent hover state

---

## 7. Button Rules

Primary Button:
High emphasis

Secondary Button:
Medium emphasis

Ghost Button:
Low emphasis

Do not create custom button styles for individual screens.

---

## 8. Color Rules

Use only design token colors.

Examples:

Background

Surface

Border

Text

Accent

Success

Warning

Danger

No hardcoded colors.

---

## 9. Animation Rules

Allowed:

* Fade
* Slide
* Glow
* Scale
* Hover Lift

Animation Duration:

200ms
300ms
400ms
600ms

Avoid excessive animations.

---

## 10. Scroll Rules

* Main page should scroll naturally.
* Sidebars may be sticky.
* Filters remain visible where appropriate.
* Avoid nested scrollbars unless necessary.

---

## 11. Responsive Rules

Desktop:
4 Cards Per Row

Laptop:
3 Cards Per Row

Tablet:
2 Cards Per Row

Mobile:
1 Card Per Row

All screens must remain usable on mobile.

---

## 12. Component Reuse Rule

Before creating a new component:

Check whether an existing component can be reused.

Examples:

Button

Card

Badge

Chip

Dropdown

Modal

Avoid duplicate components.

---

## 13. Accessibility Rules

* Text must remain readable.
* Interactive elements must be keyboard accessible.
* Maintain sufficient contrast.
* Click targets should be touch-friendly on mobile.

---

## 14. Flyen Experience Principle

Every screen should answer:

What can I do here?

What is the next action?

How do I proceed?

The interface should feel:

* Premium
* Technical
* Futuristic
* Professional

Not cluttered.
Not academic.
Not dashboard-heavy.

---

## 15. Golden Rule

Before approving any new screen ask:

1. Does it follow the Flyen grid system?
2. Does it use existing components?
3. Does it follow spacing tokens?
4. Does it align with the design system?
5. Does it improve the user journey?

If the answer is "No" to any item, revise before implementation.
