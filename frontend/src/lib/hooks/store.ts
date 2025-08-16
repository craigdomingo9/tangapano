"use client";
import createEntityStore from "@/lib/store/entityStore";

/**
 * A custom hook that provides a store for managing the selected `Listing` entity.
 *
 * @remarks
 * This hook utilizes `createEntityStore` to create a store instance specifically for `Listing` entities.
 * The initial state is an empty `Listing` object.
 *
 * @returns A store instance for the selected `Listing`.
 */
export const useAmenitiesDialogState = createEntityStore<boolean>(false);
export const useSelectedAmenities = createEntityStore<Amenity[]>([]);

/**
 * Custom hook that creates a store to manage the mode of a listing image dialog.
 *
 * The store can be in one of three modes: "add", "list", or "delete".
 * The initial mode is set to "list".
 *
 * @returns A store instance for managing the dialog mode state.
 */
export const useListingImageDialogState = createEntityStore<boolean>(false);
export const useSelectedListingImage = createEntityStore<Image>({} as Image);
export const useListingImageDialogMode = createEntityStore<
  "add" | "list" | "delete"
>("list");

/**
 * Custom hook that creates and manages the state for listing dialog operations.
 *
 * This hook utilizes `createEntityStore` to handle the current operation mode
 * for a listing dialog, which can be one of "add", "edit", or "delete".
 * The default operation mode is set to "add".
 *
 * @returns The store instance for managing the listing dialog operation state.
 */
export const useListingDialogState = createEntityStore<boolean>(false);
export const useListingDialogMode = createEntityStore<
  "add" | "edit" | "delete"
>("add");

/**
 * Custom hook that creates a store for managing the state of room dialog operations.
 *
 * The store tracks the current operation being performed on rooms, which can be one of:
 * - "list": Viewing the list of rooms.
 * - "add": Adding a new room.
 * - "edit": Editing an existing room.
 * - "delete": Deleting a room.
 *
 * @returns A store instance initialized with the "list" operation.
 */
export const useRoomsDialogState = createEntityStore<boolean>(false);
export const useRoomsDialogOperation = createEntityStore<
  "list" | "add" | "edit" | "delete"
>("list");
export const useSelectedRoom = createEntityStore<Room>({} as Room);

/**
 * A custom hook that provides a boolean state store for managing the open/closed state
 * of the landlord dialog. Uses `createEntityStore` to create a store with an initial value of `false`.
 *
 * @returns A store instance for the landlord dialog's open/closed state.
 */
export const useLandlordDialogState = createEntityStore<boolean>(false);

/**
 * A custom hook that manages the open/closed state of a user dialog.
 *
 * @remarks
 * This store is initialized with a default state of `false`, indicating that the dialog is closed.
 *
 * @returns An entity store for the user dialog's open state.
 */
export const useContactAgentDialogState = createEntityStore<boolean>(false);

/**
 * Custom hook that creates and returns a store for managing the selected `Listing` entity by a student.
 *
 * @returns A store instance for the selected `Listing`.
 */
export const useSelectedListingByStudent = createEntityStore<Listing>(
  {} as Listing
);
