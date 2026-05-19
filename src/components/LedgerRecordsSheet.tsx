import { X } from 'lucide-react';
import { typeColors, typeLabels } from '../lib/ledger';
import type { LedgerRecord, LedgerType } from '../types';
import { formatCurrency, formatRecordDay, formatRecordTime } from '../utils/format';

interface LedgerRecordsSheetProps {
  type: LedgerType;
  records: LedgerRecord[];
  onClose: () => void;
}

export default function LedgerRecordsSheet({ type, records, onClose }: LedgerRecordsSheetProps) {
  const total = records.reduce((sum, record) => sum + record.amount, 0);
  const groupedRecords = groupRecordsByDate(records);

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <section
        className="records-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="records-sheet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="records-sheet__header">
          <div>
            <h2 id="records-sheet-title">{typeLabels[type]}账单</h2>
            <p>
              {records.length}笔 · 合计 {formatCurrency(total)}
            </p>
          </div>
          <button className="records-sheet__close" type="button" onClick={onClose} aria-label="关闭">
            <X size={22} strokeWidth={2.4} />
          </button>
        </header>

        {records.length > 0 ? (
          <div className="records-list">
            {groupedRecords.map((group) => (
              <section className="records-day-group" key={group.dateKey} aria-label={group.dateLabel}>
                <header className="records-day-group__header">
                  <strong>{group.dateLabel}</strong>
                  <span>
                    {group.records.length}笔 · {formatCurrency(group.total)}
                  </span>
                </header>

                <div className="records-day-group__items">
                  {group.records.map((record) => (
                    <article className="records-list__item" key={record.id}>
                      <div className="records-list__meta">
                        <strong>{record.note || '未填写备注'}</strong>
                        <span>{formatRecordTime(record.createdAt)}</span>
                      </div>
                      <span className="records-list__amount" style={{ color: typeColors[type] }}>
                        {formatCurrency(record.amount)}
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="records-empty">暂无{typeLabels[type]}账单</div>
        )}
      </section>
    </div>
  );
}

interface RecordGroup {
  dateKey: string;
  dateLabel: string;
  total: number;
  records: LedgerRecord[];
}

function groupRecordsByDate(records: LedgerRecord[]): RecordGroup[] {
  const groups = records.reduce<Map<string, RecordGroup>>((result, record) => {
    const date = new Date(record.createdAt);
    const dateKey = Number.isNaN(date.getTime()) ? 'unknown' : formatDateKey(date);
    const currentGroup =
      result.get(dateKey) ??
      ({
        dateKey,
        dateLabel: formatRecordDay(record.createdAt),
        total: 0,
        records: []
      } satisfies RecordGroup);

    currentGroup.total += record.amount;
    currentGroup.records.push(record);
    result.set(dateKey, currentGroup);

    return result;
  }, new Map<string, RecordGroup>());

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      records: [...group.records].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }))
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
