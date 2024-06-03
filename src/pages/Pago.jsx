import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../components/carritoContext/CarritoContext';
import { getUsuario, pagar } from '../components/apis/Api';
import TruncatedText from '../components/truncarTexto/TruncarTexto';
import { handleDecrementItem, handleIncrementItem, handleEliminarItem } from '../components/logic/FuncCarrito';

const PasarelaPago = () => {
    const { itemsCarrito = [], setItemsCarrito } = useCarrito(); // Asegúrate de que itemsCarrito sea un array
    const [usuario, setUsuario] = useState({});
    const [metodoPago, setMetodoPago] = useState('tarjeta_credito');
    const [mensajeExito, setMensajeExito] = useState('');
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const data = await getUsuario(token);
                    setUsuario(data);
                }
            } catch (error) {
                console.error('Error al obtener los detalles del usuario:', error);
            }
        };

        fetchUsuario();

        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePago = async () => {
        try {
            await pagar({
                direccion_envio: formatAddress(usuario),
                direccion_facturacion: formatAddress(usuario),
                metodo_pago: metodoPago
            });
            setItemsCarrito([]);
            setMensajeExito('Pedido realizado correctamente');
            setTimeout(() => {
                navigate('/perfil');
            }, 5000); // Redirigir después de 5 segundos
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Hubo un problema al procesar el pago. Inténtalo de nuevo.');
        }
    };

    const formatAddress = (usuario) => {
        if (!usuario.direccion || !usuario.ciudad || !usuario.codigo_postal || !usuario.pais) return 'No disponible';
        return `${usuario.direccion}, ${usuario.ciudad}, ${usuario.codigo_postal}, ${usuario.pais}`;
    };

    const precioTotal = itemsCarrito.reduce((total, item) => total + parseFloat(item.producto.precio) * item.cantidad, 0);

    const getImageUrl = (url) => {
        const baseURL = 'http://127.0.0.1:8000';
        if (!url) {
            return `${baseURL}/default-image.jpg`; // Ruta de una imagen por defecto si url es undefined
        }
        if (url.startsWith(baseURL)) {
            return url;
        }
        return `${baseURL}${url}`;
    };

    const getMaxLength = (width) => {
        if (width < 1025) return 25;
        if (width < 1441) return 30;
        return 40;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl flex">
                <div className="w-1/2 pr-4">
                    <h2 className="text-3xl font-bold mb-6 text-custom-azul">Pasarela de Pago</h2>

                    {mensajeExito && (
                        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
                            {mensajeExito}
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Nombre:</label>
                        <p className="text-lg text-gray-900 mb-2">{`${usuario.first_name} ${usuario.last_name}`}</p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Dirección de Envío:</label>
                        <p className="text-lg text-gray-900 mb-2">{formatAddress(usuario)}</p>
                        <Link to='/perfil' className="bg-custom-azul text-white px-4 py-2 rounded-md hover:bg-custom-naranja transition duration-300">
                            Modificar Dirección
                        </Link>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Dirección de Facturación:</label>
                        <p className="text-lg text-gray-900 mb-2">{formatAddress(usuario)}</p>
                        <Link to='/perfil' className="bg-custom-azul text-white px-4 py-2 rounded-md hover:bg-custom-naranja transition duration-300">
                            Modificar Facturación
                        </Link>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Método de Pago:</label>
                        <select
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-custom-azul"
                        >
                            <option value="tarjeta_credito">Tarjeta de Crédito</option>
                            <option value="efectivo">Efectivo</option>
                        </select>
                    </div>
                    
                    <button 
                        onClick={handlePago} 
                        className="bg-custom-naranja text-black px-4 py-2 rounded-md w-full hover:bg-orange-500 transition duration-300"
                    >
                        Realizar Pago
                    </button>
                </div>
                <div className="w-1/2 pl-4">
                    <h2 className="text-3xl font-bold mb-6 text-custom-azul">Resumen del Carrito</h2>
                    <ul>
                        {itemsCarrito.map(item => (
                            <li key={item.id} className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 border-b">
                                <div className="flex items-center space-x-2 flex-1">
                                    <img src={getImageUrl(item.producto.imagenes[0]?.imagen)} alt={item.producto.nombre_producto} className="w-12 h-12 object-cover rounded-md" />
                                    <div className="flex-1">
                                        <p className="whitespace-normal md:whitespace-nowrap">
                                            <TruncatedText text={item.producto.nombre_producto} maxLength={getMaxLength(windowWidth)} />
                                        </p>
                                        <p className="text-sm text-gray-600">{item.producto.precio}€ x {item.cantidad}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 text-right">
                        <p className="text-xl font-semibold">Total: {precioTotal.toFixed(2)}€</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasarelaPago;
