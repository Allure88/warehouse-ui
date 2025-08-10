import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResources } from '../services/resourcesService';
import { createResource, updateResource, archiveResource, returnToWorkResource, deleteResource } from '../services/resourcesService';
import ToastError from '../components/ToastError';

const ResourceFormPage = ({ mode }) => {
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
      const loadResource = async () => {
        try {
          const decodedName = decodeURIComponent(name);
          const res = await getResources();

          if (res.data.Success) {
            const resource = res.data.Body.Resources.find(r => r.Name === decodedName);

            if (resource) {
              setFormData(resource);
            } else {
              setError(`Ресурс с именем "${decodedName}" не найден`);
            }
          } else {
            setError('Не удалось загрузить список ресурсов');
          }
        } catch (err) {
          setError('Ошибка при загрузке ресурса: ' + err.message);
        } finally {
          setLoading(false);
        }
      };

      loadResource();
    } else if (mode === 'create') {
      setLoading(false); // Для создания не нужна загрузка
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
        ? await createResource(formData)
        : await updateResource(formData);

      if (res.data.Success) {
        navigate('/resources');
      } else {
        setError(res.data.Errors.join(', '));
      }
    } catch (err) {
      setError('Ошибка при сохранении: ' + (err.response?.data?.Message || err.message));
    }
  };

  const handleArchive = async () => {
    try {
      const res = await archiveResource(formData);
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
      const res = await returnToWorkResource(formData);
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
    if (window.confirm('Удалить ресурс?')) {
      try {
        const res = await deleteResource(formData);
        if (res.data.Success) {
          navigate('/resources');
        } else {
          setError(res.data.Errors.join(', '));
        }
      } catch (err) {
        setError('Ошибка при удалении: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center">Загрузка ресурса...</div>;
  }

  return (
    <div>
      <h3>{mode === 'create' ? 'Добавить ресурс' : 'Редактировать ресурс'}</h3>
      {error && <ToastError message={error} onClose={() => setError('')} />}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Имя</label>
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
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/resources')}>Отмена</button>
      </form>
    </div>
  );
};

export default ResourceFormPage;