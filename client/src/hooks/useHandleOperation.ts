import { enqueueSnackbar } from "notistack";

export default function useHandleOperation(
  reset,
  setStateObjectOrArray,
  stateObjectOrArray
) {
  const executeHandle = async (
    operation,
    action,
    body,
    url,
    indexOrKey = 0,
    isObject,
    attributeNameForMappingObject
  ) => {
    const data = await action(body, url);
    if (operation === "create" && data) {
      const tableName = Object.keys(data)[0];

      if (isObject) {
        const newStateObject = { ...stateObjectOrArray };
        newStateObject[data[tableName][attributeNameForMappingObject]] =
          data[tableName];

        setStateObjectOrArray(newStateObject);
      } else {
        setStateObjectOrArray([...stateObjectOrArray, data[tableName]]);
      }

      if (reset) {
        reset();
      }
    }

    if (operation === "get" && data) {
      const tableName = Object.keys(data)[0];
      setStateObjectOrArray(data[tableName]);
      enqueueSnackbar(`Success!`, {
        variant: "success",
        autoHideDuration: 1000,
      });
    }

    if (operation === "delete" && data) {
      if (isObject) {
        const newStateObjectOrArray = { ...stateObjectOrArray };
        delete newStateObjectOrArray[indexOrKey];
        setStateObjectOrArray(newStateObjectOrArray);
      } else {
        setStateObjectOrArray([
          ...stateObjectOrArray.slice(0, indexOrKey),
          ...stateObjectOrArray.slice(indexOrKey + 1),
        ]);
      }
    }

    if (data) {
      return true;
    }
    return false;
  };

  return { executeHandle };
}
