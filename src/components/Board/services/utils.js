import * as XLSX from "xlsx";

function compose(...fns) {
  return (arg) => fns.reduce((acc, fn) => fn(acc), arg);
}

function partialRight(fn, ...args) {
  return (...leftArgs) => fn(...leftArgs, ...args);
}

function addInArrayAtPosition(array, element, position) {
  const arrayCopy = [...array];
  arrayCopy.splice(position, 0, element);
  return arrayCopy;
}

function removeFromArrayAtPosition(array, position) {
  return array.reduce(
    (acc, value, idx) => (idx === position ? acc : [...acc, value]),
    []
  );
}

function changeElementOfPositionInArray(array, from, to) {
  const removeFromArrayAtPositionFrom = partialRight(
    removeFromArrayAtPosition,
    from
  );
  const addInArrayAtPositionTo = partialRight(
    addInArrayAtPosition,
    array[from],
    to
  );

  return compose(removeFromArrayAtPositionFrom, addInArrayAtPositionTo)(array);
}

function identity(value) {
  return value;
}

function when(value, predicate = identity) {
  return function callback(callback) {
    if (predicate(value)) return callback(value);
  };
}

function replaceElementOfArray(array) {
  return function (options) {
    return array.map((element) =>
      options.when(element) ? options.for(element) : element
    );
  };
}

function pickPropOut(object, prop) {
  return Object.keys(object).reduce((obj, key) => {
    return key === prop ? obj : { ...obj, [key]: object[key] };
  }, {});
}

const handleXLSXTOJSON = async ({ sheet }, callback) => {
  const XLSXTOJSON = new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const jsonResult = jsonData.map((row) =>
        row.reduce((acc, cell, index) => {
          const header = jsonData[0][index];
          if (header) {
            acc[header] = cell;
          }
          return acc;
        }, {})
      );
      resolve(jsonResult);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(sheet);
  });
  const json = await XLSXTOJSON;
  callback(json);
};

export {
  addInArrayAtPosition,
  changeElementOfPositionInArray,
  handleXLSXTOJSON,
  partialRight,
  pickPropOut,
  removeFromArrayAtPosition,
  replaceElementOfArray,
  when,
};
