import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdmissionDocs } from '../services/admissionDocsService';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import ToastError from '../components/ToastError';

const AdmissionDocsPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    number: '',
    resource: '',
    unit: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdmissionDocs();
        if (res.data.Success) {
          setData(res.data.Body);
          setFilteredData(res.data.Body);
        } else {
          setError(res.data.Errors.join(', '));
        }
      } catch (err) {
        setError('Ошибка подключения к серверу');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = data;

    if (filters.dateFrom) {
      result = result.filter(item => new Date(item.Date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      result = result.filter(item => new Date(item.Date) <= new Date(filters.dateTo));
    }
    if (filters.number) {
      result = result.filter(item => item.Number.toLowerCase().includes(filters.number.toLowerCase()));
    }
    if (filters.resource) {
      result = result.filter(item => item.ResBody && item.ResBody.Resource.Name.toLowerCase().includes(filters.resource.toLowerCase()));
    }
    if (filters.unit) {
      result = result.filter(item => item.ResBody && item.ResBody.UnitOfMeasurement.UnitDescription.toLowerCase().includes(filters.unit.toLowerCase()));
    }

    setFilteredData(result);
  }, [filters, data]);

  return (
    <div>
      <h3>Поступления</h3>
      <div className="d-flex justify-content-between mb-3">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          dateRange
          resourceFilter
          unitFilter
        />
      </div>
      <Link to="/admission/create" className="btn btn-primary">Создать документ</Link>
      {error && <ToastError message={error} onClose={() => setError('')} />}
      <DataTable
        data={filteredData}
        columns={[
          { header: 'Номер', accessor: 'Number' },
          { header: 'Дата', accessor: 'Date' },
          { header: 'Ресурс', accessor: 'ResBody.Resource.Name' },
          { header: 'Единица измерения', accessor: 'ResBody.UnitOfMeasurement.UnitDescription' },
          { header: 'Количество', accessor: 'ResBody.Quantity' },
        ]}
        onRowClick={(row) => window.location.href = `/admission/edit/${row.Number}`}
      />
    </div>
  );
};

export default AdmissionDocsPage;