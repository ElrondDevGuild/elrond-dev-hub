import {BountyResource} from "../../../types/supabase";
import {FiExternalLink} from "react-icons/fi";

export default function ResourceItem(
    {
        resource,
        onRemove
    }: { resource: Partial<BountyResource>, onRemove?: (id: string) => void }
) {
    return (
        <div className="flex flex-col items-start w-24">
            <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-24 h-24 text-theme-text dark:text-theme-text-dark border focus-within:ring-1 border-theme-border dark:border-theme-border-dark focus-within:ring-indigo-500"
            >
                <FiExternalLink className="w-8 h-8"/>
            </a>
            <div className="flex flex-col items-start">
                <p className="text-sm text-secondary mt-3 line-clamp-1 ">
                    {resource.description}
                </p>
                {typeof onRemove === "function" && (
                    <button
                        onClick={() => onRemove(resource.id || "")}
                        className="text-xs text-red-500 mt-2"
                    >
                        Remove item
                    </button>
                )}
            </div>
        </div>
    );
};