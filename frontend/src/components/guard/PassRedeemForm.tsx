import { FormEvent, useState } from 'react';

interface Props {
  onRedeem: (passCode: string) => Promise<void>;
}

export function PassRedeemForm({ onRedeem }: Props) {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await onRedeem(code.trim().toUpperCase());
      setCode('');
      setMessage('Pass redeemed — guest checked in.');
    } catch {
      setMessage('Invalid or expired pass code.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4"
    >
      <div className="min-w-[200px] flex-1">
        <h2 className="text-sm font-semibold text-indigo-900">Pre-approved pass</h2>
        <input
          required
          className="mt-1 w-full rounded-lg border border-indigo-200 px-3 py-2 uppercase"
          placeholder="8-char code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        Redeem
      </button>
      {message && (
        <p className="w-full text-sm text-indigo-800" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
