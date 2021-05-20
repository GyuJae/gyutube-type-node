export default (hashtags: string): string[] => {
  const result = hashtags
    .split(",")
    .map((word: any) => (word.startsWith("#") ? word : `#${word}`));

  return result;
};
