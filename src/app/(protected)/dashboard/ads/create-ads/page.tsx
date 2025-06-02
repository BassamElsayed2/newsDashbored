"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import supabase from "../../../../../../services/supabase";
import toast from "react-hot-toast";

type FormData = {
  title_ar: string;
  title_en: string;
  link: string;
  location: string;
};

export default function CreateAds() {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedImage) {
      toast("الصورة مطلوبة");
      return;
    }

    setLoading(true);

    const fileExt = selectedImage.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: imageUploadError } = await supabase.storage
      .from("adsmedia")
      .upload(fileName, selectedImage);

    if (imageUploadError) {
      console.error(imageUploadError);
      toast.error("فشل في رفع الصورة");
      setLoading(false);
      return;
    }

    const imageUrl = supabase.storage.from("adsmedia").getPublicUrl(fileName)
      .data.publicUrl;

    const { error: insertError } = await supabase
      .from("ads")
      .insert([{ ...data, image_url: imageUrl }]);

    if (insertError) {
      console.error(insertError);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } else {
      reset();
      setSelectedImage(null);
      setPreviewImage(null);
      toast.success("تم إنشاء الإعلان بنجاح");
      router.push("/dashboard/ads");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="gap-[25px]">
        <div className="xl:col-span-3 2xl:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">إنشاء إعلان</h5>
              </div>
            </div>

            <div className="trezo-card-content sm:grid sm:grid-cols-2 sm:gap-[25px]">
              <div className="mb-[20px]">
                <label className="mb-[10px] block font-medium text-black dark:text-white">
                  العنوان (ar)
                </label>
                <input
                  {...register("title_ar", { required: true })}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all"
                />
                {errors.title_ar && <p className="text-red-500 mt-1">مطلوب</p>}
              </div>

              <div className="mb-[20px]">
                <label className="mb-[10px] block font-medium text-black dark:text-white">
                  العنوان (en)
                </label>
                <input
                  {...register("title_en", { required: true })}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all"
                />
                {errors.title_en && (
                  <p className="text-red-500 mt-1">Required</p>
                )}
              </div>

              <div className="mb-[20px]">
                <label className="mb-[10px] block font-medium text-black dark:text-white">
                  رابط الإعلان
                </label>
                <input
                  {...register("link", { required: true })}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all"
                />
                {errors.link && <p className="text-red-500 mt-1">مطلوب</p>}
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  مكان الإعلان
                </label>
                <select
                  {...register("location", { required: true })}
                  className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500"
                >
                  <option value="">اختر مكان الإعلان</option>
                  <option value="home">الصفحة الرئيسية</option>
                  <option value="gallery">معرض الصور</option>
                  <option value="profile">الملف الشخصي</option>
                  <option value="settings">الإعدادات</option>
                </select>
                {errors.location && <p className="text-red-500 mt-1">مطلوب</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-[10px] block font-medium text-black dark:text-white">
                  اختر الصوره
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
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>

                {previewImage && (
                  <div className="mt-[10px] flex flex-wrap gap-2">
                    <div className="relative w-[50px] h-[50px]">
                      <Image
                        src={previewImage}
                        alt="preview"
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs"
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewImage(null);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-[20px] sm:mt-[25px]">
              <button
                type="submit"
                disabled={loading}
                className="font-medium inline-block transition-all rounded-md 2xl:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
              >
                {loading ? "جارٍ الإرسال..." : "إنشاء"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
