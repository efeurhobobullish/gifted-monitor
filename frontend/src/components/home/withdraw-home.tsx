// src/components/home/WithdrawHome.tsx
import React, { useState } from "react";

export default function WithdrawHome() {
  const [amount, setAmount] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [routingNumber, setRoutingNumber] = useState<string>("");
  const [accountType, setAccountType] = useState<string>("Checking"); // optional
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isValid = (): boolean => {
    const amt = Number(amount);
    return (
      !!amount &&
      !isNaN(amt) &&
      amt > 0 &&
      accountName.trim() !== "" &&
      bankName.trim() !== "" &&
      accountNumber.trim() !== "" &&
      routingNumber.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;

    setIsSubmitting(true);
    try {
      // Example payload for API integration (replace with your endpoint)
      // const fd = new FormData();
      // fd.append("amount", amount);
      // fd.append("accountName", accountName);
      // fd.append("bankName", bankName);
      // fd.append("accountNumber", accountNumber);
      // fd.append("routingNumber", routingNumber);
      // fd.append("accountType", accountType);
      // fd.append("note", note || "");
      //
      // const res = await fetch("/api/withdrawals", { method: "POST", body: fd });
      // handle response accordingly

      // Mock submit (remove in production)
      await new Promise((res) => setTimeout(res, 700));

      // reset on success
      setAmount("");
      setAccountName("");
      setBankName("");
      setAccountNumber("");
      setRoutingNumber("");
      setAccountType("Checking");
      setNote("");

      // TODO: replace with toast/notification UI
      console.log("Withdrawal request submitted (mock)", {
        amount,
        accountName,
        bankName,
        accountNumber,
        routingNumber,
        accountType,
        note,
      });
    } catch (err) {
      console.error("Withdrawal submit error", err);
      // TODO: show user-visible error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main py-8">
      <header>
        <h1 className="text-2xl font-semibold text-main font-space">Withdraw Funds</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-xl">
          Request a bank payout in USD. Provide accurate bank details to avoid processing delays. Withdrawals are reviewed and processed manually.
        </p>
      </header>

      <div className="mt-6 rounded-2xl border border-line bg-card/80 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-main">Amount to withdraw (USD)</label>
            <div className="flex items-center rounded-xl border border-line bg-background px-3 py-2.5">
              <span className="text-xs text-muted-foreground">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="ml-2 w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-main">Account name</label>
              <input
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Full name on the account"
                className="w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-main">Bank name</label>
              <input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Wells Fargo"
                className="w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-main">Account number</label>
                <input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Account number"
                  className="w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-main">Routing number</label>
                <input
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  placeholder="Routing number"
                  className="w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-main">Account type (optional)</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none"
              >
                <option>Checking</option>
                <option>Savings</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-main">Note (optional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional reference"
              className="w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              By submitting you confirm the bank account belongs to you and details are accurate.
            </p>

            <button
              type="submit"
              disabled={!isValid() || isSubmitting}
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Request withdrawal"}
            </button>
          </div>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-xs text-muted-foreground">
          <p className="font-medium text-main">Processing</p>
          <p className="mt-1">Withdrawal requests are reviewed manually. Typical processing time: 1–3 business days. Incorrect bank details may delay processing.</p>
        </div>
      </div>
    </div>
  );
}