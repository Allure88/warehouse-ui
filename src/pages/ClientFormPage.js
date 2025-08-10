import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClients } from '../services/clientsService';
import { createClient, updateClient, archiveClient, returnToWorkClient, deleteClient } from '../services/clientsService';
import ToastError from '../components/ToastError';

const ClientFormPage = ({ mode }) => {
  const { name } = useParams();
  const navigate = useNavigate();

  // Инициализация formData с пустыми значениями
  const [formData, setFormData] = useState({
    Name: '',
    Adress: '',
    State: 'Active'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(mode === 'edit'); // Только при редактировании

  useEffect(() => {
    if (mode === 'edit' && name) {
      const loadClient = async () => {
        try {
          const decodedName = decodeURIComponent(name); // Декодируем имя
          const res = await getClients();

          if (res.data.Success) {
            const client = res.data.Body.Clients.find(c => c.Name === decodedName);

            if (client) {
              setFormData(client); // Устанавливаем данные в форму
            } else {
              setError(`Клиент с именем "${decodedName}" не найден`);
              setLoading(false);
            }
          } else {
            setError('Не удалось загрузить список клиентов');
          }
        } catch (err) {
          setError('Ошибка при загрузке клиента: ' + err.message);
        } finally {
          setLoading(false);
        }
      };

      loadClient();
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
        ? await createClient(formData)
        : await updateClient(formData);

      if (res.data.Success) {
        navigate('/clients');
      } else {
        setError(res.data.Errors.join(', '));
      }
    } catch (err) {
      setError('Ошибка при сохранении: ' + (err.response?.data?.Message || err.message));
    }
  };

  const handleArchive = async () => {
    try {
      const res = await archiveClient(formData);
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
      const res = await returnToWorkClient(formData);
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
    if (window.confirm('Удалить клиента?')) {
      try {
        const res = await deleteClient(formData);
        if (res.data.Success) {
          navigate('/clients');
        } else {
          setError(res.data.Errors.join(', '));
        }
      } catch (err) {
        setError('Ошибка при удалении: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center">Загрузка...</div>;
  }

  return (
    <div>
      <h3>{mode === 'create' ? 'Добавить клиента' : 'Редактировать клиента'}</h3>
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
            readOnly={mode === 'create' ? false : true}
  

          />
        </div>
        <div className="mb-3">
          <label>Адрес</label>
          <input
            type="text"
            name="Adress"
            className="form-control"
            value={formData.Adress}
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
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/clients')}>Отмена</button>
      </form>
    </div>
  );
};

export default ClientFormPage;