import { FormEvent, useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { typeColors, typeLabels } from '../lib/ledger';
import type { LedgerRecord, LedgerType } from '../types';
import { formatCurrency, formatRecordDay, formatRecordTime } from '../utils/format';

interface LedgerRecordsSheetProps {
  type: LedgerType;
  records: LedgerRecord[];
  onClose: () => void;
  onUpdateRecord: (id: string, updates: Pick<LedgerRecord, 'amount' | 'note'>) => void;
  onDeleteRecord: (id: string) => void;
}

export default function LedgerRecordsSheet({
  type,
  records,
  onClose,
  onUpdateRecord,
  onDeleteRecord
}: LedgerRecordsSheetProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState('');
  const [editingNote, setEditingNote] = useState('');
  const [editingError, setEditingError] = useState('');
  const total = records.reduce((sum, record) => sum + record.amount, 0);
  const groupedRecords = groupRecordsByDate(records);

  function startEditing(record: LedgerRecord) {
    setEditingId(record.id);
    setEditingAmount(String(record.amount));
    setEditingNote(record.note);
    setEditingError('');
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingAmount('');
    setEditingNote('');
    setEditingError('');
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>, recordId: string) {
    event.preventDefault();
    const normalizedAmount = Number(editingAmount);

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      setEditingError('金额必须大于 0');
      return;
    }

    onUpdateRecord(recordId, {
      amount: Number(normalizedAmount.toFixed(2)),
      note: editingNote
    });
    cancelEditing();
  }

  function handleDelete(record: LedgerRecord) {
    const confirmed = window.confirm(`确定删除这笔${typeLabels[type]}账单吗？`);

    if (confirmed) {
      onDeleteRecord(record.id);
      if (editingId === record.id) {
        cancelEditing();
      }
    }
  }

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
                      {editingId === record.id ? (
                        <form className="records-edit-card" onSubmit={(event) => handleEditSubmit(event, record.id)}>
                          <label className="records-edit-field">
                            <span>金额</span>
                            <input
                              inputMode="decimal"
                              min="0"
                              step="0.01"
                              type="number"
                              value={editingAmount}
                              onChange={(event) => setEditingAmount(event.target.value)}
                            />
                          </label>
                          <label className="records-edit-field">
                            <span>备注</span>
                            <input
                              type="text"
                              value={editingNote}
                              placeholder="请输入备注（可选）"
                              onChange={(event) => setEditingNote(event.target.value)}
                            />
                          </label>
                          {editingError ? <p className="records-edit-error">{editingError}</p> : null}
                          <div className="records-edit-actions">
                            <button className="records-action records-action--primary" type="submit">
                              <Check size={16} />
                              保存
                            </button>
                            <button className="records-action" type="button" onClick={cancelEditing}>
                              取消
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="records-list__meta">
                            <strong>{record.note || '未填写备注'}</strong>
                            <span>{formatRecordTime(record.createdAt)}</span>
                          </div>
                          <div className="records-list__side">
                            <span className="records-list__amount" style={{ color: typeColors[type] }}>
                              {formatCurrency(record.amount)}
                            </span>
                            <div className="records-list__actions" aria-label="账单操作">
                              <button type="button" onClick={() => startEditing(record)} aria-label="修改账单">
                                <Pencil size={15} />
                              </button>
                              <button type="button" onClick={() => handleDelete(record)} aria-label="删除账单">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
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
