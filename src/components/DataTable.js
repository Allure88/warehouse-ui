import React from 'react';

const DataTable = ({ data = [], columns }) => {
  if (!data.length) return <p>Нет данных</p>;

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col, i) => {
              const value = col.accessor
                .split('.')
                .reduce((acc, key) => acc?.[key], row);
              return <td key={i}>{value !== undefined ? value : ''}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;