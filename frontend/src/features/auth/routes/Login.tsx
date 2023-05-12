import SimpleButton from '@/components/Button/SimpleButton';
import { getImage, getPhotos } from '@/features/landing_page/api/getImages';
import { useState } from 'react';
import { useAuth } from 'react-oidc-context';

const LoginInner = () => {
  const auth = useAuth();

  switch (auth.activeNavigator) {
    case 'signinSilent':
      return <div>Signing you in...</div>;
    case 'signoutRedirect':
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        Hello {auth.user?.profile.sub}{' '}
        <button onClick={() => void auth.removeUser()}>Log out</button>
      </div>
    );
  }

  return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
};

export const Login = () => {
  const [image, setImage] = useState(undefined);

  const fetchFirstImage = async () => {
    const imageUrls = await getPhotos();
    const image = await getImage(imageUrls[1]);
    setImage(image);
  };

  const renderImage = () => {
    console.log(image);
    if (image) {
      const url = URL.createObjectURL(image);
      return <img src={url} />;
    }
  };
  return (
    <div className="mt-20">
      {LoginInner()}
      <SimpleButton onClick={fetchFirstImage}>get photos</SimpleButton>
      {renderImage()}
    </div>
  );
};
