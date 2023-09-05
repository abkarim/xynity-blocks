import Select from "../input/Select.jsx";

export default function FontStretchInput({ ...props }) {
    return (
        <Select {...props}>
            <option value="inherit">Inherit</option>
            <option value="initial">Initial</option>
            <option value="revert">Revert</option>
            <option value="revert-layer">Revert layer</option>
            <option value="unset">Unset</option>
            <option value="normal">Normal</option>
            <option value="ultra-condensed">Ultra condensed</option>
            <option value="extra-condensed">Extra condensed</option>
            <option value="condensed">Condensed</option>
            <option value="semi-condensed">Semi condensed</option>
            <option value="semi-expanded">Semi expanded</option>
            <option value="expanded">Expanded</option>
            <option value="ultra-expanded">Ultra expanded</option>
        </Select>
    );
}
