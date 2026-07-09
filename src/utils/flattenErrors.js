// Flatten object error nested dari React Hook Form jadi array path string,
// dipakai bareng useScrollToError
export function flattenErrors(errors, prefix = "") {
  let paths = [];
  for (const key in errors) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (errors[key] && errors[key].message) {
      paths.push({ path, message: errors[key].message });
    } else if (typeof errors[key] === "object" && errors[key] !== null) {
      paths = paths.concat(flattenErrors(errors[key], path));
    }
  }
  return paths;
}
