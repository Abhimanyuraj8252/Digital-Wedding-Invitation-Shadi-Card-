/**
 * Security Module
 * Handles Admin authentication and Input Sanitization.
 */

const Security = {
    // SHA-256 Hash of "abhi"
    ADMIN_HASH: "5478f05dfd941e6264072f3c34357a207bbbf8685ae571b53c5a732cf8c762ec9",
    ADMIN_USER: "admin",

    /**
     * Verifies the Admin Credentials (Async)
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<boolean>}
     */
    verifyCredentials: async function (username, password) {
        // 1. Check Username
        if (username.trim() !== this.ADMIN_USER) {
            return false;
        }

        // 2. Check Password Hash
        const hash = this.sha256(password);

        // Robust comparison: Trim and lowercase just in case
        if (hash.toLowerCase().trim() !== this.ADMIN_HASH.toLowerCase().trim()) {
            console.warn("Hash Mismatch", hash, this.ADMIN_HASH);
            return false;
        }

        return true;
    },

    /**
     * Sanitizes user input to prevent XSS
     */
    sanitize: function (str) {
        if (!str) return "";
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    /**
     * Validates a URL
     */
    isValidAudioUrl: function (url) {
        try {
            const parsed = new URL(url);
            return parsed.protocol === "https:" || parsed.protocol === "http:";
        } catch (e) {
            return false;
        }
    },

    /**
     * Pure JavaScript SHA-256 Implementation (Reliable for file://)
     * Source: Standard FIPS 180-2 implementation adapted for JS
     */
    sha256: function (ascii) {
        function rightRotate(e, t) {
            return e >>> t | e << 32 - t;
        }
        var mathPow = Math.pow;
        var maxWord = mathPow(2, 32);
        var result = "";
        var words = [];
        var asciiBitLength = 8 * ascii.length;
        var hash = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
        var k = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
            0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
            0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
            0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
            0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
            0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
            0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
            0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];

        ascii += "\x80";
        while (ascii.length % 64 - 56) ascii += "\x00";

        for (var i = 0; i < ascii.length; i++) {
            var j = ascii.charCodeAt(i);
            if (j >> 8) return;
            words[i >> 2] |= j << (3 - i) % 4 * 8;
        }
        words[words.length] = asciiBitLength / maxWord | 0;
        words[words.length] = asciiBitLength;

        for (var j = 0; j < words.length;) {
            var w = words.slice(j, j += 16);
            var oldHash = hash;
            hash = hash.slice(0, 8);
            for (var i = 0; i < 64; i++) {
                var i2 = i + j;
                var w15 = w[i - 15], w2 = w[i - 2];
                var a = hash[0], e = hash[4];
                var temp1 = hash[7] + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + ((e & hash[5]) ^ (~e & hash[6])) + k[i] + (w[i] = i < 16 ? w[i] : w[i - 16] + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ w15 >>> 3) + w[i - 7] + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ w2 >>> 10) | 0);
                var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
                hash = [temp1 + temp2 | 0].concat(hash);
                hash[4] = hash[4] + temp1 | 0;
            }
            for (var i = 0; i < 8; i++) {
                hash[i] = hash[i] + oldHash[i] | 0;
            }
        }
        for (var i = 0; i < 8; i++) {
            for (var j = 3; j + 1; j--) {
                var b = hash[i] >> 8 * j & 255;
                result += (b < 16 ? 0 : "") + b.toString(16);
            }
        }
        return result;
    }
};
