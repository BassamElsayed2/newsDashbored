"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteGalleries,
  getGalleriesById,
  updateGallery,
} from "../../../../../../services/apiGallery";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { gallerySchema } from "@/components/Social/SettingsForm/lib/validations/schema";

interface Gallery {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  image_urls: string[];
}

type GalleryFormData = z.infer<typeof gallerySchema>;

const GalleryDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
  });

  const {
    data: gallery,
    isLoading,
    isError,
  } = useQuery<Gallery>({
    queryKey: ["gallery", id],
    queryFn: () => {
      if (!id) throw new Error("No ID provided");
      return getGalleriesById(id);
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (gallery) {
      reset({
        title_ar: gallery.title_ar,
        title_en: gallery.title_en,
        description_ar: gallery.description_ar || "",
        description_en: gallery.description_en || "",
      });
    }
  }, [gallery, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: GalleryFormData) => {
      if (!id || !gallery) throw new Error("No ID or gallery data provided");
      return await updateGallery(id, {
        ...data,
        image_urls: gallery.image_urls,
      });
    },
    onSuccess: () => {
      toast.success("تم تحديث المعرض بنجاح");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["gallery", id] });
    },
    onError: (error) => {
      console.error("Error updating gallery:", error);
      toast.error("فشل في تحديث المعرض");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGalleries,
    onSuccess: () => {
      toast.success("تم حذف المعرض بنجاح");
      router.push("/dashboard/images-gallery");
    },
    onError: (error) => {
      console.error("Error deleting gallery:", error);
      toast.error("فشل في حذف المعرض");
    },
  });

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const onSubmit = async (data: GalleryFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="flex justify-center items-center h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-r-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">جاري تحميل المعرض...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !gallery) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="flex flex-col items-center justify-center h-[400px] gap-4">
          <p className="text-red-500">حدث خطأ أثناء تحميل المعرض</p>
          <Link
            href="/dashboard/images-gallery"
            className="text-primary-500 hover:underline"
          >
            العودة إلى المعارض
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">تفاصيل المعرض</h5>
        <ol className="breadcrumb mt-[12px] md:mt-0 rtl:flex-row-reverse">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              رئيسية
            </Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard/images-gallery"
              className="hover:text-primary-500 transition-colors"
            >
              معرض الصور
            </Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            تفاصيل المعرض
          </li>
        </ol>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content lg:max-w-[1070px] md:pt-[15px] md:px-[15px] md:pb-[75px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px]">
            <div className="lg:ltr:mr-[30px] lg:rtl:ml-[30px]">
              {gallery.image_urls?.[activeTab] && (
                <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden">
                  <Image
                    src={gallery.image_urls[activeTab]}
                    alt={gallery.title_ar || "صورة المعرض"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex gap-[20px] mt-[20px] overflow-x-auto pb-2">
                {gallery.image_urls?.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => handleTabClick(idx)}
                    className={`cursor-pointer rounded-md overflow-hidden w-[100px] h-[75px] relative border-2 transition-all ${
                      activeTab === idx
                        ? "border-primary-500 shadow-lg"
                        : "border-transparent hover:border-primary-200"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`صورة مصغرة ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h6 className="font-medium text-lg mb-2">العنوان بالعربية</h6>
                <p className="text-gray-700 dark:text-gray-300">
                  {gallery.title_ar}
                </p>
              </div>

              <div>
                <h6 className="font-medium text-lg mb-2">
                  العنوان بالإنجليزية
                </h6>
                <p className="text-gray-700 dark:text-gray-300">
                  {gallery.title_en}
                </p>
              </div>

              {gallery.description_ar && (
                <div>
                  <h6 className="font-medium text-lg mb-2">الوصف بالعربية</h6>
                  <p className="text-gray-700 dark:text-gray-300">
                    {gallery.description_ar}
                  </p>
                </div>
              )}

              {gallery.description_en && (
                <div>
                  <h6 className="font-medium text-lg mb-2">
                    الوصف بالإنجليزية
                  </h6>
                  <p className="text-gray-700 dark:text-gray-300">
                    {gallery.description_en}
                  </p>
                </div>
              )}

              <div className="pt-4 flex gap-4">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  تعديل المعرض
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin"></span>
                      جارٍ الحذف...
                    </div>
                  ) : (
                    "حذف المعرض"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal تعديل المعرض */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">تعديل المعرض</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    العنوان (ar) *
                  </label>
                  <input
                    {...register("title_ar")}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0c1427]"
                  />
                  {errors.title_ar && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title_ar.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    العنوان (en) *
                  </label>
                  <input
                    {...register("title_en")}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0c1427]"
                  />
                  {errors.title_en && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title_en.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    الوصف (ar)
                  </label>
                  <textarea
                    {...register("description_ar")}
                    rows={4}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0c1427]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    الوصف (en)
                  </label>
                  <textarea
                    {...register("description_en")}
                    rows={4}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0c1427]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  disabled={updateMutation.isPending}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50"
                >
                  {updateMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin"></span>
                      جارٍ الحفظ...
                    </div>
                  ) : (
                    "حفظ التغييرات"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal تأكيد الحذف */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">تأكيد الحذف</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              هل أنت متأكد أنك تريد حذف هذا المعرض؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                disabled={deleteMutation.isPending}
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (id) {
                    deleteMutation.mutate(id);
                    setIsDeleteModalOpen(false);
                  }
                }}
                disabled={deleteMutation.isPending}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? "جارٍ الحذف..." : "تأكيد الحذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryDetails;
