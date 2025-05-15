import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FiUsers, FiFileText, FiPackage, FiTrendingUp } from "react-icons/fi";

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface PlatformStatsData {
  expertsCount: number;
  articlesCount: number;
  bountiesCount: number;
}

const PlatformStats = () => {
  const [stats, setStats] = useState<PlatformStatsData>({
    expertsCount: 0,
    articlesCount: 0,
    bountiesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch published bounties count
        const { count: bountiesCount, error: bountiesError } = await supabase
          .from("x_bounties")
          .select("*", { count: "exact", head: true })
          .not("published_at", "is", null);

        if (bountiesError) throw bountiesError;

        // Fetch published articles count
        const { count: articlesCount, error: articlesError } = await supabase
          .from("resources")
          .select("*", { count: "exact", head: true });

        if (articlesError) throw articlesError;

        // Fetch active experts count (users with expert flag or contributions)
        const { count: expertsCount, error: expertsError } = await supabase
          .from("x_developers")
          .select("*", { count: "exact", head: true })
          .not("published_at", "is", null);

        if (expertsError) throw expertsError;

        setStats({
          bountiesCount: bountiesCount || 0,
          articlesCount: articlesCount || 0,
          expertsCount: expertsCount || 0,
        });
      } catch (err) {
        console.error("Error fetching platform stats:", err);
        // Keep default values in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Stats display items
  const statItems = [
    {
      title: "MultiversX Experts",
      value: stats.expertsCount,
      icon: FiUsers,
      color: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Articles & Guides",
      value: stats.articlesCount,
      icon: FiFileText,
      color: "text-purple-500 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Active Bounties",
      value: stats.bountiesCount,
      icon: FiPackage,
      color: "text-orange-500 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className="rounded-lg border border-theme-border dark:border-theme-border-dark bg-white dark:bg-secondary-dark shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-theme-border dark:border-theme-border-dark flex items-center justify-between">
        <h3 className="text-base font-semibold text-theme-title dark:text-theme-title-dark flex items-center">
          <FiTrendingUp className="w-4 h-4 mr-2 text-green-500" />
          Platform Statistics
        </h3>
      </div>

      {/* Body */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary dark:border-primary-dark"></div>
          </div>
        ) : (
          <ul className="space-y-3">
            {statItems.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-md ${item.bgColor} mr-3 flex-shrink-0`}
                  >
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.title}
                    </span>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PlatformStats;
