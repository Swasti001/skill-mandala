import React, { useEffect, useState } from "react";
import api from "../api";
import UserNavbar from "../components/UserNavbar";

const UserRequestsPage = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReceivedRequests();
    fetchSentRequests();
  }, []);

  const fetchReceivedRequests = async () => {
    try {
      const res = await api.get(`/user/exchange-requests/received/${userId}`);
      setReceivedRequests(res.data || []);
    } catch (err) {
      console.error("Failed to load received requests", err);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const res = await api.get(`/user/exchange-requests/sent/${userId}`);
      setSentRequests(res.data || []);
    } catch (err) {
      console.error("Failed to load sent requests", err);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await api.put(`/user/exchange-requests/${requestId}/accept/${userId}`);
      fetchReceivedRequests();
    } catch (err) {
      console.error("Accept request failed", err);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await api.put(`/user/exchange-requests/${requestId}/reject/${userId}`);
      fetchReceivedRequests();
    } catch (err) {
      console.error("Reject request failed", err);
    }
  };

  const cancelRequest = async (requestId) => {
    try {
      await api.put(`/user/exchange-requests/${requestId}/cancel/${userId}`);
      fetchSentRequests();
    } catch (err) {
      console.error("Cancel request failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <UserNavbar />

      <div className="pt-28 px-6 md:px-12 max-w-5xl mx-auto">

        <h1 className="text-2xl font-semibold mb-8">Exchange Requests</h1>

        {/* Incoming Requests */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-4 text-purple-400">
            Incoming Requests
          </h2>

          {receivedRequests.length === 0 && (
            <p className="text-slate-400">No incoming requests.</p>
          )}

          {receivedRequests.map((req) => (
            <div
              key={req.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex justify-between items-center"
            >
              <div>
                <p className="text-sm">
                  <span className="text-slate-400">Teaches:</span>{" "}
                  {req.requesterTeaches}
                </p>

                <p className="text-sm">
                  <span className="text-slate-400">Learns:</span>{" "}
                  {req.requesterLearns}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Status: {req.status}
                </p>
              </div>

              {req.status === "PENDING" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => acceptRequest(req.id)}
                    className="px-4 py-2 text-xs rounded-full bg-green-500 hover:bg-green-600"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => rejectRequest(req.id)}
                    className="px-4 py-2 text-xs rounded-full bg-red-500 hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sent Requests */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-pink-400">
            Outgoing Requests
          </h2>

          {sentRequests.length === 0 && (
            <p className="text-slate-400">No outgoing requests.</p>
          )}

          {sentRequests.map((req) => (
            <div
              key={req.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex justify-between items-center"
            >
              <div>
                <p className="text-sm">
                  <span className="text-slate-400">You Teach:</span>{" "}
                  {req.requesterTeaches}
                </p>

                <p className="text-sm">
                  <span className="text-slate-400">You Learn:</span>{" "}
                  {req.requesterLearns}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Status: {req.status}
                </p>
              </div>

              {req.status === "PENDING" && (
                <button
                  onClick={() => cancelRequest(req.id)}
                  className="px-4 py-2 text-xs rounded-full bg-yellow-500 hover:bg-yellow-600"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default UserRequestsPage;