export const validation = {
  whatsappNumber: {
    // International E.164 Standard: + [Country Code] [Number]
    // Max length is usually 15 digits. Min length ~7-8.
    pattern: /^\+[1-9]\d{7,14}$/,

    format: (value: string) => {
      // 1. Remove all characters that are NOT digits or '+'
      let cleaned = value.replace(/[^0-9+]/g, "");

      // 2. Handle International Prefix "00" (e.g., 0044 -> +44)
      if (cleaned.startsWith("00")) {
        cleaned = "+" + cleaned.slice(2);
      }

      // 3. If user typed "263..." or "44..." without +, add it.
      // (Assumption: If it starts with 1-9 and is long, it's likely a full number)
      if (/^[1-9]/.test(cleaned)) {
        cleaned = "+" + cleaned;
      }

      return cleaned;
    },

    validate: (value: string) => {
      if (!value) return { isValid: false, error: "Phone number is required" };

      // 1. Must start with '+'
      if (!value.startsWith("+")) {
        return {
          isValid: false,
          error: "Include country code (e.g., +1 for USA, +263 for Zim)",
        };
      }

      // 2. Check Length (International numbers are 8-15 digits total)
      if (value.length < 8 || value.length > 16) {
        return {
          isValid: false,
          error: "Invalid length for an international number",
        };
      }

      // 3. Strict Regex Check
      // Matches: + [1-9] [7 to 14 digits]
      if (!/^\+[1-9]\d{7,14}$/.test(value)) {
        return { isValid: false, error: "Invalid format" };
      }

      return { isValid: true };
    },
  },

  studentId: {
    // Regex: Either a valid ID (R...) OR the word "NEW"
    pattern: /^(R[A-Z0-9]{7,10}|NEW)$/,

    format: (value: string) => {
      if (!value) return "";

      // Normalize input
      let cleaned = value.toUpperCase().trim();

      // 1. Handle New/Pending variations
      // If user types "new", "n/a", "pending", "none", we standardize it to "NEW"
      const newStudentKeywords = [
        "NEW",
        "N/A",
        "NA",
        "PENDING",
        "NONE",
        "APPLICANT",
      ];
      if (newStudentKeywords.includes(cleaned)) {
        return "NEW";
      }

      // 2. Standard ID Formatting (Clean chars & Add 'R' prefix)
      cleaned = cleaned.replace(/[^A-Z0-9]/g, "");
      if (/^[0-9]/.test(cleaned)) {
        cleaned = "R" + cleaned;
      }

      return cleaned;
    },

    validate: (value: string) => {
      // 1. Valid Case: User is a new student
      if (value === "NEW") {
        return { isValid: true };
      }

      // 2. Valid Case: Standard Student ID
      if (/^R[A-Z0-9]{7,10}$/.test(value)) {
        return { isValid: true };
      }

      // 3. Invalid
      return {
        isValid: false,
        error: "Enter Student ID or type 'NEW' if not assigned",
      };
    },
  },
};
