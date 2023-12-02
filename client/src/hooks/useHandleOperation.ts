export default function useHandleOperation(
  reset,
  index = null,
  setOnUpdateSectionArray,
  onUpdateSectionArray
) {
  const executeHandle = async (operation, action, body, url) => {
    const data = await action(body, url);
    if (operation === "create" && data) {
      const tableName = Object.keys(data)[0];
      setOnUpdateSectionArray([...onUpdateSectionArray, data[tableName]]);
      reset();
    }

    if (operation === "delete" && data) {
      setOnUpdateSectionArray([
        ...onUpdateSectionArray.slice(0, index),
        ...onUpdateSectionArray.slice(index + 1),
      ]);
    }
  };

  return { executeHandle };
}
