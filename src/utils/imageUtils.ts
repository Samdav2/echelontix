/**
 * Processes image URLs to handle both Cloudinary CDN URLs and legacy local paths
 * Ensures backward compatibility with existing database records
 */

export const getProcessedImageUrl = (picturePath: string | null | undefined): string => {
  // Fallback for missing images
  if (!picturePath) {
    return '/placeholder-image.png';
  }

  // If it's already an absolute HTTP/HTTPS URL (Cloudinary or legacy domain), return as-is
  if (picturePath.startsWith('http://') || picturePath.startsWith('https://')) {
    return picturePath;
  }

  // If it's a relative path (legacy uploads/... format), prepend the API base URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${apiUrl}/${picturePath}`;
};

/**
 * Cloudinary transformation helper for advanced image optimization
 * Usage: transformCloudinaryUrl(url, 'w_500,h_500,c_fill,q_auto,f_auto')
 */
export const transformCloudinaryUrl = (
  url: string,
  transformations: string
): string => {
  if (!url.includes('res.cloudinary.com')) {
    return url; // Not a Cloudinary URL, return as-is
  }

  // Insert transformations before the final path component
  // e.g., https://res.cloudinary.com/cloud/image/upload/sample.jpg
  // becomes https://res.cloudinary.com/cloud/image/upload/w_500.../sample.jpg
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  }

  return url;
};
