import { useCallback } from "react";
import { Id, toast } from "react-toastify";

export const useDisplayToast = (
  setCsvData: (_data: string[][]) => void,
  reset: (_values?: any) => void
) => {
  const displayToast = useCallback(
    ({
      dataRes,
      status,
      error,
      id,
      typeCard,
    }: {
      dataRes: string[][] | null;
      status: number;
      error: string | null;
      id: Id;
      typeCard: string | undefined;
    }) => {
      if (dataRes && status === 200) {
        setCsvData(dataRes);
        toast.success("Génération terminée", { autoClose: 3000 });
        // Restore form reset functionality
        reset({ typeCard: typeCard });
      } else if (error && status === 500) {
        toast.dismiss(id);
        toast.error(error);
      } else {
        toast.dismiss(id);
        toast.error("Une erreur inattendue s'est produite");
      }
    },
    [reset, setCsvData]
  );

  return { displayToast };
};
