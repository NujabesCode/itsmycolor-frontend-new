export interface Review {
  id: string;
  user: {
    name: string;
  };
  createdAt: string;
  rating: number;
  content: string;
  imageUrls: string[];
}
