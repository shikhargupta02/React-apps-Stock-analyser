import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { CirclesWithBar } from "react-loader-spinner";
import styled from "styled-components";
export const StockSelect = () => {
  const [stockData, setStockData] = useState(null);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_KEY = "RZOSIHBR6MCJ0GG8";
        const StockSymbol = "MSFT";
        let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${StockSymbol}&outputsize=compact&apikey=${API_KEY}`;
        let stockChartXValuesFunction = [];
        let stockChartYValuesFunction = [];

        const response = await fetch(API_Call);
        const data = await response.json();
        debugger;
        for (let key in data["Time Series (Daily)"]) {
          stockChartXValuesFunction.push(key);
          stockChartYValuesFunction.push(
            data["Time Series (Daily)"][key]["1. open"]
          );
        }
        setStockData({
          xValues: stockChartXValuesFunction,
          yValues: stockChartYValuesFunction,
        });
        setLoader(false);
      } catch (e) {
        console.log(e);
      }
    };
    // fetchData();
  }, []);
  return loader ? (
    <LoaderWrapper>
      <CirclesWithBar
        height="100"
        width="100"
        color="#4fa94d"
        outerCircleColor="#4fa94d"
        innerCircleColor="#4fa94d"
        barColor="#4fa94d"
        ariaLabel="circles-with-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </LoaderWrapper>
  ) : (
    <div className="stock">
      <h1>Stock Market</h1>
      <h2>Microsoft</h2>
      <div>
        <Plot
          data={[
            {
              x: stockData.xValues,
              y: stockData.yValues,
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "red" },
            },
          ]}
          layout={{ width: 720, height: 440, title: "A Fancy Plot" }}
        />
      </div>
    </div>
  );
};
const LoaderWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
