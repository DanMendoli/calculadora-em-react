import Button from "./components/Button";
import Screen from "./components/Screen";
import { useState } from "react";

const buttonValues = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

const toLocaleString = (value) =>
  String(value).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (value) => value.toString().replace(/\s/g, "");

function App() {
  const [calc, setCalc] = useState({
    sign: "",
    number: 0,
    result: 0,
  });

  const numberClickHandler = (event) => {
    event.preventDefault();
    const value = event.target.innerHTML;

    if (removeSpaces(calc.number).length < 16) {
      setCalc({
        ...calc,
        number:
          calc.number === 0 && value === "0"
            ? "0"
            : removeSpaces(calc.number) % 1 === 0
            ? toLocaleString(Number(removeSpaces(calc.number + value)))
            : toLocaleString(calc.number + value),
        result: !calc.sign ? 0 : calc.result,
      });
    }
  };

  const commaClickHandler = (event) => {
    event.preventDefault();
    const value = event.target.innerHTML;

    setCalc({
      ...calc,
      number: !calc.number.toString().includes(".")
        ? calc.number + value
        : calc.number,
    });
  };

  const signClickHandler = (event) => {
    setCalc({
      ...calc,
      sign: event.target.innerHTML,
      result: !calc.result && calc.number ? calc.number : calc.result,
      number: 0,
    });
  };

  const equalsClickHandler = () => {
    if (calc.sign && calc.number) {
      const math = (a, b, sign) =>
        sign === "+"
          ? a + b
          : sign === "-"
          ? a - b
          : sign === "X"
          ? a * b
          : a / b;

      setCalc({
        ...calc,
        result:
          calc.number === "0" && calc.sign === "/"
            ? "Cannot divide by zero"
            : toLocaleString(
                math(
                  Number(removeSpaces(calc.result)),
                  Number(removeSpaces(calc.number)),
                  calc.sign
                )
              ),
        sign: "",
        number: 0,
      });
    }
  };

  const invertClickHandler = () => {
    setCalc({
      ...calc,
      number: calc.number ? toLocaleString(removeSpaces(calc.number) * -1) : 0,
      result: calc.result ? toLocaleString(removeSpaces(calc.result) * -1) : 0,
      sign: "",
    });
  };

  const percentClickHandler = () => {
    let number = calc.number ? parseFloat(removeSpaces(calc.number)) : 0;
    let result = calc.result ? parseFloat(removeSpaces(calc.result)) : 0;

    setCalc({
      ...calc,
      number: (number /= Math.pow(100, 1)),
      result: (result /= Math.pow(100, 1)),
      sign: "",
    });
  };

  const resetClickHandler = () => {
    setCalc({
      ...calc,
      sign: "",
      number: 0,
      result: 0,
    });
  };

  return (
    <>
      <div className="flex flex-col h-screen justify-center items-center">
        <h1 className="text-4xl text-gray-700 font-bold mb-4">CALCULATOR</h1>
        <div className="bg-gray-800 p-4 rounded-lg border-4 border-gray-700">
          <Screen value={calc.number ? calc.number : calc.result} />
          <div className="grid grid-cols-4 gap-2">
            {buttonValues.flat().map((button) => {
              return (
                <Button
                  className={
                    button === "=" ? "calc-red-button" : "calc-blue-button"
                  }
                  key={button}
                  value={button}
                  onClick={
                    button === "C"
                      ? resetClickHandler
                      : button === "+-"
                      ? invertClickHandler
                      : button === "%"
                      ? percentClickHandler
                      : button === "="
                      ? equalsClickHandler
                      : button === "+" ||
                        button === "-" ||
                        button === "X" ||
                        button === "/"
                      ? signClickHandler
                      : button === "."
                      ? commaClickHandler
                      : numberClickHandler
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
