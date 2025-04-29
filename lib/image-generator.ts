export const getImageFromUnsplash = async (query: string): Promise<string | null> => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
        { cache: 'no-store' }
      );
  
      const data = await res.json();
  
      return data?.results?.[0]?.urls?.regular ?? null;
    } catch (err) {
      console.error("Unsplash API error:", err);
      return null;
    }
};
  