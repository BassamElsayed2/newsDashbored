"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createProduct,
  ProductFormData,
} from "../../../../../../services/apiProduct";
import {
  Editor,
  EditorProvider,
  ContentEditableEvent,
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  HtmlButton,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";

const CreateProductForm: React.FC = () => {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [descriptionAr, setDescriptionAr] = useState<string>("");
  const [descriptionEn, setDescriptionEn] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>();

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("تم إنشاء المنتج بنجاح");
      router.push("/dashboard/e-commerce");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء المنتج");
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (selectedImages.length === 0) {
      toast.error("يرجى رفع صورة واحدة على الأقل");
      return;
    }
    createProductMutation.mutate({
      ...data,
      images: selectedImages,
      description_ar: descriptionAr,
      description_en: descriptionEn,
    });
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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="lg:grid lg:grid-cols-3 gap-[25px]">
          <div className="lg:col-span-12">
            <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h5 className="!mb-0">أضف منتج جديد </h5>
                </div>
              </div>

              <div className="trezo-card-content">
                <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      عنوان المنتج بالعربية
                    </label>
                    <input
                      type="text"
                      {...register("name_ar", { required: "هذا الحقل مطلوب" })}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="مثال: جوجل بكسل 7 برو"
                    />
                    {errors.name_ar && (
                      <span className="text-red-500 text-sm">
                        {errors.name_ar.message}
                      </span>
                    )}
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      عنوان المنتج بالانجليزية
                    </label>
                    <input
                      type="text"
                      {...register("name_en", { required: "هذا الحقل مطلوب" })}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="مثال: Google Pixel 7 Pro"
                    />
                    {errors.name_en && (
                      <span className="text-red-500 text-sm">
                        {errors.name_en.message}
                      </span>
                    )}
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      نوع المنتج
                    </label>
                    <select
                      {...register("type", { required: "هذا الحقل مطلوب" })}
                      className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500"
                    >
                      <option value="">اختر نوع المنتج</option>
                      <option value="digital">منتج رقمي</option>
                      <option value="physical">منتج مادي</option>
                    </select>
                    {errors.type && (
                      <span className="text-red-500 text-sm">
                        {errors.type.message}
                      </span>
                    )}
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      الماركة
                    </label>
                    <select
                      {...register("brand", { required: "هذا الحقل مطلوب" })}
                      className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500"
                    >
                      <option value="">اختر الماركة</option>
                      <option value="samsung">سامسونج</option>
                      <option value="apple">ابل</option>
                      <option value="huawei">هواوي</option>
                      <option value="oppo">اوبو</option>
                      <option value="xiaomi">شومي</option>
                    </select>
                    {errors.brand && (
                      <span className="text-red-500 text-sm">
                        {errors.brand.message}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      وصف المنتج بالعربية
                    </label>
                    <EditorProvider>
                      <Editor
                        value={descriptionAr}
                        onChange={(e: ContentEditableEvent) =>
                          setDescriptionAr(e.target.value)
                        }
                        style={{ minHeight: "200px" }}
                        className="rsw-editor"
                      >
                        <Toolbar>
                          <BtnUndo />
                          <BtnRedo />
                          <Separator />
                          <BtnBold />
                          <BtnItalic />
                          <BtnUnderline />
                          <BtnStrikeThrough />
                          <Separator />
                          <BtnNumberedList />
                          <BtnBulletList />
                          <Separator />
                          <BtnLink />
                          <BtnClearFormatting />
                          <HtmlButton />
                          <Separator />
                          <BtnStyles />
                        </Toolbar>
                      </Editor>
                    </EditorProvider>
                  </div>

                  <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      وصف المنتج بالانجليزية
                    </label>
                    <EditorProvider>
                      <Editor
                        value={descriptionEn}
                        onChange={(e: ContentEditableEvent) =>
                          setDescriptionEn(e.target.value)
                        }
                        style={{ minHeight: "200px" }}
                        className="rsw-editor"
                      >
                        <Toolbar>
                          <BtnUndo />
                          <BtnRedo />
                          <Separator />
                          <BtnBold />
                          <BtnItalic />
                          <BtnUnderline />
                          <BtnStrikeThrough />
                          <Separator />
                          <BtnNumberedList />
                          <BtnBulletList />
                          <Separator />
                          <BtnLink />
                          <BtnClearFormatting />
                          <HtmlButton />
                          <Separator />
                          <BtnStyles />
                        </Toolbar>
                      </Editor>
                    </EditorProvider>
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      السعر
                    </label>
                    <input
                      type="number"
                      {...register("price", {
                        required: "هذا الحقل مطلوب",
                        min: 0,
                      })}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="مثال: 99"
                    />
                    {errors.price && (
                      <span className="text-red-500 text-sm">
                        {errors.price.message}
                      </span>
                    )}
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      الكمية المتاحة
                    </label>
                    <input
                      type="number"
                      {...register("quantity", {
                        required: "هذا الحقل مطلوب",
                        min: 0,
                      })}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="مثال: 100"
                    />
                    {errors.quantity && (
                      <span className="text-red-500 text-sm">
                        {errors.quantity.message}
                      </span>
                    )}
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      الخصم
                    </label>
                    <input
                      type="number"
                      {...register("discount", { min: 0, max: 100 })}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="مثال: 20"
                    />
                    {errors.discount && (
                      <span className="text-red-500 text-sm">
                        {errors.discount.message}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      رفع صور المنتج
                    </label>

                    <div id="fileUploader">
                      <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[88px] px-[20px] border border-gray-200 dark:border-[#172036]">
                        <div className="flex items-center justify-center">
                          <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                            <i className="ri-upload-2-line"></i>
                          </div>
                          <p className="leading-[1.5]">
                            <strong className="text-black dark:text-white">
                              اضغط لرفع الصور
                            </strong>
                            <br /> يرجى رفع صور المنتج
                          </p>
                        </div>

                        <input
                          type="file"
                          id="fileInput"
                          multiple
                          accept="image/*"
                          className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                          onChange={handleFileChange}
                        />
                      </div>

                      {/* Image Previews */}
                      <div className="mt-[10px] flex flex-wrap gap-2">
                        {selectedImages.map((image, index) => (
                          <div
                            key={index}
                            className="relative w-[50px] h-[50px]"
                          >
                            <Image
                              src={URL.createObjectURL(image)}
                              alt="product-preview"
                              width={50}
                              height={50}
                              className="rounded-md"
                            />
                            <button
                              type="button"
                              className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs rtl:right-auto rtl:left-[-5px]"
                              onClick={() => handleRemoveImage(index)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="trezo-card mb-[25px]">
          <div className="trezo-card-content">
            <button
              type="button"
              onClick={() => router.back()}
              className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createProductMutation.isPending}
              className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                  add
                </i>
                {createProductMutation.isPending
                  ? "جاري الإنشاء..."
                  : "إنشاء المنتج"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateProductForm;
