import { Bed, Check, Home, Link, MapPin } from "lucide-react";
import React from "react";

interface ListingDetailInfoProps {
  listing: Listing;
}

function ListingDetailInfo({ listing }: ListingDetailInfoProps) {
  return (
    <div className="space-y-8">
      {/* Title & Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              {listing.title}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400 font-medium">
              <MapPin className="w-4 h-4 text-lapis dark:text-sky-400" />
              <span className="text-sm">
                {listing.neighborhood.name}, {listing.neighborhood.city}
              </span>
            </div>
          </div>

          {/* Minimal Stats Row */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 [&>div>span]:text-xsm [&>div>span]:sm:text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Home className="w-4 h-4 text-slate-400" />
              <span>Student Residence</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Bed className="w-4 h-4 text-slate-400" />
              <span>{listing?.rooms?.length} Rooms</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Link className="w-4 h-4 text-slate-400" />
              <span>{listing.distance_from_campus} min walk</span>
            </div>
          </div>
        </div>
      </div>
      {/* Amenities - Minimal Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6">
          Amenities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
          {listing.amenities.map((amenity) => (
            <div
              key={amenity.id}
              className="flex items-center gap-3 text-slate-600 dark:text-slate-300"
            >
              <div className="size-7 sm:size-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Check className="size-4 text-lapis dark:text-sky-400" />
              </div>
              <span className="text-xsm sm:text-sm font-medium">
                {amenity.display_name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListingDetailInfo;
