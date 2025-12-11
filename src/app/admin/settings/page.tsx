import { getSystemSettings } from '@/actions/settings';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const { settings } = await getSystemSettings();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      {/* Pass fetched settings or empty object if null */}
      <SettingsClient initialSettings={settings || {}} />
    </div>
  );
}
