import {
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { Chip } from './Chip';
import { Input } from './Input';
import { Button } from './Button';
import { PanelHeader } from './PanelHeader';
import { Spinner } from './Spinner';

export type ChatRole = 'user' | 'assistant' | 'system' | 'error';

export interface ChatMessageData {
  id?: string;
  role: ChatRole;
  content: ReactNode;
  /** Optional language label for a code block under the message body. */
  code?: string;
  codeLang?: string;
  /** Timestamp / meta label. */
  time?: ReactNode;
  /** Author label (defaults from role). */
  author?: ReactNode;
}

export interface ChatActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Glyph / icon before the label. */
  icon?: ReactNode;
  /** Visible text (hidden on icon-only if omit). */
  label?: ReactNode;
  /** Active/toggled state. */
  active?: boolean;
  /** Destructive hover (delete, reject). */
  danger?: boolean;
  /** Show text label next to icon. */
  showLabel?: boolean;
}

/** Icon button for message toolbars and composer tools. */
export function ChatAction({
  icon,
  label,
  active = false,
  danger = false,
  showLabel = false,
  className = '',
  type = 'button',
  title,
  children,
  ...rest
}: ChatActionProps) {
  const tip = title ?? (typeof label === 'string' ? label : undefined);
  return (
    <button
      type={type}
      title={tip}
      aria-label={typeof tip === 'string' ? tip : undefined}
      className={cn(
        'cd-chat-action',
        active && 'is-active',
        danger && 'cd-chat-action--danger',
        className,
      )}
      {...rest}
    >
      {icon != null && <span className="cd-chat-action__icon">{icon}</span>}
      {(showLabel || (!icon && label != null)) && (
        <span className="cd-chat-action__label">{label}</span>
      )}
      {children}
    </button>
  );
}

export interface ChatActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Absolute overlay on the message (default) or flow below. */
  placement?: 'overlay' | 'below';
  /** Force visible (also shows on parent hover). */
  visible?: boolean;
  children?: ReactNode;
}

/** Hover toolbar container for message actions. */
export function ChatActions({
  placement = 'overlay',
  visible = false,
  className = '',
  children,
  ...rest
}: ChatActionsProps) {
  return (
    <div
      className={cn(
        'cd-chat-actions',
        placement === 'overlay' ? 'cd-chat-actions--overlay' : 'cd-chat-actions--below',
        visible && 'is-visible',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface ChatCodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onCopy'> {
  code: string;
  language?: string;
  onCopy?: (code: string) => void;
  onInsert?: (code: string) => void;
  onRun?: (code: string) => void;
}

/** Code fence with hover copy / insert / run actions. */
export function ChatCodeBlock({
  code,
  language = 'code',
  onCopy,
  onInsert,
  onRun,
  className = '',
  ...rest
}: ChatCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(code);
    } catch {
      /* ignore */
    }
    setCopied(true);
    onCopy?.(code);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className={cn('cd-chat-code', className)} {...rest}>
      <div className="cd-chat-code__header">
        <span>{language}</span>
        <div className="cd-chat-code__header-actions">
          {onRun && (
            <ChatAction icon="▶" label="Run" title="Run / play" onClick={() => onRun(code)} />
          )}
          {onInsert && (
            <ChatAction icon="↧" label="Insert" title="Insert into editor" onClick={() => onInsert(code)} />
          )}
          <ChatAction
            icon={copied ? '✓' : '⧉'}
            label={copied ? 'Copied' : 'Copy'}
            title="Copy code"
            active={copied}
            onClick={copy}
          />
        </div>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  role: ChatRole;
  /** Message body. */
  children?: ReactNode;
  /** Optional code fence below the body. */
  code?: string;
  codeLang?: string;
  time?: ReactNode;
  author?: ReactNode;
  /** Hover action toolbar. */
  actions?: ReactNode;
  /** Always show actions (no hover required). */
  actionsVisible?: boolean;
  onCopyCode?: (code: string) => void;
  onInsertCode?: (code: string) => void;
  onRunCode?: (code: string) => void;
}

const ROLE_AUTHOR: Record<ChatRole, string> = {
  user: 'You',
  assistant: 'AI',
  system: 'System',
  error: 'Error',
};

/** Single chat message row with optional hover actions + code block. */
export function ChatMessage({
  role,
  children,
  code,
  codeLang = 'strudel',
  time,
  author,
  actions,
  actionsVisible = false,
  onCopyCode,
  onInsertCode,
  onRunCode,
  className = '',
  ...rest
}: ChatMessageProps) {
  const showMeta = author != null || time != null || role !== 'system';

  return (
    <div className={cn('cd-chat-row', `cd-chat-row--${role}`, className)} {...rest}>
      {showMeta && role !== 'system' && (
        <div className="cd-chat-row__meta">
          <span>{author ?? ROLE_AUTHOR[role]}</span>
          {time != null && <span className="cd-chat-row__meta-right">{time}</span>}
        </div>
      )}
      <div className={cn('cd-chat-msg', `cd-chat-msg--${role}`)} style={{ position: 'relative', maxWidth: '100%' }}>
        {children}
        {actions != null && (
          <ChatActions placement="overlay" visible={actionsVisible}>
            {actions}
          </ChatActions>
        )}
      </div>
      {code != null && (
        <ChatCodeBlock
          code={code}
          language={codeLang}
          onCopy={onCopyCode}
          onInsert={onInsertCode}
          onRun={onRunCode}
          style={{ width: '100%', maxWidth: 420 }}
        />
      )}
    </div>
  );
}

export interface ChatTypingProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
}

/** Streaming / thinking indicator. */
export function ChatTyping({ label = 'Thinking', className = '', ...rest }: ChatTypingProps) {
  return (
    <div className={cn('cd-chat-typing', className)} {...rest}>
      <span className="cd-chat-typing__dots" aria-hidden>
        <span />
        <span />
        <span />
      </span>
      {label}
    </div>
  );
}

export interface ChatProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onSubmit'> {
  title?: ReactNode;
  actions?: ReactNode;
  messages?: ChatMessageData[];
  /** Quick prompt chips above the composer. */
  prompts?: Array<{ label: ReactNode; value: string }>;
  onPrompt?: (value: string) => void;
  /** Controlled composer value. */
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  submitLabel?: ReactNode;
  /** Extra tools above the input (attach, mic, model picker…). */
  composerTools?: ReactNode;
  /** Show typing indicator at end of transcript. */
  typing?: boolean;
  typingLabel?: ReactNode;
  /** Disable send. */
  disabled?: boolean;
  /** Custom render for each message (defaults to ChatMessage with standard actions). */
  renderMessage?: (msg: ChatMessageData, index: number) => ReactNode;
  children?: ReactNode;
}

