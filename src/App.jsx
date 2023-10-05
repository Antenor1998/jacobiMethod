import { useState } from 'react'
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Textarea, Switch, Button } from "@nextui-org/react";
import { Input } from "@nextui-org/input";

import './App.css'

function App() {
  const [matrixA, setMatrixA] = useState([
    [9, 2, -1],
    [7, 8, 5],
    [3, 4, -10],
  ]);
  // [3, -0.1, -1.2],
  //   [0.1, 7, -0.3],
  //   [0.3, -0.2, 10],
  const [vectorB, setVectorB] = useState([-2, 3, 6]);
  const [solution, setSolution] = useState([]);
  const [iterations, setIterations] = useState(0);
  const [iterationResults, setIterationResults] = useState([]);
  const [decimalPlaces, setDecimalPlaces] = useState(5); // numero de decimales a contemplar
  const formatNumber = (number) => {
    return parseFloat(number.toFixed(decimalPlaces));
  };




  const jacobiMethod = (A, b, maxIterations, tolerance) => {
    const n = A.length;
    let x = new Array(n).fill(0);
    let x_new = new Array(n).fill(0); // Usamos
    const results = [];

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      const result = { iteration: iteration + 1, x: [...x] }  
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
          if (j !== i) {
            sum += A[i][j] * (i === 0 ? x[j] : x_new[j]);
          }
        }
        x_new[i] = formatNumber((b[i] - sum) / A[i][i]);
        console.log(b[i], '-', sum, '/', A[i][i]);
        result.x[i] = x_new[i]; // Almacenar el valor de x para esta iteración
      }

      results.push(result);
      let shouldStop = true;
      for (let i = 0; i < n; i++) {
        if (x_new[i] !== x[i]) {
          shouldStop = false;
          break;
        }
      }

      if (shouldStop) {
        break;
      }
      
      x = [...x_new];

      // if (maxError < tolerance) {
      //   setIterations(iteration + 1);
      //   setIterationResults(results);
      //   return x;
      // }
    }

    setIterations(maxIterations);
    setIterationResults(results);
    return x;
  }



  const handleSolve = () => {
    const maxIterations = 100; // Números de iteraciones
    const tolerance = 1e-9

    const result = jacobiMethod(matrixA, vectorB, maxIterations, tolerance);
    setSolution(result);
  };


  const handleMatrixChange = (e) => {
    const text = e.target.value;
    const lines = text.split("\n");
    const newMatrixA = lines.map((line) =>
      line.split(" ").map((value) => {
        const floatValue = value.replace(',', '.');
        return !isNaN(floatValue) ? floatValue : 0;
      })
    );
    setMatrixA(newMatrixA);
  };
  const handleVectorBChange = (e) => {
    const text = e.target.value;
    const values = text.split(" ").map((value) => {
      const floatValue = value.replace(',', '.');
      return !isNaN(floatValue) ? floatValue : 0;
    });
    setVectorB(values);
  };


  const matrixAText = matrixA
    .map((row) => row.map((value) => value.toString()).join(" "))
    .join("\n");


  return (
    <div className="flex">
      <div className="basis-1/3 p-4">
        <Card>
          <CardBody>
            <h1>Jacobi Solver</h1>
              <div className='h-auto mb-4'>
                <label>Matrix A:</label>

              <Textarea
                label="Formula" labelPlacement="outside" placeholder="Introduzca la formula"
                className="h-auto"
                  rows="3"
                  cols="15"
                  value={matrixAText}
                  onChange={handleMatrixChange}
                />
              </div>
              <div className=' flex h-auto mb-4'>
                <label>Vector b:</label>
              <Input
                  className='flex-auto'
                  type="text"
                  value={vectorB.join(" ")}
                onChange={handleVectorBChange}
                />
              </div>



            {/* Resultados */}
            <p className="result">Iterations: {iterations}</p>
            <p className="result">Solution: {solution.join(", ")}</p>

            <CardFooter>
              <Button color="success" onClick={handleSolve}>Resolver</Button>  
            </CardFooter>

            {/* Tabla de resultados de iteraciones */}
          </CardBody>
        </Card>
      </div>
        <div className='p-4 basis-full'>
        <Table>
            <TableHeader>
              <TableColumn>Iteration</TableColumn>
              {matrixA[0].map((_, index) => (
                <TableColumn key={index}>x{index + 1}</TableColumn>
              ))}

            </TableHeader>
            <TableBody>
            {iterationResults.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.iteration}</TableCell>
                {result.x.map((value, i) => (
                  <TableCell key={i}>{value.toFixed(6)}</TableCell>
                ))}
              </TableRow>
            ))}
            </TableBody>
        </Table>
        </div>

    </div>

  )
}

export default App
