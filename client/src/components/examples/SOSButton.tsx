import { SOSButton } from '../sos-button';

export default function SOSButtonExample() {
  return (
    <div className="p-8 space-y-4">
      <h3 className="font-medium text-lg">Emergency SOS Button</h3>
      <p className="text-muted-foreground">Always accessible crisis support</p>
      <SOSButton />
    </div>
  );
}