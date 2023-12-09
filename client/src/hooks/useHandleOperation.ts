export default function useHandleOperation(
  reset,
  setOnUpdateSectionArray,
  onUpdateSectionArray
) {
  const executeHandle = async (operation, action, body, url, index = 0) => {
    const data = await action(body, url);
    if (operation === "create" && data) {
      const tableName = Object.keys(data)[0];
      setOnUpdateSectionArray([...onUpdateSectionArray, data[tableName]]);

      reset();
    }

    if (operation === "delete" && data) {
      console.log("before deletion", onUpdateSectionArray);
      console.log(
        onUpdateSectionArray.slice(0, index),
        onUpdateSectionArray.slice(index + 1)
      );
      setOnUpdateSectionArray([
        ...onUpdateSectionArray.slice(0, index),
        ...onUpdateSectionArray.slice(index + 1),
      ]);
    }

    if (data) {
      return true;
    }
    return false;
  };

  return { executeHandle };
}
