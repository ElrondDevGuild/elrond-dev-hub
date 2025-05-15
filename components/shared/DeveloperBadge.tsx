import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface DeveloperBadgeProps {
  badge: Badge;
}

export default function DeveloperBadge({ badge }: DeveloperBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [badgeImgError, setBadgeImgError] = useState(false);
  const badgeImageSrc = badgeImgError ? "/badges/xdev-member.svg" : badge.imageUrl;

  return (
    <div className="relative">
      <motion.div
        className="relative cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-blue-400/20 p-0.5">
          <div className="w-full h-full rounded-full bg-white dark:bg-secondary-dark p-0.5 relative">
            <Image
              src={badgeImageSrc}
              alt={badge.name}
              width={32}
              height={32}
              className="rounded-full"
              objectFit="cover"
              onError={() => setBadgeImgError(true)}
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 bg-white dark:bg-secondary-dark rounded-lg shadow-xl p-3 border border-theme-border/30 dark:border-theme-border-dark/30"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={badgeImageSrc}
                  alt={badge.name}
                  width={24}
                  height={24}
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <span className="font-semibold text-sm text-theme-title dark:text-theme-title-dark">
                {badge.name}
              </span>
            </div>
            <p className="text-xs text-theme-text dark:text-theme-text-dark">
              {badge.description}
            </p>
            <div className="mt-2">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary-dark/10 dark:text-primary-dark">
                {badge.category}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
