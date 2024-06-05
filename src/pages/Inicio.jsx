import { useState, useEffect, useContext } from 'react';
import { obtenerProductos } from '../components/apis/Api';
import TarjetaProducto from '../components/tarjetasProducto/TarjetasProducto';
import { agregarItemAlCarrito, cargarCarrito } from '../components/logic/FuncCarrito';
import { AuthContext } from '../components/auth/AuthContext';
import banner from '../assets/banner.webp';
import { Link } from 'react-router-dom';

function Inicio() {
    const [productos, setProductos] = useState([]);
    const [itemsCarrito, setItemsCarrito] = useState([]);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);
    const { estaLogueado, primerNombre } = useContext(AuthContext);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const productos = await obtenerProductos();
                setProductos(productos);
            } catch (error) {
                console.error('Error al cargar los productos:', error);
                setError(error);
            } finally {
                setCargando(false);
            }
        };
        cargarProductos();
        if (estaLogueado) {
            cargarCarrito(setItemsCarrito);
        }
    }, [estaLogueado]);

    const manejarAgregarAlCarrito = async (productoId) => {
        await agregarItemAlCarrito(productoId, setItemsCarrito);
    };

    if (cargando) {
        return <div>Cargando productos...</div>;
    }

    if (error) {
        return <div>Error al cargar los productos: {error.message}</div>;
    }

    return (
        <main className="flex-1">
            <section className="bg-custom-azul2 text-white pb-10 pt-6 px-6 flex flex-col items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-black text-4xl font-bold">Bienvenido a PCenter{estaLogueado ? `, ` + primerNombre : ''}</h1>
                    <p className="text-black text-xl">Encuentra el mejor hardware para tu ordenador al mejor precio y según tus necesidades.</p>
                    <div>
                        <Link to='/productos' className='bg-custom-naranja px-4 py-2 rounded-md hover:bg-orange-500 transition duration-300'>
                            Compra ya
                        </Link>
                    </div>
                </div> 
                <img
                    src={banner}
                    width={1200}
                    height={600}
                    alt="banner"
                    className="w-full max-w-5xl rounded-lg shadow-lg mt-8"
                />
            </section>
            <section className="py-12 px-4 md:px-12">
                <h2 className="text-3xl font-bold mb-8">Productos destacados</h2>
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-lg">
                        {productos.slice(0, 4).map((producto) => (
                            <TarjetaProducto key={producto.id} producto={producto} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Inicio;
