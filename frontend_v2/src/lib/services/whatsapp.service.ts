/**
 * WhatsApp Text Formatting Service
 * Provides utilities for formatting messages and building WhatsApp URLs
 */

export interface WhatsAppUrlOptions {
  phone: string;
  message?: string;
  /** Use web.whatsapp.com instead of wa.me (for desktop) */
  useWeb?: boolean;
}

export interface ExpressInterestOptions {
  listing: {
    title: string;
    location: string;
    neighborhood: string;
    roomName: string;
    price: string;
  };
  applicant: {
    name: string;
    gender: string;
    studentId: string;
    program: string;
    year: string;
  };
  timeline: {
    moveIn: string;
    deposit: string;
    payment: string;
  };
}

export class WhatsAppService {
  /**
   * Format text with WhatsApp styles
   */
  static format = {
    /** Make text bold: *text* */
    bold: (text: string): string => `*${text}*`,

    /** Make text italic: _text_ */
    italic: (text: string): string => `_${text}_`,

    /** Make text strikethrough: ~text~ */
    strikethrough: (text: string): string => `~${text}~`,

    /** Make text monospace: ```text``` */
    monospace: (text: string): string => `\`\`\`${text}\`\`\``,

    /** Make text inline code: `text` */
    code: (text: string): string => `\`${text}\``,

    /** Create a bullet list */
    bulletList: (items: string[]): string =>
      items.map((item) => `• ${item}`).join("\n"),

    /** Create a line break (new line) */
    lineBreak: (): string => "\n",

    /** Create multiple line breaks */
    lineBreaks: (count: number = 1): string => "\n".repeat(count),

    /** Combine multiple formatted texts */
    combine: (...parts: string[]): string => parts.join(""),
  };

  /**
   * Build a WhatsApp URL for opening a chat
   */
  static buildUrl(options: WhatsAppUrlOptions): string {
    const { phone, message, useWeb = false } = options;

    // Clean phone number (remove non-digits)
    const cleanPhone = phone.replace(/\D/g, "");

    // Encode message for URL
    const encodedMessage = message ? encodeURIComponent(message) : "";

    // Build URL based on platform preference
    if (useWeb) {
      // Desktop/Web version
      return `https://web.whatsapp.com/send?phone=${cleanPhone}${
        encodedMessage ? `&text=${encodedMessage}` : ""
      }`;
    } else {
      // Mobile/Universal version
      return `https://wa.me/${cleanPhone}${
        encodedMessage ? `?text=${encodedMessage}` : ""
      }`;
    }
  }

  /**
   * Open WhatsApp in a new window/tab
   */
  static openChat(options: WhatsAppUrlOptions): void {
    const url = this.buildUrl(options);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  /**
   * Message Templates - Pre-built common messages
   */
  static templates = {
    /**
     * Express interest in property
     */
    expressInterest: (options: ExpressInterestOptions): string => {
      const { listing, applicant, timeline } = options;
      const F = WhatsAppService.format;

      return F.combine(
        `Hi! I found ${F.bold(
          listing.title,
        )} on TangaPano and would love to learn more.`,
        F.lineBreaks(2),

        `Here are my details:`,
        F.lineBreaks(2),

        `🏠 ${F.bold("Room Selection")}`,
        F.lineBreak(),
        `• ${listing.roomName} - ${listing.price}`,
        F.lineBreaks(2),

        `👤 ${F.bold("About Me")}`,
        F.lineBreak(),
        `• Name: ${applicant.name}`,
        F.lineBreak(),
        `• Gender: ${applicant.gender}`,
        F.lineBreak(),
        `• Student ID: ${applicant.studentId}`,
        F.lineBreak(),
        `• Program: ${applicant.program} - ${applicant.year}`,
        F.lineBreaks(2),

        `🕓 ${F.bold("My Timeline")}`,
        F.lineBreak(),
        `• Move-in: ${timeline.moveIn}`,
        F.lineBreak(),
        `• Deposit: ${timeline.deposit}`,
        F.lineBreak(),
        `• Payment: ${timeline.payment}`,
        F.lineBreaks(2),

        `📍 ${F.bold("Property Details")}`,
        F.lineBreak(),
        `• Location: ${listing.location}`,
        F.lineBreak(),
        `• Neighborhood: ${listing.neighborhood}`,
        F.lineBreaks(2),

        `I'm looking forward to hearing from you!`,
      );
    },
  };
}
