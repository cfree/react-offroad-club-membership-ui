import React, { useState, useCallback } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from '../../utility/ErrorMessage';
import Loading from '../../utility/Loading';
import { getUploadLocation } from '../../../lib/utils';

const UPDATE_AVATAR = gql`
  mutation UPDATE_AVATAR($data: ImageUpdateInput!) {
    updateAvatar(data: $data) {
      message
    }
  }
`;

const DELETE_AVATAR = gql`
  mutation DELETE_AVATAR($avatar: CloudinaryImageInput!) {
    deleteAvatar(avatar: $avatar) {
      message
    }
  }
`;

const uploadImage = async file => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', getUploadLocation('avatars'));

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/fourplayers/image/upload',
    {
      method: 'POST',
      body: data,
    },
  );

  return res.json();
};

const defaultImage = {
  id: null,
  publicId: null,
  url: null,
  smallUrl: null,
};

const AvatarUploader = ({ image }) => {
  const initialImage = {
    id: (image && image.id) || defaultImage.id,
    publicId: (image && image.publicId) || defaultImage.publicId,
    url: (image && image.url) || defaultImage.url,
    smallUrl: (image && image.smallUrl) || defaultImage.smallUrl,
  };
  const [avatar, setAvatar] = useState(initialImage);
  const [oldAvatar, setOldAvatar] = useState(image ? initialImage : null);

  const uploadFile = useCallback(
    async (e, callback) => {
      const files = e.target.files;
      const uploadResults = await uploadImage(files[0]);
      const newAvatar = {
        publicId: uploadResults.public_id,
        url: uploadResults.secure_url,
        smallUrl: uploadResults.eager[0].secure_url,
      };

      callback({
        variables: {
          data: {
            old: oldAvatar,
            new: newAvatar,
          },
        },
      });

      setAvatar(newAvatar);
      setOldAvatar(newAvatar);
    },
    [uploadImage, oldAvatar, setAvatar, setOldAvatar],
  );

  const deleteFile = useCallback(
    async callback => {
      callback({
        variables: {
          avatar: oldAvatar,
        },
      });

      setAvatar(defaultImage);
      setOldAvatar();
    },
    [oldAvatar, setAvatar, setOldAvatar, defaultImage],
  );

  return (
    <>
      Upload avatar (cropped to 200 x 200)
      <Mutation mutation={UPDATE_AVATAR}>
        {(updateAvatar, { error, loading, data }) => {
          return (
            <>
              <input
                type="file"
                id="file"
                name="file"
                placeholder="Upload an image"
                required
                onChange={e => uploadFile(e, updateAvatar)}
                key={Date.now()}
              />
              {loading && <Loading loading={loading} />}
              {error && <ErrorMessage error={error} />}
              {avatar.url && data && data.updateAvatar.message}
              {avatar.url && <img width="100" src={avatar.url} alt="Avatar" />}
            </>
          );
        }}
      </Mutation>
      {avatar.url && (
        <Mutation mutation={DELETE_AVATAR}>
          {(deleteAvatar, { error, loading, data }) => {
            return (
              <>
                <button
                  disabled={loading}
                  onClick={() => deleteFile(deleteAvatar)}
                >
                  Delete image
                </button>
                {loading && <Loading loading={loading} />}
                {error && <ErrorMessage error={error} />}
              </>
            );
          }}
        </Mutation>
      )}
    </>
  );
};

export default AvatarUploader;
