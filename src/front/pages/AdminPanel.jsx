
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import services from "../services/apiServices";

export const AdminPanel = () => {

    const { store, dispatch } = useGlobalReducer();

    const loadSubscribers = async () => {
        const data = await services.getSubscribers();

        dispatch({
            type: "getSubs",
            payload: data.data
        });
    };

    useEffect(() => {
        loadSubscribers();
    }, []);

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
            alert("Este usuario no tiene suscripción");
            return;
        }
        console.log(sub.subscription.cancel_day)

        setSelectedSub({
            subscriptionId: sub.subscription.id,
            planId: sub.plan?.id,
            active: sub.subscription.active,
            cancel_day: sub.subscription?.cancel_day
                ? new Date(sub.subscription.cancel_day)
                    .toISOString()
                    .split("T")[0]
                : ""
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

            // recargar usuarios
        } catch (error) {
            console.error(error);
        }
    };

    const saveSubscription = async () => {
        try {
            await services.updateSubscription(
                selectedSub.subscriptionId,
            {
                active: selectedSub.active,
                cancel_day: selectedSub.cancel_day
            });
            await loadSubscribers();
            setShowSubModal(false);

            // recargar datos
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="d-flex min-vh-100 bg-dark text-white">

            {/* SIDEBAR */}
            <div className="bg-black p-3" style={{ width: "220px" }}>
                <h4 className="mb-4">Admin</h4>

                <p className="text-secondary">Dashboard</p>
                <p className="text-secondary">Users</p>
                <p className="text-secondary">Subscriptions</p>
                <p className="text-secondary">Plans</p>
            </div>

            {/* MAIN */}
            <div className="flex-grow-1 p-4">

                <h2 className="mb-4">Dashboard Overview</h2>

                {/* STATS */}
                <div className="row mb-4">

                    <div className="col-md-4">
                        <div className="card bg-black border-secondary p-3">
                            <h5>Total Users</h5>
                            <h2>{total}</h2>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card bg-black border-success p-3">
                            <h5>Active Subs</h5>
                            <h2 className="text-success">{active}</h2>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card bg-black border-danger p-3">
                            <h5>Inactive Subs</h5>
                            <h2 className="text-danger">{inactive}</h2>
                        </div>
                    </div>

                </div>

                {/* TABLE */}
                <div className="card bg-black border-secondary p-3">

                    <h4 className="mb-3">Subscriptions</h4>

                    <div className="table-responsive">

                        <table className="table table-dark table-hover align-middle">

                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Plan</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Ends</th>
                                    <th>Actions</th>
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
                                                Edit User
                                            </button>

                                            <button
                                                className="btn btn-sm btn-info me-2"
                                                onClick={() => handleEditSubscription(sub)}
                                            >
                                                Edit Sub
                                            </button>

                                            <button className="btn btn-sm btn-warning me-2">
                                                Note
                                            </button>

                                            {sub.user.is_banned ? (
                                                <button className="btn btn-sm btn-success">
                                                    Unban
                                                </button>
                                            ) : (
                                                <button className="btn btn-sm btn-danger">
                                                    Ban
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