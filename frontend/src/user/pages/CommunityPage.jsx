import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, MessageSquare, Share2, MoreHorizontal,
  Send, Image, Sparkles, Loader2, Trash2, Edit3,
  ChevronDown, Users, TrendingUp, BookOpen, HelpCircle, Handshake,
  ExternalLink, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import api from "../api";
import Avatar from "../components/Avatar";

const CommunityPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("feed");
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [postComments, setPostComments] = useState({});
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef();

  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const currentUserId = user?.id;
  const displayName = user?.name || user?.username || "You";

  const BACKEND_BASE = "http://localhost:8080";

  const SIDEBAR_LINKS = [
    { id: "feed",    name: t('home_feed'),    icon: BookOpen },
    { id: "circles",name: t('skill_circles'),icon: Users },
    { id: "trending",name: t('trending'),    icon: TrendingUp },
  ];

  const CATEGORIES = [t("all_topics"), "Programming", "Design", "Strategy", "Business", "Music", "Language"];

  const getImageUrl = useCallback((imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${BACKEND_BASE}${imageUrl}`;
  }, []);

  const fetchFeed = useCallback(async (view) => {
    try {
      setLoading(true);
      let endpoint = "/posts/feed";
      if (view === "circles") endpoint = "/posts/circles";
      else if (view === "trending") endpoint = "/posts/trending";
      
      const res = await api.get(endpoint);
      setPosts(res.data.content || []);
    } catch (err) {
      console.error(`Failed to fetch ${view} feed:`, err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(activeView);
  }, [activeView, fetchFeed]);

  const fetchComments = async (postId) => {
    try {
      const res = await api.get(`/comments/${postId}`);
      setPostComments(prev => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleToggleComments = (postId) => {
    const isExpanding = !expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: isExpanding }));
    if (isExpanding) {
      fetchComments(postId);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!newBody.trim()) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("content", newBody.trim());
      if (newTitle.trim()) formData.append("title", newTitle.trim());
      if (selectedImage) formData.append("image", selectedImage);
      formData.append("skillId", 1); 

      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (activeView === "feed") {
        setPosts([res.data, ...posts]);
      }
      setNewTitle("");
      setNewBody("");
      setSelectedImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Failed to create post:", err);
      alert(t('failed_share'));
    } finally {
      setUploading(false);
    }
  };

  const toggleLike = async (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const currentlyLiked = p.likedByCurrentUser;
        return {
          ...p,
          likedByCurrentUser: !currentlyLiked,
          likeCount: currentlyLiked ? p.likeCount - 1 : p.likeCount + 1
        };
      }
      return p;
    }));

    try {
      await api.post(`/posts/${postId}/like`);
    } catch (err) {
      console.error("Failed to toggle like:", err);
      fetchFeed(activeView);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm(t('delete_confirm'))) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const addComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    try {
      const res = await api.post("/comments", { postId, content: text });
      
      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data]
      }));

      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
      ));

      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const filteredPosts = activeCategory === t("all_topics")
    ? posts
    : posts.filter(p => 
        p.title?.toLowerCase().includes(activeCategory.toLowerCase()) || 
        p.content?.toLowerCase().includes(activeCategory.toLowerCase())
      );

  const formatTime = (dateString) => {
    if (!dateString) return t('just_now');
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return t('just_now');
    if (diff < 3600) return t('minutes_ago', { count: Math.floor(diff / 60) });
    if (diff < 86400) return t('hours_ago', { count: Math.floor(diff / 3600) });
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex gap-6 text-white text-left">
      <aside className="w-[200px] shrink-0 hidden xl:flex flex-col gap-2 pt-2">
        {SIDEBAR_LINKS.map(link => {
          const Icon = link.icon;
          const isActive = activeView === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveView(link.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                isActive
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
              }`}
            >
              <Icon size={16} />
              {link.name}
            </button>
          );
        })}
      </aside>

      <main className="flex-1 max-w-[720px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-black tracking-tight leading-none">
              {activeView === "feed" && t('community_mandala')}
              {activeView === "circles" && t('skill_circles')}
              {activeView === "trending" && t('trending_topics')}
            </h1>
            <p className="text-slate-400 text-[13px] font-medium mt-2">
              {activeView === "feed" && t('feed_desc')}
              {activeView === "circles" && t('circles_desc')}
              {activeView === "trending" && t('trending_desc')}
            </p>
          </div>
          
          {activeView === "feed" && (
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${
                    activeCategory === cat ? "bg-indigo-500 text-white border-indigo-400" : "bg-white/5 text-slate-400 border-slate-700/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#12182B] border border-slate-700/50 rounded-[28px] p-6 mb-8 shadow-xl">
          <div className="flex gap-4">
            <Avatar src={user?.profilePictureUrl} name={displayName} size="sm" border={false} className="shrink-0" />
            <div className="flex-1 space-y-3">
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder={t('topic_title')}
                className="w-full bg-transparent text-[15px] text-white font-bold placeholder:text-slate-600 focus:outline-none"
              />
              <textarea
                value={newBody}
                onChange={e => setNewBody(e.target.value)}
                rows={2}
                placeholder={t('whats_on_mind')}
                className="w-full bg-transparent text-[13px] text-slate-300 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed"
              />
              {imagePreview && (
                <div className="relative w-full h-40 rounded-xl overflow-hidden mt-2 group">
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  <button onClick={() => { setSelectedImage(null); setImagePreview(null); }} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/80 transition">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/60">
            <div className="relative">
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-slate-700/50 text-[11px] font-bold text-slate-300 hover:bg-white/10 transition">
                <Image size={12} /> {t('media')}
              </button>
            </div>
            <button onClick={handlePost} disabled={!newBody.trim() || uploading} className="px-6 py-2.5 rounded-full bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition shadow-lg disabled:opacity-40">
              {uploading ? <Loader2 className="animate-spin" size={12} /> : t('post_to_mandala')}
            </button>
          </div>
        </div>

        <div className="space-y-6 pb-12">
          {loading ? (
             <div className="flex flex-col items-center py-20 opacity-20">
               <Loader2 className="animate-spin mb-4" size={24} />
               <p className="text-[10px] font-black uppercase tracking-[0.3em]">{t('harvesting_knowledge')}</p>
             </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-20 text-center opacity-40">
              <Sparkles className="mx-auto mb-4" size={32} />
              <p className="text-[14px] font-bold">{t('no_posts_found')}</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredPosts.map((post) => {
                const isExpanded = expandedComments[post.id];
                const comments = postComments[post.id] || [];
                const postImageUrl = getImageUrl(post.imageUrl);

                return (
                  <motion.article 
                    key={post.id} 
                    layout 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.95 }} 
                    className="bg-[#12182B] border border-slate-700/50 rounded-[28px] overflow-hidden shadow-xl"
                  >
                    <div className="p-6 pb-0 text-left">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/profile/${post.userId}`)}>
                          <Avatar src={post.authorProfilePictureUrl} name={post.authorName} size="sm" border={false} className="shrink-0 group-hover:scale-110 transition-transform" />
                          <div>
                            <h4 className="text-[14px] font-black text-white leading-tight hover:text-indigo-400 transition-colors">{post.authorName}</h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">{formatTime(post.createdAt)}</p>
                          </div>
                        </div>
                        {post.userId === currentUserId && (
                          <button onClick={() => deletePost(post.id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="mt-4">
                        {post.title && <h3 className="text-[17px] font-black text-white mb-2">{post.title}</h3>}
                        <p className="text-[13px] text-slate-300 font-medium leading-relaxed">{post.content}</p>
                      </div>
                    </div>

                    {postImageUrl && (
                      <div className="mt-4 mx-6 rounded-2xl overflow-hidden border border-white/5">
                        <img src={postImageUrl} alt="" className="w-full h-auto max-h-[400px] object-cover" />
                      </div>
                    )}

                    <div className="px-6 py-4 flex items-center gap-6 border-t border-slate-800/40 mt-4">
                      <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-2 text-[12px] font-bold transition ${post.likedByCurrentUser ? "text-rose-400" : "text-slate-400 hover:text-rose-400"}`}>
                        <Heart size={16} className={post.likedByCurrentUser ? "fill-current" : ""} /> {post.likeCount}
                      </button>
                      <button onClick={() => handleToggleComments(post.id)} className="flex items-center gap-2 text-[12px] font-bold text-slate-400 hover:text-sky-400 transition">
                        <MessageSquare size={16} /> {post.commentCount}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-800/40 overflow-hidden">
                          <div className="px-6 py-4 space-y-4 text-left">
                            {comments.map(c => (
                              <div key={c.id} className="flex gap-3">
                                <div className="cursor-pointer group" onClick={() => navigate(`/profile/${c.userId}`)}>
                                  <Avatar src={c.authorProfilePictureUrl} name={c.authorName} size="xs" border={false} className="shrink-0 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span 
                                      className="text-[12px] font-black text-white cursor-pointer hover:text-indigo-400 transition-colors"
                                      onClick={() => navigate(`/profile/${c.userId}`)}
                                    >
                                      {c.authorName}
                                    </span>
                                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{formatTime(c.createdAt)}</span>
                                  </div>
                                  <p className="text-[12px] text-slate-300 mt-1">{c.content}</p>
                                </div>
                              </div>
                            ))}
                            <div className="flex items-center gap-3 pt-2">
                              <input 
                                value={commentInputs[post.id] || ""} 
                                onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))} 
                                onKeyDown={e => e.key === "Enter" && addComment(post.id)} 
                                placeholder={t('write_comment')} 
                                className="flex-1 bg-[#1C2333] border border-slate-700/50 rounded-full px-4 py-2 text-[12px] text-white focus:outline-none" 
                              />
                              <button onClick={() => addComment(post.id)} className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white" disabled={!commentInputs[post.id]?.trim()}>
                                <Send size={12} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </main>

      <aside className="w-[260px] shrink-0 hidden xl:flex flex-col gap-6 pt-2">
        <div className="bg-[#12182B] border border-slate-700/50 rounded-[24px] p-5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 flex items-center gap-2">
            <TrendingUp size={12} className="text-indigo-400" /> {t('community_news')}
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[12px] font-bold text-white">{t('mandala_live')}</p>
              <p className="text-[10px] text-slate-500 mt-1">{t('mandala_live_desc')}</p>
            </div>
            <div className="pt-3 border-t border-slate-800/50">
              <p className="text-[12px] font-bold text-white">{t('upcoming_workshop')}</p>
              <p className="text-[10px] text-slate-500 mt-1">{t('workshop_desc')}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#12182B] border border-slate-700/50 rounded-[24px] p-5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 flex items-center gap-2">
            <Sparkles size={12} className="text-amber-400" /> {t('highlights')}
          </h3>
          <div className="space-y-3">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <p className="text-[12px] text-slate-300">{t('new_matches_today', { count: 12 })}</p>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-[12px] text-slate-300">{t('discussions_trending', { count: 5 })}</p>
             </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CommunityPage;
