import { useState } from "react";
import { FaCheck, FaTrash, FaComment, FaPhone, FaStar } from "react-icons/fa";
import img from "../assets/images/img.png";

function FeedCard({ id, name, number, description, rating = 0, onDelete, onReply }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="flex flex-col sm:flex-row items-start bg-white border rounded-lg p-4 sm:p-5 shadow-sm w-full gap-4">
      {/* Profile Image */}
      <img
        src={img}
        alt="Profile"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
      />

      {/* Content Area */}
      <div className="flex flex-col flex-grow gap-3 w-full">
        {/* Review Text */}
        <div className="text-sm text-gray-700 flex items-start gap-2">
          <FaComment className="mt-1 flex-shrink-0" />
          <span className="break-words">{description}</span>
        </div>

        {/* Name, Phone & Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-lg text-gray-900">{name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FaPhone className="flex-shrink-0" /> {number}
            </p>
          </div>

          {/* Dynamic Rating Stars */}
          <div className="flex items-center gap-1 text-lg sm:text-xl">
            {renderStars(rating)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-end mt-2">
          <button
            onClick={() => onDelete(id)}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 text-sm font-medium rounded-md border border-red-200 hover:bg-red-100 w-full sm:w-auto"
          >
            <FaTrash /> Delete
          </button>

          <button
            onClick={() => setShowReply(!showReply)}
            className="flex items-center justify-center gap-2 bg-green-50 text-[#006644] px-4 py-2 text-sm font-medium rounded-md border border-green-200 hover:bg-green-100 w-full sm:w-auto"
          >
            <FaCheck /> Review
          </button>
        </div>

        {/* Reply Textbox */}
        {showReply && (
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006644]"
            />
            <button
              onClick={() => {
                onReply(id, replyText);
                setReplyText("");
                setShowReply(false);
              }}
             className="self-end bg-[#006644] text-white px-4 py-2 rounded-md hover:bg-green-100 hover:text-[#006644] text-sm"

            >
              Send Reply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedCard;
