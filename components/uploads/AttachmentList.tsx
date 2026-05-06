"use client";

import { useRef, useState } from "react";
import { FileArchive, FileSpreadsheet, FileText, Upload } from "lucide-react";

import { uploadAttachment } from "@/app/tasks/[taskId]/actions";
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
  taskId: string;
  initialAttachments: Attachment[];
};

function fileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return FileText;
  if (["xlsx", "xls", "csv"].includes(ext ?? "")) return FileSpreadsheet;
  if (["zip", "rar", "7z"].includes(ext ?? "")) return FileArchive;
  return FileText;
}

export function AttachmentList({ taskId, initialAttachments }: Props) {
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAttachment(taskId, formData);

    if (!result.ok) {
      setError(result.error);
    } else {
      setAttachments((prev) => [...prev, result.data]);
    }

    setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
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
        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {attachments.length === 0 && !error && (
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
