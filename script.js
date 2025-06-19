let tasaCambio = 1;
let presupuestoUSD = 0;
let presupuestoVES = 0;
let productos = [];

document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que el DOM esté cargado antes de asignar eventos
    const configButton = document.getElementById('config-button');
    if (configButton) {
        configButton.addEventListener('click', abrirConfiguraciones);
    }
});

function establecerPresupuesto() {
    const montoPresupuesto = parseFloat(document.getElementById('budget-amount').value);
    const monedaPresupuesto = document.getElementById('budget-currency').value;
    tasaCambio = parseFloat(document.getElementById('exchange-rate').value) || 1;

    if (isNaN(montoPresupuesto) || isNaN(tasaCambio)) {
        alert('Por favor, ingrese números válidos para el presupuesto y la tasa de cambio.');
        return;
    }

    if (monedaPresupuesto === 'USD') {
        presupuestoUSD = montoPresupuesto;
        presupuestoVES = montoPresupuesto * tasaCambio;
    } else {
        presupuestoVES = montoPresupuesto;
        presupuestoUSD = montoPresupuesto / tasaCambio;
    }

    document.getElementById('budget-usd').textContent = presupuestoUSD.toFixed(2);
    document.getElementById('budget-ves').textContent = presupuestoVES.toFixed(2);
    actualizarEstado();
}

function agregarProducto() {
    const nombre = document.getElementById('product-name').value;
    const precioEstimado = parseFloat(document.getElementById('estimated-price').value);
    const precioReal = parseFloat(document.getElementById('real-price').value) || 0;

    if (!nombre || isNaN(precioEstimado)) {
        alert('Por favor, ingrese un nombre de producto y un precio estimado válidos.');
        return;
    }

    productos.push({
        nombre,
        precioEstimado,
        precioReal
    });

    renderizarProductos();
    document.getElementById('product-name').value = '';
    document.getElementById('estimated-price').value = '';
    document.getElementById('real-price').value = '';
}

function eliminarProducto(indice) {
    productos.splice(indice, 1);
    renderizarProductos();
}

function guardarEdicion(celda, indice, campo) {
    const valor = parseFloat(celda.textContent) || celda.textContent;
    if (campo !== 'nombre' && isNaN(valor)) {
        alert('Por favor, ingrese un valor numérico válido.');
        renderizarProductos(); // Revertir a valor anterior
        return;
    }
    productos[indice][campo] = valor;
    actualizarTotales();
    actualizarEstado();
}

