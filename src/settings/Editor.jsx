import Input from "../components/Input.jsx";
import Select from "../components/Select.jsx";

const Editor = () => {
    return (
        <section>
            <div className="flex items-start justify-between w-full p-4 border-b">
                <div>
                    <h3 className="text-xl">Default Content Width</h3>
                    <p>Container Block's default Content Width.</p>
                </div>
                <fieldset className="flex items-center w-48">
                    <Input className="rounded-tl-none rounded-bl-none" />
                    <Select>
                        <option value="px">PX</option>
                        <option value="rem">REM</option>
                    </Select>
                </fieldset>
            </div>
        </section>
    );
};

export default Editor;
