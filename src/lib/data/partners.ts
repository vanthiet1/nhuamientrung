/** Logo đối tác (nguồn: mangcopvc.vn trang chủ) */
export type Partner = {
  id: string;
  name: string;
  image: string;
  href?: string;
};

const BASE = "https://mangcopvc.vn";

export const partners: Partner[] = [
  {
    id: "tri-son",
    name: "Tri Sơn",
    image: `${BASE}/upload/photo/tri-son-28350-copy-69784.jpg`,
  },
  {
    id: "tri-hai",
    name: "Trí Hải",
    image: `${BASE}/upload/photo/tri-hai-31750-copy-78863.jpg`,
  },
  {
    id: "tuong-an",
    name: "Tường An",
    image: `${BASE}/upload/photo/tuong-an-60120-37472.jpg`,
  },
  {
    id: "partner-4",
    name: "Đối tác",
    image: `${BASE}/upload/photo/rectangle-1-53600-copy-54071.jpg`,
  },
  {
    id: "lavie",
    name: "La Vie",
    image: `${BASE}/upload/photo/lavie-1537-copy-24710.jpg`,
  },
  {
    id: "partner-6",
    name: "Đối tác",
    image: `${BASE}/upload/photo/images-copy-70780.jpg`,
  },
  {
    id: "partner-7",
    name: "Đối tác",
    image: `${BASE}/upload/photo/group-1-89980-copy-23090.jpg`,
  },
  {
    id: "partner-8",
    name: "Đối tác",
    image: `${BASE}/upload/photo/doitac-50204-copy-47710.jpg`,
  },
];
