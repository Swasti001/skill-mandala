import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, MessageSquare, Award, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../api';

const FeedbackModal = ({ isOpen, onClose, session, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState({
    teachingQuality: 5,
    clarity: 5,
    helpfulness: 5,
    engagement: 5,
    preparedness: 5,
    seriousness: 5,
    punctuality: 5,
    communication: 5
  });
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !session) return null;

  // Determine if we are rating a teacher or a learner
  // If current user is userA, they are the learner (rating a teacher userB)
  const isRatingTeacher = session.incoming === false; // Based on your SessionsPage logic

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        sessionId: session.sessionId,
        comment,
        punctuality: rating.punctuality,
        communication: rating.communication,
        ...(isRatingTeacher ? {
          teachingQuality: rating.teachingQuality,
          clarity: rating.clarity,
          helpfulness: rating.helpfulness
        } : {
          engagement: rating.engagement,
          preparedness: rating.preparedness,
          seriousness: rating.seriousness
        })
      };

      await api.post('/feedback/submit', payload);
      onFeedbackSubmitted();
      onClose();
    } catch (err) {
      console.error("Feedback submission failed:", err);
      alert("Failed to submit feedback. You might have already submitted reviews for this session.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (key, label) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
        <span className="text-xs font-bold text-indigo-400">{rating[key]}/5</span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating({ ...rating, [key]: star })}
            className={`transition-all duration-300 ${rating[key] >= star ? 'text-amber-400 scale-110' : 'text-slate-700 hover:text-slate-500'}`}
          >
            <Star size={20} fill={rating[key] >= star ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#020617]/90 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#0F172A] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Award size={24} />
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Rate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Experience</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-2">
              Reviewing your session with <span className="text-white font-bold">{session.otherUserName}</span>
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isRatingTeacher ? (
                <>
                  {renderStars('teachingQuality', 'Teaching Quality')}
                  {renderStars('clarity', 'Clarity')}
                  {renderStars('helpfulness', 'Helpfulness')}
                </>
              ) : (
                <>
                  {renderStars('engagement', 'Engagement')}
                  {renderStars('preparedness', 'Preparedness')}
                  {renderStars('seriousness', 'Seriousness')}
                </>
              )}
              {renderStars('punctuality', 'Punctuality')}
              {renderStars('communication', 'Communication')}
            </div>

            <div className="mt-10 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <MessageSquare size={12} /> Share a brief comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the session? Did you learn what you expected?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 border border-white/10 rounded-2xl text-[12px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              onClick={handleSubmit}
              className="flex-[2] py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <><CheckCircle2 size={18} /> Submit Review</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
