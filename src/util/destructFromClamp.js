export default function destructFromClamp(string) {
    const groups = string.match(
        /clamp\((?<minimum>.+),(?<value>.+),(?<maximum>.+)\)/
    ).groups;
    return groups;
}
