import React from "react";

/**
 * Avatar component - The single source of truth for user profile pictures.
 * 
 * @param {Object} props
 * @param {string} props.src - The URL of the profile picture.
 * @param {string} props.name - The user's name (used for generating default avatar).
 * @param {string} props.size - Size variant (sm, md, lg, xl, xxl).
 * @param {string} props.className - Additional CSS classes.
 * @param {boolean} props.border - Whether to show a border.
 */
const Avatar = ({ src, name, size = "md", className = "", border = true }) => {
  const sizeMap = {
    "xs": "w-7 h-7",
    "sm": "w-9 h-9",
    "md": "w-11 h-11",
    "lg": "w-16 h-16",
    "xl": "w-24 h-24",
    "xxl": "w-48 h-48",
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=6366f1&color=fff&size=512&bold=true&font-size=0.33`;
  const avatarSrc = src || defaultAvatar;

  const sizeClass = sizeMap[size] || sizeMap["md"];
  const borderClass = border ? "border-2 border-indigo-500/30" : "";

  return (
    <div className={`shrink-0 rounded-full overflow-hidden bg-slate-900 ${sizeClass} ${borderClass} ${className}`}>
      <img 
        src={avatarSrc} 
        alt={name || "User"} 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        onError={(e) => {
          if (e.target.src !== defaultAvatar) {
            e.target.src = defaultAvatar;
          }
        }}
      />
    </div>
  );
};

export default Avatar;
