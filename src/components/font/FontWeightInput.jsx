import Select from "../input/Select.jsx";

export default function FontWeightInput({ ...props }) {
    return (
        <Select {...props}>
            <option value="inherit">Inherit</option>
            <option value="initial">Initial</option>
            <option value="revert">Revert</option>
            <option value="revert-layer">Revert layer</option>
            <option value="unset">Unset</option>
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
            <option value="bolder">Bolder</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
        </Select>
    );
}
