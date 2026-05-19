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

  return {
    records,
    totals,
    addRecord
  };
}
