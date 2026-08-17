# Roadmap

## Shipped — 90+ components

**Forms**: Button, ButtonGroup, Input, InputGroup, InputOTP, Textarea, Select, NativeSelect,
Checkbox, Radio, RadioGroup, Switch, Slider, Combobox, DatePicker, Calendar, Toggle, ToggleGroup,
Field, Label

**Display**: Card, Badge, Table, DataTable, Stat, Kbd, Avatar, Skeleton, Accordion, Collapsible,
Modal, Dialog, AlertDialog, Sheet, Drawer, Separator, Tooltip, Popover, HoverCard, Spreadsheet,
Chip, StatusDot, StatusPill, StatusBar, Empty, AspectRatio, ScrollArea, SectionHeader, Carousel,
FeedItem, Item, Resizable

**Feedback**: Alert, Progress, Spinner, Toast, Toaster

**Navigation**: Tabs, Breadcrumb, Dropdown, DropdownMenu, ContextMenu, Menubar, NavigationMenu,
Sidebar, BottomNav, Pagination, Command

**Cyber / terminal**: AugButton, AugPanel, GlowCard, PanelHeader, Terminal, HudBar, HudFrame,
Scanner, Interference, Gauge, Ticker, HBar, Clock, Transport, Chat, Typography

Each ships as CSS (`cd-*` classes) + a thin React wrapper (`cyberdesign/react`) + a full documented
React component with a Storybook story (`react-cyberdesign`).

## In progress

- **cyberdiagram (Phase 0 spike)**: isometric architecture maps. CSS lives in
  `packages/cyberdesign/src/css/components/iso.css`; projector in `src/js/iso.js`
  (`CdIsoScene`). Campus HUD demo: `packages/cyberdesign/examples/diagram.html`.
  Next is a typed model + `@nukleas/cyberdiagram` package (viewer-first, no editor).
- **Atlas maps (Phase 0)**: SVG world / US projector (`map.css` + `CdMapScene`).
  Demo: `packages/cyberdesign/examples/map.html`. Basemaps are vendored TopoJSON;
  jurisdiction, pins, and areas are data. No tile servers, no API keys.

## Under consideration

- **React chart wrappers**: `charts.css` + `charts.js` already ship CSS and canvas helpers
  (`CdLineChart`, `CdBarChart`, `CdWaveform`, `CdRadar`, plus `.cd-sparkline`, `.cd-histogram`,
  `.cd-activity-grid`, `.cd-timeline`) but no `react-cyberdesign` component wraps them yet — Stat
  and HBar are the only chart-family components with a React API so far.
- **Rating / ColorPicker / Tree view**: common in broader component-library parity checks, not
  requested yet.

Have a use case that needs one of these sooner, or an idea that's not listed? Open an issue — see
[CONTRIBUTING.md](./CONTRIBUTING.md).

## Not planned

Nothing at the moment — cyberdesign is intentionally the maximalist end of the design system
family (its calmer sibling, [corpo](https://github.com/nukleas/corpo), is where the cyber-only
families get intentionally left out). If a component would only make sense in a light, quiet,
business-UI register, it belongs in corpo instead of here.
