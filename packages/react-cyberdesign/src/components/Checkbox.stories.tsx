import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { Switch } from './Switch';
import { Slider } from './Slider';
import { Select } from './Select';
import { Textarea } from './Textarea';
import { Field } from './Field';
import { Label } from './Label';
import { RadioGroup } from './RadioGroup';
import { InputGroup, InputGroupAddon } from './InputGroup';
import { Input } from './Input';
import { InputOTP } from './InputOTP';
import { useState } from 'react';

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Enable uplink', defaultChecked: true },
};

export const WithDescription: Story = {
  args: {
    label: 'Telemetry',
    description: 'Stream diagnostic packets to the control plane.',
  },
};

export const FormControlsGallery: Story = {
  name: 'All form controls',
  render: () => {
    const [otp, setOtp] = useState('482');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 340 }}>
        <Field>
          <Label htmlFor="call">Callsign</Label>
          <Input id="call" placeholder="neon-runner" accent />
        </Field>
        <Field>
          <Label>Region</Label>
          <Select defaultValue="west">
            <option value="west">West sector</option>
            <option value="east">East sector</option>
            <option value="orbit">Orbit</option>
          </Select>
        </Field>
        <Field description="Optional notes for the operator log.">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={3} placeholder="…" />
        </Field>
        <Field>
          <Label>Endpoint</Label>
          <InputGroup>
            <InputGroupAddon>https://</InputGroupAddon>
            <Input placeholder="api.internal.local" />
            <InputGroupAddon>/v1</InputGroupAddon>
          </InputGroup>
        </Field>
        <Checkbox label="Remember device" defaultChecked />
        <Radio name="mode" label="Autonomous" defaultChecked />
        <Radio name="mode" label="Manual override" />
        <Switch label="Night mode" defaultChecked />
        <Slider defaultValue={60} valueLabel="60%" />
        <Field>
          <Label>Auth code</Label>
          <InputOTP length={6} value={otp} onChange={setOtp} separatorAfter={3} />
        </Field>
        <RadioGroup
          name="priority"
          defaultValue="normal"
          items={[
            { value: 'low', label: 'Low' },
            { value: 'normal', label: 'Normal' },
            { value: 'high', label: 'High', description: 'Jump the queue' },
          ]}
        />
      </div>
    );
  },
};
