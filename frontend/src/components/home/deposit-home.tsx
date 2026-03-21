// src/components/home/DepositHome.tsx
import React, { useState } from "react";
import { BanknoteIcon, Wallet, UploadCloud } from "lucide-react";

type DepositMethod = "bank" | "crypto";

/**
 * DepositHome
 *
 * - Bank details (manual) are shown at the top of the deposit card so users
 *   see account info immediately.
 * - Users can choose Bank (manual) or Crypto (USDT), enter USD amount,
 *   upload proof (image/pdf), and submit for manual review.
 */
export function DepositHome() {
  const [method, setMethod] = useState<DepositMethod>("bank");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [proof, setProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setProof(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !proof) return;

    setIsSubmitting(true);

    try {
      // Example: prepare FormData for API integration
      // const fd = new FormData();
      // fd.append("amount", amount);
      // fd.append("method", method);
      // fd.append("note", note);
      // fd.append("proof", proof);
      // await fetch("/api/deposits", { method: "POST", body: fd });

      // Placeholder: emulate network latency
      await new Promise((res) => setTimeout(res, 900));

      // reset form
      setAmount("");
      setNote("");
      setProof(null);

      // TODO: show success toast / navigate to deposit tracking page
      console.log("Deposit submitted (mock):", { method, amount, note, proofName: proof.name });
    } catch (err) {
      console.error("Deposit submit error:", err);
      // TODO: show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main py-8 space-y-8">
      {/* Page header */}
      <header>
        <h1 className="text-2xl font-semibold text-main font-space">Deposit (USD)</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-xl">
          Deposit USD via manual bank transfer or USDT. Upload a clear proof of payment for verification.
        </p>
      </header>

      {/* Card */}
      <div className="rounded-2xl border border-line bg-card/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
        {/* BANK DETAILS — placed at the top (visible immediately) */}
        <div className="rounded-lg border border-line bg-secondary/30 p-4 text-sm">
          <p className="text-xs font-semibold text-main">Bank transfer details (USD)</p>

          <div className="mt-3 grid gap-2 text-[13px]">
            <DetailRow label="Account name" value="Efeurhobo Bullish" />
            <DetailRow label="Bank name" value="Wells Fargo" />
            <DetailRow label="Account number" value="40630203010669629" />
            <DetailRow label="Account type" value="Checking" />
            <DetailRow label="Routing number" value="121000248" />
            <DetailRow label="SWIFT code" value="WFBIUS6S" />
            <DetailRow
              label="Bank address"
              value="651 N Broad St, Suite 206, Middletown, 19709 Delaware, US"
            />
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Transfer USD to the account above. After payment, upload a screenshot or receipt below so we can verify and credit your account.
          </p>
        </div>

        {/* Payment method selector */}
        <div className="mt-6">
          <h2 className="text-xs font-medium text-muted-foreground">SELECT PAYMENT METHOD</h2>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMethod("bank")}
              className={`flex flex-col items-start rounded-xl border px-4 py-4 text-left text-xs transition-all ${
                method === "bank"
                  ? "border-primary bg-primary/5"
                  : "border-line hover:border-primary/40 hover:bg-muted/40"
              }`}
            >
              <div className="mb-2 flex items-center gap-2 text-main">
                <span className="rounded-full border border-line bg-secondary/60 p-1.5">
                  <BanknoteIcon className="h-5 w-5" />
                </span>
                <span className="text-[13px] font-semibold">Bank Transfer (USD)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Make a manual USD bank transfer to the account shown above and upload the receipt.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMethod("crypto")}
              className={`flex flex-col items-start rounded-xl border px-4 py-4 text-left text-xs transition-all ${
                method === "crypto"
                  ? "border-primary bg-primary/5"
                  : "border-line hover:border-primary/40 hover:bg-muted/40"
              }`}
            >
              <div className="mb-2 flex items-center gap-2 text-main">
                <span className="rounded-full border border-line bg-secondary/60 p-1.5">
                  <Wallet className="h-5 w-5" />
                </span>
                <span className="text-[13px] font-semibold">Crypto (USDT)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Send USDT to the provided wallet address (see instructions at right) and upload the transaction screenshot.
              </p>
            </button>
          </div>
        </div>

        {/* Form + method details */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr,0.9fr]">
          <DepositForm
            amount={amount}
            note={note}
            proof={proof}
            isSubmitting={isSubmitting}
            onAmountChange={setAmount}
            onNoteChange={setNote}
            onProofChange={handleProofChange}
            onSubmit={handleSubmit}
          />

          <MethodDetails method={method} />
        </div>

        {/* Important notice */}
        <div className="mt-6 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-xs text-muted-foreground">
          <p className="font-medium text-main">Important</p>
          <p className="mt-1">
            Verification is manual. Upload a clear payment proof that shows amount, recipient or txid. We will credit your USD balance after confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   DepositForm (does NOT accept `method` prop)
   ========================= */
interface DepositFormProps {
  amount: string;
  note: string;
  proof: File | null;
  isSubmitting: boolean;
  onAmountChange: (val: string) => void;
  onNoteChange: (val: string) => void;
  onProofChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function DepositForm({
  amount,
  note,
  proof,
  isSubmitting,
  onAmountChange,
  onNoteChange,
  onProofChange,
  onSubmit,
}: DepositFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 text-sm">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-main">Amount to deposit (USD)</label>
        <div className="flex items-center rounded-xl border border-line bg-background px-3 py-2.5">
          <span className="text-xs text-muted-foreground">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            min={0}
            step="0.01"
            className="ml-2 w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-main">Note (optional)</label>
        <input
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="e.g. Trading capital, savings..."
          className="w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-main">Upload payment proof (required)</label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-muted/40 px-4 py-4 text-center text-xs transition hover:border-primary">
          <UploadCloud className="h-5 w-5 text-muted-foreground" />
          <p className="font-medium text-main">{proof ? proof.name : "Click to upload screenshot or receipt"}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Supported: JPG, PNG, PDF. Max 10MB.</p>
          <input type="file" accept="image/*,application/pdf" className="hidden" onChange={onProofChange} />
        </label>
      </div>

      <button
        type="submit"
        disabled={!amount || !proof || isSubmitting}
        className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-full bg-primary px-6 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit deposit"}
      </button>
    </form>
  );
}

/* =========================
   MethodDetails: uses `method`
   ========================= */
function MethodDetails({ method }: { method: DepositMethod }) {
  if (method === "bank") {
    return (
      <div className="rounded-2xl border border-line bg-secondary/40 p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-main">Bank Transfer (USD)</p>

        <div className="mt-3 space-y-1.5">
          <DetailRow label="Account name" value="Efeurhobo Bullish" />
          <DetailRow label="Bank name" value="Wells Fargo" />
          <DetailRow label="Account number" value="40630203010669629" />
          <DetailRow label="Account type" value="Checking" />
          <DetailRow label="Routing number" value="121000248" />
          <DetailRow label="SWIFT code" value="WFBIUS6S" />
          <DetailRow
            label="Bank address"
            value="651 N Broad St, Suite 206, Middletown, 19709 Delaware, US"
          />
        </div>

        <p className="mt-3 text-[13px]">
          Transfer the exact USD amount to the account shown above. Upload a clear screenshot that shows payment date, amount and recipient. Manual verification typically completes within a few hours.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-secondary/40 p-4 text-xs text-muted-foreground">
      <p className="font-semibold text-main">Crypto (USDT)</p>

      <div className="mt-3 space-y-1.5">
        <DetailRow label="Asset" value="USDT (Tether)" />
        <DetailRow label="Network" value="(select network e.g. TRC20 / ERC20 / BSC)" />
        <DetailRow label="Wallet address" value="(paste your official USDT wallet address)" />
      </div>

      <p className="mt-3 text-[13px]">
        Only send USDT on the supported network. After sending, upload a screenshot showing the TxID/hash and amount. We will credit your account after verification.
      </p>
    </div>
  );
}

/* =========================
   Small helper: label + value row
   ========================= */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-medium text-main break-all">{value}</span>
    </div>
  );
}

export default DepositHome;