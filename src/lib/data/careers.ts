export type Job = {
  id: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
};

/** Dữ liệu tĩnh đã bỏ — dùng CMS admin / data/careers.json */
export const jobs: Job[] = [];
