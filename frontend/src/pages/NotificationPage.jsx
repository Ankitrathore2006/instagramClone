import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { X, Check } from "lucide-react";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/notifications"); // Your backend route
      setNotifications(res.data); // adjust if response wraps data
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <p className="text-center pt-10">Loading notifications...</p>;
  if (notifications.length === 0) return <p className="text-center pt-10">No notifications yet</p>;

  return (
    <div className="max-w-xl mx-auto p-4 py-8 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>

      <ul className="space-y-2">
        {notifications.map((n) => (
          <li
            key={n._id}
            className={`flex justify-between items-center p-3 rounded-lg border ${
              n.read ? "bg-gray-100" : "bg-white"
            }`}
          >
            <div>
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-gray-500">{n.message}</p>
              <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              {!n.read && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <Check />
                </button>
              )}
              <button
                onClick={() => setNotifications((prev) => prev.filter((item) => item._id !== n._id))}
                className="text-red-500 hover:text-red-700 transition"
              >
                <X />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPage;
