import { useEffect, useMemo, useState } from 'react';
import { createRecord, getLedgerTotals, readRecordsFromStorage, writeRecordsToStorage } from '../lib/ledger';
import type { LedgerRecord, LedgerType } from '../types';

export function useLedgerRecords() {
  const [records, setRecords] = useState<LedgerRecord[]>(() => readRecordsFromStorage());
  const totals = useMemo(() => getLedgerTotals(records), [records]);

  useEffect(() => {
    writeRecordsToStorage(records);
  }, [records]);

  function addRecord(type: LedgerType, amount: number, note: string) {
    const record = createRecord(type, amount, note);
    setRecords((currentRecords) => [record, ...currentRecords]);
  }

  function updateRecord(id: string, updates: Pick<LedgerRecord, 'amount' | 'note'>) {
    setRecords((currentRecords) =>
      currentRecords.map((record) => (record.id === id ? { ...record, ...updates, note: updates.note.trim() } : record))
    );
  }

  function deleteRecord(id: string) {
    setRecords((currentRecords) => currentRecords.filter((record) => record.id !== id));
  }

  return {
    records,
    totals,
    addRecord,
    updateRecord,
    deleteRecord
  };
}
