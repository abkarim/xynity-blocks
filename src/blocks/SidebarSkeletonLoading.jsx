import getRandomTailwindCSSWidths from "../util/styles/getRandomTailwindCSSWidths";

const SideBarSkeletonLoading = () => {
    const Option = () => {
        return (
            <div className="w-80">
                <span
                    className={`
                rounded-sm animate-pulse p-4 inline-block bg-gradient-to-r from-slate-200 to-slate-100 ${getRandomTailwindCSSWidths(
                    50,
                    70
                )}
                    `}></span>
            </div>
        );
    };

    return (
        <aside className="flex flex-col items-start gap-3 py-4 border-r w-80">
            <Option />
            <Option />
            <Option />
            <Option />
            <Option />
            <Option />
            <Option />
        </aside>
    );
};

export default SideBarSkeletonLoading;
