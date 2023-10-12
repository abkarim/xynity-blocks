import { useEffect, useRef, useState } from "react";
import { useNotificationUpdate } from "../context/notification.jsx";
import Select from "../components/input/Select.jsx";
import getData from "../util/fetch/getData.js";
import { MediaUpload } from "@wordpress/media-utils";
import DefaultButton from "../components/button/Default.jsx";
import postData from "../util/fetch/postData.js";
import useHandleUnsavedChanges from "../hooks/useHandleUnsavedChanges.js";

const SiteIcon = () => {
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [visibleOption, setVisibleOption] = useState("*");
    const setNotification = useNotificationUpdate();

    const [siteIconURL, setSiteIconURL] = useState(null);
    const [siteLogoURL, setSiteLogoURL] = useState(null);

    useHandleUnsavedChanges(hasUnsavedChanges);

    useEffect(() => {
        const get_icon = async () => {
            const response = await getData({
                action: "__get_site_icon_url",
            });

            const response_data = (await response.json()).data;
            setSiteIconURL(response_data);
        };
        const get_logo = async () => {
            const response = await getData({
                action: "__get_site_logo_url",
            });

            const response_data = (await response.json()).data;
            setSiteLogoURL(response_data);
        };

        get_icon();
        get_logo();
    }, []);

    /**
     * Update icon
     *
     * @param {number} id
     */
    async function update_icon(id) {
        setHasUnsavedChanges(true);

        const response = await postData({
            action: "__update_site_icon",
            data: {
                id,
            },
        });

        const response_data = (await response.json()).data;
        if (response.ok) {
            setSiteIconURL(response_data);
            setNotification({
                type: "success",
                text: "Site icon updated successfully",
            });
        } else {
            setNotification({
                type: "error",
                text: response_data,
            });
        }

        setHasUnsavedChanges(false);
    }

    /**
     * Update logo
     *
     * @param {number} id
     */
    async function update_logo(id) {
        setHasUnsavedChanges(true);

        const response = await postData({
            action: "__update_site_logo",
            data: {
                id,
            },
        });

        const response_data = (await response.json()).data;
        if (response.ok) {
            setSiteLogoURL(response_data);
            setNotification({
                type: "success",
                text: "Site logo updated successfully",
            });
        } else {
            setNotification({
                type: "error",
                text: response_data,
            });
        }

        setHasUnsavedChanges(false);
    }

    return (
        <section>
            <div className="flex items-center justify-between px-5 py-2 bg-slate-100">
                <h2 className="text-sm font-bold text-gray-600 uppercase">
                    Visible Option
                </h2>
                <Select
                    value={visibleOption}
                    onChange={(e) => {
                        setVisibleOption(e.target.value);
                    }}>
                    <option value="*">All</option>
                    <option value="site_icon">Site Icon</option>
                    <option value="site_logo">Site Logo</option>
                </Select>
            </div>
            {(visibleOption === "site_icon" || visibleOption === "*") && (
                <div>
                    <div className="flex items-center justify-between px-5 py-1 border-y bg-gray-50">
                        <h3 className="text-sm font-bold text-gray-600 uppercase ">
                            Site Icon
                        </h3>
                    </div>
                    <div className="relative flex items-start justify-between w-full p-5 border-b">
                        <div>
                            <h3 className="text-xl">Site Icon </h3>
                            <p>Change site icon (Favicon)</p>
                        </div>
                        <section>
                            <img
                                className="w-auto h-16 "
                                src={siteIconURL}
                                alt="site icon not found"
                            />
                            <fieldset className="mt-2">
                                <MediaUpload
                                    onSelect={(media) => {
                                        update_icon(media.id);
                                    }}
                                    render={({ open }) => (
                                        // render a button that opens the media upload dialog
                                        <DefaultButton onClick={open}>
                                            Change icon
                                        </DefaultButton>
                                    )}
                                />
                            </fieldset>
                        </section>
                    </div>
                </div>
            )}
            {(visibleOption === "site_logo" || visibleOption === "*") && (
                <div>
                    <div className="flex items-center justify-between px-5 py-1 border-y bg-gray-50">
                        <h3 className="text-sm font-bold text-gray-600 uppercase ">
                            Site Logo
                        </h3>
                    </div>
                    <div className="relative flex items-start justify-between w-full p-5 border-b">
                        <div>
                            <h3 className="text-xl">Site Logo </h3>
                            <p>Change site logo</p>
                        </div>
                        <section>
                            <img
                                className="w-auto h-16 "
                                src={siteLogoURL}
                                alt="site icon not found"
                            />
                            <fieldset className="mt-2">
                                <MediaUpload
                                    onSelect={(media) => {
                                        update_logo(media.id);
                                    }}
                                    render={({ open }) => (
                                        // render a button that opens the media upload dialog
                                        <DefaultButton onClick={open}>
                                            Change logo
                                        </DefaultButton>
                                    )}
                                />
                            </fieldset>
                        </section>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SiteIcon;
