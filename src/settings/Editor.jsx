import Input from "../components/Input.jsx";
import UnitSelect from "../components/UnitSelect.jsx";

const Editor = () => {
    return (
        <section>
            <div className="flex items-start justify-between w-full p-5 border-b">
                <div>
                    <h3 className="text-xl">Default Content Width</h3>
                    <p>Container Block&apos;s default Content Width.</p>
                </div>
                <fieldset className="flex items-center w-48">
                    <Input className="rounded-tl-none rounded-bl-none" />
                    <UnitSelect />
                </fieldset>
            </div>
            <div className="flex items-start justify-between w-full p-5 border-b">
                <div>
                    <h3 className="text-xl">Default Wide Size</h3>
                    <p>Default width size for wide blocks.</p>
                </div>
                <fieldset className="flex items-center w-48">
                    <Input className="rounded-tl-none rounded-bl-none" />
                    <UnitSelect />
                </fieldset>
            </div>
        </section>
    );
};

export default Editor;
