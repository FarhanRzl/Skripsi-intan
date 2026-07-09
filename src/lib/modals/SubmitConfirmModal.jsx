import logoOkeGarden from "../assets/Logo_Oke Garden_2021_Logotype_Color.png";
import confirmIllustration from "./assets/submit-confirm-illustration.svg";

export default function SubmitConfirmModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-confirm-title"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-white px-6 pt-6 pb-7 shadow-xl">
        {/* Header: logo + close */}
        <div className="flex items-start justify-between">
          <img src={logoOkeGarden} alt="OKE Garden" className="h-6 w-auto" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="text-danger-main text-xl leading-none font-semibold"
          >
            ✕
          </button>
        </div>

        {/* Illustration */}
        <div className="flex justify-center py-5">
          <img src={confirmIllustration} alt="" className="h-28 w-auto" />
        </div>

        {/* Title */}
        <h2
          id="submit-confirm-title"
          className="text-center text-lg font-bold text-gray-900 leading-snug"
        >
          Apakah Anda Yakin Untuk Melakukan Submit Survey ?
        </h2>

        {/* Warning subtitle */}
        <p className="mt-2 text-center text-xs font-medium text-danger-main leading-relaxed">
          Anda akan menyelesaikan proses awal survey dan dokumen yang sudah
          diisi dapat diubah kembali
        </p>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-full font-semibold text-sm border-2 border-brand-500 text-brand-700 bg-white"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-full font-semibold text-sm bg-brand-500 text-white hover:bg-brand-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}