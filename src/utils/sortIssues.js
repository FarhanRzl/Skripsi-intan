// Portir langsung dari logic toast error di versi Svelte:
// error dengan path diawali "orderDesign" ditaruh paling belakang,
// biar error yang lebih relevan (area, structures, dll) muncul duluan
export function sortIssuesDeprioritizeOrderDesign(issues) {
  return [...issues].sort((a, b) => {
    const aIsOrderDesign = a.path[0] === "orderDesign" ? 1 : 0;
    const bIsOrderDesign = b.path[0] === "orderDesign" ? 1 : 0;
    return aIsOrderDesign - bIsOrderDesign;
  });
}
