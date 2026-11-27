import { imgpileVariantUrl } from "../utils/seo";

export default function ResponsiveProductImage({ src, alt, className, mobileSize = "md", ...imageProps }) {
  const mobileSource = imgpileVariantUrl(src, mobileSize);

  return (
    <picture className="block h-full w-full">
      {mobileSource && <source media="(max-width: 767px)" srcSet={mobileSource} />}
      <img {...imageProps} className={className} src={src} alt={alt} />
    </picture>
  );
}
