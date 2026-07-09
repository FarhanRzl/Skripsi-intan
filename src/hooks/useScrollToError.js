// Portir dari scrollToFirstError versi Svelte: loop semua error,
// cocokkan ke DOM lewat atribut data-field, scroll ke yang pertama
function flattenErrorPaths(obj, prefix = "") {
  let paths = [];
  for (const key in obj) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (obj[key] && obj[key].message) {
      paths.push(path);
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      paths = paths.concat(flattenErrorPaths(obj[key], path));
    }
  }
  return paths;
}

export function useScrollToError() {
  return function scrollToFirstError(errors) {
    const errorPaths = flattenErrorPaths(errors);
    if (errorPaths.length === 0) return;

    for (const path of errorPaths) {
      const el = document.querySelector(`[data-field="${path}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        break;
      }
    }
  };
}
