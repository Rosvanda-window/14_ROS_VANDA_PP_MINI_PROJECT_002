"use client";

import { useState, useEffect } from "react";
import { Input, Spinner } from "@heroui/react";
import ShopCardComponent from "../../../components/shop/ShopCardComponent";
import { getProductsService } from "@/service/products.service";
import toast from "react-hot-toast";
import { data } from "framer-motion/client";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [price, setPrice] = useState(300);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeQuick, setActiveQuick] = useState("");

  const quickOptions = [
    { label: "Under $50", value: 50 },
    { label: "Under $100", value: 100 },
    { label: "Under $150", value: 150 },
    { label: "All prices", value: 300 },
  ];

  // fetch data
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getProductsService();
        const data = response?.payload || []; 
        setProducts(data);
      } catch (error) {
        toast.error("Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredProducts = products.filter((p) => {
    const matchPrice = p.price <= price;
    const matchCategory = categories.length === 0 || categories.includes(p.category);
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    return matchPrice && matchCategory && matchSearch;
  });

  if (isLoading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Spinner color="default" label="Loading..." />
    </div>
  );

  return (
    <main className="mx-auto max-w-7xl p-6 lg:p-10 bg-white">
      <header className="mb-10 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Luxury beauty products</h1>
          <p className="text-gray-500 mt-2">Use filters to browse our collection.</p>
        </div>
        <div className="w-full md:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product..."
            variant="bordered"
            radius="lg"
          />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* filter */}
        <div className="w-full lg:w-72 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm h-fit">
          <div className="flex justify-between items-center">
            <span className="bg-gray-100 px-2 py-1 text-sm rounded-md font-bold">Filters</span>
            <button 
              onClick={() => {setPrice(300); setSearch(""); setCategories([]); setActiveQuick("");}}
              className="text-xs text-gray-500 hover:text-black"
            >
              Reset
            </button>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold text-gray-500">PRICE RANGE</p>
            <p className="text-sm mt-1 font-bold">$0 – ${price}</p>
            <input
              type="range" min={0} max={300} value={price}
              onChange={(e) => { setPrice(Number(e.target.value)); setActiveQuick(""); }}
              className="mt-3 w-full accent-black"
            />
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold text-gray-500 uppercase">Quick Select</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickOptions.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setPrice(item.value); setActiveQuick(item.label); }}
                  className={`px-3 py-1 text-xs rounded-full border transition ${activeQuick === item.label ? "bg-black text-white" : "border-gray-200"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold text-gray-500">CATEGORIES</p>
            {["Skincare", "Makeup", "Fragrance"].map((cat) => (
              <label key={cat} className="flex justify-between mt-3 cursor-pointer">
                <div className="flex gap-2 items-center">
                  <input type="checkbox" checked={categories.includes(cat)} onChange={() => toggleCategory(cat)} />
                  <span className="text-sm">{cat}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* product */}
        <div className="flex-1">
          <p className="mb-6 text-gray-500">Showing <b>{filteredProducts.length}</b> products</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <ShopCardComponent key={p.productId} product={p} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}