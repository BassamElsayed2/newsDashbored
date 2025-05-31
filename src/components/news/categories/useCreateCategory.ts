import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import supabase from "../../../../services/supabase";

export function useAddCategory() {
  const queryClient = useQueryClient();

  const { mutate: addCategory, isPending } = useMutation({
    mutationFn: async ({
      name_ar,
      name_en,
    }: {
      name_ar: string;
      name_en: string;
    }) => {
      const { error } = await supabase
        .from("categories")
        .insert([{ name_ar, name_en }]);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("تمت إضافة التصنيف بنجاح");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error("فشل في إضافة التصنيف: " + error.message);
    },
  });

  return { addCategory, isPending };
}
