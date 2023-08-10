const ChangeIndicator = ({ defaultValue }) => {
    return (
        <>
            <div className="absolute inline-block w-3 h-3 p-1 bg-yellow-300 rounded-full cursor-pointer peer top-2 right-1 aspect-square"></div>
            <i className="absolute hidden text-3xl text-orange-500 pointer-events-none peer-hover:inline-block -right-1 -top-3 fi fi-rr-caret-down"></i>
            <p className="absolute hidden p-2 text-white bg-orange-500 rounded-sm pointer-events-none peer-hover:block -right-3 -top-8">
                (Edited) Default value was&nbsp;
                <span className="font-bold">{defaultValue}</span>
            </p>
        </>
    );
};

export default ChangeIndicator;
