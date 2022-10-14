export default function ItemsLoader({quantity = 5}: { quantity?: number }) {
    return (
        <ul role="list" className="divide-y divide-theme-border dark:divide-theme-border-dark">
            {
                Array.from({length: quantity}).map((_, index) => (
                    <li key={index}
                        className="flex items-center justify-between animate-pulse w-full  p-4">
                            <span
                                className="w-1/2 h-2 bg-theme-text dark:bg-theme-text-dark rounded-3xl"
                            />
                        <span
                            className="w-1/4 h-2 bg-theme-text dark:bg-theme-text-dark rounded-3xl"
                        />
                    </li>
                ))
            }
        </ul>
    )
};