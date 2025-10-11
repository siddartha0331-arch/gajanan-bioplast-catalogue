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
  moq: number; // Minimum Order Quantity
  deliveryDays: string;
  printingOptions: string[];
  features: string[];
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
    moq: 1000,
    deliveryDays: "7-10 days",
    printingOptions: ["Screen Printing", "Flexo Printing", "Digital Print"],
    features: ["Eco-friendly material", "Reusable", "Custom colors available", "Strong handles"],
  },
  {
    id: "2",
    name: "D Cut Non-Woven Bag",
    type: "D Cut",
    size: "15x18",
    price: 420,
    image: dcutBag,
    description: "Durable D-cut bag with reinforced handles for heavy-duty use.",
    moq: 1000,
    deliveryDays: "7-10 days",
    printingOptions: ["Screen Printing", "Flexo Printing", "Digital Print"],
    features: ["Heavy-duty", "Reinforced handles", "Custom branding", "UV resistant"],
  },
  {
    id: "3",
    name: "W Cut Non-Woven Bag",
    type: "W Cut",
    size: "12x15",
    price: 320,
    image: wcutBag,
    description: "Classic W-cut design, ideal for boutiques and gift shops.",
    moq: 1500,
    deliveryDays: "5-8 days",
    printingOptions: ["Screen Printing", "Digital Print"],
    features: ["Lightweight", "Cost-effective", "Multiple colors", "Quick turnaround"],
  },
  {
    id: "4",
    name: "W Cut Non-Woven Bag",
    type: "W Cut",
    size: "15x18",
    price: 380,
    image: wcutBag,
    description: "Spacious W-cut bag with excellent load-bearing capacity.",
    moq: 1500,
    deliveryDays: "5-8 days",
    printingOptions: ["Screen Printing", "Digital Print"],
    features: ["Spacious design", "Load-bearing", "Custom sizes", "Bulk discounts"],
  },
  {
    id: "5",
    name: "PP Woven Bag",
    type: "PP Woven",
    size: "15x21",
    price: 450,
    image: ppBag,
    description: "Heavy-duty PP woven bag for packaging and industrial use.",
    moq: 2000,
    deliveryDays: "10-14 days",
    printingOptions: ["Laminated Print", "BOPP Lamination"],
    features: ["Industrial strength", "Water-resistant", "Custom lamination", "UV protected"],
  },
  {
    id: "6",
    name: "PP Woven Bag",
    type: "PP Woven",
    size: "18x24",
    price: 550,
    image: ppBag,
    description: "Large PP woven bag suitable for bulk packaging and transportation.",
    moq: 2000,
    deliveryDays: "10-14 days",
    printingOptions: ["Laminated Print", "BOPP Lamination"],
    features: ["Extra large", "Tear-resistant", "Heavy load capacity", "Long-lasting"],
  },
  {
    id: "7",
    name: "BOPP Laminated Bag",
    type: "BOPP",
    size: "12x15",
    price: 480,
    image: boppBag,
    description: "Premium BOPP laminated bag with glossy finish for branding.",
    moq: 1000,
    deliveryDays: "12-15 days",
    printingOptions: ["Full Color BOPP Print", "Glossy Finish", "Matte Finish"],
    features: ["Premium finish", "Vibrant colors", "Brand enhancement", "Glossy/Matte options"],
  },
  {
    id: "8",
    name: "BOPP Laminated Bag",
    type: "BOPP",
    size: "15x18",
    price: 580,
    image: boppBag,
    description: "High-quality BOPP bag with vibrant printing capabilities.",
    moq: 1000,
    deliveryDays: "12-15 days",
    printingOptions: ["Full Color BOPP Print", "Glossy Finish", "Matte Finish"],
    features: ["High-quality print", "Color accuracy", "Professional look", "Custom designs"],
  },
];
