"use client";

import { useRef, useState } from "react";
import { FileArchive, FileSpreadsheet, FileText, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Attachment = {
  id: string;
  filename: string;
  file_type: string | null;
  file_size: string | null;
  created_at: string;
};

type Props = {
  initialAttachments: Attachment[];
};

function fileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return FileText;
  if (["xlsx", "xls", "csv"].includes(ext ?? "")) return FileSpreadsheet;
  if (["zip", "rar", "7z"].includes(ext ?? "")) return FileArchive;
  return FileText;
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function AttachmentList({ initialAttachments }: Props) {
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setAttachments((prev) => [
        ...prev,
        {
          id: `a-local-${Date.now()}`,
          filename: file.name,
          file_type: file.type || "File",
          file_size: formatSize(file.size),
          created_at: new Date().toISOString(),
        },
      ]);
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }, 800);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 border-b border-white/[0.08] pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Upload className="h-4 w-4 text-primary" />
          Attachments ({attachments.length})
        </CardTitle>
        <Button
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload file"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
          onChange={handleFileChange}
        />
      </CardHeader>

      <CardContent className="space-y-3 p-5">
        {attachments.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No attachments yet.
          </p>
        )}

        {attachments.map((attachment) => {
          const Icon = fileIcon(attachment.filename);
          const date = new Date(attachment.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <div
              key={attachment.id}
              className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{attachment.filename}</p>
                  <p className="text-sm text-muted-foreground">
                    {attachment.file_type || "File"} · {attachment.file_size || "—"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">Uploaded {date}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
