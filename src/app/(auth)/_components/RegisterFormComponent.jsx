"use client";

import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerService } from "@/service/auth.service";
import toast from "react-hot-toast";

const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required"),
  lastName: z
    .string()
    .min(1, "Last name is required"),
  email: z
    .string()
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  birthDate: z
    .string()
    .min(1, "Birth date is required")
    .refine((val) => {
    const birth = new Date(val);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 18;
  }, { message: "Must be at least 18 years old" }),
});

export default function RegisterFormComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", birthDate: "" },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        birthDate: data.birthDate
      };

      await registerService(payload);
      
      toast.success("Account created! Please log in.");
      
      setTimeout(() => {
        router.push("/login");
      }, 500);
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-4 text-black" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">First Name</label>
          <input
            {...register("firstName")}
            className={`mt-1 w-full rounded-xl border p-3 text-sm outline-none transition focus:ring-2 focus:ring-lime-400/20 ${errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-lime-400'}`}
            placeholder="Jane"
          />
          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">Last Name</label>
          <input
            {...register("lastName")}
            className={`mt-1 w-full rounded-xl border p-3 text-sm outline-none transition focus:ring-2 focus:ring-lime-400/20 ${errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-lime-400'}`}
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          {...register("email")}
          type="email"
          className={`mt-1 w-full rounded-xl border p-3 text-sm outline-none transition focus:ring-2 focus:ring-lime-400/20 ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-lime-400'}`}
          placeholder="jane@example.com"
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          {...register("password")}
          type="password"
          className={`mt-1 w-full rounded-xl border p-3 text-sm outline-none transition focus:ring-2 focus:ring-lime-400/20 ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-lime-400'}`}
          placeholder="••••••••"
        />
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Birth Date</label>
        <input
          {...register("birthDate")}
          type="date"
          className={`mt-1 w-full rounded-xl border p-3 text-sm outline-none transition focus:ring-2 focus:ring-lime-400/20 ${errors.birthDate ? 'border-red-500' : 'border-gray-200 focus:border-lime-400'}`}
        />
        {errors.birthDate && <p className="text-xs text-red-500 mt-1">{errors.birthDate.message}</p>}
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full bg-lime-400 font-bold py-6 rounded-full mt-4 text-gray-900 shadow-sm transition hover:bg-lime-300"
      >
        Sign Up
      </Button>
    </form>
  );
}