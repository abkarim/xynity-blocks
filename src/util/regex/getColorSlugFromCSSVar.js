export default function getColorSlugFromCSSVar(string) {
    if (!string) return "";

    const data = string.match(/.+--wp--preset--color--(?<slug>.+)[)]$/i);

    if (!data) return "";

    if (data.groups.slug) return data.groups.slug;

    return "";
}
