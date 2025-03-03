import React from "react";

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Infrastructure & Tools, Gaming, Wallets, Others, Defi
const getCategoryColor = (category: string): string => {
  category = category.toLowerCase();
  switch (category) {
    // Original categories
    case "tutorials":
      return "bg-blue-100 text-blue-800";
    case "tools":
      return "bg-green-100 text-green-800";
    case "libraries":
      return "bg-purple-100 text-purple-800";
    case "documentation":
      return "bg-yellow-100 text-yellow-800";
    case "community":
      return "bg-pink-100 text-pink-800";
    case "news":
      return "bg-orange-100 text-orange-800";
    // Added categories
    case "infrastructure & tools":
      return "bg-teal-100 text-teal-800";
    case "infrastructure":
      return "bg-teal-100 text-teal-800";
    case "gaming":
      return "bg-indigo-100 text-indigo-800";
    case "wallets":
      return "bg-amber-100 text-amber-800";
    case "defi":
      return "bg-rose-100 text-rose-800";
    case "others":
      return "bg-slate-100 text-slate-800";
    // New categories
    case "dev tools":
      return "bg-cyan-100 text-cyan-800";
    case "projects":
      return "bg-emerald-100 text-emerald-800";
    case "smart contracts":
      return "bg-violet-100 text-violet-800";
    case "articles":
      return "bg-lime-100 text-lime-800";
    case "sdks & frameworks":
    case "sdks":
    case "frameworks":
      return "bg-fuchsia-100 text-fuchsia-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSizeClasses = (size: "sm" | "md" | "lg"): string => {
  switch (size) {
    case "sm":
      return "text-xs px-2 py-0.5";
    case "lg":
      return "text-sm px-3 py-1.5";
    case "md":
    default:
      return "text-xs px-2.5 py-1";
  }
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = "md",
  className,
}) => {
  const classes = [
    "inline-flex items-center rounded-full font-medium",
    getCategoryColor(category.toLowerCase()),
    getSizeClasses(size),
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {category.charAt(0).toLowerCase() + category.toLowerCase().slice(1)}
    </span>
  );
};

export default CategoryBadge;
