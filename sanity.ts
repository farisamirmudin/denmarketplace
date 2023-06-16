import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  apiVersion: "2022-11-16",
  useCdn: true,
};

export const sanityClient = createClient(config);
export const urlFor = (source: Image) =>
  createImageUrlBuilder(config).image(source);
