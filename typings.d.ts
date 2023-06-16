interface Image {
  asset: {
    url: string;
  };
}

interface Creator {
  _id: string;
  address: string;
  name: string;
  slug: {
    current: string;
  };
  image: Image;
  bio: string;
}

interface Collection {
  _id: string;
  address: string;
  collectionName: string;
  creator: Creator;
  description: string;
  mainImage: Image;
  previewImage: Image;
  slug: {
    current: string;
  };
  title: string;
}
