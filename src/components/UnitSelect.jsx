import Select from "./input/Select.jsx";
import unit from "../util/unit.js";

const UnitSelect = ({ ...props }) => {
    return (
        <Select {...props}>
            {unit().map((item, i) => {
                return (
                    <option key={i} value={item.value}>
                        {item.name}
                    </option>
                );
            })}
        </Select>
    );
};

export default UnitSelect;