/**
 * AI chat panel shell — messages, optional quick prompts, composer tools, and input.
 * Pair with {@link ChatMessage} hover actions for a full AI UX.
 */
export function Chat({
  title = 'AI',
  actions,
  messages = [],
  prompts,
  onPrompt,
  value,
  onValueChange,
  placeholder = 'Ask for a pattern…',
  onSubmit,
  submitLabel = 'Send',
  composerTools,
  typing = false,
  typingLabel,
  disabled = false,
  renderMessage,
  className = '',
  children,
  ...rest
}: ChatProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (value?.trim()) onSubmit?.(value.trim());
  };

  return (
    <div className={cn('cd-chat', className)} {...rest}>
      <PanelHeader actions={actions}>{title}</PanelHeader>
      <div className="cd-chat__messages">
        {messages.map((m, i) =>
          renderMessage ? (
            <div key={m.id ?? i}>{renderMessage(m, i)}</div>
          ) : (
            <ChatMessage
              key={m.id ?? i}
              role={m.role}
              code={m.code}
              codeLang={m.codeLang}
              time={m.time}
              author={m.author}
            >
              {m.content}
            </ChatMessage>
          ),
        )}
        {typing && <ChatTyping label={typingLabel} />}
        {children}
      </div>
      {prompts != null && prompts.length > 0 && (
        <div className="cd-chat__prompts">
          {prompts.map((p) => (
            <Chip key={String(p.value)} size="sm" onClick={() => onPrompt?.(p.value)}>
              {p.label}
            </Chip>
          ))}
        </div>
      )}
      <div className="cd-chat__composer-wrap">
        {composerTools != null && <div className="cd-chat__composer-tools">{composerTools}</div>}
        <form className="cd-chat__composer" onSubmit={handleSubmit}>
          <Input
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
          />
          <Button type="submit" variant="primary" size="sm" disabled={disabled || !value?.trim()}>
            {disabled ? <Spinner size="xs" /> : submitLabel}
          </Button>
        </form>
      </div>
    </div>
  );
}
