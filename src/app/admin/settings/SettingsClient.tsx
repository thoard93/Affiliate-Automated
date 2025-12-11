'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';
import { updateSystemSetting } from '@/actions/settings';
import toast from 'react-hot-toast';

type SettingsClientProps = {
    initialSettings: Record<string, string>;
};

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
    const [settings, setSettings] = useState(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditingKeys, setIsEditingKeys] = useState(false);

    const handleUpdate = async (key: string, value: string) => {
        // Optimistic update
        setSettings(prev => ({ ...prev, [key]: value }));

        // For selects/toggles, save immediately
        const result = await updateSystemSetting(key, value);
        if (result.success) {
            toast.success('Setting updated');
        } else {
            toast.error('Failed to update setting');
            // Revert on failure (optional, but good practice)
        }
    };

    const handleSaveKeys = async () => {
        setIsSaving(true);
        try {
            await updateSystemSetting('tiktok.app_key', settings['tiktok.app_key'] || '');
            await updateSystemSetting('tiktok.app_secret', settings['tiktok.app_secret'] || '');
            toast.success('API Keys saved successfully');
            setIsEditingKeys(false);
        } catch (error) {
            toast.error('Failed to save API keys');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {/* TikTok API Configuration */}
                <div className="glass-panel p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#E6425E]/10 rounded-lg">
                                <SettingsIcon className="w-6 h-6 text-[#E6425E]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">TikTok Shop API</h2>
                                <p className="text-white/40 text-sm">Manage your connection to TikTok Shop Partner Center</p>
                            </div>
                        </div>
                        {!isEditingKeys ? (
                            <button
                                onClick={() => setIsEditingKeys(true)}
                                className="btn-secondary text-xs px-3 py-1.5"
                            >
                                Edit Keys
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditingKeys(false)}
                                    className="btn-secondary text-xs px-3 py-1.5"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveKeys}
                                    disabled={isSaving}
                                    className="btn-primary text-xs px-3 py-1.5 flex items-center gap-2"
                                >
                                    {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                    Save Keys
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">App Key</label>
                                <input
                                    type="text"
                                    value={settings['tiktok.app_key'] || ''}
                                    onChange={(e) => setSettings(prev => ({ ...prev, 'tiktok.app_key': e.target.value }))}
                                    disabled={!isEditingKeys}
                                    className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white font-mono ${!isEditingKeys ? 'opacity-60 cursor-not-allowed' : 'focus:border-[#E6425E]/50 focus:outline-none'}`}
                                    placeholder="Enter App Key"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">App Secret</label>
                                <input
                                    type="password"
                                    value={settings['tiktok.app_secret'] || ''}
                                    onChange={(e) => setSettings(prev => ({ ...prev, 'tiktok.app_secret': e.target.value }))}
                                    disabled={!isEditingKeys}
                                    className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white font-mono ${!isEditingKeys ? 'opacity-60 cursor-not-allowed' : 'focus:border-[#E6425E]/50 focus:outline-none'}`}
                                    placeholder="Enter App Secret"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="flex items-center gap-2 text-green-400">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="font-semibold text-sm">API Connected & Syncing</span>
                            </div>
                            <button className="text-xs text-white/60 hover:text-white underline">Refresh Token</button>
                        </div>
                    </div>
                </div>

                {/* Global Configuration */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-4">Commission Defaults</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-white/80">Default Boost Rate</label>
                                <select
                                    value={settings['commission.default_boost'] || '0.05'}
                                    onChange={(e) => handleUpdate('commission.default_boost', e.target.value)}
                                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-aa-gold/50"
                                >
                                    <option value="0.05">5%</option>
                                    <option value="0.06">6%</option>
                                    <option value="0.08">8%</option>
                                    <option value="0.10">10%</option>
                                </select>
                            </div>
                            <div className="flex justify-between items-center">
                                <label className="text-white/80">Creator Fee</label>
                                <select
                                    value={settings['commission.creator_fee'] || '0'}
                                    onChange={(e) => handleUpdate('commission.creator_fee', e.target.value)}
                                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-aa-gold/50"
                                >
                                    <option value="0">0% (Free)</option>
                                    <option value="0.05">5%</option>
                                    <option value="0.10">10%</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-4">Notification Settings</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-white/80">New Creator Applications</span>
                                <button
                                    onClick={() => handleUpdate('notifications.new_creator', settings['notifications.new_creator'] === 'false' ? 'true' : 'false')}
                                    className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${settings['notifications.new_creator'] !== 'false' ? 'bg-aa-orange' : 'bg-white/10'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings['notifications.new_creator'] !== 'false' ? 'translate-x-[16px]' : ''}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/80">High Value Sales Alert</span>
                                <button
                                    onClick={() => handleUpdate('notifications.high_value_sale', settings['notifications.high_value_sale'] === 'true' ? 'false' : 'true')}
                                    className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${settings['notifications.high_value_sale'] === 'true' ? 'bg-aa-orange' : 'bg-white/10'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings['notifications.high_value_sale'] === 'true' ? 'translate-x-[16px]' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
