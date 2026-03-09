/** Prefix a public-folder path with the Next.js basePath for production. */
export function publicPath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
