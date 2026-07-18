"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadSummaryButtonProps {
  readonly referenceNumber?: string;
  readonly summary: Record<string, unknown>;
}

/** Opens a printable summary that users can save as PDF from the browser. */
export function DownloadSummaryButton({
  referenceNumber = "SV-SUMMARY",
  summary
}: DownloadSummaryButtonProps): React.ReactElement {
  const handleDownload = () => {
    const rows = Object.entries(summary)
      .map(
        ([key, value]) =>
          `<tr><td style="padding:10px;border-bottom:1px solid #eadcf8;color:#6b5b78">${key}</td><td style="padding:10px;border-bottom:1px solid #eadcf8;color:#2D2238;font-weight:600">${Array.isArray(value) ? value.join(", ") : String(value ?? "")}</td></tr>`
      )
      .join("");
    const printWindow = window.open("", "_blank", "noopener,noreferrer");

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head><title>${referenceNumber}</title></head>
        <body style="font-family:Arial,sans-serif;background:#FAF7FF;padding:32px">
          <main style="max-width:760px;margin:auto;background:white;border:1px solid #eadcf8;border-radius:14px;padding:28px">
            <p style="color:#D4AF37;letter-spacing:2px;text-transform:uppercase;font-size:12px">Shree Velora Event's</p>
            <h1 style="color:#2D2238;font-family:Georgia,serif">Event Inquiry Summary</h1>
            <p style="color:#6b5b78">Reference: ${referenceNumber}</p>
            <table style="width:100%;border-collapse:collapse;margin-top:20px">${rows}</table>
          </main>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Button onClick={handleDownload} type="button" variant="outline">
      <Download aria-hidden="true" className="size-4" />
      Download Summary (PDF)
    </Button>
  );
}
