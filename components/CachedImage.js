import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import * as FileSystem from 'expo-file-system';

const CachedImage = ({ source, cacheKey, ...props }) => {
  const [sourceUri, setSourceUri] = useState(source.uri);

  useEffect(() => {
    const fetchImage = async () => {
      const filename = cacheKey || encodeURIComponent(source.uri);
      const filepath = `${FileSystem.cacheDirectory}${filename}`;
      const fileInfo = await FileSystem.getInfoAsync(filepath);
      if (fileInfo.exists) {
        setSourceUri(filepath);
      } else {
        const downloadResumable = FileSystem.createDownloadResumable(
          source.uri,
          filepath,
          {},
          (downloadProgress) => {
            // Handle progress if needed
          }
        );

        try {
          const { uri } = await downloadResumable.downloadAsync();
          setSourceUri(uri);
        } catch (e) {
          console.error('Error downloading image: ', e);
          // If download fails, fall back to the original URI
          setSourceUri(source.uri);
        }
      }
    };

    if (source.uri) {
      fetchImage();
    }
  }, [source.uri, cacheKey]);

  return (
    <Image source={{ uri: sourceUri }} {...props} />
  );
};

export default CachedImage;
