import { useMemo, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface TreeNode {
  /** Unique across the whole tree (a file path, a record id). */
  id: string;
  /** Row text. */
  label: ReactNode;
  /** Optional leading glyph, after the disclosure chevron. */
  icon?: ReactNode;
  /** Optional trailing detail: a count, a status mark. */
  meta?: ReactNode;
  /**
   * Child nodes. Present (even when empty) makes this node a branch;
   * omitted makes it a leaf unless `branch` is set.
   */
  children?: TreeNode[];
  /**
   * Marks a branch whose children are not loaded yet. Opening it fires
   * `onExpandedChange`; a "Loading…" row shows until `children` is provided.
   */
  branch?: boolean;
  /** Dim the row and skip it for pointer and keyboard. */
  disabled?: boolean;
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  /** Top-level nodes, in order. */
  nodes: TreeNode[];
  /** Row density. */
  size?: 'sm' | 'md';
  /** Controlled selected node id. When set, `onSelect` should update it. */
  selected?: string | null;
  /** Initially selected node id (uncontrolled). */
  defaultSelected?: string | null;
  /** Fires when a row is clicked or reached with the arrow keys. */
  onSelect?: (node: TreeNode) => void;
  /** Controlled ids of open branches. When set, `onExpandedChange` should update it. */
  expanded?: string[];
  /** Initially open branch ids (uncontrolled). */
  defaultExpanded?: string[];
  /**
   * Fires with the new open ids and the branch that changed. Load a lazy
   * branch's children here.
   */
  onExpandedChange?: (expanded: string[], node: TreeNode) => void;
  /** Fires on double-click or Enter on a leaf (open the file, follow the link). */
  onActivate?: (node: TreeNode) => void;
  /** Id of the node being renamed; its label becomes a text field. */
  editing?: string | null;
  /** Text the rename field starts with. Needed when `label` is not a string. */
  editingValue?: string;
  /** Fires when F2 is pressed on a row. Set `editing` in response to allow renaming. */
  onEditStart?: (node: TreeNode) => void;
  /** Fires with the trimmed text when the rename field is committed (Enter or blur). */
  onEditCommit?: (node: TreeNode, value: string) => void;
  /** Fires when the rename is abandoned (Escape, or committed empty). */
  onEditCancel?: (node: TreeNode) => void;
  /** Fires on right-click or the context-menu key, for a per-node menu. */
  onNodeContextMenu?: (event: MouseEvent<HTMLLIElement>, node: TreeNode) => void;
  /** Text of the row shown inside an open branch with no children. */
  emptyLabel?: ReactNode;
  /** Text of the row shown inside an open branch whose children are not loaded. */
  loadingLabel?: ReactNode;
}

type Row =
  | { kind: 'node'; node: TreeNode; depth: number; parent: TreeNode | null; branch: boolean; open: boolean }
  | { kind: 'note'; key: string; depth: number; text: ReactNode };

const isBranch = (node: TreeNode) => node.children !== undefined || node.branch === true;

/**
 * Hierarchical list with keyboard navigation — a file explorer, an outline,
 * nested navigation. Follows the WAI-ARIA tree pattern: arrow keys move and
 * open or close branches, Home/End jump, Enter activates, F2 starts a rename.
 *
 * Selection, expansion and renaming can each be controlled or left to the
 * component. Children can be supplied up front or loaded when a branch opens.
 */
export function Tree({
  nodes,
  size = 'md',
  selected,
  defaultSelected = null,
  onSelect,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  onActivate,
  editing = null,
  editingValue,
  onEditStart,
  onEditCommit,
  onEditCancel,
  onNodeContextMenu,
  emptyLabel = 'Empty',
  loadingLabel = 'Loading…',
  className,
  ...rest
}: TreeProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(defaultSelected);
  const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpanded);
  const [focused, setFocused] = useState<string | null>(null);
  const list = useRef<HTMLUListElement>(null);

  const selectedId = selected === undefined ? internalSelected : selected;
  const openIds = expanded ?? internalExpanded;

  const rows = useMemo(() => {
    const open = new Set(openIds);
    const out: Row[] = [];
    const walk = (items: TreeNode[], depth: number, parent: TreeNode | null) => {
      for (const node of items) {
        const branch = isBranch(node);
        const isOpen = branch && open.has(node.id);
        out.push({ kind: 'node', node, depth, parent, branch, open: isOpen });
        if (!isOpen) continue;
        if (node.children === undefined) {
          out.push({ kind: 'note', key: `${node.id}:loading`, depth: depth + 1, text: loadingLabel });
        } else if (node.children.length === 0) {
          out.push({ kind: 'note', key: `${node.id}:empty`, depth: depth + 1, text: emptyLabel });
        } else {
          walk(node.children, depth + 1, node);
        }
      }
    };
    walk(nodes, 0, null);
    return out;
  }, [nodes, openIds, emptyLabel, loadingLabel]);

  const reachable = rows.filter((row) => row.kind === 'node' && !row.node.disabled) as Extract<Row, { kind: 'node' }>[];
  // The one row in the tab order: the focused one, else the selected one, else the first.
  const tabStop =
    reachable.find((row) => row.node.id === focused)?.node.id ??
    reachable.find((row) => row.node.id === selectedId)?.node.id ??
    reachable[0]?.node.id;

  const select = (node: TreeNode) => {
    if (selected === undefined) setInternalSelected(node.id);
    onSelect?.(node);
  };

  const setOpen = (node: TreeNode, open: boolean) => {
    const next = open ? [...openIds.filter((id) => id !== node.id), node.id] : openIds.filter((id) => id !== node.id);
    if (expanded === undefined) setInternalExpanded(next);
    onExpandedChange?.(next, node);
  };

  const focusRow = (node: TreeNode) => {
    setFocused(node.id);
    list.current?.querySelector<HTMLElement>(`[data-tree-id="${CSS.escape(node.id)}"]`)?.focus();
    select(node);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLLIElement>, row: Extract<Row, { kind: 'node' }>) => {
    // Keys typed into the rename field belong to it.
    if (event.target !== event.currentTarget) return;
    const index = reachable.findIndex((r) => r.node.id === row.node.id);
    const go = (target: Extract<Row, { kind: 'node' }> | undefined) => target && focusRow(target.node);
    switch (event.key) {
      case 'ArrowDown':
        go(reachable[index + 1]);
        break;
      case 'ArrowUp':
        go(reachable[index - 1]);
        break;
      case 'Home':
        go(reachable[0]);
        break;
      case 'End':
        go(reachable[reachable.length - 1]);
        break;
      case 'ArrowRight':
        if (!row.branch) return;
        if (!row.open) setOpen(row.node, true);
        else if (reachable[index + 1]?.parent?.id === row.node.id) go(reachable[index + 1]);
        break;
      case 'ArrowLeft':
        if (row.open) setOpen(row.node, false);
        else if (row.parent && !row.parent.disabled) focusRow(row.parent);
        else return;
        break;
      case 'Enter':
      case ' ':
        if (row.branch) setOpen(row.node, !row.open);
        else onActivate?.(row.node);
        break;
      case 'F2':
        if (!onEditStart) return;
        onEditStart(row.node);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  return (
    <ul ref={list} role="tree" className={cn('cd-tree', size === 'sm' && 'cd-tree--sm', className)} {...rest}>
      {rows.map((row) => {
        const indent = { '--cd-tree-depth': row.depth } as CSSProperties;
        if (row.kind === 'note') {
          return (
            <li key={row.key} role="none" className="cd-tree__note" style={indent}>
              {row.text}
            </li>
          );
        }
        const { node, branch, open } = row;
        const isSelected = node.id === selectedId;
        const isEditing = node.id === editing;
        return (
          <li
            key={node.id}
            role="treeitem"
            data-tree-id={node.id}
            aria-level={row.depth + 1}
            aria-expanded={branch ? open : undefined}
            aria-selected={isSelected}
            aria-disabled={node.disabled || undefined}
            tabIndex={node.id === tabStop ? 0 : -1}
            className={cn(
              'cd-tree__row',
              open && 'is-expanded',
              isSelected && 'is-selected',
              node.disabled && 'is-disabled',
            )}
            style={indent}
            onFocus={(event) => event.target === event.currentTarget && setFocused(node.id)}
            onClick={() => {
              if (isEditing) return;
              select(node);
              if (branch) setOpen(node, !open);
            }}
            onDoubleClick={() => !isEditing && !branch && onActivate?.(node)}
            onContextMenu={onNodeContextMenu && ((event) => onNodeContextMenu(event, node))}
            onKeyDown={(event) => onKeyDown(event, row)}
          >
            <span className="cd-tree__caret" aria-hidden="true">
              {branch ? '›' : ''}
            </span>
            {node.icon != null && (
              <span className="cd-tree__icon" aria-hidden="true">
                {node.icon}
              </span>
            )}
            {isEditing ? (
              <RenameField
                initial={editingValue ?? (typeof node.label === 'string' ? node.label : '')}
                onCommit={(value) => {
                  if (value) onEditCommit?.(node, value);
                  else onEditCancel?.(node);
                }}
                onCancel={() => onEditCancel?.(node)}
              />
            ) : (
              <span className="cd-tree__label">{node.label}</span>
            )}
            {node.meta != null && !isEditing && <span className="cd-tree__meta">{node.meta}</span>}
          </li>
        );
      })}
    </ul>
  );
}

function RenameField({
  initial,
  onCommit,
  onCancel,
}: {
  initial: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initial);
  // Escape blurs the field as it unmounts; that blur must not commit.
  const cancelled = useRef(false);
  return (
    <input
      className="cd-input cd-input--sm cd-tree__input"
      aria-label="Rename"
      autoFocus
      spellCheck={false}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onFocus={(event) => {
        // Select the name but not the extension, as file managers do.
        const dot = event.target.value.lastIndexOf('.');
        event.target.setSelectionRange(0, dot > 0 ? dot : event.target.value.length);
      }}
      onClick={(event) => event.stopPropagation()}
      onBlur={() => !cancelled.current && onCommit(value.trim())}
      onKeyDown={(event) => {
        // Enter commits through blur, so a commit happens once however the field is left.
        if (event.key === 'Enter') event.currentTarget.blur();
        if (event.key === 'Escape') {
          cancelled.current = true;
          onCancel();
        }
      }}
    />
  );
}
