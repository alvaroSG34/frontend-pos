import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Página no encontrada</h1>
      <p>La ruta que estás buscando no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
};

export default ErrorPage;
