import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const supportStaff = [
  {
    name: "Craig K Domingo",
    role: "Technical Support",
    whatsappNo: "+263 781 901 939",
    callNumber: "+263 776 808 964",
    avatar: "https://placehold.co/150x150/4f46e5/ffffff?text=CD",
  },
  {
    name: "Darrell B Magirazi",
    role: "MSU Sales & Partnerships | Billing & Accounts",
    whatsappNo: "+263 786 639 149",
    callNumber: "+263 786 639 149",
    avatar: "https://placehold.co/150x150/10b981/ffffff?text=DM",
  },
  {
    name: "Jackson Mamutse",
    role: "UZ Sales & Partnerships | Billing & Accounts",
    whatsappNo: "+263 781 164 313",
    callNumber: "+263 781 164 313",
    avatar: "https://placehold.co/150x150/ef4444/ffffff?text=JM",
  },
  {
    name: "Craig Svosve",
    role: "UZ Sales & Partnerships",
    whatsappNo: "+263 784 424 207",
    callNumber: "+263 784 424 207",
    avatar: "https://placehold.co/150x150/eab308/ffffff?text=CS",
  },
];

function SupportPage() {
  return (
    <>
      <div className="max-w-sm mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl rounded-lg">
          Need help? Contact our support team.
        </h1>
        <p className="mt-4 max-w-2xl text-md sm:text-xl text-gray-500 dark:text-gray-400 mx-auto">
          Our team is here to assist you with any questions or issues you may
          have.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
        {supportStaff.map((staff) => (
          <div
            key={staff.name}
            className="flex flex-col items-center w-full max-w-sm rounded-lg"
          >
            {/* Avatar image */}
            <Avatar className="rounded-full h-24 w-24 relative inline-block ring-4 ring-white dark:ring-gray-900 z-10 cursor-pointer">
              <AvatarImage className="rounded-full" src={staff.avatar} />
              <AvatarFallback className="rounded-full">
                {staff.name
                  .split(" ")
                  .map((name) => name.charAt(0))
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {/* The main card container with negative margin to overlap the avatar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full -mt-12 pt-12 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
              <div className="flex flex-col items-center p-6 pt-0">
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {staff.name}
                  </h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    {staff.role}
                  </p>
                </div>
                <div className="mt-4 flex flex-col items-center space-y-2 text-gray-600 dark:text-gray-300">
                  <a
                    href={`tel:${staff.callNumber}`}
                    className="flex items-center space-x-2 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <Phone size={16} />
                    <span className="underline">{staff.callNumber}</span>
                  </a>
                  <a
                    href={`https://wa.me/${staff.whatsappNo.replace(
                      /[\s()+-]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-green-500 hover:text-green-600 transition-colors"
                  >
                    <Button variant={"outline"}>
                      <MessageCircle size={16} />
                      <span>Contact on WhatsApp</span>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default SupportPage;
