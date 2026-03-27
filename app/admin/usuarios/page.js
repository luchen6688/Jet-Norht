'use client';

import { useState, useEffect } from 'react';
import styles from '../Admin.module.css';

export default function AdminUsuarios() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/users');
        if (res.ok) {
            const data = await res.json();
            setUsers(data.users);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateUser = async (id, role, is_active) => {
        const res = await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, role, is_active })
        });
        if (res.ok) {
            fetchUsers();
        }
    };

    return (
        <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Gestión de Usuarios</h3>
                <button onClick={fetchUsers} className={styles.logoutBtn} style={{ width: 'auto', backgroundColor: '#005eb8' }}>Actualizar</button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando usuarios...</div>
            ) : (
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Fecha Registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td><strong>{u.name}</strong></td>
                                <td>{u.email}</td>
                                <td>
                                    <select 
                                        value={u.role} 
                                        onChange={(e) => handleUpdateUser(u.id, e.target.value, u.is_active)}
                                        style={{ padding: '4px', borderRadius: '4px' }}
                                    >
                                        <option value="user">Usuario</option>
                                        <option value="admin">Administrador</option>
                                        <option value="agent">Agente</option>
                                    </select>
                                </td>
                                <td>
                                    <span 
                                        onClick={() => handleUpdateUser(u.id, u.role, u.is_active ? 0 : 1)}
                                        className={`${styles.statusPill} ${u.is_active ? styles.statusSuccess : styles.statusError}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {u.is_active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '---'}</td>
                                <td>
                                    <button style={{ color: '#005eb8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
