import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUnits } from '../services/unitsService';
import { createUnit, updateUnit, archiveUnit, returnToWorkUnit, deleteUnit } from '../services/unitsService';
import ToastError from '../components/ToastError';

const UnitFormPage = ({ mode }) => {
  const { unitDescription } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    UnitDescription: '',
    State: 'Active'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit') {
      const loadUnit = async () => {
        try {
          const res = await getUnits();
          if (res.data.Success) {
            const unit = res.data.Body.find(u => u.UnitDescription === decodeURIComponent(unitDescription));
            if (unit) setFormData(unit);
          }
        } catch (err) {
          setError('Не удалось загрузить единицу');
        }
      };
      loadUnit();
    }
  }, [mode, unitDescription]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = mode === 'create'
        ? await createUnit(formData)
        : await updateUnit(formData);
      if (res.data.Success) {
        navigate('/units');
      } else {
        setError(res.data.Errors.join(', '));
      }
    } catch (err) {
      setError('Ошибка сохранения');
    }
  };

  const handleArchive = async () => {
    try {
      const res = await archiveUnit(formData);
      if (res.data.Success) {
        setFormData(prev => ({ ...prev, State: 'Archived' }));
      } else {
        setError(res.data.Errors.join(', '));
      }
    } catch (err) {
      setError('Ошибка архивации');
    }
  };

  const handleReturnToWork = async () => {
    try {
      const res = await returnToWorkUnit(formData);
      if (res.data.Success) {
        setFormData(prev => ({ ...prev, State: 'Active' }));
      } else {
        setError(res.data.Errors.join(', '));
      }
    } catch (err) {
      setError('Ошибка возврата в работу');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить единицу измерения?')) {
      try {
        const res = await deleteUnit(formData);
        if (res.data.Success) {
          navigate('/units');
        } else {
          setError(res.data.Errors.join(', '));
        }
      } catch (err) {
        setError('Ошибка удаления');
      }
    }
  };

  return (
    <div>
      <h3>{mode === 'create' ? 'Добавить единицу измерения' : 'Редактировать единицу'}</h3>
      {error && <ToastError message={error} onClose={() => setError('')} />}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Название</label>
          <input
            type="text"
            name="UnitDescription"
            className="form-control"
            value={formData.UnitDescription}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Статус</label>
          <input
            type="text"
            className="form-control"
            value={formData.State}
            readOnly
          />
        </div>
        <button type="submit" className="btn btn-success me-2">Сохранить</button>
        {formData.State === 'Active' && (
          <button type="button" className="btn btn-warning me-2" onClick={handleArchive}>В архив</button>
        )}
        {formData.State === 'Archived' && (
          <button type="button" className="btn btn-info me-2 text-white" onClick={handleReturnToWork}>В работу</button>
        )}
        <button type="button" className="btn btn-danger me-2" onClick={handleDelete}>Удалить</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/units')}>Отмена</button>
      </form>
    </div>
  );
};

export default UnitFormPage;