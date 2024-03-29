interface ImageBlobProps extends React.ComponentPropsWithoutRef<'img'> {
  /** The blob that will be rendered as an image */
  image: Blob;
}

/**
 * render an image from a data Blob
 */
export const ImageBlob = (props: ImageBlobProps) => {
  const { image, ...imageProps } = props;
  const url = URL.createObjectURL(image);
  return <img {...imageProps} src={url} />;
};
