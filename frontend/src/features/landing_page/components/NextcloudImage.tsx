import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { getPublicImage } from "@/features/nextcloud_integration/api/getImages";
import { ImageBlob } from "@/features/nextcloud_integration/components/ImageBlob";
import { useQuery } from "@tanstack/react-query";
import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { toast } from "react-toastify";

interface NextcloudImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  // relative path starting at the public share directory to the image in Nextcloud
  path: string,
  // token which identifies the public share directory
  shareToken: string
}

export const NextcloudImage = (props: NextcloudImageProps) => {
  const { path, shareToken, ...imageProps } = props

  const { data: image, isLoading, isError } = useQuery({
    queryKey: ['image', path, shareToken] as const,
    queryFn: ({ queryKey: [_image, path, token] }) => getPublicImage(path, token),
  });

  if( isLoading ){
    return <LoadingSpinner />
  }

  if( isError ){
    //TODO: translation
    toast.error("Sorry! Couldn't load image from Nextcloud. Please try again later")
    return <div>Failed to load image.</div>
  }

  return <ImageBlob
    image={image}
    { ...imageProps }
  ></ImageBlob>
}
