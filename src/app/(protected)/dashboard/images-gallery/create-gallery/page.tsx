"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { gallerySchema } from "@/components/Social/SettingsForm/lib/validations/schema";
import { CreateGallery } from "../../../../../../services/apiGallery";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type GalleryFormData = z.infer<typeof gallerySchema>;

export default function CreatGalleryPage() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const title_ar = formData.get("title_ar") as string;
      const title_en = formData.get("title_en") as string;
      const description_ar = formData.get("description_ar") as string;
      const description_en = formData.get("description_en") as string;
      const image_urls = formData.getAll("image_urls") as File[];

      return await CreateGallery({
        title_ar,
        title_en,
        description_ar,
        description_en,
        image_urls,
      });
    },
    onSuccess: () => {
      toast.success("تم إنشاء الحساب بنجاح");
      router.push("/dashboard/images-gallery");
    },
  });

  const onSubmit = (data: GalleryFormData) => {
    const formData = new FormData();
    formData.append("title_ar", data.title_ar);
    formData.append("title_en", data.title_en);
    formData.append("description_ar", data.description_ar || "");
    formData.append("description_en", data.description_en || "");
    selectedImages.forEach((image) => {
      formData.append("image_urls", image);
    });

    mutation.mutate(formData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="gap-[25px]">
        <div className="xl:col-span-3 2xl:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">إنشاء معرض صور</h5>
              </div>
            </div>
            <div className="trezo-card-content sm:grid sm:grid-cols-2 sm:gap-[25px]">
              {/* العنوان بالعربية */}
              <div className="mb-[20px]">
                <label className="mb-[10px] block font-medium text-black dark:text-white">
                  العنوان (ar) *
                </label>
                <input
                  {...register("title_ar")}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all"
                />
                {errors.title_ar && (
                  <p className="text-red-500 text-sm">
                    {errors.title_ar.message}
                  </p>
                )}
              </div>

              {/* العنوان بالإنجليزية */}
              <div className="mb-[20px]">
                <label className="mb-[10px] block font-medium text-black dark:text-white">
                  العنوان (en) *
                </label>
                <input
                  {...register("title_en")}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all"
                />
                {errors.title_en && (
                  <p className="text-red-500 text-sm">
                    {errors.title_en.message}
                  </p>
                )}
              </div>

              {/* التفاصيل بالعربية */}
              <div className="sm:col-span-2 mb-[20px]">
                <label className="mb-[10px] block font-medium text-black dark:text-white">
                  تفاصيل (ar)
                </label>
                <textarea
                  {...register("description_ar")}
                  className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all"
                />
              </div>

              {/* التفاصيل بالإنجليزية */}
              <div className="sm:col-span-2 mb-[20px]">
                <label className="mb-[10px] block font-medium text-black dark:text-white">
                  تفاصيل (en)
                </label>
                <textarea
                  {...register("description_en")}
                  className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all"
                />
              </div>

              {/* رفع الصور */}
              <div className="sm:col-span-2">
                <label className="mb-[10px] block font-medium text-black dark:text-white">
                  اختر الصور
                </label>
                <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[65px] px-[20px] border border-gray-200 dark:border-[#172036]">
                  <div className="flex items-center justify-center">
                    <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                      <i className="ri-upload-2-line"></i>
                    </div>
                    <p>
                      <strong>Click to upload</strong>
                      <br /> your file here
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="mt-[10px] flex flex-wrap gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative w-[50px] h-[50px]">
                      <Image
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs"
                        onClick={() => handleRemoveImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-[20px] sm:mt-[25px]">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="font-medium inline-block transition-all rounded-md 2xl:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
              >
                {mutation.isPending ? "جارٍ الإرسال..." : "إنشاء"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
