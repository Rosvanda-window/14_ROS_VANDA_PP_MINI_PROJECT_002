"use client";

import { useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from "@heroui/react";
import { useForm } from "react-hook-form";

export default function CreateProductModal({ isOpen, onOpenChange, onSave, initialData }) {
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (initialData && isOpen) {
      setValue("productName", initialData.productName);
      setValue("price", initialData.price);
      setValue("imageUrl", initialData.imageUrl === "string" ? "" : initialData.imageUrl);
      setValue("description", initialData.description);
    } else if (!isOpen) {
      reset();
    }
  }, [initialData, isOpen, setValue, reset]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit((data) => { onSave({...data, price: Number(data.price)}); onOpenChange(false); })}>
            <ModalHeader className="font-bold">{initialData ? "Edit" : "New"} Product</ModalHeader>
            <ModalBody className="space-y-4">
              <Input {...register("productName")} label="Name" variant="bordered" isRequired />
              <Input {...register("price")} label="Price" type="number" variant="bordered" isRequired />
              <Input {...register("imageUrl")} label="Image URL" variant="bordered" />
              <Textarea {...register("description")} label="Description" variant="bordered" />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>Cancel</Button>
              <Button type="submit" className="bg-lime-400 font-bold">Save</Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}