import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VirtualList, type VirtualListHandle } from './VirtualList';
import { Item } from './Item';
import { Button } from './Button';
import { Input } from './Input';

/**
 * Fixed-row-height windowed list. Only the rows near the viewport are in the
 * DOM, so the row count is limited by the browser's maximum element height, not
 * by rendering cost.
 *
 * The viewport takes its height from its container or from `style`; every row
 * is exactly `rowHeight` pixels tall.
 *
 * ### Keyboard
 * Pass `activeIndex` (with `onActiveIndexChange`) to make the list a single Tab
 * stop with one active row. Focus stays on the viewport and
 * `aria-activedescendant` names the active row, so it survives rows unmounting.
 *
 * | Key | Action |
 * | --- | --- |
 * | Tab | Focus the list (one stop) |
 * | Up / Down | Previous / next row |
 * | PageUp / PageDown | Move by one viewport of rows |
 * | Home / End | First / last row |
 * | Enter / Space | Activate the active row (`onRowActivate`) |
 *
 * The active row is always scrolled into view; the index does not wrap. A click
 * on a row makes it active and activates it. Without `activeIndex` the list is
 * static and has no key handling.
 */
const meta = {
  title: 'Data/VirtualList',
  component: VirtualList,
  tags: ['autodocs'],
  args: { items: [], rowHeight: 40, renderRow: () => null },
  argTypes: {
    rowHeight: { control: { type: 'number', min: 1 }, table: { category: 'Appearance' } },
    overscan: { control: { type: 'number', min: 0 }, table: { category: 'Behavior' } },
    items: { control: false, table: { category: 'Content' } },
    renderRow: { control: false, table: { category: 'Content' } },
    getRowKey: { control: false, table: { category: 'Content' } },
    rowProps: { control: false, table: { category: 'Content' } },
    handleRef: { control: false, table: { category: 'Behavior' } },
    activeIndex: { control: false, table: { category: 'Behavior' } },
    onActiveIndexChange: { control: false, table: { category: 'Behavior' } },
    onRowActivate: { control: false, table: { category: 'Behavior' } },
  },
} satisfies Meta<typeof VirtualList>;
export default meta;
type Story = StoryObj<typeof meta>;

interface Bank {
  id: string;
  name: string;
}

function makeBanks(count: number): Bank[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `bank-${i}`,
    name: `bank_${String(i).padStart(5, '0')}`,
  }));
}

const BANKS = makeBanks(10_000);
const ROW_HEIGHT = 40;
const frame = { height: 320, width: 320, border: '1px solid var(--cd-border)' };

/** 10,000 rows; inspect the DOM to see only the visible window plus overscan. */
export const TenThousandRows: Story = {
  render: ({ rowHeight, overscan }) => (
    <VirtualList
      className="cd-scrollbar"
      style={frame}
      aria-label="Sound banks"
      items={BANKS}
      rowHeight={rowHeight}
      overscan={overscan}
      getRowKey={(bank) => bank.id}
      renderRow={(bank, index) => <Item title={bank.name} actions={index + 1} />}
    />
  ),
};

/**
 * 10,000 selectable rows driven from the keyboard: Tab into the list, move with
 * the arrow keys, PageUp / PageDown, Home / End, and select with Enter / Space.
 */
export const KeyboardSelect: Story = {
  render: ({ rowHeight, overscan }) => {
    const [active, setActive] = useState(0);
    const [selected, setSelected] = useState(-1);
    return (
      <div style={{ display: 'grid', gap: 12, width: 320 }}>
        <Button>Before</Button>
        <VirtualList
          className="cd-scrollbar"
          style={{ ...frame, width: undefined }}
          aria-label="Sound banks"
          items={BANKS}
          rowHeight={rowHeight}
          overscan={overscan}
          getRowKey={(bank) => bank.id}
          activeIndex={active}
          onActiveIndexChange={setActive}
          onRowActivate={(_, index) => setSelected(index)}
          rowProps={(_, index) => ({ 'aria-selected': index === selected })}
          renderRow={(bank, index) => <Item title={bank.name} actions={index + 1} />}
        />
        <Button>After</Button>
        <output style={{ fontSize: 11, color: 'var(--cd-text-muted)' }}>
          active {active} · selected {selected < 0 ? 'none' : BANKS[selected].name}
        </output>
      </div>
    );
  },
};

/** `handleRef.scrollToIndex` moves a row into view by the shortest scroll. */
export const ScrollToIndex: Story = {
  render: () => {
    const handle = useRef<VirtualListHandle>(null);
    const [target, setTarget] = useState(5000);
    const go = (index: number) => {
      const next = Math.min(BANKS.length - 1, Math.max(0, index));
      setTarget(next);
      handle.current?.scrollToIndex(next);
    };
    return (
      <div style={{ display: 'grid', gap: 12, width: 320 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            size="sm"
            type="number"
            aria-label="Row index"
            min={0}
            max={BANKS.length - 1}
            value={target}
            onChange={(event) => go(Number(event.target.value))}
          />
          <Button onClick={() => go(target - 1)}>Prev</Button>
          <Button onClick={() => go(target + 1)}>Next</Button>
          <Button onClick={() => go(BANKS.length - 1)}>Last</Button>
        </div>
        <VirtualList
          className="cd-scrollbar"
          style={{ ...frame, width: undefined }}
          aria-label="Sound banks"
          handleRef={handle}
          items={BANKS}
          rowHeight={ROW_HEIGHT}
          getRowKey={(bank) => bank.id}
          rowProps={(_, index) => ({ 'aria-current': index === target || undefined })}
          renderRow={(bank, index) => <Item bordered={index === target} title={bank.name} />}
        />
      </div>
    );
  },
};

/** The window stays correct when `items` grows or shrinks while scrolled. */
export const ChangingLength: Story = {
  render: () => {
    const [count, setCount] = useState(1000);
    return (
      <div style={{ display: 'grid', gap: 12, width: 320 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 3, 50, 1000, 10_000].map((n) => (
            <Button key={n} variant={n === count ? 'primary' : undefined} onClick={() => setCount(n)}>
              {n}
            </Button>
          ))}
        </div>
        <VirtualList
          className="cd-scrollbar"
          style={{ ...frame, width: undefined }}
          aria-label="Sound banks"
          items={BANKS.slice(0, count)}
          rowHeight={ROW_HEIGHT}
          getRowKey={(bank) => bank.id}
          renderRow={(bank) => <Item title={bank.name} />}
        />
      </div>
    );
  },
};
