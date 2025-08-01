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
            <Avatar className="w-full rounded-none h-56">
              <AvatarImage className="rounded-t-xl" src={image.image} />
              <AvatarFallback className="rounded-none">
                {listing.title}
              </AvatarFallback>
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
