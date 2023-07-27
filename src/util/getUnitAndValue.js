export default function getUnitAndValue(string) {
    const groups = string.match(/(?<value>-?[0-9.]+)(?<unit>[%A-z]+)?/).groups;
    return {
        value: groups.value * 1, // multiply by 1 to make it Number from string
        unit: groups.unit,
    };
}
