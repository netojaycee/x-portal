import { useEffect, useState } from "react";

/**
 * usePersistentTab - Reusable hook for tab persistence using localStorage
 * @param {string} key - Unique key for localStorage
 * @param {string[]} tabOptions - Array of valid tab values
 * @param {string} defaultTab - Default tab value
 * @returns {[string, (tab: string) => void]} - [activeTab, setActiveTab]
 */
export function usePersistentTab(
    key: string,
    tabOptions: string[],
    defaultTab: string
): [string, (tab: string) => void] {
    const [activeTab, setActiveTab] = useState<string>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(key);
            return tabOptions.includes(stored || "") ? stored! : defaultTab;
        }
        return defaultTab;
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(key, activeTab);
        }
    }, [activeTab, key]);

    return [activeTab, setActiveTab];
}
