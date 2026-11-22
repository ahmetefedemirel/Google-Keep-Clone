import { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';

function sanitizePin(value) {
  return value.replace(/\D/g, '').slice(0, 4);
}

export function PinModal({ hasPin, onSavePin, onVerifyPin, onSuccess, onClose }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const dialogRef = useRef(null);
  const pinInputRef = useRef(null);
  const didSucceedRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (!dialog.open) {
      dialog.showModal();
    }
    pinInputRef.current?.focus();

    // Fallback light-dismiss for browsers without native `closedby="any"` support (e.g. Safari)
    let cleanupBackdrop = () => {};
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      let pressedOutside = false;
      const isOutside = (event) => {
        const rect = dialog.getBoundingClientRect();
        return (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        );
      };

      const handlePointerDown = (event) => {
        pressedOutside = isOutside(event);
      };
      const handlePointerUp = (event) => {
        if (pressedOutside && isOutside(event)) {
          dialog.close();
        }
        pressedOutside = false;
      };

      dialog.addEventListener('pointerdown', handlePointerDown);
      dialog.addEventListener('pointerup', handlePointerUp);
      cleanupBackdrop = () => {
        dialog.removeEventListener('pointerdown', handlePointerDown);
        dialog.removeEventListener('pointerup', handlePointerUp);
      };
    }

    return () => {
      cleanupBackdrop();
    };
  }, []);

  function handleDialogClose() {
    const dialog = dialogRef.current;
    if (dialog?.open) {
      return;
    }
    if (dialog) {
      dialog.returnValue = '';
    }
    if (!didSucceedRef.current) {
      onClose();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!hasPin) {
      if (pin.length !== 4) {
        setError('PIN 4 rakamdan oluşmalıdır.');
        pinInputRef.current?.focus();
        return;
      }
      if (pin !== confirmPin) {
        setError('PIN kodları eşleşmiyor.');
        return;
      }
      if (onSavePin(pin)) {
        didSucceedRef.current = true;
        onSuccess();
      }
      return;
    }

    if (pin.length !== 4) {
      setError('Lütfen 4 haneli PIN girin.');
      pinInputRef.current?.focus();
      return;
    }

    if (!onVerifyPin(pin)) {
      setError('Hatalı PIN. Tekrar deneyin.');
      setPin('');
      pinInputRef.current?.focus();
      return;
    }

    didSucceedRef.current = true;
    onSuccess();
  }

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="pin-modal-title"
      onClose={handleDialogClose}
      className="m-auto w-[min(92vw,24rem)] rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 id="pin-modal-title" className="text-base font-semibold text-slate-900">
              {hasPin ? 'Gizli Notlar Kilidini Aç' : 'Gizli Notlar PIN Oluştur'}
            </h2>
            <p className="text-xs text-slate-500">
              {hasPin
                ? 'Gizli notlarınızı görüntülemek için 4 haneli PIN girin.'
                : 'İlk kullanım için 4 haneli bir PIN belirleyin.'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="hidden-pin-input" className="mb-1 block text-xs font-medium text-slate-700">
              {hasPin ? '4 Haneli PIN' : 'Yeni 4 Haneli PIN'}
            </label>
            <input
              ref={pinInputRef}
              id="hidden-pin-input"
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              autoComplete="off"
              autoFocus
              value={pin}
              onChange={(event) => {
                setPin(sanitizePin(event.target.value));
                if (error) setError('');
              }}
              placeholder="••••"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-lg font-semibold tracking-[0.5em] text-slate-900 placeholder:tracking-[0.4em] placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none"
            />
          </div>

          {!hasPin && (
            <div>
              <label
                htmlFor="hidden-pin-confirm-input"
                className="mb-1 block text-xs font-medium text-slate-700"
              >
                PIN Tekrar
              </label>
              <input
                id="hidden-pin-confirm-input"
                type="password"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                autoComplete="off"
                value={confirmPin}
                onChange={(event) => {
                  setConfirmPin(sanitizePin(event.target.value));
                  if (error) setError('');
                }}
                placeholder="••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-lg font-semibold tracking-[0.5em] text-slate-900 placeholder:tracking-[0.4em] placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none"
              />
            </div>
          )}

          {error && (
            <p role="alert" className="text-xs font-medium text-rose-600">
              {error}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-amber-500"
          >
            İptal
          </button>
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-amber-500"
          >
            {hasPin ? 'Kilidi Aç' : 'PIN Kaydet'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
