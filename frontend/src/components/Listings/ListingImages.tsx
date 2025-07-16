import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


type Props = {
  listing: Listing,
}

function ListingImages({listing}: Props) {

  return (
    <Carousel>
      <CarouselContent>
        {listing.images.map((image) => (
          <CarouselItem key={image.id}>
            <Avatar className="w-full rounded-none h-56">
              <AvatarImage className="rounded-t-md" src={image.image} />
              <AvatarFallback className="rounded-none">{listing.title}</AvatarFallback>
            </Avatar>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default ListingImages