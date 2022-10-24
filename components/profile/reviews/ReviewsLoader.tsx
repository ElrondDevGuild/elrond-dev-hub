import ProfileImage from "../ProfileImage";

export default function ReviewsLoader({qty = 4}) {
    return (
        <div className="w-full">
            <ul
                role="list"
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4"
            >
                {Array.from({length: qty}).map((_, index) => (
                    <li key={index}
                        className="animate-pulse col-span-1 flex flex-col items-start rounded-lg bg-white dark:bg-secondary-dark-lighter border-theme-border dark:border-theme-border-dark p-4"
                    >
                        <div className="flex items-center space-x-2 text-sm mb-1 w-full">
                            <span className="bg-theme-text dark:bg-theme-text-dark w-10 h-2 rounded-3xl"/>
                            <span
                                className="w-1/2 h-2 bg-theme-text dark:bg-theme-text-dark rounded-3xl"
                            />
                        </div>
                        <div className="flex flex-col space-y-2 w-full mt-4">
                             <span
                                 className="w-full h-2 bg-theme-text dark:bg-theme-text-dark rounded-3xl"
                             />
                            <span
                                className="w-full h-2 bg-theme-text dark:bg-theme-text-dark rounded-3xl"
                            />
                            <span
                                className="w-full h-2 bg-theme-text dark:bg-theme-text-dark rounded-3xl"
                            />
                            <span
                                className="w-full h-2 bg-theme-text dark:bg-theme-text-dark rounded-3xl"
                            />
                        </div>
                        <div className="flex items-center space-x-2 mt-2 h-6 w-full">
                            <ProfileImage avatarUrl={null} size="md"/>
                            <span
                                className="w-1/2 h-2 bg-theme-text dark:bg-theme-text-dark rounded-3xl"
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};