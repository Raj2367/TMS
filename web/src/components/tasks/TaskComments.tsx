"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { Task, Comment } from "@/types";
import { onSocketEvent, offSocketEvent } from "@/lib/socket";

interface Props {
  task: Task;
}

export default function TaskComments({ task }: Props) {
  const [comments, setComments] = useState<Comment[]>(task.comments || []);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [comments]);

  useEffect(() => {
    const handleCommentAdded = (data: any) => {
      if (data.taskId !== task._id) return;

      setComments((prev) => [...prev, data.comment]);
    };

    onSocketEvent("commentAdded", handleCommentAdded);

    return () => {
      offSocketEvent("commentAdded", handleCommentAdded);
    };
  }, [task._id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      setLoading(true);

      await api.post(`/tasks/${task._id}/comments`, { message });

      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">Comments</h3>

      <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
        {comments.length === 0 && (
          <p className="text-sm text-gray-500">No comments yet</p>
        )}

        {comments.map((comment, index) => {
          return (
            <div key={index} className="bg-gray-100 p-3 rounded">
              <p className="text-sm font-semibold">{comment.user.name}:</p>
              <p className="text-sm text-gray-700">{comment.message}</p>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border p-2 rounded"
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
