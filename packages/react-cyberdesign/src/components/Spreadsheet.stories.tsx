import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Spreadsheet,
  createSpreadsheetData,
  type SpreadsheetData,
} from './Spreadsheet';
import { Button } from './Button';
import { Badge } from './Badge';
import { SectionHeader } from './SectionHeader';
import { Stat, StatGrid } from './Stat';
import { Kbd } from './Kbd';

/**
 * Editable cyber spreadsheet — selection, keyboard nav, inline edit, formula bar,
 * and basic formulas (`=A1+B1`, `=SUM(A1:A3)`).
 *
 * ### Keyboard
 * | Key | Action |
 * | --- | --- |
 * | Arrows | Move selection |
 * | Shift+Arrows | Extend range |
 * | Enter / F2 | Edit cell |
 * | Type | Overwrite cell |
 * | Tab | Commit + next column |
 * | Esc | Cancel edit |
 * | Delete | Clear selection |
 * | ⌘/Ctrl+C / V | Copy / paste (TSV blocks) |
 */
const meta = {
  title: 'Data/Spreadsheet',
  component: Spreadsheet,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    readOnly: { control: 'boolean', table: { category: 'State' } },
    formulas: { control: 'boolean', table: { category: 'Behavior' } },
    compact: { control: 'boolean', table: { category: 'Appearance' } },
    showFormulaBar: { control: 'boolean', table: { category: 'Appearance' } },
    showStatus: { control: 'boolean', table: { category: 'Appearance' } },
    columnWidth: { control: { type: 'range', min: 64, max: 160 }, table: { category: 'Appearance' } },
  },
} satisfies Meta<typeof Spreadsheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const BUDGET: SpreadsheetData = [
  ['Item', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'],
  ['Uplink', '1200', '1350', '1280', '1400', '=SUM(B2:E2)'],
  ['Sensors', '800', '820', '900', '880', '=SUM(B3:E3)'],
  ['Personnel', '4200', '4200', '4350', '4400', '=SUM(B4:E4)'],
  ['Contingency', '300', '300', '350', '400', '=SUM(B5:E5)'],
  ['', '', '', '', '', ''],
  ['Quarter sum', '=SUM(B2:B5)', '=SUM(C2:C5)', '=SUM(D2:D5)', '=SUM(E2:E5)', '=SUM(F2:F5)'],
  ['Avg / qtr', '=AVG(B2:B5)', '=AVG(C2:C5)', '=AVG(D2:D5)', '=AVG(E2:E5)', ''],
];

export const Default: Story = {
  args: {
    defaultData: BUDGET,
    rows: 10,
    cols: 6,
    columnWidth: 100,
    maxHeight: 360,
  },
};

export const EmptyGrid: Story = {
  args: {
    rows: 15,
    cols: 10,
    columnWidth: 88,
  },
};

export const CompactReadOnly: Story = {
  args: {
    defaultData: BUDGET,
    rows: 8,
    cols: 6,
    compact: true,
    readOnly: true,
    maxHeight: 280,
  },
};

export const ControlledTelemetry: Story = {
  name: 'Controlled + live stats',
  render: () => {
    const seed = useMemo(() => {
      const m = createSpreadsheetData(8, 5);
      m[0] = ['Node', 'CPU%', 'MEM%', 'NET', 'Score'];
      m[1] = ['edge-01', '42', '61', '120', '=B2*0.4+C2*0.4+D2*0.01'];
      m[2] = ['edge-02', '78', '55', '90', '=B3*0.4+C3*0.4+D3*0.01'];
      m[3] = ['edge-03', '15', '33', '40', '=B4*0.4+C4*0.4+D4*0.01'];
      m[4] = ['edge-04', '91', '88', '200', '=B5*0.4+C5*0.4+D5*0.01'];
      m[5] = ['', '', '', '', ''];
      m[6] = ['MAX CPU', '=MAX(B2:B5)', '', '', ''];
      m[7] = ['AVG MEM', '=AVG(C2:C5)', '', '', ''];
      return m;
    }, []);

    const [data, setData] = useState(seed);
    const [log, setLog] = useState<string[]>([]);

    const cpuVals = data
      .slice(1, 5)
      .map((r) => Number(r[1]))
      .filter((n) => !Number.isNaN(n));
    const avgCpu = cpuVals.length
      ? Math.round(cpuVals.reduce((a, b) => a + b, 0) / cpuVals.length)
      : 0;

    return (
      <div style={{ width: 560, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SectionHeader
          title="Node telemetry"
          actions={<Badge color="green">LIVE EDIT</Badge>}
        />
        <StatGrid>
          <Stat label="Rows" value={data.length} />
          <Stat label="Avg CPU" value={`${avgCpu}%`} variant="accent" />
          <Stat label="Edits" value={log.length} variant="magenta" />
        </StatGrid>
        <Spreadsheet
          data={data}
          onChange={setData}
          onCellChange={(r, c, v) =>
            setLog((l) => [`${String.fromCharCode(65 + c)}${r + 1} → ${v}`, ...l].slice(0, 6))
          }
          rows={8}
          cols={5}
          columnWidth={100}
          maxHeight={300}
        />
        <div style={{ fontSize: 11, color: 'var(--cd-text-dim)' }}>
          <div style={{ marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Change log
          </div>
          {log.length === 0 ? (
            <span>Edit a cell to see onCellChange events…</span>
          ) : (
            log.map((line, i) => (
              <div key={i} style={{ color: 'var(--cd-text-secondary)' }}>
                {line}
              </div>
            ))
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="sm"
            onClick={() => {
              const next = data.map((row) => [...row]);
              for (let r = 1; r <= 4; r++) {
                next[r][1] = String(Math.floor(Math.random() * 100));
                next[r][2] = String(Math.floor(Math.random() * 100));
              }
              setData(next);
            }}
          >
            Scramble metrics
          </Button>
          <Button size="sm" variant="primary" onClick={() => setData(seed)}>
            Reset
          </Button>
        </div>
      </div>
    );
  },
};

export const FormulasPlayground: Story = {
  name: 'Formulas playground',
  render: () => {
    const demo: SpreadsheetData = [
      ['Label', 'Value'],
      ['Alpha', '10'],
      ['Beta', '25'],
      ['Gamma', '5'],
      ['Sum', '=SUM(B2:B4)'],
      ['Avg', '=AVG(B2:B4)'],
      ['Min', '=MIN(B2:B4)'],
      ['Max', '=MAX(B2:B4)'],
      ['Count', '=COUNT(B2:B4)'],
      ['A+B', '=B2+B3'],
      ['(A+B)*C', '=(B2+B3)*B4'],
      ['Ref chain', '=B10'],
    ];
    return (
      <div style={{ width: 360 }}>
        <Spreadsheet defaultData={demo} rows={12} cols={2} columnWidth={140} maxHeight={400} />
        <p style={{ fontSize: 11, color: 'var(--cd-text-muted)', marginTop: 10, lineHeight: 1.5 }}>
          Supported: <code>=A1+B2</code>, <code>=SUM(A1:A3)</code>,{' '}
          <code>=AVG</code>/<code>MIN</code>/<code>MAX</code>/<code>COUNT</code>, parentheses, and
          cell reference chains.
        </p>
      </div>
    );
  },
};

export const KeyboardCheatSheet: Story = {
  name: 'Keyboard map',
  render: () => (
    <div style={{ width: 520, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Spreadsheet
        defaultData={BUDGET}
        rows={8}
        cols={6}
        columnWidth={90}
        maxHeight={240}
        compact
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          fontSize: 11,
          color: 'var(--cd-text-secondary)',
        }}
      >
        {[
          ['Arrows', 'Move active cell'],
          ['Shift+Arrows', 'Extend selection'],
          ['Enter / F2', 'Start edit'],
          ['Type char', 'Overwrite cell'],
          ['Tab / Shift+Tab', 'Commit + move'],
          ['Esc', 'Cancel edit'],
          ['Delete', 'Clear selection'],
          ['Backspace', 'Clear & edit'],
          ['⌘/Ctrl+C', 'Copy active cell'],
          ['⌘/Ctrl+V', 'Paste (TSV block)'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Kbd>{k}</Kbd>
            <span>{v}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};
