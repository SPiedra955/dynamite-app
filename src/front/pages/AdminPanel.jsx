
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import services from "../services/apiServices";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const AdminPanel = () => {

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const loadSubscribers = async () => {
        try {
            const data = await services.getSubscribers();

            dispatch({
                type: "getSubs",
                payload: data.data
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        loadSubscribers();
    }, [navigate, dispatch]);

    const subscribers = store.subs || [];
    const total = subscribers.length;
    const active = subscribers.filter(
        s => s.subscription?.active
    ).length;

    const inactive = total - active;


    const [showUserModal, setShowUserModal] = useState(false);
    const [showSubModal, setShowSubModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);

    const handleEditUser = (sub) => {
        setSelectedUser({
            id: sub.user.id,
            name: sub.user.name,
            email: sub.user.email,
            is_banned: sub.user.is_banned
        });

        setShowUserModal(true);
    };

    const handleEditSubscription = (sub) => {

        if (!sub.subscription) {
            Swal.fire({
                icon: "warning",
                title: "Sin suscripción",
                text: "Este usuario no tiene una suscripción asociada"
            });
            return;
        }
        
        setSelectedSub({
            subscriptionId: sub.subscription.id,
            active: sub.subscription.active,
            cancel_day: sub.subscription.cancel_day
                ? new Date(sub.subscription.cancel_day).toISOString().split("T")[0]
                : "",
            created_at: sub.subscription.created_at
        });

        setShowSubModal(true);
    };


    const saveUser = async () => {
        try {
            await services.updateUser(
                selectedUser.id,
                selectedUser
            );
            await loadSubscribers();

            setShowUserModal(false);

        } catch (error) {
            console.error(error);
        }
    };

    const saveSubscription = async () => {
        try {
            const createdAt = selectedSub.created_at;
            const cancelDay = selectedSub.cancel_day;

            if (cancelDay && createdAt) {
                const created = new Date(createdAt);
                const cancel = new Date(cancelDay);

                if (cancel < created) {
                    Swal.fire({
                        icon: "warning",
                        title: "Fecha no válida",
                        text: "La cancelación no puede ser anterior a la creación de la suscripción",
                        confirmButtonText: "Entendido"
                    });
                    return;
                }
            }

            await services.updateSubscription(
                selectedSub.subscriptionId,
                {
                    active: selectedSub.active,
                    cancel_day: selectedSub.cancel_day
                }
            );
            dispatch({
                type: "updateSubStatus",
                payload: {
                    subscriptionId: selectedSub.subscriptionId,
                    updates: {
                        active: selectedSub.active,
                        cancel_day: selectedSub.cancel_day
                    }
                }
            });

            await loadSubscribers();

            setShowSubModal(false);

        } catch (error) {
            console.error(error);
        }
    };


    const handleBanToggle = async (user) => {
        const isBan = !user.is_banned;

        const result = await Swal.fire({
            title: isBan ? "Ban User" : "Unban User",
            input: "textarea",
            inputLabel: "Motivo",
            inputPlaceholder: `Introduce el motivo para ${isBan ? "banear" : "desbanear"} al usuario`,
            inputValidator: (value) => {
                if (!value) {
                    return "Debes introducir un motivo";
                }
            },
            showCancelButton: true,
            confirmButtonText: isBan ? "Ban" : "Unban",
            cancelButtonText: "Cancelar",
            icon: "warning"
        });

        if (!result.isConfirmed) return;

        try {
            await services.toggleBan(user.id, {
                is_banned: isBan,
                reason: result.value
            });

            await loadSubscribers();

            Swal.fire({
                icon: "success",
                title: isBan ? "Usuario baneado" : "Usuario desbaneado",
                timer: 1500,
                showConfirmButton: false
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message
            });
        }
    };

    const handleShowNote = (user) => {
        Swal.fire({
            title: "Ban Note",
            text: user.ban_reason || "No hay motivo registrado",
            icon: "info",
            confirmButtonText: "Cerrar"
        });
    };

    return (
        <div className="container py-5 mt-4 d-flex min-vh-100 bg-dark text-white">


            {/* MAIN */}
            <div className="flex-grow-1 p-4">

                <h2 className="mb-4">Dashboard Overview</h2>

                {/* STATS */}
                <div className="row mb-4">

                    <div className="col-md-4">
                        <div className="card bg-black border-secondary p-3">
                            <h5>Usuarios totales</h5>
                            <h2>{total}</h2>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card bg-black border-success p-3">
                            <h5>Subs activas</h5>
                            <h2 className="text-success">{active}</h2>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card bg-black border-danger p-3">
                            <h5>Subs inactivas</h5>
                            <h2 className="text-danger">{inactive}</h2>
                        </div>
                    </div>

                </div>

                {/* TABLE */}
                <div className="card bg-black border-secondary p-3">

                    <h4 className="mb-3">Subscripciones</h4>

                    <div className="table-responsive">

                        <table className="table table-dark table-hover align-middle">

                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Email</th>
                                    <th>Plan</th>
                                    <th>Estado</th>
                                    <th>Creado</th>
                                    <th>Fin</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {subscribers.map((sub) => (
                                    <tr key={sub.user.id}>
                                        <td>{sub.user.name}</td>
                                        <td>{sub.user.email}</td>

                                        <td>
                                            {sub.plan ? sub.plan.name : "Sin plan"}
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${sub.subscription?.active
                                                    ? "bg-success"
                                                    : "bg-secondary"
                                                    }`}
                                            >
                                                {sub.subscription?.active
                                                    ? "Active"
                                                    : "No subscription"}
                                            </span>
                                        </td>

                                        <td>
                                            {sub.subscription?.created_at
                                                ? new Date(
                                                    sub.subscription.created_at
                                                ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        <td>
                                            {sub.subscription?.cancel_day
                                                ? new Date(
                                                    sub.subscription.cancel_day
                                                ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary me-2"
                                                onClick={() => handleEditUser(sub)}
                                            >
                                                Editar usuario
                                            </button>

                                            <button
                                                className="btn btn-sm btn-info me-2"
                                                onClick={() => handleEditSubscription(sub)}
                                            >
                                                Editar Sub
                                            </button>

                                            <button
                                                className={`btn btn-sm me-2 ${sub.user.is_banned ? "btn-warning" : "btn-secondary"}`}
                                                onClick={() => handleShowNote(sub.user)}
                                                disabled={!sub.user.is_banned}>
                                                Ver motivo
                                            </button>

                                            {sub.user.is_banned ? (
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => handleBanToggle(sub.user)}
                                                >
                                                    Desbanear
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleBanToggle(sub.user)}
                                                >
                                                    Banear
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {showUserModal && (
                    <>
                        <div className="modal fade show d-block">
                            <div className="modal-dialog">
                                <div className="modal-content bg-dark text-white">

                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            Edit User
                                        </h5>

                                        <button
                                            className="btn-close btn-close-white"
                                            onClick={() => setShowUserModal(false)}
                                        />
                                    </div>

                                    <div className="modal-body">

                                        <div className="mb-3">
                                            <label>Name</label>

                                            <input
                                                className="form-control"
                                                value={selectedUser?.name || ""}
                                                onChange={(e) =>
                                                    setSelectedUser({
                                                        ...selectedUser,
                                                        name: e.target.value
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label>Email</label>

                                            <input
                                                className="form-control"
                                                value={selectedUser?.email || ""}
                                                onChange={(e) =>
                                                    setSelectedUser({
                                                        ...selectedUser,
                                                        email: e.target.value
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedUser?.is_banned || false}
                                                onChange={(e) =>
                                                    setSelectedUser({
                                                        ...selectedUser,
                                                        is_banned: e.target.checked
                                                    })
                                                }
                                            />

                                            <label className="form-check-label">
                                                Banned
                                            </label>
                                        </div>

                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setShowUserModal(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="btn btn-success"
                                            onClick={saveUser}
                                        >
                                            Save
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="modal-backdrop fade show"></div>
                    </>
                )}


                {showSubModal && (
                    <>
                        <div className="modal fade show d-block">
                            <div className="modal-dialog">
                                <div className="modal-content bg-dark text-white">

                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            Edit Subscription
                                        </h5>

                                        <button
                                            className="btn-close btn-close-white"
                                            onClick={() => setShowSubModal(false)}
                                        />
                                    </div>

                                    <div className="modal-body">

                                        <div className="form-check mb-3">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedSub?.active || false}
                                                onChange={(e) =>
                                                    setSelectedSub({
                                                        ...selectedSub,
                                                        active: e.target.checked
                                                    })
                                                }
                                            />

                                            <label className="form-check-label">
                                                Active
                                            </label>
                                        </div>


                                        <div className="mb-3">
                                            <label>Creation Day</label>

                                            <input
                                                type="date"
                                                className="form-control"
                                                value={
                                                    selectedSub?.created_at
                                                        ? selectedSub.created_at.slice(0, 10)
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    setSelectedSub({
                                                        ...selectedSub,
                                                        created_at: e.target.value
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label>Cancel Day</label>

                                            <input
                                                type="date"
                                                className="form-control"
                                                value={
                                                    selectedSub?.cancel_day
                                                        ? selectedSub.cancel_day.slice(0, 10)
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    setSelectedSub({
                                                        ...selectedSub,
                                                        cancel_day: e.target.value
                                                    })
                                                }
                                            />
                                        </div>

                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setShowSubModal(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="btn btn-success"
                                            onClick={saveSubscription}
                                        >
                                            Save
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="modal-backdrop fade show"></div>
                    </>
                )}
            </div>

        </div>


    );
};

export default AdminPanel