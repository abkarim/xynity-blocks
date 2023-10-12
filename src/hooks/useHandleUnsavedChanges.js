import { useEffect } from "react";

/**
 * Handle unsaved changes
 *
 * @param {boolean} haveUnsavedChanges
 * @param {string} message
 */
export default function useHandleUnsavedChanges(haveUnsavedChanges) {
    /**
     * Confirm exit
     * called by beforeUnload event
     *
     * @param {Event} event
     * @returns {string} message
     */
    const confirmExit = (event) => {
        if (haveUnsavedChanges === true) {
            event.preventDefault();
        }
    };

    useEffect(() => {
        window.addEventListener("beforeunload", confirmExit);

        return () => window.removeEventListener("beforeunload", confirmExit);
    }, [haveUnsavedChanges, confirmExit]);
}
