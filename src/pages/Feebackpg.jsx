import { useState, useEffect } from "react";
import { MdFeedback } from "react-icons/md";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../../firebase";
import FeedCard from "../components/FeedbackCardpg";
import Filterbtn from "../components/FilterBtnpg";
import { getAllData } from "../Helper/FirebaseHelperpg";

//  Fetch user by UID
async function getUserByUID(uid) {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user by UID:", error);
    return null;
  }
}



function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState("All");

  //delete handler
  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this feedback?");
      if (!confirmDelete) return;

      await deleteDoc(doc(db, "feedbacks", id));
      setFeedbacks((prev) => prev.filter((fb) => fb.id !== id)); // update UI

      alert("Feedback deleted successfully ✅");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("❌ Failed to delete feedback");
    }
  };
  const handleReply = async (id, replyText) => {
    try {
      await updateDoc(doc(db, "feedbacks", id), {
        adminReply: replyText,
        repliedAt: new Date().toISOString(),
      });

      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === id ? { ...fb, adminReply: replyText } : fb
        )
      );

      alert("Reply sent successfully ✅");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("❌ Failed to send reply");
    }
  };

  //  Fetch feedback with user details
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const fbData = await getAllData("feedbacks");

        const enriched = await Promise.all(
          fbData.map(async (fb) => {
            const user = fb.userID ? await getUserByUID(fb.userID) : null;
            return {
              ...fb,
              userName: user?.name || "Unknown User",
              userPhone: user?.phoneNumber || "N/A",
              role: user?.role || "unknown",
            };
          })
        );

        setFeedbacks(enriched);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  //  Filter by role
  const filteredFeedbacks =
    filter === "All" ? feedbacks : feedbacks.filter((fb) => fb.role === filter);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-col flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 gap-5">

        {/* Header */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <MdFeedback size={22} className="text-[#006644]" />
            <span className="text-xl font-semibold">Feedback Management</span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 w-full sm:w-auto">
            {["All", "farmer", "expert"].map((f) => (
              <Filterbtn
                key={f}
                name={f}
                active={filter === f}
                onClick={() => setFilter(f)}
              />
            ))}
          </div>
        </div>

        {/* Feedback Cards */}
        <div className="flex flex-col gap-4">
          {filteredFeedbacks.length > 0 ? (
            filteredFeedbacks.map((fb) => (
              <FeedCard
                key={fb.id}
                id={fb.id}
                name={fb.userName}
                number={fb.userPhone}
                description={fb.content || "No feedback provided"}
                rating={fb.rating || 0}
                onDelete={handleDelete}
                onReply={handleReply}
              />

            ))
          ) : (
            <p className="text-gray-500 text-center w-full">
              No feedback available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feedback;
