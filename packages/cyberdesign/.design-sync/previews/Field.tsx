import { Field, Label } from 'cyberdesign';

const Frame = ({ children, max = 440 }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

const input: React.CSSProperties = {
  background: 'var(--cd-bg-panel)',
  border: '1px solid var(--cd-border)',
  color: 'var(--cd-text)',
  fontFamily: 'var(--cd-font-mono)',
  fontSize: 12,
  padding: '6px 8px',
  width: '100%',
  boxSizing: 'border-box',
};

export const WithDescription = () => (
  <Frame>
    <Field description="Used to route encrypted traffic through the mesh relay.">
      <Label htmlFor="relay" required>Relay Endpoint</Label>
      <input id="relay" style={input} defaultValue="relay.darknet:8443" />
    </Field>
  </Frame>
);

export const WithError = () => (
  <Frame>
    <Field error="Token must be at least 32 characters.">
      <Label htmlFor="tok" required>Access Token</Label>
      <input id="tok" style={{ ...input, borderColor: 'var(--cd-neon-red)' }} defaultValue="sk-too-short" />
    </Field>
  </Frame>
);

export const Inline = () => (
  <Frame>
    <Field inline>
      <Label htmlFor="enc">Encryption</Label>
      <input id="enc" style={{ ...input, maxWidth: 160 }} defaultValue="AES-256-GCM" />
    </Field>
  </Frame>
);
