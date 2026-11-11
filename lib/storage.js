// Public URL se storage ka path nikalta hai
// Example: https://.../storage/v1/object/public/class-media/<uid>/file.pdf -> <uid>/file.pdf
export function storagePathFromUrl(url, bucket = "class-media") {
  if (!url) return null;

  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;

  const rest = url.slice(index + marker.length).split("?")[0];
  return decodeURIComponent(rest);
}