"use client";

import { useState, useEffect } from "react";
import { 
  Button, useDisclosure, Spinner, 
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem 
} from "@heroui/react";
import ProductCardComponent from "@/components/ProductCardComponent";
import CreateProductModal from "@/components/CreateProductModal";
import { 
  getProductsService, createProductService, 
  updateProductService, deleteProductService 
} from "@/service/products.service";
import toast from "react-hot-toast";

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const loadData = async () => {
    try {
      const data = await getProductsService();
      setProducts(data);
    } catch (err) {
      toast.error("Error loading data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        await updateProductService(selectedProduct.productId || selectedProduct.id, formData);
        toast.success("Updated!");
      } else {
        await createProductService(formData);
        toast.success("Created!");
      }
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (isLoading) return <div className="flex h-[60vh] justify-center items-center"><Spinner color="lime" /></div>;

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Button onPress={() => { setSelectedProduct(null); onOpen(); }} className="bg-lime-400 font-bold">
          + Create Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.productId || p.id || Math.random()} className="relative group">
            <ProductCardComponent product={p} />
            <div className="absolute top-6 right-6 z-10">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly variant="flat" className="bg-white/90 rounded-full shadow-sm">•••</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem onClick={() => { setSelectedProduct(p); onOpen(); }}>Edit</DropdownItem>
                  <DropdownItem color="danger" className="text-danger" onClick={async () => {
                    if(confirm("Delete?")) {
                       await deleteProductService(p.productId || p.id);
                       loadData();
                    }
                  }}>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        ))}
      </div>

      <CreateProductModal isOpen={isOpen} onOpenChange={onOpenChange} onSave={handleFormSubmit} initialData={selectedProduct} />
    </main>
  );
}