"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Editor,
  EditorProvider,
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
import {
  createProperty,
  uploadPropertyImages,
} from "../../../../../../services/apiProperty";

interface PropertyFormData {
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  status: string;
  price: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  addressAr: string;
  addressEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

const AddPropertyForm: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [descriptionAr, setDescriptionAr] = useState<string>("");
  const [descriptionEn, setDescriptionEn] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    defaultValues: {
      status: "for_rent",
      type: "apartment",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert selected images array to FileList
      const dataTransfer = new DataTransfer();
      selectedImages.forEach((image) => {
        dataTransfer.items.add(image);
      });

      // Upload images first
      const imageUrls = await uploadPropertyImages(dataTransfer.files);

      // Create property with form data and image URLs
      await createProperty(
        {
          ...data,
          descriptionAr,
          descriptionEn,
          images: imageUrls,
        },
        imageUrls
      );

      // Show success toast
      toast.success("تم إنشاء العقار بنجاح", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#10B981",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });

      // Redirect to properties list on success
      router.push("/dashboard/real-estate");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء العقار";
      setError(errorMessage);

      // Show error toast
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#EF4444",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-content">
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  اسم العقار بالعربية
                </label>
                <input
                  type="text"
                  {...register("nameAr", { required: "هذا الحقل مطلوب" })}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="اسم العقار بالعربية"
                />
                {errors.nameAr && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.nameAr.message}
                  </span>
                )}
              </div>
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  اسم العقار بالانجليزية
                </label>
                <input
                  type="text"
                  {...register("nameEn", { required: "هذا الحقل مطلوب" })}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="اسم العقار بالانجليزية"
                />
                {errors.nameEn && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.nameEn.message}
                  </span>
                )}
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  حالة العقار
                </label>
                <select
                  {...register("status", { required: "هذا الحقل مطلوب" })}
                  className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500"
                >
                  <option value="for_rent">للإيجار</option>
                  <option value="for_sale">للبيع</option>
                </select>
                {errors.status && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.status.message}
                  </span>
                )}
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  سعر العقار
                </label>
                <input
                  type="text"
                  {...register("price", { required: "هذا الحقل مطلوب" })}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="$18,000"
                />
                {errors.price && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </span>
                )}
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  نوع العقار
                </label>
                <select
                  {...register("type", { required: "هذا الحقل مطلوب" })}
                  className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500"
                >
                  <option value="apartment">شقة</option>
                  <option value="villa">فيلا</option>
                  <option value="house">منزل</option>
                  <option value="commercial">تجاري</option>
                  <option value="land">أرض</option>
                  <option value="other">أخرى</option>
                </select>
                {errors.type && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.type.message}
                  </span>
                )}
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  عدد الغرف
                </label>
                <input
                  type="number"
                  {...register("bedrooms", { required: "هذا الحقل مطلوب" })}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="عدد الغرف"
                />
                {errors.bedrooms && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.bedrooms.message}
                  </span>
                )}
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  عدد الحمامات
                </label>
                <input
                  type="number"
                  {...register("bathrooms", { required: "هذا الحقل مطلوب" })}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="عدد الحمامات"
                />
                {errors.bathrooms && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.bathrooms.message}
                  </span>
                )}
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  المساحة
                </label>
                <input
                  type="text"
                  {...register("area", { required: "هذا الحقل مطلوب" })}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="المساحة"
                />
                {errors.area && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.area.message}
                  </span>
                )}
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  العنوان بالعربية
                </label>
                <input
                  type="text"
                  {...register("addressAr", { required: "هذا الحقل مطلوب" })}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="العنوان بالعربية"
                />
                {errors.addressAr && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.addressAr.message}
                  </span>
                )}
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  العنوان بالانجليزية
                </label>
                <input
                  type="text"
                  {...register("addressEn", { required: "هذا الحقل مطلوب" })}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="العنوان بالانجليزية"
                />
                {errors.addressEn && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.addressEn.message}
                  </span>
                )}
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  المدينة بالعربية
                </label>
                <input
                  type="text"
                  {...register("cityAr", { required: "هذا الحقل مطلوب" })}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="المدينة بالعربية"
                />
                {errors.cityAr && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.cityAr.message}
                  </span>
                )}
              </div>
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  المدينة بالانجليزية
                </label>
                <input
                  type="text"
                  {...register("cityEn", { required: "هذا الحقل مطلوب" })}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="المدينة بالانجليزية"
                />
                {errors.cityEn && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.cityEn.message}
                  </span>
                )}
              </div>

              <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  الوصف بالعربية
                </label>
                <EditorProvider>
                  <Editor
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
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
                  الوصف بالانجليزية
                </label>
                <EditorProvider>
                  <Editor
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
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
                  صور العقار
                </label>
                <div id="fileUploader">
                  <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[88px] px-[20px] border border-gray-200 dark:border-[#172036]">
                    <div className="flex items-center justify-center">
                      <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                        <i className="ri-upload-2-line"></i>
                      </div>
                      <p className="leading-[1.5]">
                        <strong className="text-black dark:text-white">
                          انقر للرفع
                        </strong>
                        <br /> هنا
                      </p>
                    </div>
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                      multiple
                    />
                  </div>

                  {/* Image Previews */}
                  <div className="mt-[10px] flex flex-wrap gap-2">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative w-[50px] h-[50px]">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="property-preview"
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

            <div className="mt-[20px] md:mt-[25px]">
              <button
                type="button"
                onClick={() => router.back()}
                className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                  <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                    add
                  </i>
                  {isSubmitting ? "جاري الإنشاء..." : "انشاء عقار"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddPropertyForm;
