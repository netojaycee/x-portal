/**
 * Utility functions for safe date formatting
 * Prevents "Invalid time value" errors
 */

export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }
        return date.toLocaleDateString();
    } catch (error) {
        console.error("Date formatting error:", error);
        return "Invalid Date";
    }
};

export const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }
        return date.toLocaleString();
    } catch (error) {
        console.error("DateTime formatting error:", error);
        return "Invalid Date";
    }
};

export const formatDateLocale = (
    dateString: string | null | undefined,
    locale: string = "en-GB",
    options?: Intl.DateTimeFormatOptions
): string => {
    if (!dateString) return "N/A";

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }

        const defaultOptions: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        };

        return date.toLocaleDateString(locale, { ...defaultOptions, ...options });
    } catch (error) {
        console.error("Date locale formatting error:", error);
        return "Invalid Date";
    }
};

export const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) return "N/A";

    try {
        return amount.toLocaleString();
    } catch (error) {
        console.error("Currency formatting error:", error);
        return "N/A";
    }
};
