/**
 * Checks if the keys given exist whin an object.
 * @param object - object to check against
 * @param requiredFields - fields to check for
 * @returns Array of the strings. Each element is a field that was not found in the object
 */
export const findMissingFields = (object: object, requiredFields: string[]) => {
  const missingFields: string[] = [];

  requiredFields.forEach((field) => {
    if (!(field in object)) {
      missingFields.push(field);
    }
  });

  return missingFields;
};
