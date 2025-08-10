import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUnits } from '../services/unitsService';
import { createUnit, updateUnit, archiveUnit, returnToWorkUnit, deleteUnit } from '../services/unitsService';
import ToastError from '../components/ToastError';

const UnitFormPage = ({ mode }) => {
  const { name } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: '',
    State: 'Active'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit' && name) {
      const loadUnit = async () => {
        try {
          const decodedDesc = decodeURIComponent(name);
          const res = await getUnits();

          if (res.data.Success) {
            const unit = res.data.Body.Units.find(u => u.Name === decodedDesc);

            if (unit) {
              setFormData(unit);
            } else {
              setError(`Единица измерения "${decodedDesc}" не найдена`);
            }
          } else {
            setError('Не удалось загрузить список единиц измерения');
          }
        } catch (err) {
          setError('Ошибка при загрузке единицы: ' + err.message);
        } finally {
          setLoading(false);
        }
      };

      loadUnit();
    } else if (mode === 'create') {
      setLoading(false);
    }
  }, [mode, name]);

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
      setError('Ошибка при сохранении: ' + (err.response?.data?.Message || err.message));
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
      setError('Ошибка при архивации: ' + err.message);
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
      setError('Ошибка при возврате в работу: ' + err.message);
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
        setError('Ошибка при удалении: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center">Загрузка единицы измерения...</div>;
  }

  return (
    <div>
      <h3>{mode === 'create' ? 'Добавить единицу измерения' : 'Редактировать единицу'}</h3>
      {error && <ToastError message={error} onClose={() => setError('')} />}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Название</label>
          <input
            type="text"
            name="Name"
            className="form-control"
            value={formData.Name}
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