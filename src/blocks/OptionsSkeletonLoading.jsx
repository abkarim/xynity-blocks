import getRandomTailwindCSSWidths from "../util/styles/getRandomTailwindCSSWidths";

const OptionsSkeletonLoading = () => {
    const Skeleton = () => {
        return (
            <div className="flex items-start justify-between w-full p-5 border-b animate-pluse">
                <div>
                    <h3
                        className={`animate-pulse p-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded-sm ${getRandomTailwindCSSWidths(
                            15,
                            40
                        )}`}></h3>
                    <p
                        className={`animate-pulse mt-2 p-2 bg-gradient-to-r from-slate-200 to-slate-100 rounded-sm ${getRandomTailwindCSSWidths(
                            40
                        )}`}></p>
                </div>
            </div>
        );
    };

    return (
        <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </>
    );
};

export default OptionsSkeletonLoading;
