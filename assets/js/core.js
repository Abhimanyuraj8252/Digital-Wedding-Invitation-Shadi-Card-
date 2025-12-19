/**
 * Core Application Logic (Updated for Dynamic Schema)
 * Handles common utilities and URL parsing.
 */

const App = {
    /**
     * Get Query Parameter from URL
     * @param {string} param - Parameter name
     * @returns {string|null} - Value or null
     */
    getQueryParam: function (param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    /**
     * Get All Data from URL (New Schema)
     */
    getWeddingData: function () {
        return {
            guest: this.getQueryParam('guest') || "Guest & Family",
            bride: this.getQueryParam('b') || "Priya",
            groom: this.getQueryParam('g') || "Rohan",
            date: this.getQueryParam('d') || "Sunday, 15th Dec 2025",
            time: this.getQueryParam('t') || "7:00 PM Onwards",
            venue: this.getQueryParam('v') || "The Grand Palace Hotel",
            address: this.getQueryParam('a') || "Mumbai, India",
            song: this.getQueryParam('song')
        };
    },

    getGuestName: function () {
        return Security.sanitize(this.getQueryParam('guest') || "");
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     */
    copyToClipboard: function (text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                alert("Link Copied! ✅");
            }).catch(err => {
                console.error('Failed to copy: ', err);
                this.fallbackCopyTextToClipboard(text);
            });
        } else {
            this.fallbackCopyTextToClipboard(text);
        }
    },

    fallbackCopyTextToClipboard: function (text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";  // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            alert("Link Copied! ✅");
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            alert("Failed to copy link. Please copy manually.");
        }
        document.body.removeChild(textArea);
    }
};
