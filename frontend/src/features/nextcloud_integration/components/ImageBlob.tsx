interface ImageBlobProps {
  /** The blob that will be rendered as an image */
  image: Blob;
}

/**
 * render an image from a data Blob
 */
export const ImageBlob = ({ image }: ImageBlobProps) => {
  const url = URL.createObjectURL(image);
  return <img src={url} />;
};