function renderizarProductos() {
    const listaProductos = document.getElementById('product-list');
    listaProductos.innerHTML = '';
    const busqueda = document.getElementById('product-search').value.toLowerCase();

    let totalEstimadoUSD = 0;
    let totalRealUSD = 0;

    productos.forEach((producto, indice) => {
        if (!busqueda || producto.nombre.toLowerCase().includes(busqueda)) {
            totalEstimadoUSD += producto.precioEstimado;
            totalRealUSD += producto.precioReal;

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td contenteditable="true" onblur="guardarEdicion(this, ${indice}, 'nombre')">${producto.nombre}</td>
                <td contenteditable="true" onblur="guardarEdicion(this, ${indice}, 'precioEstimado')">$${producto.precioEstimado.toFixed(2)}</td>
                <td>Bs.${(producto.precioEstimado * tasaCambio).toFixed(2)}</td>
                <td contenteditable="true" onblur="guardarEdicion(this, ${indice}, 'precioReal')">$${producto.precioReal.toFixed(2)}</td>
                <td>Bs.${(producto.precioReal * tasaCambio).toFixed(2)}</td>
                <td><button class="delete-btn" onclick="eliminarProducto(${indice})">Eliminar</button></td>
            `;
            listaProductos.appendChild(fila);
        }
    });

    document.getElementById('total-estimated-usd').textContent = totalEstimadoUSD.toFixed(2);
    document.getElementById('total-estimated-ves').textContent = (totalEstimadoUSD * tasaCambio).toFixed(2);
    document.getElementById('total-real-usd').textContent = totalRealUSD.toFixed(2);
    document.getElementById('total-real-ves').textContent = (totalRealUSD * tasaCambio).toFixed(2);
}

function actualizarTotales() {
    let totalEstimadoUSD = 0;
    let totalRealUSD = 0;
    productos.forEach(producto => {
        totalEstimadoUSD += producto.precioEstimado;
        totalRealUSD += producto.precioReal;
    });
    document.getElementById('total-estimated-usd').textContent = totalEstimadoUSD.toFixed(2);
    document.getElementById('total-estimated-ves').textContent = (totalEstimadoUSD * tasaCambio).toFixed(2);
    document.getElementById('total-real-usd').textContent = totalRealUSD.toFixed(2);
    document.getElementById('total-real-ves').textContent = (totalRealUSD * tasaCambio).toFixed(2);
}

function actualizarEstado() {
    const totalRealUSD = productos.reduce((suma, producto) => suma + producto.precioReal, 0);
    const estadoElemento = document.getElementById('budget-status');

    if (totalRealUSD > presupuestoUSD) {
        estadoElemento.textContent = `Excede el presupuesto por $${(totalRealUSD - presupuestoUSD).toFixed(2)} USD (Bs.${((totalRealUSD - presupuestoUSD) * tasaCambio).toFixed(2)} VES)`;
        estadoElemento.style.color = 'red';
    } else {
        estadoElemento.textContent = `Dentro del presupuesto por $${(presupuestoUSD - totalRealUSD).toFixed(2)} USD (Bs.${((presupuestoUSD - totalRealUSD) * tasaCambio).toFixed(2)} VES)`;
        estadoElemento.style.color = 'green';
    }
}

function abrirConfiguraciones() {
    const modal = document.getElementById('config-modal');
    if (modal) {
        modal.style.display = 'flex';
        aplicarTemaPredefinido();
    } else {
        console.error('Modal no encontrado');
    }
}

function cerrarConfiguraciones() {
    const modal = document.getElementById('config-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function aplicarTemaPredefinido() {
    const tema = document.getElementById('theme').value;
    const customTheme = document.getElementById('custom-theme');
    customTheme.style.display = tema === 'personalizado' ? 'block' : 'none';

    let colors;
    if (tema === 'tema1') {
        colors = {
            primary: '#007bff',
            primaryDark: '#004085',
            button: '#0056b3',
            header: '#c0c0c0'
        };
    } else if (tema === 'tema2') {
        colors = {
            primary: '#ff69b4',
            primaryDark: '#c71585',
            button: '#ff1493',
            header: '#d3d3d3'
        };
    } else {
        colors = JSON.parse(localStorage.getItem('customColors')) || {
            primary: '#007bff',
            primaryDark: '#004085',
            button: '#0056b3',
            header: '#c0c0c0'
        };
    }

    document.getElementById('primary-color').value = colors.primary;
    document.getElementById('button-color').value = colors.button;
    document.getElementById('header-color').value = colors.header;

    document.body.className = tema + '-theme';
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--primary-color-dark', colors.primaryDark);
    document.documentElement.style.setProperty('--button-color', colors.button);
    document.documentElement.style.setProperty('--header-color', colors.header);

    previsualizarColores();
}

function previsualizarColores() {
    const primaryColor = document.getElementById('primary-color').value;
    const buttonColor = document.getElementById('button-color').value;
    const headerColor = document.getElementById('header-color').value;
    const primaryColorDark = ajustarBrillo(primaryColor, 0.7);

    const preview = document.getElementById('preview');
    preview.style.background = `linear-gradient(to bottom, ${primaryColor}, ${primaryColorDark})`;
    preview.querySelector('button').style.background = `linear-gradient(to right, ${primaryColor}, ${buttonColor})`;
    preview.querySelector('button').style.color = 'white';
    preview.querySelector('p').style.backgroundColor = headerColor;
}

function guardarTemaPersonalizado() {
    const primaryColor = document.getElementById('primary-color').value;
    const buttonColor = document.getElementById('button-color').value;
    const headerColor = document.getElementById('header-color').value;
    const primaryColorDark = ajustarBrillo(primaryColor, 0.7);

    document.body.className = 'personalizado-theme';
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--primary-color-dark', primaryColorDark);
    document.documentElement.style.setProperty('--button-color', buttonColor);
    document.documentElement.style.setProperty('--header-color', headerColor);

    localStorage.setItem('customColors', JSON.stringify({
        primary: primaryColor,
        primaryDark: primaryColorDark,
        button: buttonColor,
        header: headerColor
    }));
    localStorage.setItem('theme', 'personalizado');

    cerrarConfiguraciones();
}

function restablecerColores() {
    const tema = document.getElementById('theme').value;
    localStorage.removeItem('customColors');
    localStorage.setItem('theme', tema);
    aplicarTemaPredefinido();
}

function ajustarBrillo(hex, factor) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `#${Math.max(0, Math.min(255, Math.round(r * factor))).toString(16).padStart(2, '0')}${Math.max(0, Math.min(255, Math.round(g * factor))).toString(16).padStart(2, '0')}${Math.max(0, Math.min(255, Math.round(b * factor))).toString(16).padStart(2, '0')}`;
}

window.onload = function() {
    const savedTheme = localStorage.getItem('theme') || 'tema1';
    document.getElementById('theme').value = savedTheme;
    aplicarTemaPredefinido();
};