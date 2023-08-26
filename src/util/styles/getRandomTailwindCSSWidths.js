const widths = [
    {
        size: "0",
        className: "w-0",
    },
    {
        size: "0.5",
        className: "w-0.5",
    },
    {
        size: "1",
        className: "w-1",
    },
    {
        size: "1.5",
        className: "w-1.5",
    },
    {
        size: "2",
        className: "w-2",
    },
    {
        size: "2.5",
        className: "w-2.5",
    },
    {
        size: "3",
        className: "w-3",
    },
    {
        size: "3.5",
        className: "w-3.5",
    },
    {
        size: "4",
        className: "w-4",
    },
    {
        size: "5",
        className: "w-5",
    },
    {
        size: "6",
        className: "w-6",
    },
    {
        size: "7",
        className: "w-7",
    },
    {
        size: "8",
        className: "w-8",
    },
    {
        size: "9",
        className: "w-9",
    },
    {
        size: "10",
        className: "w-10",
    },
    {
        size: "11",
        className: "w-11",
    },
    {
        size: "12",
        className: "w-12",
    },
    {
        size: "14",
        className: "w-14",
    },
    {
        size: "16",
        className: "w-16",
    },
    {
        size: "20",
        className: "w-20",
    },
    {
        size: "24",
        className: "w-24",
    },
    {
        size: "28",
        className: "w-28",
    },
    {
        size: "32",
        className: "w-32",
    },
    {
        size: "36",
        className: "w-36",
    },
    {
        size: "40",
        className: "w-40",
    },
    {
        size: "44",
        className: "w-44",
    },
    {
        size: "48",
        className: "w-48",
    },
    {
        size: "52",
        className: "w-52",
    },
    {
        size: "56",
        className: "w-56",
    },
    {
        size: "60",
        className: "w-60",
    },
    {
        size: "64",
        className: "w-64",
    },
    {
        size: "72",
        className: "w-72",
    },
    {
        size: "80",
        className: "w-80",
    },
    {
        size: "96",
        className: "w-96",
    },
];

/**
 * Get random widths class name from tailwindcss
 *
 * @param {number} min included
 * @param {number} max included
 * @returns {string}
 */
export default function getRandomTailwindCSSWidths(min = null, max = null) {
    let finalSizes = widths;

    if (min !== null) {
        finalSizes = finalSizes.filter((size) => size.size * 1 >= min);
    }

    if (max !== null) {
        finalSizes = finalSizes.filter((size) => size.size * 1 <= max);
    }

    const target = finalSizes[Math.floor(Math.random() * finalSizes.length)];

    if (target) {
        return target.className;
    }

    return "";
}
