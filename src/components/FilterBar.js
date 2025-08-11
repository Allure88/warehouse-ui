import React from 'react';

const FilterBar = ({ filters, setFilters, dateRange, resourceFilter, unitFilter, docs }) => {
  return (
    <div className="mb-3 d-flex gap-2 flex-wrap">
      {dateRange && (
        <>
          <input
            type="date"
            className="form-control"
            value={filters.dateFrom || ''}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            placeholder="От"
          />
          <input
            type="date"
            className="form-control"
            value={filters.dateTo || ''}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            placeholder="До"
          />
        </>
      )}
      {resourceFilter && (
        <input
          type="text"
          className="form-control"
          value={filters.resource || ''}
          onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
          placeholder="Фильтр по ресурсу"
        />
      )}
      {unitFilter && (
        <input
          type="text"
          className="form-control"
          value={filters.unit || ''}
          onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
          placeholder="Фильтр по единице"
        />
      )}
      {docs && (
      <input
        type="text"
        className="form-control"
        value={filters.number || ''}
        onChange={(e) => setFilters({ ...filters, number: e.target.value })}
        placeholder="Номер документа"
        style={{ width: '200px' }}
      />
      )}
    </div>
  );
};

export default FilterBar;