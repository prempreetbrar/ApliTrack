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
    attributeNameForMappingObject,
    config,
    disableSnackbar,
    additionalAttributes
  ) => {
    const data = await action(body, url, config);
    if (operation === "create" && data) {
      const tableName = Object.keys(data)[0];

      if (isObject) {
        const newStateObject = { ...stateObjectOrArray };
        newStateObject[data[tableName][attributeNameForMappingObject]] =
          data[tableName];

        setStateObjectOrArray(newStateObject);
      } else {
        let newItem = data[tableName];
        if (additionalAttributes) {
          newItem = { ...newItem, ...additionalAttributes };
        }
        setStateObjectOrArray([...stateObjectOrArray, newItem]);
      }

      if (reset) {
        reset();
      }
    }

    if (operation === "get" && data) {
      const tableName = Object.keys(data)[0];
      setStateObjectOrArray(data[tableName]);
      if (!disableSnackbar) {
        enqueueSnackbar(`Success!`, {
          variant: "success",
          autoHideDuration: 1000,
        });
      }
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

    if (operation === "update" && data) {
      const tableName = Object.keys(data)[0];
      console.log(data, data[tableName], tableName);
      setStateObjectOrArray([
        ...stateObjectOrArray.slice(0, indexOrKey),
        data[tableName],
        ...stateObjectOrArray.slice(indexOrKey + 1, stateObjectOrArray.length),
      ]);
    }

    if (data) {
      return true;
    }
    return false;
  };

  return { executeHandle };
}
