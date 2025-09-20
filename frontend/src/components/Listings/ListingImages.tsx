import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image } from "lucide-react";

type Props = {
  listing: Listing;
};

function ListingImages({ listing }: Props) {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {listing.images.map((image) => (
          <CarouselItem key={image.id}>
            <Avatar className="w-full rounded-none h-56 relative">
              <AvatarImage className="rounded-t-xl" src={image.image} />
              <AvatarFallback className="rounded-none rounded-t-xl">
                {listing.title}
              </AvatarFallback>
              {image.caption && (
                <div className="absolute z-50 bottom-2 right-2 bg-[var(--lapis-lazuli)] bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {image.caption}
                </div>
              )}
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
