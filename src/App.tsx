import { useState } from 'react';
import BottomTabs from './components/BottomTabs';
import ChartsPage from './components/ChartsPage';
import HomePage from './components/HomePage';
import { useLedgerRecords } from './hooks/useLedgerRecords';
import type { TabKey } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const { records, totals, addRecord, updateRecord, deleteRecord } = useLedgerRecords();

  return (
    <div className="app-shell">
      {activeTab === 'home' ? (
        <HomePage
          records={records}
          totals={totals}
          onAddRecord={addRecord}
          onUpdateRecord={updateRecord}
          onDeleteRecord={deleteRecord}
        />
      ) : (
        <ChartsPage records={records} />
      )}

      <BottomTabs activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
