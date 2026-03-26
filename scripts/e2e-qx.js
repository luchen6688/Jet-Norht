const http = require('http');

async function runE2E() {
    console.log('--- Iniciando Prueba End-to-End (QA) ---');
    const baseUrl = 'http://localhost:3000/api';
    let cookie = '';

    const fetchAPI = async (path, options = {}) => {
        if (!options.headers) options.headers = {};
        if (cookie) options.headers['Cookie'] = cookie;
        options.headers['Content-Type'] = 'application/json';
        
        try {
            const res = await fetch(`${baseUrl}${path}`, options);
            const setCookie = res.headers.get('set-cookie');
            if (setCookie) {
                // simple cookie extraction
                cookie = setCookie.split(';')[0];
            }
            let data = null;
            try {
                const text = await res.text();
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    data = { rawText: text.substring(0, 500) };
                }
            } catch(e) {}
            return { status: res.status, data };
        } catch (e) {
            console.error(`Error fetching ${path}:`, e.message);
            return { status: 500, data: null };
        }
    };

    // 1. Registro o Login
    console.log('1. Autenticación...');
    const email = `qa_${Date.now()}@test.com`;
    let res = await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: 'QA Tester', email, password: 'password123' })
    });
    if (res.status === 201) {
        console.log(`✅ Usuario registrado: ${email}`);
        // Login to get token cookie
        res = await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password: 'password123' })
        });
        if (res.status === 200) console.log('✅ Login exitoso, sesión iniciada.');
        else return console.error('❌ Fallo Login', res);
    } else {
        return console.error('❌ Fallo Registro', res);
    }

    // 2. Búsqueda de Vuelos
    console.log('\n2. Búsqueda de Vuelos (JFK -> MIA)...');
    res = await fetchAPI('/flights?origin=JFK&destination=MIA');
    if (res.status === 200 && res.data.flights.length > 0) {
        console.log(`✅ ${res.data.flights.length} vuelos encontrados.`);
    } else {
        return console.error('❌ Fallo Búsqueda o no hay vuelos', res);
    }
    const flightId = res.data.flights[0].id;

    // 3. Crear Reserva
    console.log(`\n3. Reservando vuelo ID ${flightId}...`);
    res = await fetchAPI('/bookings', {
        method: 'POST',
        body: JSON.stringify({ flightId, passengerName: 'QA Tester Passenger' })
    });
    let bookingId;
    if (res.status === 201) {
        bookingId = res.data.booking.id;
        console.log(`✅ Reserva creada con éxito. Ref: ${res.data.booking.bookingReference}. Estado: ${res.data.booking.status}`);
    } else {
        return console.error('❌ Fallo Crear Reserva', res);
    }

    // 4. Pago (Confirmar)
    console.log(`\n4. Pagando reserva ID ${bookingId}...`);
    res = await fetchAPI(`/bookings/${bookingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'pay' })
    });
    if (res.status === 200) {
        console.log(`✅ Pago exitoso. Nuevo estado: ${res.data.booking.status}`);
    } else {
        return console.error('❌ Fallo Pago', res);
    }

    // 5. Check-In
    console.log(`\n5. Realizando Check-In para reserva ID ${bookingId}...`);
    res = await fetchAPI(`/bookings/${bookingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'checkin' })
    });
    if (res.status === 200) {
        console.log(`✅ Check-In exitoso. Nuevo estado: ${res.data.booking.status}`);
    } else {
        // En caso de que falle por la regla de las 24hrs que es normal en pruebas
        console.warn(`⚠️ Check-in devolvió estado ${res.status}. Mensaje: ${res.data?.error || res.data?.message}`);
        if(res.data?.error?.includes('abre 24 horas antes')) {
            console.log('✅ El rechazo del Check-in fue correcto según las reglas de negocio (vuelo a más de 24hrs).');
        } else {
            console.error('❌ Retorno inesperado en Check-In');
        }
    }

    console.log('\n--- Prueba End-to-End Finalizada ---');
}

runE2E();
