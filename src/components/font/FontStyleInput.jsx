import Select from "../input/Select.jsx";

export default function FontStyleInput({ ...props }) {
    return (
        <Select {...props}>
            <option value="inherit">Inherit</option>
            <option value="initial">Initial</option>
            <option value="revert">Revert</option>
            <option value="revert-layer">Revert layer</option>
            <option value="unset">Unset</option>
            <option value="normal">Normal</option>
            <option value="italic">Italic</option>
            <option value="oblique">Oblique</option>
        </Select>
    );
}
