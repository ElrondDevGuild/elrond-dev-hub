export type MediaResource = {
  id: number;
  category_id: number;
  title: string;
  author: string;
  description: string;
  curator_address: string;
  image_url: string | null;
  resource_url: string;
  published_at: string | null;
  slug: string | null;
  created_at?: string;
  deleted_at?: string | null;
  synced_at?: string | null;
  tags?: Tag[];
};

export type Category = {
  id: number;
  title: string;
  created_at: string;
};

export type Tag = {
  id: number;
  title: string;
  created_at: string;
};

export type ResourceTag = {
  id: number;
  resource_id: number;
  tag_id: number;
};

export type User = {
  id: string;
  wallet: string;
  avatar_url: string | null;
  name: string | null;
  description: string | null;
  created_at: string | null;
  verified: boolean;
  handle: string | null;
  social_links?: UserSocialLink[];
};

export type SocialPlatform = "twitter" | "github" | "discord" | "telegram" | "linkedin";
export type UserSocialLink = {
  id: string;
  user_id: string;
  platform: SocialPlatform;
  username: string;
}

export type AuthNonce = {
  id: string;
  created_at: string;
}

export type BountyType = "single_worker" | "many_workers";
export type BountyStatus =
    "open"
    | "expired"
    | "canceled"
    | "work_started"
    | "work_submitted"
    | "completed";

export type BountyExperienceLevel = "beginner" | "intermediate" | "experienced" | "any";

export type Bounty = {
  id: string;
  title: string;
  description: string;
  acceptance_criteria: string;
  status: BountyStatus;
  project_type: BountyType;
  issue_type: string;
  requires_work_permission: boolean;
  experience_level: BountyExperienceLevel;
  value: number;
  repository_url: string | null;
  repository_issue_url: string | null;
  created_at: string;
  deleted_at: string | null;
  owner_id: string;
  owner: User;
  tags?: {details: Tag}[];
  applicationsCount: number;
  applications?: BountyApplication[];
  resources?: BountyResource[];
};

export type ApplicationApprovalStatus = "pending" | "accepted" | "rejected";
export type WorkStatus = "pending" | "in_progress" | "completed";

export type BountyApplication = {
  id: string;
  bounty_id: string;
  user_id: string;
  message: string;
  approval_status: ApplicationApprovalStatus;
  work_status: WorkStatus;
  work_url: string | null;
  created_at: string;
  approval_status_timestamp: string | null;
  user: User;
  bounty?: Bounty;
};

export type BountyResource = {
  id: string;
  bounty_id: string
  user_id: string;
  url: string;
  description: string | null;
};

export type BountyTag = {
  id: number;
  bounty_id: string;
  tag_id: number;
};

export type UserReview = {
  id: string;
  user_id: string;
  reviewer_id: string;
  rating: number;
  review: string;
}
