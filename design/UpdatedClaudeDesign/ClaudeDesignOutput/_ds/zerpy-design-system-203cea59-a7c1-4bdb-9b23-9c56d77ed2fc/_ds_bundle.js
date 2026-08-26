/* @ds-bundle: {"format":4,"namespace":"ZerpyDesignSystem_203cea","components":[{"name":"Button","sourcePath":"components/buttons/Button.tsx"},{"name":"CtaButton","sourcePath":"components/buttons/CtaButton.tsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.tsx"},{"name":"Badge","sourcePath":"components/data/Badge.tsx"},{"name":"CountBadge","sourcePath":"components/data/CountBadge.tsx"},{"name":"Progress","sourcePath":"components/data/Progress.tsx"},{"name":"Skeleton","sourcePath":"components/data/Skeleton.tsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.tsx"},{"name":"Tag","sourcePath":"components/data/Tag.tsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.tsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.tsx"},{"name":"Popover","sourcePath":"components/feedback/Popover.tsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.tsx"},{"name":"ToastStack","sourcePath":"components/feedback/Toast.tsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.tsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.tsx"},{"name":"Field","sourcePath":"components/forms/Field.tsx"},{"name":"Input","sourcePath":"components/forms/Input.tsx"},{"name":"Radio","sourcePath":"components/forms/Radio.tsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.tsx"},{"name":"Select","sourcePath":"components/forms/Select.tsx"},{"name":"Switch","sourcePath":"components/forms/Switch.tsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.tsx"},{"name":"CodeBlock","sourcePath":"components/marketing/CodeBlock.tsx"},{"name":"Hero","sourcePath":"components/marketing/Hero.tsx"},{"name":"PageShell","sourcePath":"components/surfaces/PageShell.tsx"},{"name":"Panel","sourcePath":"components/surfaces/Panel.tsx"},{"name":"SectionHeading","sourcePath":"components/surfaces/SectionHeading.tsx"}],"sourceHashes":{"components/buttons/Button.tsx":"566fc823acc6","components/buttons/CtaButton.tsx":"0449ffb2e65f","components/buttons/IconButton.tsx":"a407a0270c5e","components/data/Badge.tsx":"19b8bc2cea68","components/data/CountBadge.tsx":"9abe45ad1c4d","components/data/Progress.tsx":"273a7ea0e40c","components/data/Skeleton.tsx":"c18eea349d29","components/data/StatCard.tsx":"c1278a9d050b","components/data/Tag.tsx":"e5f55de5a569","components/feedback/Dialog.tsx":"35e25d5ccc12","components/feedback/EmptyState.tsx":"a230144e9a3e","components/feedback/Popover.tsx":"cd1dde06e259","components/feedback/Toast.tsx":"06dc17af18d4","components/feedback/Tooltip.tsx":"8fdee6b69bf2","components/forms/Checkbox.tsx":"aa8c97e06554","components/forms/Field.tsx":"e31b82f1211d","components/forms/Input.tsx":"39d3d6e66838","components/forms/Radio.tsx":"eec4fe491cf7","components/forms/SegmentedControl.tsx":"61d8be8affc5","components/forms/Select.tsx":"e2c6a13a75ab","components/forms/Switch.tsx":"efe847d4e734","components/forms/Textarea.tsx":"545f65a38db6","components/marketing/CodeBlock.tsx":"ed781f4f4986","components/marketing/Hero.tsx":"e7aecdcd4f2d","components/surfaces/PageShell.tsx":"ba841bc61035","components/surfaces/Panel.tsx":"164d004f1d96","components/surfaces/SectionHeading.tsx":"50366f7de98e","ui_kits/alt_tracker/AltTracker.jsx":"682f8f381dfb","ui_kits/alt_tracker/TrackerBoard.jsx":"eedbfba5a3d5","ui_kits/alt_tracker/tracker-data.jsx":"459c7f2a59b8","ui_kits/docs/Changelog.jsx":"718ed991a85d","ui_kits/docs/DocsPage.jsx":"92730ced86c5","ui_kits/docs/DocsSite.jsx":"6508d15d7876","ui_kits/docs/docs-data.jsx":"323c4f8dff7e","ui_kits/ds-runtime.js":"52b5d5f7bcc8","ui_kits/portfolio/Landing.jsx":"dc8ccbd202dd","ui_kits/portfolio/PortfolioSite.jsx":"693a0fbf0ef6","ui_kits/portfolio/ProjectPage.jsx":"838fd0b34b9e","ui_kits/portfolio/portfolio-data.jsx":"4ef7fde81df8","ui_kits/raid_calendar/RaidCalendar.jsx":"5ea40284e815","ui_kits/raid_calendar/calendar-data.jsx":"269ee5a8a9c0"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ZerpyDesignSystem_203cea = window.ZerpyDesignSystem_203cea || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const INTENTS = {
  primary: 'zp-primary',
  secondary: 'zp-secondary',
  ghost: 'zp-ghost',
  danger: 'zp-danger'
};
const SIZES = {
  sm: 'zp-sm',
  md: '',
  lg: 'zp-lg'
};
function Button({
  intent = 'secondary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  children,
  className = '',
  ...rest
}) {
  const cls = ['zp-btn', INTENTS[intent] || INTENTS.secondary, SIZES[size] || '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    disabled: disabled || loading
  }, rest), loading ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      border: '1.5px solid var(--zp-line-accent)',
      borderTopColor: 'transparent',
      animation: 'zp-spin .7s linear infinite',
      flex: '0 0 auto'
    }
  }) : icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flex: '0 0 auto'
    }
  }, icon) : null, children ? /*#__PURE__*/React.createElement("span", null, children) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.tsx", error: String((e && e.message) || e) }); }

