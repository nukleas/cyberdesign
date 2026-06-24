import { Modal, Button } from 'cyberdesign';

// The orchestrator cfg renders Modal in a single 560x460 card; the Frame
// still paints the dark canvas + theme accent behind the dimmed overlay.
const Frame = ({ children }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      minHeight: 460,
    }}
  >
    {children}
  </div>
);

export const ThreatDetail = () => (
  <Frame>
    <Modal
      open
      title="Threat Detail — 192.168.1.44"
      onClose={() => {}}
      footer={
        <>
          <Button>Dismiss</Button>
          <Button variant="danger">Block Source</Button>
          <Button variant="primary">Investigate</Button>
        </>
      }
    >
      <p style={{ margin: '0 0 14px' }}>
        Source address flagged for anomalous outbound traffic across 14 ports over the last 6 hours.
      </p>
      <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: 'var(--cd-text-muted)', textAlign: 'left' }}>
            <th style={{ padding: '4px 8px' }}>Port</th>
            <th style={{ padding: '4px 8px' }}>Protocol</th>
            <th style={{ padding: '4px 8px' }}>Packets</th>
            <th style={{ padding: '4px 8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid var(--cd-border)' }}>
            <td style={{ padding: '4px 8px' }}>8443</td>
            <td style={{ padding: '4px 8px' }}>TCP</td>
            <td style={{ padding: '4px 8px' }}>4,120</td>
            <td style={{ padding: '4px 8px', color: 'var(--cd-red)' }}>Blocked</td>
          </tr>
          <tr style={{ borderTop: '1px solid var(--cd-border)' }}>
            <td style={{ padding: '4px 8px' }}>53</td>
            <td style={{ padding: '4px 8px' }}>UDP</td>
            <td style={{ padding: '4px 8px' }}>892</td>
            <td style={{ padding: '4px 8px', color: 'var(--cd-amber)' }}>Review</td>
          </tr>
        </tbody>
      </table>
    </Modal>
  </Frame>
);

export const ConfirmDelete = () => (
  <Frame>
    <Modal
      open
      size="sm"
      title="Confirm Deletion"
      onClose={() => {}}
      footer={
        <>
          <Button>Cancel</Button>
          <Button variant="danger">Delete Forever</Button>
        </>
      }
    >
      <p style={{ margin: 0 }}>
        This will permanently delete{' '}
        <strong style={{ color: 'var(--cd-text)' }}>prod-api-key-01</strong> and revoke all active
        sessions.
      </p>
    </Modal>
  </Frame>
);
