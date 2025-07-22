"use client";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_COMMENT, GET_COMMENTS_BY_POST } from "@/graphql/comment";

interface CommentType {
  _id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface PostType {
  id: number;
  _id: string; // GraphQL id
  title: string;
  content: string;
  specialization: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  createdAt: string;
  comments: CommentType[]; // comments array with objects
}

export const PostCard = ({ post }: { post: PostType }) => {
  const [commentText, setCommentText] = useState("");

  // Коммент жагсаалт татах query
  const { data, loading, error, refetch } = useQuery(GET_COMMENTS_BY_POST, {
    variables: { postId: post._id },
  });

  // Коммент үүсгэх mutation
  const [createComment, { loading: creating }] = useMutation(CREATE_COMMENT, {
    onCompleted() {
      setCommentText("");
      refetch();
    },
    onError(error) {
      alert("Коммент нэмэхэд алдаа гарлаа: " + error.message);
    },
  });

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await createComment({
      variables: {
        input: {
          postId: post._id,
          content: commentText,
        },
      },
    });
  };

  return (
    <div className="bg-white border rounded-md p-4 shadow-sm space-y-4">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span className="font-medium">{post.specialization}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      <h3 className="text-lg font-semibold">{post.title}</h3>
      <p className="text-gray-700 whitespace-pre-line">{post.content}</p>

      {post.mediaType === "image" && post.mediaUrl && (
        <img
          src={post.mediaUrl}
          alt="attached"
          className="w-full rounded-md max-h-60 object-cover mt-2"
        />
      )}

      {post.mediaType === "video" && post.mediaUrl && (
        <div className="aspect-video mt-2">
          <video controls src={post.mediaUrl} className="w-full rounded-md" />
        </div>
      )}

      {/* Комментын тоо */}
      <div className="text-xs text-gray-400 pt-2">
        Сэтгэгдэл: {data?.getCommentsByPost?.length ?? post.comments.length} ширхэг
      </div>

      {/* Коммент бичих хэсэг */}
      <div className="mt-4">
        <textarea
          placeholder="Сэтгэгдэл бичих..."
          className="w-full border rounded p-2 resize-none"
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={creating}
        />
        <button
          onClick={handleAddComment}
          disabled={creating || !commentText.trim()}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {creating ? "Илгээж байна..." : "Илгээх"}
        </button>
      </div>

      {/* Коммент жагсаалт */}
      <div className="mt-6 space-y-3">
        {loading && <p>Коммент уншиж байна...</p>}
        {error && <p className="text-red-500">Коммент уншихад алдаа гарлаа.</p>}
        {data?.getCommentsByPost?.map((comment: CommentType) => (
          <div key={comment._id} className="border rounded p-2 bg-gray-50">
            <p className="font-semibold">{comment.author}</p>
            <p>{comment.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
