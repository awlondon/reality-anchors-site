import { useState, type FormEvent } from 'react';
import { useNotes, useAddNote } from '../lib/hooks';
import { Card, Button, Spinner } from './ui';
import { formatDistanceToNow } from 'date-fns';

function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (v && typeof v === 'object' && 'toDate' in v) return (v as { toDate: () => Date }).toDate();
  return new Date(v as string);
}

interface NotesPanelProps {
  context: string; // e.g. 'dashboard', 'seats', 'subscription'
  title?: string;
}

export default function NotesPanel({ context, title = 'Notes' }: NotesPanelProps) {
  const { data: notes, loading } = useNotes(context);
  const addNote = useAddNote();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await addNote(text.trim(), context);
      setText('');
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mt-6">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-medium text-muted">
          {title} {notes.length > 0 && <span className="text-accent-2">({notes.length})</span>}
        </h3>
        <span className="text-muted text-xs">{expanded ? '▾ collapse' : '▸ expand'}</span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {/* Add note form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a note..."
              rows={2}
              className="flex-1 bg-bg-2 border border-line rounded-lg px-3 py-2 text-txt text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
            />
            <Button type="submit" loading={submitting} disabled={!text.trim()} className="self-end">
              Add
            </Button>
          </form>

          {/* Notes list */}
          {loading ? (
            <div className="flex justify-center py-4"><Spinner size="sm" /></div>
          ) : notes.length === 0 ? (
            <p className="text-muted/50 text-sm text-center py-2">No notes yet</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notes.map((note) => (
                <div key={note.id} className="border-l-2 border-accent/30 pl-3 py-1">
                  <p className="text-txt text-sm whitespace-pre-wrap">{note.text}</p>
                  <p className="text-muted/60 text-xs mt-1">
                    {note.authorName ?? note.authorEmail}
                    {note.createdAt && (
                      <> · {formatDistanceToNow(toDate(note.createdAt), { addSuffix: true })}</>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