// components/buttons/CtaButton.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CtaButton({
  variant = 'orbit',
  children,
  className = '',
  ...rest
}) {
  const orbit = variant === 'orbit' || variant === 'orbit-breathing';
  const cls = ['zp-cta', orbit ? 'zp-cta-orbit' : '', variant === 'orbit-breathing' || variant === 'breathing' ? 'zp-cta-pulse' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, rest), orbit ? /*#__PURE__*/React.createElement("span", {
    className: "zp-ring"
  }) : null, orbit ? /*#__PURE__*/React.createElement("span", {
    className: "zp-inner"
  }) : null, orbit ? /*#__PURE__*/React.createElement("span", {
    className: "zp-label"
  }, children) : children);
}
Object.assign(__ds_scope, { CtaButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/CtaButton.tsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  label,
  size = 'md',
  intent = 'secondary',
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Button, _extends({
    intent: intent,
    size: size,
    "aria-label": label,
    className: ['zp-icon', className].filter(Boolean).join(' ')
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.tsx", error: String((e && e.message) || e) }); }

// components/data/Badge.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  success: ['var(--zp-success)', 'var(--zp-success-tint)', 'var(--zp-success-line)'],
  warning: ['var(--zp-warning)', 'var(--zp-warning-tint)', 'var(--zp-warning-line)'],
  danger: ['var(--zp-danger)', 'var(--zp-danger-tint)', 'var(--zp-danger-line)'],
  info: ['var(--zp-info)', 'var(--zp-info-tint)', 'var(--zp-info-line)'],
  neutral: ['var(--zp-text-3)', 'var(--zp-surface-2)', 'var(--zp-line-strong)']
};
function Badge({
  tone = 'neutral',
  dot = true,
  children,
  style,
  ...rest
}) {
  const [color, bg, border] = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 9px',
      borderRadius: 'var(--zp-radius)',
      border: `1px solid ${border}`,
      background: bg,
      font: 'var(--zp-text-micro)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color,
      ...style
    }
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 8px ${color}`
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Badge.tsx", error: String((e && e.message) || e) }); }

// components/data/CountBadge.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CountBadge({
  tone = 'accent',
  children,
  style,
  ...rest
}) {
  const danger = tone === 'danger';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 22,
      height: 22,
      padding: '0 6px',
      borderRadius: 'var(--zp-radius-pill)',
      background: danger ? 'var(--zp-danger-tint)' : 'var(--zp-accent-tint-strong)',
      border: `1px solid ${danger ? 'var(--zp-danger-line)' : 'var(--zp-line-accent)'}`,
      font: 'var(--zp-text-micro)',
      fontVariantNumeric: 'tabular-nums',
      color: danger ? 'var(--zp-danger-text)' : 'var(--zp-accent-100)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { CountBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/CountBadge.tsx", error: String((e && e.message) || e) }); }

// components/data/Progress.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Progress({
  value,
  label,
  caption,
  style,
  ...rest
}) {
  const indeterminate = value == null;
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-2)',
      maxWidth: 460,
      ...style
    }
  }, rest), label || caption ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-3)'
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, label) : null, caption ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--zp-text-2)'
    }
  }, caption) : null) : null, /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-valuenow": indeterminate ? undefined : pct,
    style: {
      position: 'relative',
      height: 6,
      borderRadius: 'var(--zp-radius-pill)',
      background: 'var(--zp-surface-2)',
      border: '1px solid var(--zp-line)',
      overflow: 'hidden'
    }
  }, indeterminate ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '38%',
      borderRadius: 'var(--zp-radius-pill)',
      background: 'linear-gradient(90deg,transparent,var(--zp-accent-400),transparent)',
      animation: 'zp-indet 1.4s var(--zp-ease) infinite'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      background: 'linear-gradient(90deg,var(--zp-accent-600),var(--zp-accent-300))',
      boxShadow: 'var(--zp-accent-glow)'
    }
  })));
}
Object.assign(__ds_scope, { Progress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Progress.tsx", error: String((e && e.message) || e) }); }

// components/data/Skeleton.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Skeleton({
  width = '100%',
  height = 10,
  radius,
  shape = 'shimmer',
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    "aria-hidden": "true",
    className: shape === 'pulse' ? 'zp-sk-pulse' : 'zp-sk',
    style: {
      width,
      height,
      borderRadius: radius != null ? radius : 'var(--zp-radius-xs)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Skeleton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Skeleton.tsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StatCard({
  label,
  value,
  delta,
  deltaTone = 'neutral',
  loading = false,
  style,
  ...rest
}) {
  const tones = {
    up: 'var(--zp-success)',
    down: 'var(--zp-warning)',
    neutral: 'var(--zp-text-4)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      boxSizing: 'border-box',
      padding: 'var(--zp-space-4)',
      borderRadius: 'var(--zp-radius)',
      border: '1px solid var(--zp-line)',
      background: 'var(--zp-surface-1)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-2)',
      ...style
    }
  }, rest), loading ? /*#__PURE__*/React.createElement("div", {
    className: "zp-sk",
    style: {
      height: 8,
      width: '64%'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, label), loading ? /*#__PURE__*/React.createElement("div", {
    className: "zp-sk",
    style: {
      height: 26,
      width: '52%'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-h2)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--zp-text)'
    }
  }, value), !loading && delta ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: tones[deltaTone] || tones.neutral
    }
  }, delta) : null);
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.tsx", error: String((e && e.message) || e) }); }

// components/data/Tag.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  selected = false,
  rail,
  onDismiss,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: onDismiss ? '4px 6px 4px 10px' : rail ? '4px 10px 4px 7px' : '4px 10px',
      borderRadius: 'var(--zp-radius)',
      border: `1px solid ${selected ? 'var(--zp-line-accent)' : 'var(--zp-line-strong)'}`,
      background: selected ? 'var(--zp-accent-tint)' : 'var(--zp-surface-2)',
      font: 'var(--zp-text-label)',
      color: selected ? 'var(--zp-accent-200)' : 'var(--zp-text-2)',
      ...style
    }
  }, rest), rail ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 14,
      borderRadius: 1,
      background: rail,
      flex: '0 0 auto'
    }
  }) : null, children, onDismiss ? /*#__PURE__*/React.createElement("span", {
    role: "button",
    "aria-label": "Remove",
    onClick: onDismiss,
    style: {
      font: 'var(--zp-text-micro)',
      color: 'var(--zp-text-4)',
      cursor: 'pointer'
    }
  }, "\u2715") : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Tag.tsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.tsx
try { (() => {
function Dialog({
  open = true,
  title,
  description,
  onClose,
  footer,
  width = 420,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'rgba(6,6,14,.62)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--zp-space-6)'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: width,
      padding: 'var(--zp-space-6)',
      borderRadius: 'var(--zp-radius-md)',
      border: '1px solid var(--zp-line-strong)',
      background: 'var(--zp-surface-overlay)',
      backdropFilter: 'blur(var(--zp-blur-lg))',
      boxShadow: 'var(--zp-elev-overlay)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-5)',
      animation: 'zp-slide-in var(--zp-dur) var(--zp-ease)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-h3)',
      color: 'var(--zp-text)'
    }
  }, title), description ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-3)',
      maxWidth: '48ch',
      textWrap: 'pretty'
    }
  }, description) : null), onClose ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "Close",
    intent: "ghost",
    size: "sm",
    onClick: onClose
  }, "\u2715") : null), children, footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--zp-space-2)'
    }
  }, footer) : null));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.tsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function EmptyState({
  glyph,
  title,
  body,
  action,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      boxSizing: 'border-box',
      padding: 'var(--zp-space-8) var(--zp-space-6)',
      borderRadius: 'var(--zp-radius)',
      border: '1px dashed var(--zp-line-strong)',
      background: 'var(--zp-surface-1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--zp-space-3)',
      textAlign: 'center',
      ...style
    }
  }, rest), glyph ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--zp-radius)',
      border: '1px solid var(--zp-line-accent)',
      background: 'var(--zp-accent-tint)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: '500 15px var(--zp-font-data)',
      color: 'var(--zp-accent-200)'
    }
  }, glyph) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-h3)',
      color: 'var(--zp-text)'
    }
  }, title), body ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-3)',
      maxWidth: '40ch',
      textWrap: 'pretty'
    }
  }, body) : null, action || null);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.tsx", error: String((e && e.message) || e) }); }

// components/feedback/Popover.tsx
try { (() => {
function Popover({
  open = false,
  onClose,
  items,
  children,
  align = 'left',
  style
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 46,
      [align]: 0,
      zIndex: 30,
      minWidth: 208,
      padding: 'var(--zp-space-2)',
      borderRadius: 'var(--zp-radius-md)',
      border: '1px solid var(--zp-line-strong)',
      background: 'var(--zp-surface-overlay)',
      backdropFilter: 'blur(var(--zp-blur-lg))',
      boxShadow: 'var(--zp-elev-overlay)',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      animation: 'zp-slide-in var(--zp-dur-fast) var(--zp-ease)',
      ...style
    },
    role: "menu"
  }, items ? items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.label,
    role: "menuitem",
    onClick: () => {
      if (it.onClick) it.onClick();
      if (onClose) onClose();
    },
    className: "zp-btn zp-ghost",
    style: {
      justifyContent: 'flex-start',
      height: 32,
      width: '100%',
      color: it.tone === 'danger' ? 'var(--zp-danger)' : 'var(--zp-text-2)'
    }
  }, it.label)) : children);
}
Object.assign(__ds_scope, { Popover });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Popover.tsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  success: ['var(--zp-success)', 'var(--zp-success-line)'],
  warning: ['var(--zp-warning)', 'var(--zp-warning-line)'],
  danger: ['var(--zp-danger)', 'var(--zp-danger-line)'],
  info: ['var(--zp-info)', 'var(--zp-info-line)']
};
function Toast({
  tone = 'info',
  title,
  body,
  onDismiss,
  style,
  ...rest
}) {
  const [dot, border] = TONES[tone] || TONES.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      minWidth: 264,
      padding: 'var(--zp-space-4)',
      borderRadius: 'var(--zp-radius-md)',
      border: `1px solid ${border}`,
      background: 'var(--zp-surface-overlay)',
      backdropFilter: 'blur(var(--zp-blur-lg))',
      boxShadow: 'var(--zp-elev-overlay)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--zp-space-3)',
      animation: 'zp-slide-in var(--zp-dur) var(--zp-ease)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      marginTop: 6,
      borderRadius: '50%',
      background: dot,
      boxShadow: `0 0 8px ${dot}`,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-label)',
      color: 'var(--zp-text)'
    }
  }, title), body ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-3)'
    }
  }, body) : null), onDismiss ? /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss,
    "aria-label": "Dismiss",
    style: {
      border: 'none',
      background: 'none',
      color: 'var(--zp-text-4)',
      font: 'var(--zp-text-sm)',
      cursor: 'pointer',
      padding: 0
    }
  }, "\u2715") : null);
}
function ToastStack({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'fixed',
      right: 'var(--zp-space-6)',
      bottom: 'var(--zp-space-6)',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-2)',
      alignItems: 'flex-end',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Toast, ToastStack });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.tsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.tsx
try { (() => {
function Tooltip({
  content,
  placement = 'top',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const pos = placement === 'bottom' ? {
    top: 44,
    left: '50%',
    transform: 'translateX(-50%)'
  } : {
    bottom: 44,
    left: '50%',
    transform: 'translateX(-50%)'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, children, open ? /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      ...pos,
      whiteSpace: 'nowrap',
      zIndex: 20,
      padding: '6px 9px',
      borderRadius: 'var(--zp-radius)',
      border: '1px solid var(--zp-line-strong)',
      background: 'var(--zp-surface-overlay)',
      backdropFilter: 'blur(var(--zp-blur-lg))',
      boxShadow: 'var(--zp-elev-overlay)',
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-2)',
      animation: 'zp-slide-in var(--zp-dur-fast) var(--zp-ease)'
    }
  }, content) : null);
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.tsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    role: "checkbox",
    "aria-checked": checked,
    disabled: disabled,
    onClick: onChange ? () => onChange(!checked) : undefined,
    className: "zp-choice"
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      flex: '0 0 auto',
      borderRadius: 'var(--zp-radius-xs)',
      border: `1px solid ${checked ? 'var(--zp-line-accent)' : 'var(--zp-line-strong)'}`,
      background: checked ? 'var(--zp-accent-tint-strong)' : 'var(--zp-surface-choice)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: '600 10px var(--zp-font-ui)',
      color: 'var(--zp-accent-100)',
      transition: 'all var(--zp-dur) var(--zp-ease)'
    }
  }, checked ? '✓' : ''), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-md)',
      color: checked ? 'var(--zp-text)' : 'var(--zp-text-2)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.tsx", error: String((e && e.message) || e) }); }

// components/forms/Field.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, rest), label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: error ? 'var(--zp-danger)' : 'var(--zp-text-4)'
    }
  }, label) : null, children, error ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-danger)'
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-4)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.tsx", error: String((e && e.message) || e) }); }

// components/forms/Input.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  invalid = false,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    className: ['zp-in', invalid ? 'zp-in-err' : '', className].filter(Boolean).join(' ')
  }, rest));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.tsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Radio({
  checked = false,
  onChange,
  label,
  disabled = false,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    role: "radio",
    "aria-checked": checked,
    disabled: disabled,
    onClick: onChange ? () => onChange(true) : undefined,
    className: "zp-choice"
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      flex: '0 0 auto',
      borderRadius: '50%',
      border: `1px solid ${checked ? 'var(--zp-line-accent)' : 'var(--zp-line-strong)'}`,
      background: checked ? 'var(--zp-accent-tint)' : 'var(--zp-surface-choice)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--zp-dur) var(--zp-ease)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: checked ? 'var(--zp-accent-200)' : 'transparent'
    }
  })), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-md)',
      color: checked ? 'var(--zp-text)' : 'var(--zp-text-2)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.tsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SegmentedControl({
  options = [],
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      padding: 3,
      gap: 3,
      borderRadius: 'var(--zp-radius)',
      border: '1px solid var(--zp-line-strong)',
      background: 'var(--zp-surface-inset)',
      width: 'fit-content',
      ...style
    }
  }, rest), options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const label = typeof o === 'string' ? o : o.label;
    const on = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": on,
      onClick: onChange ? () => onChange(v) : undefined,
      className: "zp-seg-btn",
      style: {
        border: `1px solid ${on ? 'var(--zp-line-accent)' : 'transparent'}`,
        background: on ? 'var(--zp-accent-tint)' : 'transparent',
        color: on ? 'var(--zp-accent-100)' : 'var(--zp-text-3)'
      }
    }, label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.tsx", error: String((e && e.message) || e) }); }

// components/forms/Select.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  invalid = false,
  options,
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("select", _extends({
    className: ['zp-in', invalid ? 'zp-in-err' : '', className].filter(Boolean).join(' ')
  }, rest), options ? options.map(o => {
    const value = typeof o === 'string' ? o : o.value;
    const label = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: value,
      value: value
    }, label);
  }) : children);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.tsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  ...rest
}) {
  const track = /*#__PURE__*/React.createElement("button", _extends({
    role: "switch",
    "aria-checked": checked,
    "aria-label": label ? undefined : 'Toggle',
    disabled: disabled,
    onClick: onChange ? () => onChange(!checked) : undefined,
    className: "zp-switch",
    style: {
      border: `1px solid ${checked ? 'var(--zp-line-accent)' : 'var(--zp-line-strong)'}`,
      background: checked ? 'var(--zp-accent-tint-strong)' : 'var(--zp-surface-2)',
      boxShadow: checked ? 'var(--zp-accent-glow)' : 'none',
      opacity: disabled ? 0.45 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 20 : 2,
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: checked ? 'var(--zp-accent-200)' : 'var(--zp-text-4)',
      transition: 'left var(--zp-dur) var(--zp-ease)'
    }
  }));
  if (!label) return track;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-5)',
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-label)',
      color: 'var(--zp-text)'
    }
  }, label), description ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-4)'
    }
  }, description) : null), track);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.tsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  invalid = false,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    className: ['zp-in', 'zp-ta', invalid ? 'zp-in-err' : '', className].filter(Boolean).join(' ')
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.tsx", error: String((e && e.message) || e) }); }

// components/marketing/CodeBlock.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* One pass, five token classes. Each pass of a multi-pass highlighter would
   re-scan the markup the previous pass injected (and `class` is itself a
   keyword), so the whole line is matched once and every unmatched chunk is
   escaped as it goes. A design system should not ship a parser. */
const TOKEN = /(\/\/[^\n]*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|(\b(?:const|let|var|function|return|if|else|for|of|in|new|await|async|import|from|export|type|interface|class|extends|null|undefined|true|false)\b)|(\b[A-Za-z_$][\w$]*(?=\())/g;
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function mark(line) {
  let out = '';
  let last = 0;
  let m;
  TOKEN.lastIndex = 0;
  while (m = TOKEN.exec(line)) {
    out += esc(line.slice(last, m.index));
    const kind = m[1] ? 'com' : m[2] ? 'str' : m[3] ? 'num' : m[4] ? 'key' : 'fn';
    out += '<span class="zp-tok-' + kind + '">' + esc(m[0]) + '</span>';
    last = m.index + m[0].length;
  }
  return out + esc(line.slice(last));
}
function CodeBlock({
  code,
  filename,
  language,
  lineNumbers = false,
  style,
  ...rest
}) {
  const [copied, setCopied] = React.useState(false);
  const lines = String(code).replace(/\n$/, '').split('\n');
  const copy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      boxSizing: 'border-box',
      borderRadius: 'var(--zp-radius)',
      border: '1px solid var(--zp-line)',
      background: 'var(--zp-surface-field)',
      overflow: 'hidden',
      ...style
    }
  }, rest), filename || language ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-3)',
      padding: '7px var(--zp-space-3)',
      borderBottom: '1px solid var(--zp-line)',
      background: 'var(--zp-surface-1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, filename || language), /*#__PURE__*/React.createElement("button", {
    onClick: copy,
    className: "zp-btn zp-ghost zp-sm",
    style: {
      height: 22,
      padding: '0 8px'
    }
  }, copied ? 'Copied' : 'Copy')) : null, /*#__PURE__*/React.createElement("pre", {
    className: "zp-code",
    style: {
      margin: 0,
      padding: 'var(--zp-space-4)',
      overflowX: 'auto',
      font: 'var(--zp-text-data)',
      color: 'var(--zp-text-2)'
    }
  }, /*#__PURE__*/React.createElement("code", null, lines.map((line, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 'var(--zp-space-4)',
      minHeight: '1.4em'
    }
  }, lineNumbers ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      width: 18,
      textAlign: 'right',
      color: 'var(--zp-text-4)',
      userSelect: 'none'
    }
  }, i + 1) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'pre'
    },
    dangerouslySetInnerHTML: {
      __html: mark(line) || '\u00a0'
    }
  }))))));
}
Object.assign(__ds_scope, { CodeBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/CodeBlock.tsx", error: String((e && e.message) || e) }); }

// components/marketing/Hero.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Hero({
  eyebrow,
  title,
  lede,
  actions,
  aside,
  align = 'left',
  style,
  ...rest
}) {
  const center = align === 'center';
  return /*#__PURE__*/React.createElement("section", _extends({
    style: {
      display: 'grid',
      gridTemplateColumns: aside ? 'minmax(0,1fr) minmax(0,.72fr)' : 'minmax(0,1fr)',
      alignItems: 'center',
      gap: 'var(--zp-space-9)',
      padding: 'var(--zp-space-9) 0 var(--zp-space-8)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: center ? 'center' : 'flex-start',
      textAlign: center ? 'center' : 'left',
      gap: 'var(--zp-space-5)'
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, eyebrow) : null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--zp-text-display)',
      letterSpacing: 'var(--zp-tracking-tight)',
      background: 'var(--zp-gradient-text)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      maxWidth: '22ch',
      textWrap: 'pretty'
    }
  }, title), lede ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--zp-text-lg)',
      color: 'var(--zp-text-3)',
      maxWidth: '52ch',
      textWrap: 'pretty'
    }
  }, lede) : null, actions ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'var(--zp-space-3)',
      marginTop: 'var(--zp-space-2)'
    }
  }, actions) : null), aside ? /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, aside) : null);
}
Object.assign(__ds_scope, { Hero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/Hero.tsx", error: String((e && e.message) || e) }); }

// components/surfaces/PageShell.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PageShell({
  starfield = true,
  maxWidth = 1040,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      boxSizing: 'border-box',
      minHeight: '100vh',
      padding: 'var(--zp-space-9) var(--zp-space-8) var(--zp-space-10)',
      color: 'var(--zp-text)',
      fontFamily: 'var(--zp-font-body)',
      background: 'var(--zp-ground)',
      overflow: 'hidden',
      ...style
    }
  }, rest), starfield ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      opacity: 'var(--zp-starfield-opacity)',
      backgroundImage: 'var(--zp-starfield)'
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-10)'
    }
  }, children));
}
Object.assign(__ds_scope, { PageShell });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/PageShell.tsx", error: String((e && e.message) || e) }); }

// components/surfaces/Panel.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Panel({
  elevation = 'panel',
  padding = 'var(--zp-space-6)',
  children,
  style,
  ...rest
}) {
  const overlay = elevation === 'overlay';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      boxSizing: 'border-box',
      padding,
      borderRadius: overlay ? 'var(--zp-radius-md)' : 'var(--zp-radius)',
      border: `1px solid ${overlay ? 'var(--zp-line-strong)' : 'var(--zp-line)'}`,
      background: overlay ? 'var(--zp-surface-overlay)' : elevation === 'flat' ? 'var(--zp-surface-1)' : 'var(--zp-surface-panel)',
      backdropFilter: elevation === 'flat' ? undefined : `blur(var(--zp-blur-${overlay ? 'lg' : 'md'}))`,
      boxShadow: elevation === 'flat' ? 'var(--zp-elev-flat)' : overlay ? 'var(--zp-elev-overlay)' : 'var(--zp-elev-panel)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Panel.tsx", error: String((e && e.message) || e) }); }

// components/surfaces/SectionHeading.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-4)',
      flexWrap: 'wrap',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-1)'
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, eyebrow) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-h2)',
      color: 'var(--zp-text)'
    }
  }, title), description ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-3)',
      maxWidth: '64ch',
      textWrap: 'pretty',
      marginTop: 'var(--zp-space-1)'
    }
  }, description) : null), action || null);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/SectionHeading.tsx", error: String((e && e.message) || e) }); }

// ui_kits/alt_tracker/AltTracker.jsx
try { (() => {
/* Alt Tracker — the app view: character rail, stats, task board, marks panel.
   Answers one question: who do I log in tonight. */

function AltTracker() {
  const [tasks, setTasks] = React.useState(TASKS_SEED);
  const [char, setChar] = React.useState(null);
  const [view, setView] = React.useState('Open');
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState({
    title: '',
    detail: '',
    char: 'Thrashclaw',
    kind: 'Item',
    priority: 'mid'
  });
  const [toasts, setToasts] = React.useState([]);
  const push = (title, body) => {
    const id = Date.now();
    setToasts(t => t.concat([{
      id,
      title,
      body
    }]));
    window.setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4200);
  };
  const toggle = id => {
    setTasks(list => list.map(t => {
      if (t.id !== id) return t;
      if (!t.done) push('Task closed', t.char + ' · ' + t.title);
      return Object.assign({}, t, {
        done: !t.done
      });
    }));
  };
  const create = () => {
    const t = Object.assign({
      id: Date.now(),
      done: false
    }, draft, {
      title: draft.title.trim()
    });
    setTasks(list => list.concat([t]));
    setAdding(false);
    setDraft({
      title: '',
      detail: '',
      char: draft.char,
      kind: draft.kind,
      priority: 'mid'
    });
    push('Task added', t.char + ' · ' + t.title);
  };
  const openCount = name => tasks.filter(t => t.char === name && !t.done).length;
  const visible = tasks.filter(t => char ? t.char === char : true).filter(t => view === 'All' ? true : view === 'Open' ? !t.done : t.done);
  const open = tasks.filter(t => !t.done).length;
  const shortTotal = CHARS.reduce((n, c) => n + markShort(c), 0);
  const capped = CHARS.filter(c => markShort(c) === 0).length;
  return /*#__PURE__*/React.createElement(PageShell, {
    maxWidth: 1280,
    style: {
      padding: 'var(--zp-space-7) var(--zp-space-6) var(--zp-space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-4)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-h1)',
      letterSpacing: 'var(--zp-tracking-tight)',
      background: 'var(--zp-gradient-text)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, "Alt Tracker"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-3)'
    }
  }, "Six characters \xB7 ", open, " open tasks")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    options: ['Open', 'Done', 'All'],
    value: view,
    onChange: setView
  }), /*#__PURE__*/React.createElement(Button, {
    intent: "primary",
    onClick: () => setAdding(true)
  }, "Add task"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'var(--zp-space-4)'
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Open tasks",
    value: open,
    delta: '-2 vs last week',
    deltaTone: "up"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Marks short",
    value: shortTotal,
    delta: "+5 vs average",
    deltaTone: "down"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Capped chars",
    value: capped + ' / ' + CHARS.length
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Ready to raid",
    value: "4",
    delta: "+1 vs last tier",
    deltaTone: "up"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '236px minmax(0,1fr)',
      gap: 'var(--zp-space-5)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    padding: "var(--zp-space-3)",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)',
      padding: 'var(--zp-space-2) var(--zp-space-3)'
    }
  }, "Characters"), CHARS.map(c => /*#__PURE__*/React.createElement(CharacterRow, {
    key: c.name,
    c: c,
    selected: char === c.name,
    count: openCount(c.name),
    onSelect: setChar
  })), char ? /*#__PURE__*/React.createElement(Button, {
    intent: "ghost",
    size: "sm",
    onClick: () => setChar(null),
    style: {
      marginTop: 'var(--zp-space-2)'
    }
  }, "Clear filter") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-5)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-3)',
      padding: 'var(--zp-space-4)',
      borderBottom: '1px solid var(--zp-line-strong)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-h3)',
      color: 'var(--zp-text)'
    }
  }, char || 'All characters'), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--zp-space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, "Showing"), /*#__PURE__*/React.createElement(CountBadge, null, visible.length))), visible.length ? visible.map((t, i) => /*#__PURE__*/React.createElement(TaskRow, {
    key: t.id,
    t: t,
    first: i === 0,
    onToggle: toggle
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--zp-space-5)'
    }
  }, /*#__PURE__*/React.createElement(EmptyState, {
    glyph: "0",
    title: view === 'Done' ? 'Nothing closed yet' : 'Nothing open here',
    body: char ? 'Clear the character filter, or add a task for ' + char + '.' : 'Add a task, or switch the filter to All.',
    action: /*#__PURE__*/React.createElement(Button, {
      onClick: () => setAdding(true)
    }, "Add task")
  }))), /*#__PURE__*/React.createElement(MarksPanel, {
    chars: CHARS
  })))), /*#__PURE__*/React.createElement(Dialog, {
    open: adding,
    title: "Add a task",
    description: "Tasks belong to a character, not a category \u2014 that is how the question gets asked.",
    onClose: () => setAdding(false),
    width: 392,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      intent: "ghost",
      onClick: () => setAdding(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      intent: "primary",
      disabled: !draft.title.trim(),
      onClick: create
    }, "Add task"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Task"
  }, /*#__PURE__*/React.createElement(Input, {
    autoFocus: true,
    placeholder: "Skullflame Shield",
    value: draft.title,
    onChange: e => setDraft(Object.assign({}, draft, {
      title: e.target.value
    }))
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Detail",
    hint: "Where it comes from, or what it is waiting on."
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Drops in Blackrock Depths",
    value: draft.detail,
    onChange: e => setDraft(Object.assign({}, draft, {
      detail: e.target.value
    }))
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Character"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--zp-space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 20,
      borderRadius: 1,
      background: CLASS_COLOR[(CHARS.find(c => c.name === draft.char) || CHARS[0]).cls],
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement(Select, {
    options: CHARS.map(c => c.name),
    value: draft.char,
    onChange: e => setDraft(Object.assign({}, draft, {
      char: e.target.value
    }))
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Kind"
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    options: ['Item', 'Marks', 'Rep'],
    value: draft.kind,
    onChange: v => setDraft(Object.assign({}, draft, {
      kind: v
    })),
    style: {
      width: '100%'
    }
  })))), /*#__PURE__*/React.createElement(ToastStack, null, toasts.map(t => /*#__PURE__*/React.createElement(Toast, {
    key: t.id,
    tone: "success",
    title: t.title,
    body: t.body,
    onDismiss: () => setToasts(x => x.filter(y => y.id !== t.id))
  }))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/alt_tracker/AltTracker.jsx", error: String((e && e.message) || e) }); }

// ui_kits/alt_tracker/TrackerBoard.jsx
try { (() => {
/* Alt Tracker — the character rail, the task rows and the marks panel. */

function CharacterRow({
  c,
  selected,
  count,
  onSelect
}) {
  const [hover, setHover] = React.useState(false);
  const on = selected;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onSelect(on ? null : c.name),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--zp-space-3)',
      width: '100%',
      boxSizing: 'border-box',
      padding: 'var(--zp-space-3)',
      textAlign: 'left',
      cursor: 'pointer',
      borderRadius: 'var(--zp-radius)',
      border: `1px solid ${on ? 'var(--zp-line-accent)' : 'transparent'}`,
      background: on ? 'var(--zp-accent-tint)' : hover ? 'var(--zp-surface-2)' : 'transparent',
      transition: 'all var(--zp-dur) var(--zp-ease)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 26,
      borderRadius: 1,
      background: CLASS_COLOR[c.cls],
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-label)',
      color: 'var(--zp-text)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, c.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      color: 'var(--zp-text-4)'
    }
  }, c.level, " ", c.cls)), count ? /*#__PURE__*/React.createElement(CountBadge, null, count) : null);
}
function TaskRow({
  t,
  first,
  onToggle,
  onMenu
}) {
  const c = CHARS.find(x => x.name === t.char);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '26px minmax(0,1fr) 92px 118px 38px',
      alignItems: 'center',
      gap: 'var(--zp-space-3)',
      padding: 'var(--zp-space-3) var(--zp-space-4)',
      borderTop: first ? 'none' : '1px solid var(--zp-line)',
      opacity: t.done ? 0.55 : 1
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: t.done,
    onChange: () => onToggle(t.id)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-md)',
      color: 'var(--zp-text)',
      textDecoration: t.done ? 'line-through' : 'none',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, t.title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-4)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, t.detail)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 2,
      background: KIND_SERIES[t.kind]
    }
  }), t.kind), /*#__PURE__*/React.createElement(Tag, {
    rail: c ? CLASS_COLOR[c.cls] : undefined
  }, t.char), /*#__PURE__*/React.createElement(Badge, {
    tone: PRIORITY_TONE[t.priority],
    dot: true,
    style: {
      justifySelf: 'end'
    }
  }, t.priority));
}
function MarksPanel({
  chars
}) {
  return /*#__PURE__*/React.createElement(Panel, {
    padding: "var(--zp-space-5)",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-4)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Battlegrounds",
    title: "Marks to cap",
    description: "Twenty of each set per character."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-4)'
    }
  }, chars.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.name,
    style: {
      display: 'grid',
      gridTemplateColumns: '130px minmax(0,1fr) 62px',
      alignItems: 'center',
      gap: 'var(--zp-space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 14,
      borderRadius: 1,
      background: CLASS_COLOR[c.cls],
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-label)',
      color: 'var(--zp-text-2)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, c.name)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 3,
      height: 8
    }
  }, ['warsong', 'arathi', 'alterac'].map((k, i) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      flex: 1,
      position: 'relative',
      borderRadius: 'var(--zp-radius-pill)',
      background: 'var(--zp-surface-2)',
      border: '1px solid var(--zp-line)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      width: c.marks[k] / MARK_CAP * 100 + '%',
      background: ['var(--zp-cat-2)', 'var(--zp-cat-6)', 'var(--zp-cat-8)'][i]
    }
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      fontVariantNumeric: 'tabular-nums',
      color: markShort(c) === 0 ? 'var(--zp-success)' : 'var(--zp-text-2)',
      textAlign: 'right'
    }
  }, markShort(c) === 0 ? 'capped' : markShort(c) + ' short')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--zp-space-4)',
      paddingTop: 'var(--zp-space-2)',
      borderTop: '1px solid var(--zp-line)'
    }
  }, [['Warsong', 'var(--zp-cat-2)'], ['Arathi', 'var(--zp-cat-6)'], ['Alterac', 'var(--zp-cat-8)']].map(([l, col]) => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      background: col
    }
  }), l))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/alt_tracker/TrackerBoard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/alt_tracker/tracker-data.jsx
try { (() => {
/* Alt Tracker — data. Classic Babel script; these bindings are global to the kit. */

const CHARS = [{
  name: 'Thrashclaw',
  cls: 'Druid',
  level: 60,
  faction: 'Horde',
  marks: {
    warsong: 18,
    arathi: 12,
    alterac: 20
  }
}, {
  name: 'Stormcaller',
  cls: 'Shaman',
  level: 60,
  faction: 'Horde',
  marks: {
    warsong: 6,
    arathi: 20,
    alterac: 9
  }
}, {
  name: 'Windrunner',
  cls: 'Hunter',
  level: 60,
  faction: 'Horde',
  marks: {
    warsong: 20,
    arathi: 20,
    alterac: 20
  }
}, {
  name: 'Ironhide',
  cls: 'Warrior',
  level: 58,
  faction: 'Alliance',
  marks: {
    warsong: 3,
    arathi: 0,
    alterac: 11
  }
}, {
  name: 'Emberveil',
  cls: 'Mage',
  level: 60,
  faction: 'Horde',
  marks: {
    warsong: 14,
    arathi: 7,
    alterac: 2
  }
}, {
  name: 'Duskbinder',
  cls: 'Warlock',
  level: 47,
  faction: 'Horde',
  marks: {
    warsong: 0,
    arathi: 0,
    alterac: 0
  }
}];
const CLASS_COLOR = {
  Druid: 'var(--zp-class-druid)',
  Shaman: 'var(--zp-class-shaman)',
  Hunter: 'var(--zp-class-hunter)',
  Warrior: 'var(--zp-class-warrior)',
  Mage: 'var(--zp-class-mage)',
  Warlock: 'var(--zp-class-warlock)',
  Priest: 'var(--zp-class-priest)',
  Rogue: 'var(--zp-class-rogue)',
  Paladin: 'var(--zp-class-paladin)'
};
const MARK_CAP = 20;
const TASKS_SEED = [{
  id: 1,
  char: 'Thrashclaw',
  kind: 'Item',
  title: 'Skullflame Shield',
  detail: 'Drops in Blackrock Depths',
  done: false,
  priority: 'high'
}, {
  id: 2,
  char: 'Thrashclaw',
  kind: 'Rep',
  title: 'Timbermaw to honored',
  detail: '2,400 to go',
  done: false,
  priority: 'low'
}, {
  id: 3,
  char: 'Stormcaller',
  kind: 'Marks',
  title: 'Cap Warsong marks',
  detail: '14 short of the cap',
  done: false,
  priority: 'high'
}, {
  id: 4,
  char: 'Stormcaller',
  kind: 'Item',
  title: 'Windfury totem quest',
  detail: 'Chain starts in Orgrimmar',
  done: true,
  priority: 'low'
}, {
  id: 5,
  char: 'Windrunner',
  kind: 'Quest',
  title: 'Turn in all three mark sets',
  detail: 'All capped, ready to hand in',
  done: false,
  priority: 'high'
}, {
  id: 6,
  char: 'Ironhide',
  kind: 'Level',
  title: 'Get to 60',
  detail: 'Two levels out',
  done: false,
  priority: 'mid'
}, {
  id: 7,
  char: 'Ironhide',
  kind: 'Item',
  title: 'Whirlwind Axe',
  detail: 'Quest chain, needs a group',
  done: false,
  priority: 'mid'
}, {
  id: 8,
  char: 'Emberveil',
  kind: 'Item',
  title: 'Robe of Volatile Power',
  detail: 'Waiting on a tailor',
  done: false,
  priority: 'mid'
}, {
  id: 9,
  char: 'Emberveil',
  kind: 'Rep',
  title: 'Argent Dawn to revered',
  detail: 'Scourgestones banked',
  done: true,
  priority: 'low'
}, {
  id: 10,
  char: 'Duskbinder',
  kind: 'Level',
  title: 'Dreadsteed at 60',
  detail: 'Long way off',
  done: false,
  priority: 'low'
}];
const PRIORITY_TONE = {
  high: 'danger',
  mid: 'warning',
  low: 'neutral'
};
const KIND_SERIES = {
  Item: 'var(--zp-cat-1)',
  Marks: 'var(--zp-cat-2)',
  Rep: 'var(--zp-cat-3)',
  Quest: 'var(--zp-cat-4)',
  Level: 'var(--zp-cat-5)'
};
function markTotal(c) {
  return c.marks.warsong + c.marks.arathi + c.marks.alterac;
}
function markShort(c) {
  return MARK_CAP * 3 - markTotal(c);
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/alt_tracker/tracker-data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs/Changelog.jsx
try { (() => {
/* Docs — the changelog surface. */

function Release({
  r
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '148px minmax(0,1fr)',
      gap: 'var(--zp-space-5)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-2)',
      position: 'sticky',
      top: 'var(--zp-space-6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-h3)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--zp-text)'
    }
  }, r.version), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-4)'
    }
  }, r.date), r.label ? /*#__PURE__*/React.createElement(Badge, {
    tone: r.tone,
    style: {
      alignSelf: 'flex-start'
    }
  }, r.label) : null), /*#__PURE__*/React.createElement(Panel, {
    padding: "0"
  }, r.changes.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c[1],
    style: {
      display: 'grid',
      gridTemplateColumns: '96px minmax(0,1fr)',
      gap: 'var(--zp-space-4)',
      alignItems: 'baseline',
      padding: 'var(--zp-space-3) var(--zp-space-4)',
      borderTop: i ? '1px solid var(--zp-line)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: CHANGE_TONE[c[0]],
    dot: false
  }, c[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-md)',
      color: 'var(--zp-text-2)',
      textWrap: 'pretty'
    }
  }, c[1])))));
}
function Changelog() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, "Reference"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--zp-text-h1)',
      letterSpacing: 'var(--zp-tracking-tight)',
      color: 'var(--zp-text)'
    }
  }, "Changelog"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--zp-text-lg)',
      color: 'var(--zp-text-2)',
      maxWidth: '68ch',
      textWrap: 'pretty'
    }
  }, "Every release, newest first. Breaking changes are called out as Removed.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-8)'
    }
  }, RELEASES.map(r => /*#__PURE__*/React.createElement(Release, {
    key: r.version,
    r: r
  }))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs/Changelog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs/DocsPage.jsx
try { (() => {
/* Docs — the reading surface: sidebar nav, prose, code samples, a props table. */

function DocsNav({
  active,
  onPick
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-5)',
      position: 'sticky',
      top: 'var(--zp-space-6)'
    }
  }, NAV.map(section => /*#__PURE__*/React.createElement("div", {
    key: section.group,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, section.group), section.items.map(item => {
    const on = item === active;
    return /*#__PURE__*/React.createElement("button", {
      key: item,
      onClick: () => onPick(item),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--zp-space-3)',
        padding: '5px var(--zp-space-3)',
        textAlign: 'left',
        cursor: 'pointer',
        borderRadius: 'var(--zp-radius)',
        border: '1px solid transparent',
        borderLeft: `2px solid ${on ? 'var(--zp-line-accent)' : 'transparent'}`,
        background: on ? 'var(--zp-accent-tint)' : 'transparent',
        font: 'var(--zp-text-md)',
        color: on ? 'var(--zp-accent-100)' : 'var(--zp-text-3)',
        transition: 'all var(--zp-dur) var(--zp-ease)'
      }
    }, item);
  }))));
}
function Prose({
  children
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--zp-text-lg)',
      color: 'var(--zp-text-2)',
      maxWidth: '68ch',
      textWrap: 'pretty'
    }
  }, children);
}
function PropsTable() {
  return /*#__PURE__*/React.createElement(Panel, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '150px 190px minmax(0,1fr)',
      gap: 'var(--zp-space-4)',
      padding: 'var(--zp-space-3) var(--zp-space-4)',
      borderBottom: '1px solid var(--zp-line-strong)'
    }
  }, ['Prop', 'Type', 'Notes'].map(h => /*#__PURE__*/React.createElement("span", {
    key: h,
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, h))), PROPS.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      display: 'grid',
      gridTemplateColumns: '150px 190px minmax(0,1fr)',
      gap: 'var(--zp-space-4)',
      alignItems: 'center',
      padding: 'var(--zp-space-3) var(--zp-space-4)',
      borderTop: i ? '1px solid var(--zp-line)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--zp-space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-data)',
      color: 'var(--zp-text)'
    }
  }, p.name), p.req ? /*#__PURE__*/React.createElement(Badge, {
    tone: "danger",
    dot: false
  }, "req") : null), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-data)',
      color: 'var(--zp-accent-300)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, p.type), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-3)'
    }
  }, p.note))));
}
function DocsPage({
  page
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, "Getting started"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--zp-text-h1)',
      letterSpacing: 'var(--zp-tracking-tight)',
      color: 'var(--zp-text)'
    }
  }, page), /*#__PURE__*/React.createElement(Prose, null, "The calendar ships as one React component and one stylesheet. It renders three raid lockouts, handles signups, and stores nothing you have not typed into it.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-4)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Step one",
    title: "Install"
  }), /*#__PURE__*/React.createElement(CodeBlock, {
    language: "bash",
    code: INSTALL_CODE
  }), /*#__PURE__*/React.createElement(Prose, null, "The package has one peer dependency, React 18. The stylesheet carries the tokens, so import it once at the root."), /*#__PURE__*/React.createElement(CodeBlock, {
    filename: "App.tsx",
    lineNumbers: true,
    code: USAGE_CODE
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-4)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Step two",
    title: "Get the week right",
    description: "The one thing every raid tool gets wrong."
  }), /*#__PURE__*/React.createElement(Prose, null, "Lockouts reset Tuesday, so the week band the calendar highlights runs Tuesday to Monday \u2014 not the calendar week. Everything downstream of this is arithmetic on that one function."), /*#__PURE__*/React.createElement(CodeBlock, {
    filename: "lockout.ts",
    lineNumbers: true,
    code: LOCKOUT_CODE
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-4)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Reference",
    title: "Props"
  }), /*#__PURE__*/React.createElement(PropsTable, null)));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs/DocsPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs/DocsSite.jsx
try { (() => {
/* Docs — the shell: header, sidebar nav, and the two page bodies.
   Reading surface, so the starfield is off. */

function DocsSite() {
  const [page, setPage] = React.useState('Install');
  return /*#__PURE__*/React.createElement(PageShell, {
    maxWidth: 1120,
    starfield: false,
    style: {
      padding: 'var(--zp-space-7) var(--zp-space-6) var(--zp-space-9)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-4)',
      paddingBottom: 'var(--zp-space-4)',
      borderBottom: '1px solid var(--zp-line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/favicon.svg",
    width: "24",
    height: "24",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 16px/1 var(--zp-font-ui)',
      color: 'var(--zp-text)'
    }
  }, "Zerpy"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, "Docs")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search the docs",
    style: {
      width: 220
    }
  }), /*#__PURE__*/React.createElement(Tooltip, {
    content: "Version 0.9.0"
  }, /*#__PURE__*/React.createElement(Tag, null, "v0.9")), /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "GitHub"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '196px minmax(0,1fr)',
      gap: 'var(--zp-space-8)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(DocsNav, {
    active: page,
    onPick: setPage
  }), page === 'Changelog' ? /*#__PURE__*/React.createElement(Changelog, null) : /*#__PURE__*/React.createElement(DocsPage, {
    page: page
  }))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs/DocsSite.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs/docs-data.jsx
try { (() => {
/* Docs — content. Classic Babel script; bindings are global to the kit. */

const NAV = [{
  group: 'Getting started',
  items: ['Install', 'Themes', 'Tokens']
}, {
  group: 'Guides',
  items: ['Lockouts', 'Marks', 'Importing a roster']
}, {
  group: 'Reference',
  items: ['Calendar API', 'Changelog']
}];
const INSTALL_CODE = "npm i @zerpy/calendar";
const USAGE_CODE = "import { RaidCalendar } from '@zerpy/calendar';\nimport '@zerpy/calendar/styles.css';\n\nexport function App() {\n  return <RaidCalendar guild=\"Whitemane-Horde\" week={3} />;\n}";
const LOCKOUT_CODE = "// Lockouts reset Tuesday, not Sunday\nexport function lockoutStart(d: Date) {\n  const x = new Date(d);\n  x.setHours(0, 0, 0, 0);\n  x.setDate(x.getDate() - ((x.getDay() - 2 + 7) % 7));\n  return x;\n}";
const PROPS = [{
  name: 'guild',
  type: 'string',
  req: true,
  note: 'Realm and faction slug. Scopes every query.'
}, {
  name: 'week',
  type: 'number',
  req: false,
  note: 'Weeks of lockout to render. Three is the default.'
}, {
  name: 'onSchedule',
  type: '(e: Event) => void',
  req: false,
  note: 'Fires after a right-click compose is confirmed.'
}, {
  name: 'readOnly',
  type: 'boolean',
  req: false,
  note: 'Hides the composer. Signups still work.'
}];
const RELEASES = [{
  version: '0.9.0',
  date: 'August 12, 2026',
  tone: 'success',
  label: 'Latest',
  changes: [['Added', 'Light theme, opt in with data-theme="light" on any element.'], ['Added', 'Data-viz ramps: eight categorical series, a sequential ramp and a diverging ramp.'], ['Changed', 'Every control colour now reads from a token, so a theme switch needs no component edits.']]
}, {
  version: '0.8.2',
  date: 'July 30, 2026',
  tone: 'neutral',
  changes: [['Fixed', 'Overlapping events split the day column instead of stacking behind each other.'], ['Fixed', 'The lockout band no longer shifts when the month changes mid-week.']]
}, {
  version: '0.8.0',
  date: 'July 4, 2026',
  tone: 'neutral',
  changes: [['Added', 'Event composer on right-click, positioned at the cursor.'], ['Added', 'Toast confirmations for publish and withdraw.'], ['Removed', 'The month view, which nobody used.']]
}];
const CHANGE_TONE = {
  Added: 'success',
  Changed: 'info',
  Fixed: 'warning',
  Removed: 'danger'
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs/docs-data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ds-runtime.js
try { (() => {
/* Zerpy UI kits — boot loader.
   Kits prefer the compiled design-system bundle (_ds_bundle.js). When it is not
   present — a freshly checked-out copy, or a kit opened straight off disk — this
   falls back to fetching the component sources, stripping the module keywords,
   transpiling with Babel and publishing the exports on window. Either way the
   kit's own scripts see <Button /> as a global, the way a real app sees an
   import.

   Usage, from a kit's index.html:
     <script src="../ds-runtime.js"></script>
     <script>ZerpyBoot({ base: '../..', files: ['data.jsx', 'App.jsx'], root: 'App' })</script>
*/
(function () {
  const NS = 'ZerpyDesignSystem_203cea';
  const COMPONENTS = ['components/surfaces/PageShell.tsx', 'components/surfaces/Panel.tsx', 'components/surfaces/SectionHeading.tsx', 'components/buttons/Button.tsx', 'components/buttons/IconButton.tsx', 'components/buttons/CtaButton.tsx', 'components/forms/Field.tsx', 'components/forms/Input.tsx', 'components/forms/Textarea.tsx', 'components/forms/Select.tsx', 'components/forms/Switch.tsx', 'components/forms/Checkbox.tsx', 'components/forms/Radio.tsx', 'components/forms/SegmentedControl.tsx', 'components/data/Badge.tsx', 'components/data/Tag.tsx', 'components/data/CountBadge.tsx', 'components/data/StatCard.tsx', 'components/data/Progress.tsx', 'components/data/Skeleton.tsx', 'components/feedback/Dialog.tsx', 'components/feedback/Toast.tsx', 'components/feedback/Tooltip.tsx', 'components/feedback/Popover.tsx', 'components/feedback/EmptyState.tsx', 'components/marketing/Hero.tsx', 'components/marketing/CodeBlock.tsx'];
  const PRESETS = [['typescript', {
    isTSX: true,
    allExtensions: true
  }], 'react'];
  function run(code) {
    const el = document.createElement('script');
    el.textContent = Babel.transform(code, {
      presets: PRESETS,
      filename: 'kit.tsx'
    }).code;
    document.head.appendChild(el);
  }

  /* Each component runs inside its own closure — several declare private helpers
     (TONES, INTENTS, SIZES) that would collide in global scope — and only its
     exported bindings are published. Type-only exports never make the name list,
     since the pattern below matches function / const / let declarations. */
  function toScript(src) {
    const names = [];
    src.replace(/^export\s+(?:function|const|let)\s+(\w+)/gm, function (m, n) {
      names.push(n);
      return m;
    });
    const body = src.replace(/^\s*import .*?;\s*$/gm, '').replace(/^export /gm, '');
    if (!names.length) return body;
    return '(function(){\n' + body + '\nObject.assign(window, {' + names.join(', ') + '});\n})();';
  }
  async function get(path) {
    const r = await fetch(path);
    if (!r.ok) throw new Error(path + ' → ' + r.status);
    return r.text();
  }
  window.ZerpyBoot = function (opts) {
    const base = opts.base || '../..';
    const boot = document.getElementById('boot');
    (async function () {
      if (window[NS]) {
        Object.assign(window, window[NS]);
      } else {
        if (boot) boot.textContent = 'Compiling the Zerpy components…';
        for (const p of COMPONENTS) run(toScript(await get(base + '/' + p)));
      }
      for (const p of opts.files) run(toScript(await get(p)));
      ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(window[opts.root]));
    })().catch(function (err) {
      if (boot) boot.textContent = 'Could not load the kit: ' + err.message;
      console.error(err);
    });
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ds-runtime.js", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Landing.jsx
try { (() => {
/* Portfolio landing — hero, project grid, what I am working on, footer. */

function TopBar({
  theme,
  onTheme,
  onHome
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-5)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onHome,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--zp-space-3)',
      border: 'none',
      background: 'none',
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/favicon.svg",
    width: "26",
    height: "26",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 17px/1 var(--zp-font-ui)',
      color: 'var(--zp-text)'
    }
  }, "Zerpy")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--zp-space-5)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, "Tools for WoW Classic"), /*#__PURE__*/React.createElement(SegmentedControl, {
    options: ['Dark', 'Light'],
    value: theme,
    onChange: onTheme
  })));
}
function ProjectCard({
  project,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement(Panel, {
    onClick: () => onOpen(project.slug),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    padding: "var(--zp-space-5)",
    style: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-3)',
      borderColor: hover ? 'var(--zp-line-accent)' : 'var(--zp-line)',
      boxShadow: hover ? 'var(--zp-elev-panel), var(--zp-accent-glow)' : 'var(--zp-elev-panel)',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'all var(--zp-dur) var(--zp-ease)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-h3)',
      color: 'var(--zp-text)'
    }
  }, project.name), /*#__PURE__*/React.createElement(Badge, {
    tone: project.tone
  }, project.status)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-3)',
      textWrap: 'pretty'
    }
  }, project.tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--zp-space-2)',
      marginTop: 'auto',
      paddingTop: 'var(--zp-space-2)'
    }
  }, project.stack.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s
  }, s))));
}
function Landing({
  theme,
  onTheme,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-9)'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    theme: theme,
    onTheme: onTheme,
    onHome: () => onOpen(null)
  }), /*#__PURE__*/React.createElement(Hero, {
    eyebrow: "Zerpy",
    title: "Small tools for a raid that starts on time",
    lede: "A shared calendar, an alt tracker, and a handful of helpers I use every week. All of them are single pages, all of them work offline, none of them want an account.",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CtaButton, {
      onClick: () => onOpen('raid-calendar')
    }, "Open the calendar"), /*#__PURE__*/React.createElement(Button, {
      intent: "ghost",
      onClick: () => onOpen('alt-tracker')
    }, "See the alt tracker"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-5)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Five projects",
    title: "Things I have built",
    description: "Each one links out to its own page."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 'var(--zp-space-4)',
      alignItems: 'stretch'
    }
  }, PROJECTS.map(p => /*#__PURE__*/React.createElement(ProjectCard, {
    key: p.slug,
    project: p,
    onOpen: onOpen
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-5)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Right now",
    title: "What I am working on"
  }), /*#__PURE__*/React.createElement(Panel, {
    padding: "0"
  }, NOW.map((line, i) => /*#__PURE__*/React.createElement("div", {
    key: line,
    style: {
      padding: 'var(--zp-space-4) var(--zp-space-5)',
      borderTop: i ? '1px solid var(--zp-line)' : 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--zp-space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      color: 'var(--zp-text-4)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, '0' + (i + 1)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-md)',
      color: 'var(--zp-text-2)'
    }
  }, line))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-4)',
      paddingTop: 'var(--zp-space-6)',
      borderTop: '1px solid var(--zp-line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-4)'
    }
  }, "Built for a Horde guild on Whitemane. Not affiliated with Blizzard."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    intent: "ghost",
    size: "sm"
  }, "GitHub"), /*#__PURE__*/React.createElement(Button, {
    intent: "ghost",
    size: "sm"
  }, "Discord"))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Landing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/PortfolioSite.jsx
try { (() => {
/* Portfolio — the click-through: landing → project page, plus the theme switch.
   The theme attribute goes on <html>, which is all [data-theme="light"] needs. */

function PortfolioSite() {
  const [slug, setSlug] = React.useState(null);
  const [theme, setTheme] = React.useState('Dark');
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'Light' ? 'light' : 'dark');
  }, [theme]);
  const project = PROJECTS.find(p => p.slug === slug);
  return /*#__PURE__*/React.createElement(PageShell, {
    maxWidth: 1080,
    starfield: theme === 'Dark'
  }, project ? /*#__PURE__*/React.createElement(ProjectPage, {
    project: project,
    onBack: () => setSlug(null),
    theme: theme,
    onTheme: setTheme
  }) : /*#__PURE__*/React.createElement(Landing, {
    theme: theme,
    onTheme: setTheme,
    onOpen: setSlug
  }));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/PortfolioSite.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/ProjectPage.jsx
try { (() => {
/* Portfolio project page — the detail view a card links to. */

function ProjectPage({
  project,
  onBack,
  theme,
  onTheme
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-8)'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    theme: theme,
    onTheme: onTheme,
    onHome: onBack
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-4)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    intent: "ghost",
    size: "sm",
    onClick: onBack,
    style: {
      alignSelf: 'flex-start'
    }
  }, "\u2039 All projects"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-4)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, project.year, " \xB7 ", project.stack.join(' · ')), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--zp-text-h1)',
      letterSpacing: 'var(--zp-tracking-tight)',
      color: 'var(--zp-text)'
    }
  }, project.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-lg)',
      color: 'var(--zp-text-3)',
      maxWidth: '52ch',
      textWrap: 'pretty'
    }
  }, project.tagline)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: project.tone
  }, project.status), /*#__PURE__*/React.createElement(Button, {
    intent: "primary"
  }, "Open it")))), project.stats.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 'var(--zp-space-4)'
    }
  }, project.stats.map(s => /*#__PURE__*/React.createElement(StatCard, {
    key: s.label,
    label: s.label,
    value: s.value
  }))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)',
      gap: 'var(--zp-space-7)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-5)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--zp-text-lg)',
      color: 'var(--zp-text-2)',
      maxWidth: '64ch',
      textWrap: 'pretty'
    }
  }, project.body), project.notes.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, "Notes"), project.notes.map(n => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'flex',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      borderRadius: 1,
      background: 'var(--zp-line-accent)',
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-md)',
      color: 'var(--zp-text-3)',
      textWrap: 'pretty'
    }
  }, n)))) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-4)'
    }
  }, /*#__PURE__*/React.createElement(CodeBlock, {
    filename: project.slug + '.ts',
    lineNumbers: true,
    code: "// Lockouts reset Tuesday\nexport function lockoutStart(d: Date) {\n  const x = new Date(d);\n  x.setHours(0, 0, 0, 0);\n  x.setDate(x.getDate() - ((x.getDay() - 2 + 7) % 7));\n  return x;\n}"
  }), /*#__PURE__*/React.createElement(Panel, {
    elevation: "flat",
    padding: "var(--zp-space-4)",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, "Stack"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--zp-space-2)'
    }
  }, project.stack.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s
  }, s)))))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/ProjectPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/portfolio-data.jsx
try { (() => {
/* Portfolio — content. Loaded as a classic Babel script, so these bindings are
   global to the kit. */

const PROJECTS = [{
  slug: 'raid-calendar',
  name: 'Raid Calendar',
  tagline: 'A shared guild schedule that shows three lockouts at once.',
  status: 'Live',
  tone: 'success',
  year: '2026',
  stack: ['React', 'TypeScript', 'Supabase'],
  body: 'Right-click a day, name the raid, pick the character. The grid lights the current lockout so nobody signs up for a week that already reset. Built for a Classic guild running two nights a week across eleven alts.',
  stats: [{
    label: 'Events scheduled',
    value: '1,240'
  }, {
    label: 'Guilds using it',
    value: '6'
  }, {
    label: 'Median signup',
    value: '11s'
  }],
  notes: ['Lockouts reset Tuesday, so the week band is Tuesday to Monday — not the calendar week.', 'Overlapping events split the day column rather than stacking, because two raids at 8 PM is the normal case.']
}, {
  slug: 'alt-tracker',
  name: 'Alt Tracker',
  tagline: 'What every character still needs, on one board.',
  status: 'Live',
  tone: 'success',
  year: '2026',
  stack: ['React', 'TypeScript', 'IndexedDB'],
  body: 'Eleven characters, each with a different half-finished list: marks to cap, an item waiting on a drop, a reputation grind two thirds done. The board is the answer to "who do I log in tonight".',
  stats: [{
    label: 'Characters',
    value: '11'
  }, {
    label: 'Open tasks',
    value: '38'
  }, {
    label: 'Marks to cap',
    value: '180'
  }],
  notes: ['Everything is local — no account, no sync, no server that can go down mid-raid.', 'Tasks carry a character, not a category, because that is how the question is actually asked.']
}, {
  slug: 'mark-counter',
  name: 'Mark Counter',
  tagline: 'Battleground marks per character, counted against the cap.',
  status: 'Live',
  tone: 'success',
  year: '2025',
  stack: ['React', 'TypeScript'],
  body: 'A single page that reads a pasted bag export and tells you how many Warsong, Arathi and Alterac marks each character is short. It exists because the in-game UI will not add up.',
  stats: [{
    label: 'Marks parsed',
    value: '94k'
  }, {
    label: 'Parse time',
    value: '40ms'
  }],
  notes: ['Paste-in only. Nothing is stored, which is the entire feature.']
}, {
  slug: 'dungeon-timer',
  name: 'Dungeon Timer',
  tagline: 'Pull timers and boss splits, kept between runs.',
  status: 'In progress',
  tone: 'warning',
  year: '2026',
  stack: ['React', 'TypeScript'],
  body: 'A stopwatch that remembers the route. Splits per boss, a best-run comparison, and nothing else on screen while it runs.',
  stats: [{
    label: 'Routes',
    value: '9'
  }, {
    label: 'Best run',
    value: '18:42'
  }],
  notes: ['Not finished: the comparison view only handles one route at a time.']
}, {
  slug: 'parse-explorer',
  name: 'Parse Explorer',
  tagline: 'Guild logs as charts I can actually read.',
  status: 'Planned',
  tone: 'neutral',
  year: '—',
  stack: ['React', 'TypeScript', 'D3'],
  body: 'The plan is a small set of charts over a tier of logs: attendance over time, damage by class, loot spread. Nothing is built yet beyond the color ramps.',
  stats: [],
  notes: ['Only the data-viz ramps exist so far. Treat this card as a placeholder.']
}];
const NOW = ['Rebuilding the alt tracker board so it works on a phone.', 'Adding split comparison to the dungeon timer.', 'Reading a tier of guild logs to work out what the parse charts should be.'];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/portfolio-data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/raid_calendar/RaidCalendar.jsx
try { (() => {
/* Raid Calendar — the product's main view: three lockout weeks of a shared guild
   calendar. Right-click a day to compose, click an event to inspect it.
   Composed from the Zerpy primitives; nothing here re-implements a control. */

function CalendarHeader({
  rangeLabel,
  onPrev,
  onNext,
  onToday,
  view,
  onView
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-4)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-h1)',
      letterSpacing: 'var(--zp-tracking-tight)',
      background: 'var(--zp-gradient-text)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, "Raid Calendar"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-3)'
    }
  }, rangeLabel)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    options: ['Day', 'Week', 'Month'],
    value: view,
    onChange: onView
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--zp-space-2)'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Previous three weeks",
    onClick: onPrev
  }, "\u2039"), /*#__PURE__*/React.createElement(IconButton, {
    label: "Next three weeks",
    onClick: onNext
  }, "\u203A")), /*#__PURE__*/React.createElement(Button, {
    intent: "primary",
    onClick: onToday
  }, "Today")));
}
function EventBlock({
  ev,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      e.stopPropagation();
      onClick(ev);
    },
    style: {
      position: 'absolute',
      top: ev.top,
      height: ev.height,
      left: ev.left,
      width: ev.width,
      boxSizing: 'border-box',
      zIndex: 2,
      cursor: 'pointer',
      overflow: 'hidden',
      borderRadius: 'var(--zp-radius)',
      padding: '5px 7px 5px 12px',
      border: ev.skin.border,
      background: ev.skin.background,
      boxShadow: ev.skin.boxShadow,
      backdropFilter: 'blur(var(--zp-blur-sm))',
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      transition: 'transform var(--zp-dur-fast) var(--zp-ease)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: ev.skin.railWidth,
      background: ev.skin.rail
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-label)',
      color: ev.skin.textColor,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, ev.title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 10px/1.3 var(--zp-font-body)',
      color: 'var(--zp-text-3)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, ev.startLabel, " \xB7 ", ev.character));
}
function WeekRow({
  row,
  onPickEvent,
  onCompose,
  onHoverWeek,
  onLeaveWeek
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '58px repeat(7, minmax(0, 1fr))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      boxSizing: 'border-box',
      height: row.height,
      borderRight: '1px solid var(--zp-line)',
      borderBottom: '1px solid var(--zp-line)',
      background: 'rgba(10,9,24,.35)'
    }
  }, row.hours.map(h => /*#__PURE__*/React.createElement("span", {
    key: h.label,
    style: {
      position: 'absolute',
      right: 8,
      top: h.top,
      transform: 'translateY(-50%)',
      font: 'var(--zp-text-micro)',
      color: 'var(--zp-text-4)',
      whiteSpace: 'nowrap'
    }
  }, h.label))), row.days.map(day => /*#__PURE__*/React.createElement("div", {
    key: day.key,
    onContextMenu: e => onCompose(e, day),
    onMouseEnter: () => onHoverWeek(day.lockoutKey),
    onMouseLeave: onLeaveWeek,
    style: {
      position: 'relative',
      boxSizing: 'border-box',
      height: row.height,
      overflow: 'hidden',
      borderRight: '1px solid var(--zp-line)',
      borderBottom: '1px solid var(--zp-line)',
      background: day.highlighted ? 'linear-gradient(180deg, rgba(145,132,217,.10), rgba(145,132,217,.025))' : 'var(--zp-surface-1)',
      boxShadow: day.highlighted ? 'inset 0 1px 0 0 rgba(199,184,255,.22), inset 0 0 34px rgba(145,132,217,.06)' : 'none',
      transition: 'background var(--zp-dur) var(--zp-ease)'
    }
  }, row.hours.map(h => /*#__PURE__*/React.createElement("div", {
    key: h.label,
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: h.top,
      height: 1,
      background: 'var(--zp-rule-fade)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: 5,
      zIndex: 1,
      padding: '1px 5px',
      borderRadius: 'var(--zp-radius-xs)',
      font: 'var(--zp-text-micro)',
      color: day.isToday ? 'var(--zp-accent-100)' : 'var(--zp-text-4)',
      background: day.isToday ? 'var(--zp-accent-tint-strong)' : 'transparent',
      boxShadow: day.isToday ? 'var(--zp-accent-glow)' : 'none'
    }
  }, day.label), day.events.map(ev => /*#__PURE__*/React.createElement(EventBlock, {
    key: ev.id,
    ev: ev,
    onClick: onPickEvent
  })))));
}
function EventDetail({
  ev,
  onClose
}) {
  if (!ev) return null;
  return /*#__PURE__*/React.createElement(Dialog, {
    title: ev.title,
    description: ev.dateLabel + ' · ' + ev.timeLabel,
    onClose: onClose,
    width: 392,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      intent: "ghost",
      onClick: onClose
    }, "Close"), /*#__PURE__*/React.createElement(Button, {
      intent: "danger"
    }, "Withdraw"))
  }, /*#__PURE__*/React.createElement(Panel, {
    elevation: "flat",
    padding: "var(--zp-space-4)",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 34,
      borderRadius: 1,
      background: ev.color,
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-label)',
      color: 'var(--zp-text)'
    }
  }, ev.character, " \xB7 ", ev.cls), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-3)'
    }
  }, ev.status === 'confirmed' ? 'Roster confirmed' : 'Signed up')), /*#__PURE__*/React.createElement(Badge, {
    tone: ev.status === 'confirmed' ? 'success' : 'warning'
  }, ev.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--zp-space-2)'
    }
  }, /*#__PURE__*/React.createElement(Tag, null, ev.difficulty), /*#__PURE__*/React.createElement(Tag, {
    rail: ev.faction === 'Horde' ? 'var(--zp-faction-horde)' : 'var(--zp-faction-alliance)'
  }, ev.faction), /*#__PURE__*/React.createElement(Tag, {
    rail: ev.color
  }, ev.cls)));
}
function EventComposer({
  draft,
  onChange,
  onCancel,
  onCreate
}) {
  if (!draft) return null;
  const set = k => e => onChange(Object.assign({}, draft, {
    [k]: e.target.value
  }));
  const valid = draft.title.trim().length > 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 60
    },
    onClick: onCancel,
    onContextMenu: e => {
      e.preventDefault();
      onCancel();
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    elevation: "overlay",
    padding: "0",
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      left: draft.x,
      top: draft.y,
      width: 316,
      display: 'flex',
      flexDirection: 'column',
      animation: 'zp-slide-in var(--zp-dur-fast) var(--zp-ease)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--zp-space-3) var(--zp-space-4)',
      borderBottom: '1px solid var(--zp-line)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-label)',
      color: 'var(--zp-text)'
    }
  }, "New event"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-3)'
    }
  }, draft.dateLabel)), /*#__PURE__*/React.createElement(IconButton, {
    label: "Close",
    intent: "ghost",
    size: "sm",
    onClick: onCancel
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--zp-space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Title"
  }, /*#__PURE__*/React.createElement(Input, {
    autoFocus: true,
    placeholder: "Nerub-ar Palace",
    value: draft.title,
    onChange: set('title')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Start"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "time",
    value: draft.start,
    onChange: set('start')
  })), /*#__PURE__*/React.createElement(Field, {
    label: "End"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "time",
    value: draft.end,
    onChange: set('end')
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Faction"
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    options: ['Horde', 'Alliance'],
    value: draft.faction,
    onChange: v => onChange(Object.assign({}, draft, {
      faction: v
    })),
    style: {
      width: '100%'
    }
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Character"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Character name",
    value: draft.character,
    onChange: set('character')
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Class",
    hint: "Sets the block's identity rail."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--zp-space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 20,
      borderRadius: 1,
      background: CLASS_COLORS[draft.cls],
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement(Select, {
    options: CLASS_NAMES,
    value: draft.cls,
    onChange: set('cls')
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--zp-space-3) var(--zp-space-4)',
      borderTop: '1px solid var(--zp-line)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--zp-space-2)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    intent: "ghost",
    size: "sm",
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    intent: "primary",
    size: "sm",
    disabled: !valid,
    onClick: onCreate
  }, "Add event"))));
}
function RaidCalendar() {
  const [anchor, setAnchor] = React.useState(() => startOfWeek(new Date(2026, 7, 17)));
  const [selected, setSelected] = React.useState(null);
  const [draft, setDraft] = React.useState(null);
  const [custom, setCustom] = React.useState([]);
  const [hoverWeek, setHoverWeek] = React.useState(null);
  const [view, setView] = React.useState('Week');
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => {
    const onKey = e => {
      if (e.key !== 'Escape') return;
      if (draft) setDraft(null);else if (selected) setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [draft, selected]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const byDay = {};
  const push = (key, ev) => {
    (byDay[key] = byDay[key] || []).push(ev);
  };
  EVENT_SEED.forEach((s, i) => {
    const d = new Date(anchor);
    d.setDate(d.getDate() + s.offset);
    const color = CLASS_COLORS[s.cls];
    push(dateKey(d), {
      id: 'seed' + i,
      startMin: toMin(s.start),
      endMin: toMin(s.end),
      title: s.title,
      character: s.character,
      cls: s.cls,
      color,
      faction: s.faction,
      difficulty: s.difficulty,
      status: s.status,
      timeLabel: fmtMin(toMin(s.start)) + ' – ' + fmtMin(toMin(s.end)),
      startLabel: fmtMin(toMin(s.start)),
      dateLabel: longDate(d),
      skin: eventSkin(color, s.status)
    });
  });
  custom.forEach((c, i) => {
    const color = CLASS_COLORS[c.cls];
    const sm = toMin(c.start),
      em = Math.max(toMin(c.end) || sm + 120, sm + 30);
    push(c.key, {
      id: 'custom' + i,
      startMin: sm,
      endMin: em,
      title: c.title,
      character: c.character || '—',
      cls: c.cls,
      color,
      faction: c.faction,
      difficulty: 'Not set',
      status: 'confirmed',
      timeLabel: fmtMin(sm) + ' – ' + fmtMin(em),
      startLabel: fmtMin(sm),
      dateLabel: c.dateLabel,
      skin: eventSkin(color, 'confirmed')
    });
  });
  const activeWeek = hoverWeek || dateKey(lockoutStart(today));
  const rows = [];
  for (let w = 0; w < 3; w++) {
    let startH = DEFAULT_START_H,
      endH = DEFAULT_END_H;
    for (let i = 0; i < 7; i++) {
      const d = new Date(anchor);
      d.setDate(d.getDate() + w * 7 + i);
      (byDay[dateKey(d)] || []).forEach(ev => {
        startH = Math.min(startH, Math.floor(ev.startMin / 60));
        endH = Math.max(endH, Math.ceil(ev.endMin / 60));
      });
    }
    const startMin = startH * 60,
      endMin = endH * 60;
    const hours = [];
    for (let h = startH; h <= endH; h++) hours.push({
      label: hourLabel(h),
      top: PAD_TOP + (h * 60 - startMin) / 60 * PX_PER_HOUR
    });
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(anchor);
      d.setDate(d.getDate() + w * 7 + i);
      const key = dateKey(d);
      const lk = dateKey(lockoutStart(d));
      days.push({
        key,
        lockoutKey: lk,
        longLabel: longDate(d),
        isToday: key === dateKey(today),
        highlighted: lk === activeWeek,
        label: d.getDate() === 1 ? MONTHS[d.getMonth()].slice(0, 3) + ' 1' : String(d.getDate()),
        events: layoutDay(byDay[key] || [], startMin, endMin)
      });
    }
    rows.push({
      height: (endH - startH) * PX_PER_HOUR + PAD_TOP + 10,
      hours,
      days
    });
  }
  const endDate = new Date(anchor);
  endDate.setDate(endDate.getDate() + 20);
  const rangeLabel = MONTHS[anchor.getMonth()] + ' ' + anchor.getDate() + ' – ' + MONTHS[endDate.getMonth()] + ' ' + endDate.getDate() + ', ' + endDate.getFullYear();
  const shift = n => () => setAnchor(a => {
    const d = new Date(a);
    d.setDate(d.getDate() + n);
    return d;
  });
  const compose = (e, day) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(null);
    setDraft({
      key: day.key,
      dateLabel: day.longLabel,
      x: Math.max(8, Math.min(e.clientX, window.innerWidth - 328)),
      y: Math.max(8, Math.min(e.clientY, Math.max(8, window.innerHeight - 520))),
      title: '',
      start: '20:00',
      end: '23:00',
      character: '',
      cls: 'Druid',
      faction: 'Horde'
    });
  };
  const create = () => {
    setCustom(list => list.concat([Object.assign({}, draft, {
      title: draft.title.trim()
    })]));
    const id = Date.now();
    setToasts(t => t.concat([{
      id,
      title: 'Event added',
      body: draft.title.trim() + ' · ' + draft.dateLabel
    }]));
    setDraft(null);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4200);
  };
  const total = Object.keys(byDay).reduce((n, k) => n + byDay[k].length, 0);
  return /*#__PURE__*/React.createElement(PageShell, {
    maxWidth: 1440,
    style: {
      padding: 'var(--zp-space-7) var(--zp-space-6) var(--zp-space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--zp-space-5)'
    }
  }, /*#__PURE__*/React.createElement(CalendarHeader, {
    rangeLabel: rangeLabel,
    onPrev: shift(-21),
    onNext: shift(21),
    onToday: () => setAnchor(startOfWeek(new Date())),
    view: view,
    onView: setView
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'var(--zp-space-3)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "success"
  }, "Confirmed"), /*#__PURE__*/React.createElement(Badge, {
    tone: "warning"
  }, "Tentative"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-sm)',
      color: 'var(--zp-text-4)'
    }
  }, "The lit band is the current raid lockout, Tuesday to Monday. Hover any day to light its week; right-click to add an event."), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--zp-space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-4)'
    }
  }, "Scheduled"), /*#__PURE__*/React.createElement(CountBadge, null, total))), /*#__PURE__*/React.createElement(Panel, {
    padding: "0",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '58px repeat(7, minmax(0, 1fr))',
      background: 'linear-gradient(180deg, rgba(145,132,217,.12), rgba(145,132,217,.02))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRight: '1px solid var(--zp-line)',
      borderBottom: '1px solid var(--zp-line-strong)'
    }
  }), WEEKDAY.map(wd => /*#__PURE__*/React.createElement("div", {
    key: wd,
    style: {
      boxSizing: 'border-box',
      padding: '11px 12px',
      font: 'var(--zp-text-micro)',
      letterSpacing: 'var(--zp-tracking-micro)',
      textTransform: 'uppercase',
      color: 'var(--zp-text-3)',
      borderRight: '1px solid var(--zp-line)',
      borderBottom: '1px solid var(--zp-line-strong)'
    }
  }, wd))), rows.map((row, i) => /*#__PURE__*/React.createElement(WeekRow, {
    key: i,
    row: row,
    onPickEvent: setSelected,
    onCompose: compose,
    onHoverWeek: setHoverWeek,
    onLeaveWeek: () => setHoverWeek(null)
  }))), total === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    glyph: "\u2014",
    title: "No events in this range",
    body: "Right-click any day to schedule a raid, or jump back to today.",
    action: /*#__PURE__*/React.createElement(Button, {
      intent: "secondary",
      onClick: () => setAnchor(startOfWeek(new Date()))
    }, "Back to today")
  }) : null), /*#__PURE__*/React.createElement(EventDetail, {
    ev: selected,
    onClose: () => setSelected(null)
  }), /*#__PURE__*/React.createElement(EventComposer, {
    draft: draft,
    onChange: setDraft,
    onCancel: () => setDraft(null),
    onCreate: create
  }), /*#__PURE__*/React.createElement(ToastStack, null, toasts.map(t => /*#__PURE__*/React.createElement(Toast, {
    key: t.id,
    tone: "success",
    title: t.title,
    body: t.body,
    onDismiss: () => setToasts(x => x.filter(y => y.id !== t.id))
  }))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/raid_calendar/RaidCalendar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/raid_calendar/calendar-data.jsx
try { (() => {
/* Raid Calendar — data and time helpers.
   Loaded as a classic Babel script, so every top-level binding here is global
   to the kit. No imports. */

const CLASS_COLORS = {
  'Death Knight': 'var(--zp-class-death-knight)',
  'Demon Hunter': 'var(--zp-class-demon-hunter)',
  Druid: 'var(--zp-class-druid)',
  Evoker: 'var(--zp-class-evoker)',
  Hunter: 'var(--zp-class-hunter)',
  Mage: 'var(--zp-class-mage)',
  Monk: 'var(--zp-class-monk)',
  Paladin: 'var(--zp-class-paladin)',
  Priest: 'var(--zp-class-priest)',
  Rogue: 'var(--zp-class-rogue)',
  Shaman: 'var(--zp-class-shaman)',
  Warlock: 'var(--zp-class-warlock)',
  Warrior: 'var(--zp-class-warrior)'
};
const CLASS_NAMES = Object.keys(CLASS_COLORS);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PX_PER_HOUR = 30;
const PAD_TOP = 16;
const DEFAULT_START_H = 17;
const DEFAULT_END_H = 24;
function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}
function dateKey(d) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}
function startOfWeek(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
}
/** Raid lockouts reset Tuesday — the week band the calendar highlights. */
function lockoutStart(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - (x.getDay() - 2 + 7) % 7);
  return x;
}
function toMin(v) {
  if (!v) return null;
  const p = v.split(':');
  return parseInt(p[0], 10) * 60 + parseInt(p[1] || '0', 10);
}
function fmtMin(m) {
  const H = Math.floor(m / 60),
    ap = H >= 12 && H < 24 ? 'PM' : 'AM';
  let hh = H % 12;
  if (hh === 0) hh = 12;
  return hh + ':' + pad(m % 60) + ' ' + ap;
}
function hourLabel(h) {
  const hh = h % 24;
  if (hh === 0) return '12 AM';
  if (hh === 12) return '12 PM';
  return hh % 12 + (hh < 12 ? ' AM' : ' PM');
}
function longDate(d) {
  return WEEKDAY[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}
const EVENT_SEED = [{
  offset: 1,
  faction: 'Horde',
  character: 'Thrashclaw',
  cls: 'Druid',
  title: 'Nerub-ar Palace',
  start: '20:00',
  end: '23:00',
  difficulty: 'Heroic',
  status: 'confirmed'
}, {
  offset: 1,
  faction: 'Horde',
  character: 'Windrunner',
  cls: 'Hunter',
  title: 'Nerub-ar Palace',
  start: '20:00',
  end: '23:00',
  difficulty: 'Heroic',
  status: 'confirmed'
}, {
  offset: 3,
  faction: 'Alliance',
  character: 'Ironhide',
  cls: 'Warrior',
  title: 'Liberation of Undermine',
  start: '19:30',
  end: '22:30',
  difficulty: 'Normal',
  status: 'tentative'
}, {
  offset: 5,
  faction: 'Horde',
  character: 'Stormcaller',
  cls: 'Shaman',
  title: 'Nerub-ar Palace',
  start: '20:00',
  end: '23:30',
  difficulty: 'Mythic',
  status: 'confirmed'
}, {
  offset: 5,
  faction: 'Horde',
  character: 'Thrashclaw',
  cls: 'Druid',
  title: 'Nerub-ar Palace',
  start: '20:00',
  end: '23:30',
  difficulty: 'Mythic',
  status: 'confirmed'
}, {
  offset: 8,
  faction: 'Alliance',
  character: 'Windrunner',
  cls: 'Hunter',
  title: 'Liberation of Undermine',
  start: '19:00',
  end: '22:00',
  difficulty: 'Heroic',
  status: 'tentative'
}, {
  offset: 10,
  faction: 'Alliance',
  character: 'Ironhide',
  cls: 'Warrior',
  title: 'Nerub-ar Palace',
  start: '20:00',
  end: '23:00',
  difficulty: 'Heroic',
  status: 'confirmed'
}, {
  offset: 11,
  faction: 'Horde',
  character: 'Thrashclaw',
  cls: 'Druid',
  title: 'Timewalking Run',
  start: '11:00',
  end: '13:00',
  difficulty: 'Normal',
  status: 'tentative'
}, {
  offset: 12,
  faction: 'Horde',
  character: 'Stormcaller',
  cls: 'Shaman',
  title: 'Vault Farm Night',
  start: '19:00',
  end: '21:00',
  difficulty: 'Normal',
  status: 'tentative'
}, {
  offset: 15,
  faction: 'Alliance',
  character: 'Thrashclaw',
  cls: 'Druid',
  title: 'Liberation of Undermine',
  start: '19:30',
  end: '22:30',
  difficulty: 'Mythic',
  status: 'confirmed'
}, {
  offset: 17,
  faction: 'Horde',
  character: 'Windrunner',
  cls: 'Hunter',
  title: 'Nerub-ar Palace',
  start: '20:00',
  end: '23:00',
  difficulty: 'Heroic',
  status: 'confirmed'
}, {
  offset: 19,
  faction: 'Alliance',
  character: 'Stormcaller',
  cls: 'Shaman',
  title: 'Liberation of Undermine',
  start: '19:30',
  end: '22:30',
  difficulty: 'Normal',
  status: 'confirmed'
}];

/** An event block's skin. Class color enters as a gradient into the ground and as
    the leading rail — never as a flat fill. Tentative events drop to a hairline rail. */
function eventSkin(color, status) {
  if (status === 'confirmed') return {
    border: '1px solid color-mix(in srgb, ' + color + ' 58%, transparent)',
    background: 'linear-gradient(135deg, color-mix(in srgb, ' + color + ' 40%, transparent) 0%, color-mix(in srgb, ' + color + ' 14%, transparent) 58%, rgba(20,19,44,.6) 100%)',
    rail: 'linear-gradient(180deg, ' + color + ', color-mix(in srgb, ' + color + ' 35%, transparent))',
    railWidth: 3,
    boxShadow: '0 6px 18px rgba(4,4,12,.45), 0 0 16px color-mix(in srgb, ' + color + ' 20%, transparent)',
    textColor: 'var(--zp-text)'
  };
  return {
    border: '1px solid color-mix(in srgb, ' + color + ' 28%, transparent)',
    background: 'linear-gradient(135deg, color-mix(in srgb, ' + color + ' 16%, transparent) 0%, rgba(20,19,44,.45) 70%)',
    rail: 'linear-gradient(180deg, color-mix(in srgb, ' + color + ' 55%, transparent), color-mix(in srgb, ' + color + ' 10%, transparent))',
    railWidth: 1.5,
    boxShadow: '0 4px 14px rgba(4,4,12,.35)',
    textColor: 'var(--zp-text-2)'
  };
}

/** Side-by-side layout for events that overlap in time. */
function layoutDay(list, startMin, endMin) {
  const sorted = list.slice().sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
  const clusters = [];
  let cur = [],
    curEnd = -1;
  sorted.forEach(ev => {
    if (cur.length && ev.startMin >= curEnd) {
      clusters.push(cur);
      cur = [];
      curEnd = -1;
    }
    cur.push(ev);
    curEnd = Math.max(curEnd, ev.endMin);
  });
  if (cur.length) clusters.push(cur);
  const out = [];
  clusters.forEach(group => {
    const n = group.length;
    group.forEach((ev, i) => {
      const top = PAD_TOP + (ev.startMin - startMin) / 60 * PX_PER_HOUR;
      const h = Math.max(22, (Math.min(ev.endMin, endMin) - ev.startMin) / 60 * PX_PER_HOUR);
      out.push(Object.assign({}, ev, {
        top: top + 1,
        height: h - 3,
        left: 'calc(3px + ' + i / n * 100 + '%)',
        width: 'calc(' + 100 / n + '% - 6px)'
      }));
    });
  });
  return out;
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/raid_calendar/calendar-data.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.CtaButton = __ds_scope.CtaButton;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.CountBadge = __ds_scope.CountBadge;

__ds_ns.Progress = __ds_scope.Progress;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Popover = __ds_scope.Popover;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.ToastStack = __ds_scope.ToastStack;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.CodeBlock = __ds_scope.CodeBlock;

__ds_ns.Hero = __ds_scope.Hero;

__ds_ns.PageShell = __ds_scope.PageShell;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

})();
