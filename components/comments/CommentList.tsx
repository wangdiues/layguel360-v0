"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";

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
  initialComments: Comment[];
};

export function CommentList({ initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");

  function handlePost() {
    if (!text.trim()) return;
    const next: Comment = {
      id: `c-local-${Date.now()}`,
      text: text.trim(),
      created_at: new Date().toISOString(),
      author: "Karma Wangchuk",
    };
    setComments((prev) => [...prev, next]);
    setText("");
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {comments.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No comments yet.
          </p>
        )}

        <div className="space-y-4">
          {comments.map((comment) => {
            const initials = comment.author
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
            const date = new Date(comment.created_at).toLocaleDateString(
              "en-GB",
              { day: "numeric", month: "short", year: "numeric" }
            );

            return (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback className="bg-indigo-50 text-xs font-semibold text-indigo-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded-2xl border bg-muted/30 p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">{date}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {comment.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3 rounded-2xl border bg-background p-4">
          <Textarea
            placeholder="Write a comment..."
            className="min-h-24 resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              onClick={handlePost}
              disabled={!text.trim()}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Post comment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
