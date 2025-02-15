export default interface Ads {
  id: string;
  title: string;
  order: number;
  description: string | null;
  background_image_url: string;
  button_text: string | null;
  button_url: string | null;
  start_date: string | null;
  end_date: string | null;
  active: boolean;
  created_at: string;
}
