<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## AOCC Standing Project Preferences

Always prefer existing installed libraries over adding new ones or hand-rolling custom code:
- **3D / Scroll Visuals**: `@react-three/fiber` + `@react-three/drei` + `three`
- **Animations & Micro-interactions**: `framer-motion` (scroll-linked, transitions, hover/tap, layout)
- **Data Visualizations**: `recharts` (sole charting library)
- **Data Tables**: `@tanstack/react-table`
- **Large List Virtualization**: `@tanstack/react-virtual`
- **Icons**: `lucide-react` (no emojis or second icon sets)
- **Date & Time**: `date-fns` (formatting, parsing, math)

### Mandatory Guidelines:
1. **No Unnecessary Dependencies**: Always check if existing libraries solve the task before adding any npm package.
2. **Consistent Visual Theme**: Use CSS variables for colors (dark control-tower palette); never hardcode hex colors.
3. **Preserve Working Code**: Do not refactor existing working code unless explicitly requested.
4. **Safety First**: Flag any potential route or component breaking risks to the user before making changes.
