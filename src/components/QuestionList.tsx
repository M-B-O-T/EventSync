"use client";

import { useState } from "react";
import { ThumbsUp, Send } from "lucide-react";
import { submitQuestion, upvoteQuestion } from "@/lib/actions";

interface Question {
  id: string;
  content: string;
  author: string | null;
  votes: number;
  createdAt: string;
}

interface QuestionListProps {
  questions: Question[];
  sessionId: string;
  isLive: boolean;
  onQuestionAdded?: () => void;
}

export default function QuestionList({
  questions,
  sessionId,
  isLive,
  onQuestionAdded,
}: QuestionListProps) {
  const [newQuestion, setNewQuestion] = useState("");
  const [author, setAuthor] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    try {
      await submitQuestion(sessionId, newQuestion, isAnonymous ? null : author);
      setNewQuestion("");
      setAuthor("");
      if (onQuestionAdded) onQuestionAdded();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (questionId: string) => {
    try {
      await upvoteQuestion(questionId, sessionId);
      if (onQuestionAdded) onQuestionAdded();
    } catch {}
  };

  return (
    <div className="space-y-10">

      {isLive && (
        <div className="bg-white/5 border border-white/10 backdrop-blur rounded-[28px] p-6">
          <h4 className="text-white font-black uppercase tracking-[0.2em] mb-6 text-sm">
            Poser une question
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Votre question..."
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]"
              rows={3}
              required
            />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-[0.2em]">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="accent-[#2ecc71]"
                  />
                  Anonyme
                </label>

                {!isAnonymous && (
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Nom"
                    className="px-3 py-2 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#2ecc71]"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-3 bg-[#2ecc71] text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:opacity-90 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Envoyer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <h4 className="text-white font-black uppercase tracking-[0.2em] text-sm">
          Questions ({questions.length})
        </h4>

        {questions.length === 0 && (
          <p className="text-gray-500 text-center py-10">
            Aucune question pour le moment
          </p>
        )}

        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-white/5 border border-white/10 rounded-[24px] p-5 backdrop-blur"
          >
            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <p className="text-white">{question.content}</p>

                <div className="flex items-center gap-3 mt-3 text-xs uppercase tracking-[0.2em] text-gray-500">
                  <span>{question.author || "Anonyme"}</span>
                  <span>•</span>
                  <span>
                    {new Date(question.createdAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleUpvote(question.id)}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
              >
                <ThumbsUp className="w-4 h-4 text-[#2ecc71]" />
                <span className="font-black">{question.votes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}