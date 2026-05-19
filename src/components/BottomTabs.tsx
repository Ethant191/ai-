import { BarChart3, Home, type LucideIcon } from 'lucide-react';
import type { TabKey } from '../types';

interface BottomTabsProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs: Array<{ key: TabKey; label: string; icon: LucideIcon }> = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'charts', label: '图表', icon: BarChart3 }
];

export default function BottomTabs({ activeTab, onChange }: BottomTabsProps) {
  return (
    <nav className="bottom-tabs" aria-label="底部导航">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          className={`bottom-tabs__item ${activeTab === key ? `is-active is-${key}` : ''}`}
          type="button"
          onClick={() => onChange(key)}
        >
          <Icon size={29} strokeWidth={activeTab === key ? 2.6 : 2.2} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
