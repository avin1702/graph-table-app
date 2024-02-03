import React from 'react';
import Plot from 'react-plotly.js'

interface ChartProps {
  numericValues: any[];
}

const Chart: React.FC<ChartProps> = ({ numericValues }) => {

  console.log(numericValues)
  const labels = numericValues.map(value => value.title);
  const data = numericValues.map(value => value.stock);
  
  let plotData:any = [
    {
      x: labels,
      y: data,
      type: 'bar',
      marker: {
        color: 'rgba(75,192,192,1)',
      },
    },
  ];

  
  const layout = {
    xaxis: {
      title: 'Product',
    },
    yaxis: {
      title: 'Stock',
    },
    width: 400, 
    height: 300,
  };
  return (
    <div>
      <h2>Stock of Products</h2>
      <Plot data={plotData} layout={layout} />
    </div>
  );
};

export default Chart;