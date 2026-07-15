import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { cn } from '../lib/cn';

/** 2D matrix of cell raw values (display may evaluate formulas). */
export type SpreadsheetData = string[][];

export interface CellCoord {
  row: number;
  col: number;
}

export interface SpreadsheetProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled cell matrix. When omitted, component is uncontrolled. */
  data?: SpreadsheetData;
  /** Initial matrix for uncontrolled mode. */
  defaultData?: SpreadsheetData;
  /** Fired with the full matrix after any edit. */
  onChange?: (data: SpreadsheetData) => void;
  /** Fired when a single cell commits. */
  onCellChange?: (row: number, col: number, value: string, data: SpreadsheetData) => void;
  /** Number of rows when no data provided. @default 12 */
  rows?: number;
  /** Number of columns when no data provided. @default 8 */
  cols?: number;
  /** Column width in px. @default 96 */
  columnWidth?: number;
  /** Max viewport height. @default 420 */
  maxHeight?: number | string;
  /** Compact row density. */
  compact?: boolean;
  /** Disable editing (selection/nav still work). */
  readOnly?: boolean;
  /** Evaluate `=` formulas for display. @default true */
  formulas?: boolean;
  /** Show address + formula bar. @default true */
  showFormulaBar?: boolean;
  /** Show status strip. @default true */
  showStatus?: boolean;
  /** Optional column labels (defaults A, B, C…). */
  columnLabels?: string[];
  /** Optional row labels (defaults 1-based numbers). */
  rowLabels?: string[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

function colToLetter(index: number): string {
  let n = index;
  let s = '';
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

function parseCellRef(ref: string): CellCoord | null {
  const m = ref.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
  if (!m) return null;
  const letters = m[1];
  const row = parseInt(m[2], 10) - 1;
  let col = 0;
  for (let i = 0; i < letters.length; i++) {
    col = col * 26 + (letters.charCodeAt(i) - 64);
  }
  col -= 1;
  if (row < 0 || col < 0) return null;
  return { row, col };
}

function cellAddress(row: number, col: number): string {
  return `${colToLetter(col)}${row + 1}`;
}

function createMatrix(rows: number, cols: number, fill = ''): SpreadsheetData {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
}

function cloneMatrix(data: SpreadsheetData): SpreadsheetData {
  return data.map((row) => [...row]);
}

function ensureSize(data: SpreadsheetData, rows: number, cols: number): SpreadsheetData {
  const next = data.map((row) => {
    const r = [...row];
    while (r.length < cols) r.push('');
    return r.slice(0, cols);
  });
  while (next.length < rows) next.push(Array.from({ length: cols }, () => ''));
  return next.slice(0, rows);
}

function isNumericDisplay(value: string): boolean {
  if (value === '' || value.startsWith('=')) return false;
  return !Number.isNaN(Number(value)) && value.trim() !== '';
}

/** Evaluate a single formula against raw matrix. Supports refs, ranges, SUM/AVG/MIN/MAX/COUNT, + - * /. */
function evaluateFormula(raw: string, data: SpreadsheetData, stack: Set<string> = new Set()): string {
  const expr = raw.slice(1).trim();
  if (!expr) return '';

  const getCell = (row: number, col: number): number | string => {
    if (row < 0 || col < 0 || row >= data.length || col >= (data[0]?.length ?? 0)) return 0;
    const v = data[row][col] ?? '';
    if (v.startsWith('=')) {
      const addr = cellAddress(row, col);
      if (stack.has(addr)) return '#CYCLE!';
      const next = new Set(stack);
      next.add(addr);
      const out = evaluateFormula(v, data, next);
      if (out.startsWith('#')) return out;
      const n = Number(out);
      return Number.isNaN(n) ? out : n;
    }
    if (v === '') return 0;
    const n = Number(v);
    return Number.isNaN(n) ? v : n;
  };

  const rangeValues = (a: string, b: string): number[] => {
    const start = parseCellRef(a);
    const end = parseCellRef(b);
    if (!start || !end) return [];
    const r0 = Math.min(start.row, end.row);
    const r1 = Math.max(start.row, end.row);
    const c0 = Math.min(start.col, end.col);
    const c1 = Math.max(start.col, end.col);
    const vals: number[] = [];
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const v = getCell(r, c);
        if (typeof v === 'number') vals.push(v);
        else if (typeof v === 'string' && !v.startsWith('#')) {
          const n = Number(v);
          if (!Number.isNaN(n)) vals.push(n);
        }
      }
    }
    return vals;
  };

  // Function calls: SUM(A1:B2), AVG(...), MIN, MAX, COUNT
  const fnMatch = expr.match(/^(SUM|AVG|AVERAGE|MIN|MAX|COUNT)\(([^)]+)\)$/i);
  if (fnMatch) {
    const fn = fnMatch[1].toUpperCase();
    const arg = fnMatch[2].trim();
    let vals: number[] = [];
    if (arg.includes(':')) {
      const [a, b] = arg.split(':');
      vals = rangeValues(a, b);
    } else {
      const parts = arg.split(',').map((p) => p.trim());
      for (const p of parts) {
        const ref = parseCellRef(p);
        if (ref) {
          const v = getCell(ref.row, ref.col);
          if (typeof v === 'number') vals.push(v);
        } else {
          const n = Number(p);
          if (!Number.isNaN(n)) vals.push(n);
        }
      }
    }
    if (fn === 'COUNT') return String(vals.length);
    if (vals.length === 0) return '0';
    if (fn === 'SUM') return String(vals.reduce((a, b) => a + b, 0));
    if (fn === 'AVG' || fn === 'AVERAGE')
      return String(vals.reduce((a, b) => a + b, 0) / vals.length);
    if (fn === 'MIN') return String(Math.min(...vals));
    if (fn === 'MAX') return String(Math.max(...vals));
  }

  // Replace cell refs with values, then eval arithmetic safely
  try {
    let replaced = expr.replace(/[A-Z]+\d+/gi, (ref) => {
      const coord = parseCellRef(ref);
      if (!coord) return '0';
      const v = getCell(coord.row, coord.col);
      if (typeof v === 'string' && v.startsWith('#')) throw new Error(v);
      if (typeof v === 'number') return String(v);
      const n = Number(v);
      if (Number.isNaN(n)) throw new Error('#VALUE!');
      return String(n);
    });
    // Allow only digits, ops, parens, dots, spaces
    if (!/^[\d+\-*/().\s]+$/.test(replaced)) return '#NAME?';
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${replaced});`)() as number;
    if (typeof result !== 'number' || !Number.isFinite(result)) return '#NUM!';
    // Trim floating noise
    return String(Math.round(result * 1e10) / 1e10);
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('#')) return e.message;
    return '#ERROR!';
  }
}

function displayValue(raw: string, data: SpreadsheetData, formulas: boolean): string {
  if (!formulas || !raw.startsWith('=')) return raw;
  return evaluateFormula(raw, data);
}

function inRange(cell: CellCoord, a: CellCoord, b: CellCoord): boolean {
  const r0 = Math.min(a.row, b.row);
  const r1 = Math.max(a.row, b.row);
  const c0 = Math.min(a.col, b.col);
  const c1 = Math.max(a.col, b.col);
  return cell.row >= r0 && cell.row <= r1 && cell.col >= c0 && cell.col <= c1;
}

// ── component ────────────────────────────────────────────────────────────────

/**
 * Editable cyber spreadsheet grid.
 *
 * Features: cell selection, shift-range select, inline edit, formula bar,
 * keyboard nav (arrows/tab/enter), basic formulas (`=A1+B1`, `=SUM(A1:A3)`).
 */
export function Spreadsheet({
  data: controlledData,
  defaultData,
  onChange,
  onCellChange,
  rows: rowsProp,
  cols: colsProp,
  columnWidth = 96,
  maxHeight = 420,
  compact = false,
  readOnly = false,
  formulas = true,
  showFormulaBar = true,
  showStatus = true,
  columnLabels,
  rowLabels,
  className = '',
  style,
  ...rest
}: SpreadsheetProps) {
  const rows = rowsProp ?? controlledData?.length ?? defaultData?.length ?? 12;
  const cols =
    colsProp ?? controlledData?.[0]?.length ?? defaultData?.[0]?.length ?? 8;

  const [internal, setInternal] = useState<SpreadsheetData>(() =>
    ensureSize(defaultData ?? createMatrix(rows, cols), rows, cols),
  );

  const matrix = useMemo(() => {
    const source = controlledData ?? internal;
    return ensureSize(source, rows, cols);
  }, [controlledData, internal, rows, cols]);

  const [active, setActive] = useState<CellCoord>({ row: 0, col: 0 });
  const [anchor, setAnchor] = useState<CellCoord>({ row: 0, col: 0 });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [editOrigin, setEditOrigin] = useState<'type' | 'edit'>('edit');

  const rootRef = useRef<HTMLDivElement>(null);
  const cellInputRef = useRef<HTMLInputElement>(null);
  const fxInputRef = useRef<HTMLInputElement>(null);

  const setMatrix = useCallback(
    (next: SpreadsheetData, cell?: { row: number; col: number; value: string }) => {
      if (controlledData == null) setInternal(next);
      onChange?.(next);
      if (cell) onCellChange?.(cell.row, cell.col, cell.value, next);
    },
    [controlledData, onChange, onCellChange],
  );

  const commit = useCallback(
    (row: number, col: number, value: string) => {
      const next = cloneMatrix(matrix);
      next[row][col] = value;
      setMatrix(next, { row, col, value });
    },
    [matrix, setMatrix],
  );

  const beginEdit = useCallback(
    (mode: 'type' | 'edit', seed?: string) => {
      if (readOnly) return;
      const raw = matrix[active.row]?.[active.col] ?? '';
      setDraft(seed !== undefined ? seed : raw);
      setEditOrigin(mode);
      setEditing(true);
    },
    [readOnly, matrix, active],
  );

  const endEdit = useCallback(
    (save: boolean, move?: CellCoord) => {
      if (editing && save) {
        commit(active.row, active.col, draft);
      }
      setEditing(false);
      setDraft('');
      if (move) {
        setActive(move);
        setAnchor(move);
      }
      // restore focus to grid for keyboard nav
      requestAnimationFrame(() => rootRef.current?.focus());
    },
    [editing, draft, active, commit],
  );

  useEffect(() => {
    if (editing) {
      const el = cellInputRef.current;
      if (el) {
        el.focus();
        if (editOrigin === 'edit') el.select();
        else {
          const len = el.value.length;
          el.setSelectionRange(len, len);
        }
      }
    }
  }, [editing, editOrigin]);

  const activeRaw = matrix[active.row]?.[active.col] ?? '';
  const activeDisplay = displayValue(activeRaw, matrix, formulas);
  const selectionCount = useMemo(() => {
    const r0 = Math.min(active.row, anchor.row);
    const r1 = Math.max(active.row, anchor.row);
    const c0 = Math.min(active.col, anchor.col);
    const c1 = Math.max(active.col, anchor.col);
    return (r1 - r0 + 1) * (c1 - c0 + 1);
  }, [active, anchor]);

  const moveActive = (row: number, col: number, extend: boolean) => {
    const next = {
      row: Math.max(0, Math.min(rows - 1, row)),
      col: Math.max(0, Math.min(cols - 1, col)),
    };
    setActive(next);
    if (!extend) setAnchor(next);
  };

  const onGridKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (editing) return;

    const { key, shiftKey, metaKey, ctrlKey } = e;
    const mod = metaKey || ctrlKey;

    // Start edit
    if (key === 'F2' || key === 'Enter') {
      e.preventDefault();
      if (key === 'Enter' && !shiftKey) {
        beginEdit('edit');
      } else if (key === 'F2') {
        beginEdit('edit');
      } else if (key === 'Enter' && shiftKey) {
        moveActive(active.row - 1, active.col, false);
      }
      return;
    }

    if (key === 'Delete' || key === 'Backspace') {
      if (readOnly) return;
      e.preventDefault();
      if (key === 'Backspace') {
        beginEdit('type', '');
      } else {
        // clear selection range
        const next = cloneMatrix(matrix);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (inRange({ row: r, col: c }, active, anchor)) next[r][c] = '';
          }
        }
        setMatrix(next);
      }
      return;
    }

    if (mod && key.toLowerCase() === 'c') {
      e.preventDefault();
      const text = activeRaw;
      void navigator.clipboard?.writeText(text);
      return;
    }

    if (mod && key.toLowerCase() === 'v' && !readOnly) {
      e.preventDefault();
      void navigator.clipboard?.readText().then((text) => {
        // Support TSV paste of a block
        const lines = text.replace(/\r/g, '').split('\n').filter((l, i, arr) => !(i === arr.length - 1 && l === ''));
        const next = cloneMatrix(matrix);
        lines.forEach((line, ri) => {
          const cells = line.split('\t');
          cells.forEach((val, ci) => {
            const r = active.row + ri;
            const c = active.col + ci;
            if (r < rows && c < cols) next[r][c] = val;
          });
        });
        setMatrix(next);
      });
      return;
    }

    // Navigation
    const nav: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      Tab: [0, shiftKey ? -1 : 1],
      Home: [0, -active.col],
      End: [0, cols - 1 - active.col],
    };

    if (key in nav) {
      e.preventDefault();
      const [dr, dc] = nav[key];
      if (key === 'Tab') {
        moveActive(active.row + dr, active.col + dc, false);
      } else {
        moveActive(active.row + dr, active.col + dc, shiftKey);
      }
      return;
    }

    // Type to overwrite
    if (
      !readOnly &&
      key.length === 1 &&
      !mod &&
      !e.altKey
    ) {
      e.preventDefault();
      beginEdit('type', key);
    }
  };

  const onEditorKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      endEdit(false);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      endEdit(true, {
        row: Math.min(rows - 1, active.row + (e.shiftKey ? -1 : 1)),
        col: active.col,
      });
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      endEdit(true, {
        row: active.row,
        col: Math.max(0, Math.min(cols - 1, active.col + (e.shiftKey ? -1 : 1))),
      });
      return;
    }
  };

  const styleVars = {
    ...style,
    ['--cd-sheetgrid-col-width' as string]: `${columnWidth}px`,
    ['--cd-sheetgrid-max-height' as string]:
      typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={cn(
        'cd-sheetgrid',
        compact && 'cd-sheetgrid--compact',
        readOnly && 'cd-sheetgrid--readonly',
        className,
      )}
      style={styleVars}
      tabIndex={0}
      role="grid"
      aria-rowcount={rows}
      aria-colcount={cols}
      aria-label="Spreadsheet"
      onKeyDown={onGridKeyDown}
      {...rest}
    >
      {showFormulaBar && (
        <div className="cd-sheetgrid__bar">
          <div className="cd-sheetgrid__addr">{cellAddress(active.row, active.col)}</div>
          <div className="cd-sheetgrid__fx-label">ƒx</div>
          <input
            ref={fxInputRef}
            className="cd-sheetgrid__fx-input"
            value={editing ? draft : activeRaw}
            disabled={readOnly}
            spellCheck={false}
            aria-label="Formula bar"
            onFocus={() => {
              if (!readOnly && !editing) beginEdit('edit');
            }}
            onChange={(e) => {
              if (!editing) beginEdit('type', e.target.value);
              else setDraft(e.target.value);
            }}
            onKeyDown={onEditorKeyDown}
            onBlur={() => {
              // blur handled carefully — only commit if still editing and focus left grid
              if (editing) endEdit(true);
            }}
          />
        </div>
      )}

      <div className="cd-sheetgrid__viewport">
        <table className="cd-sheetgrid__table">
          <thead>
            <tr>
              <th className="cd-sheetgrid__corner" scope="col" />
              {Array.from({ length: cols }, (_, c) => (
                <th
                  key={c}
                  className={cn(
                    'cd-sheetgrid__col-head',
                    (active.col === c ||
                      inRange({ row: active.row, col: c }, active, anchor)) &&
                      'is-active',
                  )}
                  scope="col"
                >
                  {columnLabels?.[c] ?? colToLetter(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, r) => (
              <tr key={r}>
                <th
                  className={cn(
                    'cd-sheetgrid__row-head',
                    (active.row === r ||
                      inRange({ row: r, col: active.col }, active, anchor)) &&
                      'is-active',
                  )}
                  scope="row"
                >
                  {rowLabels?.[r] ?? r + 1}
                </th>
                {Array.from({ length: cols }, (_, c) => {
                  const raw = matrix[r]?.[c] ?? '';
                  const shown = displayValue(raw, matrix, formulas);
                  const isActive = active.row === r && active.col === c;
                  const isSelected = inRange({ row: r, col: c }, active, anchor);
                  const isEditing = isActive && editing;
                  const isErr = formulas && raw.startsWith('=') && shown.startsWith('#');
                  const isNum =
                    (!raw.startsWith('=') && isNumericDisplay(raw)) ||
                    (raw.startsWith('=') && isNumericDisplay(shown));

                  return (
                    <td
                      key={c}
                      role="gridcell"
                      aria-selected={isSelected}
                      aria-colindex={c + 1}
                      className={cn(
                        'cd-sheetgrid__cell',
                        isActive && 'is-active',
                        isSelected && 'is-selected',
                        isEditing && 'is-editing',
                        isNum && 'cd-sheetgrid__cell--number',
                        raw.startsWith('=') && 'cd-sheetgrid__cell--formula',
                        isErr && 'cd-sheetgrid__cell--error',
                      )}
                      onMouseDown={(e) => {
                        // prevent grid blur stealing edit
                        if (editing && isActive) return;
                        if (editing) endEdit(true);
                        e.preventDefault();
                        rootRef.current?.focus();
                        const next = { row: r, col: c };
                        setActive(next);
                        if (e.shiftKey) {
                          /* keep anchor */
                        } else {
                          setAnchor(next);
                        }
                      }}
                      onDoubleClick={() => {
                        if (!readOnly) beginEdit('edit');
                      }}
                    >
                      {isEditing ? (
                        <input
                          ref={cellInputRef}
                          className={cn(
                            'cd-sheetgrid__cell-input',
                            isNum && 'cd-sheetgrid__cell-input--number',
                          )}
                          value={draft}
                          spellCheck={false}
                          aria-label={`Edit ${cellAddress(r, c)}`}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={onEditorKeyDown}
                          onBlur={() => {
                            // delay to allow formula bar / other cell mousedown
                            requestAnimationFrame(() => {
                              if (document.activeElement === fxInputRef.current) return;
                              if (document.activeElement === cellInputRef.current) return;
                              if (editing) endEdit(true);
                            });
                          }}
                        />
                      ) : (
                        <span className="cd-sheetgrid__cell-display">{shown}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showStatus && (
        <div className="cd-sheetgrid__status">
          <span>
            cell <strong>{cellAddress(active.row, active.col)}</strong>
          </span>
          {selectionCount > 1 && (
            <span>
              sel <strong>{selectionCount}</strong>
            </span>
          )}
          <span>
            {readOnly ? 'read-only' : editing ? 'editing' : 'ready'}
          </span>
          {formulas && activeRaw.startsWith('=') && (
            <span>
              → <strong>{activeDisplay}</strong>
            </span>
          )}
          <span style={{ marginLeft: 'auto' }}>
            {rows}×{cols}
          </span>
        </div>
      )}
    </div>
  );
}

/** Build an empty matrix helper for consumers. */
export function createSpreadsheetData(rows: number, cols: number, fill = ''): SpreadsheetData {
  return createMatrix(rows, cols, fill);
}
