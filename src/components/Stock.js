import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { CirclesWithBar } from "react-loader-spinner";
import styled from "styled-components";
import { NewsSection } from "./news-section/NewsSection";
import { SearchBar } from "./SearchBar";
import { API_KEY } from "./common";
export const StockSelect = () => {
  const [stockData, setStockData] = useState(null);
  const [loader, setLoader] = useState(true);
  const [symbol, setSymbolUpdate] = useState("MSFT");
  const [stockName, setStockName] = useState("Microsoft");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const StockSymbol = symbol;
        let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${StockSymbol}&outputsize=full&apikey=${API_KEY}`;
        let stockChartXValuesFunction = [];
        let stockChartYValuesFunction = [];

        const response = await fetch(API_Call);
        const data = await response.json();
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
    // setLoader(false);
    fetchData();
  }, [symbol]);
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
    <div className="stock-analyser-page">
      <NewsSection />
      <div className="stock">
        <h1>Stock Market</h1>
        <SearchBar
          setSymbolUpdate={setSymbolUpdate}
          setStockName={setStockName}
        />
        <h2>{stockName}</h2>
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
            layout={{ width: 720, height: 440 }}
          />
        </div>
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
