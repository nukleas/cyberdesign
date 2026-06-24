import { Table, Badge } from 'cyberdesign';

const Frame = ({ children, max = 640 }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

export const ThreatLog = () => (
  <Frame>
    <Table scroll>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Source</Table.HeaderCell>
          <Table.HeaderCell sort="asc">Severity</Table.HeaderCell>
          <Table.HeaderCell numeric sort>Events</Table.HeaderCell>
          <Table.HeaderCell numeric>Score</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>192.168.1.44</Table.Cell>
          <Table.Cell><Badge color="red">Critical</Badge></Table.Cell>
          <Table.Cell numeric>1,204</Table.Cell>
          <Table.Cell numeric>98.4</Table.Cell>
          <Table.Cell status="err">Blocked</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>10.0.0.17</Table.Cell>
          <Table.Cell><Badge color="amber">High</Badge></Table.Cell>
          <Table.Cell numeric>487</Table.Cell>
          <Table.Cell numeric>74.1</Table.Cell>
          <Table.Cell status="warn">Review</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>203.0.113.22</Table.Cell>
          <Table.Cell><Badge color="cyan">Medium</Badge></Table.Cell>
          <Table.Cell numeric>112</Table.Cell>
          <Table.Cell numeric>41.8</Table.Cell>
          <Table.Cell status="ok">Pass</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>172.16.5.100</Table.Cell>
          <Table.Cell><Badge color="green">Low</Badge></Table.Cell>
          <Table.Cell numeric>23</Table.Cell>
          <Table.Cell numeric>12.3</Table.Cell>
          <Table.Cell status="ok">Pass</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>198.51.100.9</Table.Cell>
          <Table.Cell><Badge color="orange">Medium</Badge></Table.Cell>
          <Table.Cell numeric>0</Table.Cell>
          <Table.Cell numeric>—</Table.Cell>
          <Table.Cell status="idle">Idle</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </Frame>
);

export const CompactBordered = () => (
  <Frame max={420}>
    <Table compact bordered scroll>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Port</Table.HeaderCell>
          <Table.HeaderCell>Protocol</Table.HeaderCell>
          <Table.HeaderCell numeric sort="desc">Packets</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>8443</Table.Cell>
          <Table.Cell>TCP</Table.Cell>
          <Table.Cell numeric>4,120</Table.Cell>
          <Table.Cell status="err">Blocked</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>53</Table.Cell>
          <Table.Cell>UDP</Table.Cell>
          <Table.Cell numeric>892</Table.Cell>
          <Table.Cell status="warn">Review</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>443</Table.Cell>
          <Table.Cell>TCP</Table.Cell>
          <Table.Cell numeric>12,847</Table.Cell>
          <Table.Cell status="ok">Allowed</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </Frame>
);
