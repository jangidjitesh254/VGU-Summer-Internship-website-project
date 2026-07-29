import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserMessages } from '../api';
import socket from '../socket';
import { Link } from 'react-router-dom';

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  const chatContainerRef = useRef(null);

  // Reliable Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 60);
    return () => clearTimeout(timer);
  }, [threadMessages, activeThread]);

  const loadMessages = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getUserMessages(user.email);
      setMessages(Array.isArray(data) ? data : []);
      
      if (data && data.length > 0 && !activeThread) {
        const firstMsg = data[0];
        const partner = firstMsg.senderEmail.toLowerCase() === user.email.toLowerCase()
          ? firstMsg.receiverEmail
          : firstMsg.senderEmail;
        
        setActiveThread({
          productId: firstMsg.productId,
          productTitle: firstMsg.productTitle,
          partnerEmail: partner,
          partnerName: firstMsg.senderEmail.toLowerCase() === user.email.toLowerCase() ? firstMsg.receiverName : firstMsg.senderName
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [user]);

  // Socket.io real-time listener
  useEffect(() => {
    if (!activeThread || !user) return;

    const roomId = `${activeThread.productId}_${[user.email.toLowerCase(), activeThread.partnerEmail.toLowerCase()].sort().join('_')}`;
    
    socket.emit('join_room', roomId);

    const handleReceiveMessage = (newMsg) => {
      setThreadMessages((prev) => [...prev, newMsg]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [activeThread, user]);

  // Filter messages for active thread
  useEffect(() => {
    if (!activeThread || !user) return;

    const partner = activeThread.partnerEmail.toLowerCase();
    const myEmail = user.email.toLowerCase();

    const filtered = messages.filter((m) => {
      const matchProduct = m.productId === activeThread.productId || activeThread.productId === 'general';
      const matchUsers = (m.senderEmail.toLowerCase() === myEmail && m.receiverEmail.toLowerCase() === partner) ||
                         (m.senderEmail.toLowerCase() === partner && m.receiverEmail.toLowerCase() === myEmail);
      return matchProduct && matchUsers;
    });

    setThreadMessages(filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
  }, [activeThread, messages, user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread || !user) return;

    const roomId = `${activeThread.productId}_${[user.email.toLowerCase(), activeThread.partnerEmail.toLowerCase()].sort().join('_')}`;

    const msgPayload = {
      roomId,
      productId: activeThread.productId,
      productTitle: activeThread.productTitle,
      senderEmail: user.email,
      senderName: user.firstName || user.email.split('@')[0],
      receiverEmail: activeThread.partnerEmail,
      receiverName: activeThread.partnerName || "Seller",
      text: inputText.trim()
    };

    socket.emit('send_message', msgPayload);
    setInputText('');
  };

  const threadsMap = new Map();
  if (user && messages) {
    messages.forEach((m) => {
      const partnerEmail = m.senderEmail.toLowerCase() === user.email.toLowerCase() ? m.receiverEmail : m.senderEmail;
      const partnerName = m.senderEmail.toLowerCase() === user.email.toLowerCase() ? m.receiverName : m.senderName;
      const key = `${m.productId}_${partnerEmail.toLowerCase()}`;

      if (!threadsMap.has(key)) {
        threadsMap.set(key, {
          productId: m.productId,
          productTitle: m.productTitle,
          partnerEmail,
          partnerName,
          lastMessage: m.text,
          date: m.createdAt
        });
      }
    });
  }

  const threadsList = Array.from(threadsMap.values());

  if (!user) {
    return (
      <div className="container py-5 text-center min-vh-75 d-flex flex-column justify-content-center align-items-center">
        <div className="card shadow-lg p-5 rounded-4 border-0 max-w-md">
          <i className="bi bi-chat-lock-fill display-2 text-success mb-3"></i>
          <h3 className="fw-bold">Sign In Required</h3>
          <p className="text-muted">Please log in to access your in-app campus messages and seller chats.</p>
          <Link to="/login" className="btn btn-success px-4 py-2 mt-2">
            Login to Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 bg-light min-vh-90">
      <div className="container">
        <div className="mb-4">
          <h2 className="fw-extrabold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-chat-dots-fill text-success"></i> Campus Inbox
          </h2>
          <p className="text-muted small mb-0">Real-time Socket.io student-to-student messaging</p>
        </div>

        <div className="card shadow-xl border-0 rounded-4 overflow-hidden" style={{ minHeight: '620px' }}>
          <div className="row g-0 h-100">
            {/* Left Sidebar Threads */}
            <div className="col-lg-4 border-end bg-white">
              <div className="p-3 bg-light border-bottom fw-bold text-dark d-flex align-items-center justify-content-between">
                <span>Conversations ({threadsList.length})</span>
                <button onClick={loadMessages} className="btn btn-sm btn-outline-secondary rounded-circle" title="Refresh Inbox">
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>

              <div className="overflow-auto" style={{ maxHeight: '560px' }}>
                {loading && (
                  <div className="text-center py-4 text-muted">
                    <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                    Loading messages...
                  </div>
                )}

                {!loading && threadsList.length === 0 && (
                  <div className="p-4 text-center text-muted">
                    <i className="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                    <p className="small mb-0">No active chat conversations yet. Visit a product page and click "Contact Seller" to start chatting!</p>
                  </div>
                )}

                {threadsList.map((t) => {
                  const isSelected = activeThread && activeThread.productId === t.productId && activeThread.partnerEmail.toLowerCase() === t.partnerEmail.toLowerCase();

                  return (
                    <div
                      key={`${t.productId}_${t.partnerEmail}`}
                      onClick={() => setActiveThread(t)}
                      className={`p-3 border-bottom cursor-pointer transition-all ${isSelected ? 'bg-success bg-opacity-10 border-start border-4 border-success' : 'hover-bg-light'}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '42px', height: '42px' }}>
                          <i className="bi bi-person-fill"></i>
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="fw-bold mb-0 text-truncate">{t.partnerName || t.partnerEmail.split('@')[0]}</h6>
                            <small className="text-muted opacity-75" style={{ fontSize: '0.7rem' }}>
                              {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </small>
                          </div>
                          <span className="badge bg-secondary bg-opacity-10 text-secondary mb-1" style={{ fontSize: '0.7rem' }}>
                            {t.productTitle}
                          </span>
                          <p className="text-muted small mb-0 text-truncate">{t.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Chat Panel */}
            <div className="col-lg-8 bg-light d-flex flex-column" style={{ minHeight: '560px' }}>
              {activeThread ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 bg-white border-bottom d-flex align-items-center justify-content-between shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-person"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">{activeThread.partnerName || activeThread.partnerEmail}</h6>
                        <small className="text-muted">
                          Item: <strong className="text-success">{activeThread.productTitle}</strong>
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages Body - Container Ref Auto-scroll */}
                  <div
                    ref={chatContainerRef}
                    className="p-4 flex-grow-1 overflow-auto bg-light"
                    style={{ maxHeight: '440px', height: '440px' }}
                  >
                    {threadMessages.map((m, index) => {
                      const isMe = m.senderEmail.toLowerCase() === user.email.toLowerCase();

                      return (
                        <div key={m._id || index} className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                          <div
                            className={`p-3 rounded-4 shadow-sm max-w-lg ${
                              isMe
                                ? 'bg-success text-white rounded-bottom-end-0'
                                : 'bg-white text-dark border rounded-bottom-start-0'
                            }`}
                            style={{ maxWidth: '75%' }}
                          >
                            <p className="mb-1 fs-6">{m.text}</p>
                            <small className={`d-block text-end ${isMe ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.68rem' }}>
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </small>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chat Composer Form */}
                  <form onSubmit={handleSendMessage} className="p-3 bg-white border-top">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-lg border-secondary border-opacity-25 ps-3"
                        placeholder="Type your message to seller..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        required
                      />
                      <button className="btn btn-success px-4 fw-bold" type="submit">
                        Send <i className="bi bi-send-fill ms-1"></i>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted p-5">
                  <i className="bi bi-chat-square-dots display-3 mb-3 text-secondary opacity-50"></i>
                  <h5>Select a conversation</h5>
                  <p className="small">Choose an active thread from the left sidebar to view messages or reply.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
