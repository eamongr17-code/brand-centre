# Atlas Brand Centre — Design System

## Button System

### Sizes
- **Small**: `text-xs px-3 py-1.5 rounded-lg`
- **Medium**: `text-sm px-4 py-2 rounded-xl`
- **Icon small**: `w-8 h-8 rounded-xl`
- **Icon large**: `w-10 h-10 rounded-xl`

### Variants
- **Primary**: `bg-white text-black hover:bg-white/90`
- **Secondary**: `bg-white/[0.05] border border-white/[0.07] text-[#f0f0f0] hover:bg-white/[0.08]`
- **Ghost**: `border border-white/[0.07] text-[#686868] hover:text-[#f0f0f0] hover:border-white/[0.12]`
- **Destructive**: `hover:bg-red-500/20 text-red-400`
- **Accent**: `bg-[#f77614] text-white hover:bg-[#e06810]`

## Card Layout

### Panel padding
Always `px-5 pt-4 pb-4` for card info panels.

### Aspect ratios
All preview images use `aspect-video` (16:9).

### Border radius
- Cards: `rounded-2xl`
- Buttons: `rounded-lg` (small) or `rounded-xl` (medium/icon)
- Panels: `rounded-t-2xl`

## Color Tokens

| Role | Value |
|------|-------|
| Body bg | `#141414` |
| Card/panel bg | `#1a1a1a` |
| Glass card bg | `rgba(26,26,26,0.75)` |
| Glass nav bg | `rgba(20,20,20,1)` |
| Primary text | `#f0f0f0` |
| Secondary text | `#8a8a8a` |
| Muted text | `#636363` |
| Dim text | `#555` |
| Dark text | `#505050` |
| Subtle border | `white/[0.05]` |
| Default border | `white/[0.07]` |
| Scrollbar thumb | `#303030` |
| Accent | `#f77614` |

## Typography
- Headings: `font-bold text-[#f0f0f0]`
- Body: `text-sm`
- Labels: `text-xs` or `text-[10px]`
- Font: Urbanist

## Rules
- No looping animations on static elements (e.g. no `subtle-float` on logos).
- Card panels must have `border-t border-white/[0.07]` separating them from the image above.
- Collapsed card panel height: `h-[100px]`.
