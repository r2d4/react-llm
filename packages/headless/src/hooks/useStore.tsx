import { useEffect, useState } from "react";

// https://github.com/pmndrs/zustand/blob/65d2bc0660ab0d542cf9f97a3b004754ffa73f3e/docs/integrations/persisting-store-data.md?plain=1#L471-L488
const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default useStore;
