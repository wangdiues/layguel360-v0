"use client";

import { useState, useTransition } from "react";
import { MessageSquare } from "lucide-react";

import { postComment } from "@/app/tasks/[taskId]/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Comment = {
  id: string;
  text: string;
  created_at: string;
  author: string;
};

type Props = {
  taskId: string;
  initialComments: Comment[];
};

export function CommentList({ taskId, initialComments }: Props) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handlePost() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setError(null);
    startTransition(async () => {
      const result = await postComment(taskId, trimmed);
      if (result.ok === false) {
        setError(result.error);
        return;
      }
      setText("");
    });
  }

  return (
    <Card>
      <CardHeader className="border-b border-white/[0.08] pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <MessageSquare className="h-4 w-4 text-primary" />
          Comments ({initialComments.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        {initialComments.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">No comments yet.</p>
        )}

        <div className="space-y-4">
          {initialComments.map((comment) => {
            const initials = comment.author
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
            const date = new Date(comment.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-9 w-9 border border-white/[0.1]">
                  <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.04] p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-foreground">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">{date}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{comment.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
          <Textarea
            placeholder="Write a comment..."
            className="min-h-24 resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={pending}
          />
          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <div className="flex justify-end">
            <Button onClick={handlePost} disabled={!text.trim() || pending}>
              {pending ? "Posting…" : "Post comment"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
