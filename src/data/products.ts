import dcutBag from "@/assets/dcut-bag.jpg";
import wcutBag from "@/assets/wcut-bag.jpg";
import ppBag from "@/assets/pp-bag.jpg";
import boppBag from "@/assets/bopp-bag.jpg";

export interface Product {
  id: string;
  name: string;
  type: "D Cut" | "W Cut" | "PP Woven" | "BOPP";
  size: string;
  price: number;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "D Cut Non-Woven Bag",
    type: "D Cut",
    size: "12x15",
    price: 350,
    image: dcutBag,
    description: "Eco-friendly D-cut non-woven shopping bag, perfect for retail and grocery stores.",
  },
  {
    id: "2",
    name: "D Cut Non-Woven Bag",
    type: "D Cut",
    size: "15x18",
    price: 420,
    image: dcutBag,
    description: "Durable D-cut bag with reinforced handles for heavy-duty use.",
  },
  {
    id: "3",
    name: "W Cut Non-Woven Bag",
    type: "W Cut",
    size: "12x15",
    price: 320,
    image: wcutBag,
    description: "Classic W-cut design, ideal for boutiques and gift shops.",
  },
  {
    id: "4",
    name: "W Cut Non-Woven Bag",
    type: "W Cut",
    size: "15x18",
    price: 380,
    image: wcutBag,
    description: "Spacious W-cut bag with excellent load-bearing capacity.",
  },
  {
    id: "5",
    name: "PP Woven Bag",
    type: "PP Woven",
    size: "15x21",
    price: 450,
    image: ppBag,
    description: "Heavy-duty PP woven bag for packaging and industrial use.",
  },
  {
    id: "6",
    name: "PP Woven Bag",
    type: "PP Woven",
    size: "18x24",
    price: 550,
    image: ppBag,
    description: "Large PP woven bag suitable for bulk packaging and transportation.",
  },
  {
    id: "7",
    name: "BOPP Laminated Bag",
    type: "BOPP",
    size: "12x15",
    price: 480,
    image: boppBag,
    description: "Premium BOPP laminated bag with glossy finish for branding.",
  },
  {
    id: "8",
    name: "BOPP Laminated Bag",
    type: "BOPP",
    size: "15x18",
    price: 580,
    image: boppBag,
    description: "High-quality BOPP bag with vibrant printing capabilities.",
  },
];
