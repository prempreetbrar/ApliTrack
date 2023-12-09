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
    index = 0,
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

        console.log(newStateObject);
        setStateObjectOrArray(newStateObject);
      } else {
        setStateObjectOrArray([...stateObjectOrArray, data[tableName]]);
      }

      if (reset) {
        reset();
      }
    }

    if (operation === "delete" && data) {
      console.log("before deletion", stateObjectOrArray);
      console.log(
        stateObjectOrArray.slice(0, index),
        stateObjectOrArray.slice(index + 1)
      );
      setStateObjectOrArray([
        ...stateObjectOrArray.slice(0, index),
        ...stateObjectOrArray.slice(index + 1),
      ]);
    }

    if (data) {
      return true;
    }
    return false;
  };

  return { executeHandle };
}
