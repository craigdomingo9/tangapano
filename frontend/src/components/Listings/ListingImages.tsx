import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Link } from "lucide-react";
import { toast } from "sonner";

type Props = {
  listing: Listing;
  showLinkCopy?: boolean;
};

function ListingImages({ listing, showLinkCopy }: Props) {
  function copyLinkToClipboard() {
    const listingLink = window.location.origin + "/listing/" + listing.id;
    navigator.clipboard
      .writeText(listingLink)
      .then(() => toast.success("Link has been copied to clipboard."))
      .catch(() => toast.error("Failed to copy link to clipboard."));
  }

  return (
    <Carousel
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {listing.images.map((image) => (
          <CarouselItem key={image.id}>
            <Avatar className="w-full rounded-none h-56 relative overflow-hidden">
              <AvatarImage className="rounded-t-xl" src={image.display_image} />
              <AvatarFallback className="rounded-none rounded-t-xl max-w-[340px]">
                {listing.title}
              </AvatarFallback>
              {image.caption && (
                <div className="absolute z-50 bottom-2 right-2 bg-[var(--lapis-lazuli)] bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {image.caption}
                </div>
              )}
              {/* {showLinkCopy && (
                <div
                  className="absolute z-50 cursor-pointer top-2 right-2 bg-[var(--lapis-lazuli)] hover:scale-[1.03] bg-opacity-50 text-white px-2 py-1 rounded"
                  onClick={copyLinkToClipboard}
                >
                  <Link size={16} strokeWidth={1.25} />
                </div>
              )} */}
            </Avatar>
          </CarouselItem>
        ))}
        {listing.images.length === 0 && (
          <Avatar className="w-full rounded-none h-56 flex justify-center items-center">
            <Image strokeWidth={1.25} />
          </Avatar>
        )}
      </CarouselContent>
      {listing.images.length > 1 && <CarouselNext className="right-1" />}
    </Carousel>
  );
}

export default ListingImages;
