import { useMemo, useState } from "react";
import { AiFillGithub, AiFillLinkedin, AiFillMail, AiFillTwitterSquare } from "react-icons/ai";

export interface IExpertItem {
  name: string;
  description?: string;
  image_url: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
  skills: string[];
  slug?: string;
}

interface IExpertItemProps {
  expert: IExpertItem;
  imageHeight?: string;
  showLinks?: boolean;
}

export default function ExpertItem({ expert, imageHeight = "h-48", showLinks = true }: IExpertItemProps) {
  return (
    <article className="flex flex-col w-full border-0.5 border-theme-border dark:border-theme-border-dark rounded-md bg-white dark:bg-secondary-dark-lighter shadow-sm">
      <div className="">
        <img
          src={expert.image_url}
          alt={expert.name}
          className={`object-square ${imageHeight} mx-auto rounded-full mt-6 shadow-lg`}
        />
      </div>
      <div className="p-4 md:px-8 md:py-6 flex-grow">
        <div className="font-semibold text-theme-title dark:text-theme-title-dark text-base  sm:text-xl text-center">
          {expert.name}
        </div>
        {expert?.description && (
          <p className="text-theme-text dark:text-theme-text-dark text-xs sm:text-sm mt-3 text-center">
            {expert.description}
          </p>
        )}

        <p className="text-theme-title dark:text-theme-title-dark text-xs sm:text-sm mt-3 text-center">
          {expert.skills.map((skill) => `#${skill} `)}
        </p>
      </div>
      {showLinks && (
        <div className="flex text-theme-text dark:text-theme-text-dark py-5 border-t-0.5 border-theme-border dark:border-theme-border-dark divide-x-0.5 divide-theme-border dark:divide-theme-border-dark">
          {expert?.socials?.twitter && (
            <a href={expert.socials.twitter} target="_blank" className="flex-1 cursor-pointer" rel="noreferrer">
              <div className="flex items-center justify-center">
                <AiFillTwitterSquare className="text-2xl sm:text-xl" />
              </div>
            </a>
          )}
          {expert?.socials?.linkedin && (
            <a href={expert.socials.linkedin} target="_blank" className="flex-1 cursor-pointer" rel="noreferrer">
              <div className="flex items-center justify-center">
                <AiFillLinkedin className="text-2xl sm:text-xl" />
              </div>
            </a>
          )}
          {expert?.socials?.github && (
            <a href={expert.socials.github} target="_blank" className="flex-1 cursor-pointer" rel="noreferrer">
              <div className="flex items-center justify-center">
                <AiFillGithub className="text-2xl sm:text-xl" />
              </div>
            </a>
          )}
          {expert?.socials?.email && (
            <a
              href={`mailto:${expert.socials.email}`}
              target="_blank"
              className="flex-1 cursor-pointer"
              rel="noreferrer"
            >
              <div className="flex items-center justify-center">
                <AiFillMail className="text-2xl sm:text-xl" />
              </div>
            </a>
          )}
        </div>
      )}
    </article>
  );
}
