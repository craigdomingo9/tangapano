/**
 * WhatsApp Service
 * Handles message generation and WhatsApp integration
 */

import { WhatsAppMessageData } from "../types/express-interest";

const TIMELINE_MAP: Record<string, string> = {
  immediately: "Immediately (Within 1 week)",
  "2_weeks": "Within 2 weeks",
  "1_month": "Within 1 month",
  next_semester: "Next Semester",
};

const DEPOSIT_MAP: Record<string, string> = {
  ready_now: "Yes, ready now",
  within_24h: "Will arrange within 24 hours",
  need_time: "Need time to get funds",
};

const PAYMENT_MAP: Record<string, string> = {
  cash: "Cash",
  mobile: "Mobile Payment",
  bank_transfer: "Bank Transfer",
};

export class WhatsAppService {
  static generateMessage(data: WhatsAppMessageData): string {
    const { formData, listingName, selectedRoom, selectedListing } = data;

    const roomInfo = selectedRoom
      ? `Room ${selectedRoom.room_number} - $${parseFloat(
          selectedRoom.rent_per_month
        ).toFixed(2)}/month`
      : "No room selected";

    return `Hi! I found *${listingName}* on TangaPano and would love to learn more.

Here are my details:

*🏠 Room Selection*
• ${roomInfo}

*👤 About Me*
• Name: ${formData.fullName}
• Student ID: ${formData.studentId}
• Program: ${formData.program} - Year ${formData.yearOfStudy}

*🕓 My Timeline*
• Move-in: ${TIMELINE_MAP[formData.moveInTimeline] || formData.moveInTimeline}
• Deposit: ${
      DEPOSIT_MAP[formData.depositReadiness] || formData.depositReadiness
    }
• Payment: ${PAYMENT_MAP[formData.paymentMethod] || formData.paymentMethod}

*📍 Property Details*
• Location: ${selectedListing.campus?.name || "Not specified"}
• Neighborhood: ${selectedListing.neighborhood?.name || "Not specified"}

I'm looking forward to hearing from you!`;
  }

  static openChat(message: string, whatsappNumber: string): void {
    console.log("Opening WhatsApp chat with message:", message);
    console.log("WhatsApp number:", whatsappNumber);

    // Use a temporary link element
    const link = document.createElement("a");
    link.href = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
      message
    )}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer"; // For security best practice
    link.style.display = "none"; // Hide the link

    // Append the link to the body (not strictly necessary but good practice)
    document.body.appendChild(link);

    // Programmatically click the link
    link.click();

    // Remove the temporary link element
    document.body.removeChild(link);
  }

  static sendMessage(data: WhatsAppMessageData, whatsappNumber: string): void {
    const message = this.generateMessage(data);
    this.openChat(message, whatsappNumber);
  }
}
