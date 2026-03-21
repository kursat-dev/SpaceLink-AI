import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { messagesAPI, usersAPI } from '../api';
import Sidebar from '../components/Sidebar';
import './Messages.css';

export default function Messages() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    const userId = searchParams.get('user');
    if (userId) openChat(userId);
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await messagesAPI.getConversations();
      setConversations(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openChat = async (userId) => {
    try {
      const [msgsRes, userRes] = await Promise.all([
        messagesAPI.getMessages(userId),
        usersAPI.getById(userId)
      ]);
      setMessages(msgsRes.data);
      setActiveChat(userRes.data);
    } catch (err) { console.error(err); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    try {
      const res = await messagesAPI.send(activeChat._id, newMessage);
      setMessages([...messages, res.data]);
      setNewMessage('');
      loadConversations();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page-with-sidebar">
      <Sidebar />
      <main className="page-content" style={{ padding: 0, display: 'flex', maxHeight: 'calc(100vh - 5rem)' }}>
        {/* Conversations List */}
        <div className="messages-sidebar">
          <div className="messages-sidebar-header">
            <h2>{t('messages.sidebar_title')}</h2>
          </div>
          <div className="conversations-list">
            {loading ? (
              <div className="loading-placeholder" style={{ padding: '2rem' }}>{t('messages.loading')}</div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
                {t('messages.no_convos')}
              </div>
            ) : (
              conversations.map((conv, i) => (
                <div key={i} className={`conversation-item ${activeChat?._id === conv.user?._id ? 'active' : ''}`}
                  onClick={() => openChat(conv.user?._id)}>
                  <div className="conv-avatar">
                    {conv.user?.name?.charAt(0) || '?'}
                  </div>
                  <div className="conv-info">
                    <div className="conv-header">
                      <span className="conv-name">{conv.user?.name}</span>
                      <span className="conv-time">
                        {new Date(conv.lastMessageAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="conv-preview">{conv.lastMessage?.substring(0, 50)}...</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="conv-unread">{conv.unreadCount}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {activeChat ? (
            <>
              <div className="chat-header">
                <div className="chat-header-user">
                  <div className="conv-avatar" style={{ width: '2.5rem', height: '2.5rem' }}>
                    {activeChat.name?.charAt(0)}
                  </div>
                  <div>
                    <h3>{activeChat.name}</h3>
                    <p>{activeChat.title}</p>
                  </div>
                </div>
              </div>
              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-bubble ${msg.sender?._id === user?._id || msg.sender === user?._id ? 'sent' : 'received'}`}>
                    <p>{msg.content}</p>
                    <span className="chat-time">
                      {new Date(msg.createdAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-input-area" onSubmit={sendMessage}>
                <input className="input-field chat-input" placeholder={t('messages.input_ph')}
                  value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <button type="submit" className="btn-primary chat-send-btn" disabled={!newMessage.trim()}>
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty">
              <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'var(--outline-variant)' }}>chat</span>
              <h3>{t('messages.empty_title')}</h3>
              <p>{t('messages.empty_desc')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
