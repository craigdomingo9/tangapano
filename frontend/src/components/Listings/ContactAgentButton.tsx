import { MessageCircle } from "lucide-react";
import { Button } from "../ui/button"


type Props = {
  listing: Listing,
}

function ContactAgentButton({listing}: Props) {

  function handleClick() {
    const agentPhoneNumber = listing.campus.agents.phone_number;
    const message = `Hello, I'm interested in the accommodation ${listing.title} listed on your platform. Can you please provide more details?`;
    const whatsappUrl = `https://wa.me/${agentPhoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  return (
    <Button 
      className="w-full h-14 rounded-t-none cursor-pointer sm:hover:scale-[1.03] transition" 
      onClick={handleClick}
    >
      <MessageCircle size={20} />
      Contact Agent
    </Button>
  )
}

export default ContactAgentButton