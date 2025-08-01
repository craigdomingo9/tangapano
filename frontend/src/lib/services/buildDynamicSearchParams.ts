/**
 * Dynamically constructs URLSearchParams from a data object.
 *
 * @param data The object containing filter criteria.
 * @returns A URLSearchParams object.
 */
function buildDynamicSearchParams(data: Record<string, any>): URLSearchParams {
  const params = new URLSearchParams();

  // Define a mapping for data keys that need different URL parameter names.
  // This makes the function flexible for API requirements.
  const paramNameMap: { [key: string]: string } = {};

  for (const key in data) {
    // Ensure the property belongs to the object itself, not its prototype chain.
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];

      // Only append parameters if the value is not null, undefined, or an empty string.
      // This prevents sending unnecessary or invalid parameters.
      if (value !== undefined && value !== null && value !== "") {
        // Determine the actual URL parameter name:
        // Use the mapped name if it exists, otherwise use the original key.
        const paramName = paramNameMap[key] || key;

        // Convert the value to a string before appending.
        // This handles numbers, booleans, etc., correctly for URL parameters.
        params.append(paramName, value.toString());
      }
    }
  }

  return params;
}

export default buildDynamicSearchParams;
