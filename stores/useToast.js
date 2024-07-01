import { defineStore } from "pinia";
import { useToast } from "@/components/ui/toast/use-toast";

export const useUseToast = defineStore("toast", {
  state: () => ({
    deleteToast: useToast({
      description: "Data Berhasil Dihapus",
      variant: "destructive",
    }),
  }),
});
