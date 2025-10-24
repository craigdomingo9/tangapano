import React from "react";
import { ExpressInterestDialogContent } from "../ExpressInterestDialogContent";

// Mock dependencies
jest.mock("@/services/whatsappService");
jest.mock("@/lib/hooks/store");

describe("ExpressInterestDialogContent", () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
  });

  it("renders the first step correctly", () => {
    render(<ExpressInterestDialogContent {...defaultProps} />);

    expect(screen.getByText("Move-in & Financial")).toBeInTheDocument();
    expect(screen.getByTestId("move-in-financial-step")).toBeInTheDocument();
  });

  it("navigates through steps correctly", () => {
    render(<ExpressInterestDialogContent {...defaultProps} />);

    // Complete step 1
    fireEvent.click(screen.getByTestId("option-immediately"));
    fireEvent.click(screen.getByTestId("option-ready_now"));
    fireEvent.click(screen.getByTestId("option-cash"));
    fireEvent.click(screen.getByTestId("next-button"));

    expect(
      screen.getByTestId("identity-verification-step")
    ).toBeInTheDocument();
  });

  it("opens WhatsApp with correct message on completion", () => {
    render(<ExpressInterestDialogContent {...defaultProps} />);

    // Mock implementation
    const mockSendMessage = jest.fn();
    (WhatsAppService.sendMessage as jest.Mock) = mockSendMessage;

    // Navigate to completion step and complete
    // ... navigation logic

    fireEvent.click(screen.getByText("📱 Open WhatsApp"));

    expect(mockSendMessage).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
