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
        <div className="space-y-8 animate-fade-in-up">
            <div className="grid gap-8">
                {/* TikTok API Configuration */}
                <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-aa-bg-secondary/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#E6425E]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#E6425E]/10 transition-colors" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#E6425E]/10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-[0_0_20px_rgba(230,66,94,0.1)]">
                                <SettingsIcon className="w-6 h-6 text-[#E6425E]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-white tracking-tight">TikTok Shop <span className="text-[#E6425E]">Integration</span></h2>
                                <p className="text-white/40 text-sm mt-0.5 font-medium">Manage your secure connection to TikTok Partner Center</p>
                            </div>
                        </div>
                        {!isEditingKeys ? (
                            <button
                                onClick={() => setIsEditingKeys(true)}
                                className="btn-secondary px-6 py-2.5 text-sm font-bold tracking-wide"
                            >
                                Edit API Keys
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsEditingKeys(false)}
                                    className="px-6 py-2.5 text-sm font-bold text-white/40 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveKeys}
                                    disabled={isSaving}
                                    className="btn-primary px-6 py-2.5 text-sm font-bold flex items-center gap-2 shadow-[0_4px_20px_rgba(255,107,0,0.2)]"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Client Key</label>
                                <input
                                    type="text"
                                    value={settings['tiktok.app_key'] || ''}
                                    onChange={(e) => setSettings(prev => ({ ...prev, 'tiktok.app_key': e.target.value }))}
                                    disabled={!isEditingKeys}
                                    className={`w-full bg-aa-bg-primary border border-white/5 rounded-xl px-5 py-3 text-white font-mono text-sm transition-all ${!isEditingKeys ? 'opacity-40 cursor-not-allowed' : 'focus:border-[#E6425E]/50 focus:ring-1 focus:ring-[#E6425E]/20 focus:outline-none'}`}
                                    placeholder="Enter TikTok Client Key"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Client Secret</label>
                                <input
                                    type="password"
                                    value={settings['tiktok.app_secret'] || ''}
                                    onChange={(e) => setSettings(prev => ({ ...prev, 'tiktok.app_secret': e.target.value }))}
                                    disabled={!isEditingKeys}
                                    className={`w-full bg-aa-bg-primary border border-white/5 rounded-xl px-5 py-3 text-white font-mono text-sm transition-all ${!isEditingKeys ? 'opacity-40 cursor-not-allowed' : 'focus:border-[#E6425E]/50 focus:ring-1 focus:ring-[#E6425E]/20 focus:outline-none'}`}
                                    placeholder="••••••••••••••••"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-5 bg-[#E6425E]/5 border border-[#E6425E]/10 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#E6425E]/50" />
                            <div className="flex items-center gap-3 text-[#E6425E]">
                                <div className="p-1.5 bg-[#E6425E]/10 rounded-full animate-pulse">
                                    <div className="w-2 h-2 rounded-full bg-[#E6425E]" />
                                </div>
                                <span className="font-bold text-sm tracking-tight capitalize">System Connected</span>
                            </div>
                            <button className="text-xs font-bold text-white/40 hover:text-[#E6425E] transition-colors uppercase tracking-widest">
                                Force Re-Sync
                            </button>
                        </div>
                    </div>
                </div>

                {/* Global Configuration */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="glass-card p-8 group">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                                <Save className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-extrabold text-white tracking-tight">Financials</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-4 bg-white/2 rounded-xl border border-white/5">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-white">Default Boost Rate</label>
                                    <p className="text-xs text-white/40">Default extra commission for creators</p>
                                </div>
                                <select
                                    value={settings['commission.default_boost'] || '0.05'}
                                    onChange={(e) => handleUpdate('commission.default_boost', e.target.value)}
                                    className="bg-aa-bg-primary border border-white/10 rounded-lg px-4 py-2 text-white text-sm font-bold focus:outline-none focus:border-aa-orange"
                                >
                                    <option value="0.05">5%</option>
                                    <option value="0.06">6%</option>
                                    <option value="0.08">8%</option>
                                    <option value="0.10">10%</option>
                                </select>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-white/2 rounded-xl border border-white/5">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-white">Creator Platform Fee</label>
                                    <p className="text-xs text-white/40">Processing fee taken from sales</p>
                                </div>
                                <select
                                    value={settings['commission.creator_fee'] || '0'}
                                    onChange={(e) => handleUpdate('commission.creator_fee', e.target.value)}
                                    className="bg-aa-bg-primary border border-white/10 rounded-lg px-4 py-2 text-white text-sm font-bold focus:outline-none focus:border-aa-orange"
                                >
                                    <option value="0">0% (None)</option>
                                    <option value="0.05">5%</option>
                                    <option value="0.10">10%</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 group">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-aa-orange/10 flex items-center justify-center transition-transform group-hover:scale-110">
                                <SettingsIcon className="w-5 h-5 text-aa-orange" />
                            </div>
                            <h3 className="text-xl font-extrabold text-white tracking-tight">Security & Alerts</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/2 rounded-xl border border-white/5">
                                <div className="space-y-1">
                                    <span className="text-sm font-bold text-white">Partner Applications</span>
                                    <p className="text-xs text-white/40">Alert when new creators apply</p>
                                </div>
                                <button
                                    onClick={() => handleUpdate('notifications.new_creator', settings['notifications.new_creator'] === 'false' ? 'true' : 'false')}
                                    className={`w-12 h-6 rounded-full flex items-center p-1 transition-all duration-300 ${settings['notifications.new_creator'] !== 'false' ? 'bg-aa-orange shadow-[0_0_15px_rgba(255,107,0,0.3)]' : 'bg-white/10'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-300 ${settings['notifications.new_creator'] !== 'false' ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/2 rounded-xl border border-white/5">
                                <div className="space-y-1">
                                    <span className="text-sm font-bold text-white">High Value Sales Alert</span>
                                    <p className="text-xs text-white/40">Notify for sales over $500</p>
                                </div>
                                <button
                                    onClick={() => handleUpdate('notifications.high_value_sale', settings['notifications.high_value_sale'] === 'true' ? 'false' : 'true')}
                                    className={`w-12 h-6 rounded-full flex items-center p-1 transition-all duration-300 ${settings['notifications.high_value_sale'] === 'true' ? 'bg-aa-orange shadow-[0_0_15px_rgba(255,107,0,0.3)]' : 'bg-white/10'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-300 ${settings['notifications.high_value_sale'] === 'true' ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
