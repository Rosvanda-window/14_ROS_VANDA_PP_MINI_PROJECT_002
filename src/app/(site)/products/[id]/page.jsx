"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Spinner, Button, Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { getProductsService } from "@/service/products.service";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // stat for select
  const [selectedColor, setSelectedColor] = useState("green");
  const [selectedSize, setSelectedSize] = useState("s");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await getProductsService();
        const allProducts = response?.payload || [];
        const found = allProducts.find((p) => p.productId === id);
        
        if (found) setProduct(found);
        else toast.error("Product not found");
      } catch (error) {
        toast.error("Error loading product");
      } finally {
        setLoading(false);
      }
    };
    if (id) loadProduct();
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Spinner color="default" /></div>;
  if (!product) return <div className="p-20 text-center font-bold text-xl">Product not found.</div>;

  // img replace
  const displayImage = product.imageUrl && product.imageUrl !== "string" 
    ? product.imageUrl 
    : "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&fit=crop";

  return (
    <main className="mx-auto max-w-7xl p-6 lg:px-12 py-10">
      <Breadcrumbs className="mb-8">
        <BreadcrumbItem onClick={() => router.push("/")}>Home</BreadcrumbItem>
        <BreadcrumbItem onClick={() => router.push("/products")}>Products</BreadcrumbItem>
        <BreadcrumbItem className="font-bold text-gray-900">{product.productName}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-4xl border border-gray-100 bg-[#f9f9f9]">
          <Image
            src={displayImage}
            alt={product.productName}
            fill
            className="object-contain p-12"
            unoptimized
          />
        </div>

        {/* right */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {product.productName}
            </h1>
            <div className="flex text-amber-400 text-xl">
               ★★★★<span className="text-gray-200">★</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl font-bold text-indigo-900">${product.price}.00</span>
            {product.price > 50 && (
              <span className="text-lg text-gray-400 line-through">${(product.price * 1.15).toFixed(0)}.00</span>
            )}
          </div>

          {/* color  */}
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-900 mb-3">Choose a color</p>
            <div className="flex gap-3">
              {["green", "gray"].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-1.5 rounded-full border text-sm transition-all
                    ${selectedColor === color ? "bg-green-100 border-green-500 text-green-700" : "bg-white border-gray-200 text-gray-500"}`}
                >
                  {color}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">Selected: {selectedColor}</p>
          </div>

          {/* sixe */}
          <div className="mb-8">
            <p className="text-sm font-bold text-gray-900 mb-3">Choose a size</p>
            <div className="flex gap-3">
              {["s", "m", "l"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border text-xs font-bold uppercase transition-all
                    ${selectedSize === size ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-gray-200 text-gray-400"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed text-sm mb-8 max-w-md">
            {product.description || "A deep cleansing foam with BHA and Tea tree unclogs pores and exfoliates dead skin cells, leaving a refreshed finish."}
          </p>

          {/* bar */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 bg-gray-50">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2 text-gray-400 font-bold">-</button>
              <span className="px-4 font-bold w-10 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-2 text-gray-400 font-bold">+</button>
            </div>
            
            <Button 
              className="flex-1 bg-gray-900 text-white h-12 rounded-full font-bold shadow-xl hover:bg-black transition-all"
              startContent={<span>+</span>}
            >
              Add to cart
            </Button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-100 flex items-center gap-4">
             <div className="text-xl">↺</div>
             <div>
               <p className="font-bold text-sm text-gray-900">Free 30-day returns</p>
               <p className="text-xs text-gray-400">See return policy details in cart.</p>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}